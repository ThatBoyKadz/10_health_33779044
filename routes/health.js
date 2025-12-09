const express = require('express');
const router = express.Router();

// Show all health records (health.ejs)
router.get('/', (req, res) => {
    db.query(
        'SELECT * FROM health_records', // no user_id filtering
        (err, results) => {
            if (err) throw err;
            res.render('health', { records: results });
        }
    );
});

// Add health record form
router.get('/add', (req, res) => {
    res.render('add_record'); // render add_record.ejs
});

// Handle adding health record
router.post('/add', (req, res) => {
    const { user_id, weight, height, blood_pressure, heart_rate } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    db.query(
        'INSERT INTO health_records (user_id, record_date, weight, height, bmi, blood_pressure, heart_rate) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
        [user_id, weight, height, bmi, blood_pressure, heart_rate],
        (err) => {
            if (err) throw err;
            res.redirect('/health');
        }
    );
});

module.exports = router;
