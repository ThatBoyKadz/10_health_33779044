const express = require('express');
const router = express.Router();

// ------------------------
// Middleware to protect routes
// ------------------------
function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        // Redirect to login page
        res.redirect('/users/login');
    }
}

// ------------------------
// GET: Show all health records
// ------------------------
router.get('/', isLoggedIn, (req, res) => {
    const sql = 'SELECT * FROM health_records WHERE user_id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) return res.status(500).send('Database error');
        res.render('health', { records: results });
    });
});

// ------------------------
// GET: Add health record form
// ------------------------
router.get('/add', isLoggedIn, (req, res) => {
    res.render('add_record'); // render add_record.ejs
});

// ------------------------
// POST: Handle adding health record
// ------------------------
router.post('/add', isLoggedIn, (req, res) => {
    const { weight, height, blood_pressure, heart_rate } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    const sql = `
        INSERT INTO health_records
        (user_id, record_date, weight, height, bmi, blood_pressure, heart_rate)
        VALUES (?, NOW(), ?, ?, ?, ?, ?)
    `;
    const params = [req.session.userId, weight, height, bmi, blood_pressure, heart_rate];

    db.query(sql, params, (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/health');
    });
});

module.exports = router;
