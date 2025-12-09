const express = require('express');
const router = express.Router();

// Show all health records
router.get('/', (req, res) => {
    if (!req.session || !req.session.userId) {
        // Not logged in: show empty page or message
        return res.render('health', { 
            records: [],
            first: '',
            last: '',
            message: 'Please log in to view your health records.'
        });
    }

    db.query(
        'SELECT * FROM health_records WHERE user_id = ?',
        [req.session.userId],
        (err, results) => {
            if (err) throw err;
            res.render('health', { 
                records: results,
                first: req.session.first,
                last: req.session.last,
                message: ''
            });
        }
    );
});

// Add health record form
router.get('/add', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.send('You must be logged in to add a record.');
    }
    res.render('add_record'); 
});

// Handle adding health record
router.post('/add', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.send('You must be logged in to add a record.');
    }

    const { weight, height, blood_pressure, heart_rate } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    db.query(
        'INSERT INTO health_records (user_id, record_date, weight, height, bmi, blood_pressure, heart_rate) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
        [req.session.userId, weight, height, bmi, blood_pressure, heart_rate],
        (err) => {
            if (err) throw err;
            res.redirect('/health');
        }
    );
});

module.exports = router;
