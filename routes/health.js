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
// Handle adding health record
// Handle adding health record
router.post('/add', (req, res, next) => {
    // Only allow logged-in users
    if (!req.session || !req.session.userId) {
        return res.redirect("../users/login"); // relative redirect
    }

    // Sanitize inputs
    const weight = req.sanitize(req.body.weight);
    const height = req.sanitize(req.body.height);
    const blood_pressure = req.sanitize(req.body.blood_pressure);
    const heart_rate = req.sanitize(req.body.heart_rate);
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    const sql = `
        INSERT INTO health_records 
        (user_id, record_date, weight, height, bmi, blood_pressure, heart_rate)
        VALUES (?, NOW(), ?, ?, ?, ?, ?)
    `;
    const params = [req.session.userId, weight, height, bmi, blood_pressure, heart_rate];

    db.query(sql, params, (err) => {
        if (err) return next(err);
        // Redirect relative to router mount like users.js
        res.redirect("../health"); 
    });
});


module.exports = router;
