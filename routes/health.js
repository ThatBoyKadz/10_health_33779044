const express = require('express');
const router = express.Router();

// middleware to protect routes
function isLoggedIn(req, res, next) {
    if (req.session.userId) next();
    else res.redirect('/users/login');
}

// Show all health records (use a single flat view: health.ejs)
router.get('/', isLoggedIn, (req, res) => {
    db.query(
        'SELECT * FROM health_records WHERE user_id = ?',
        [req.session.userId],
        (err, results) => {
            if (err) throw err;
            res.render('health', { records: results }); // render health.ejs
        }
    );
});

// Add health record form
router.get('/add', isLoggedIn, (req, res) => {
    res.render('add_record'); // render add_record.ejs
});

// Handle adding health record
router.post('/add', isLoggedIn, (req, res) => {
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
