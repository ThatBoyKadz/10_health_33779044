const express = require('express');
const router = express.Router();

// ------------------------
// GET: Show all health records
// ------------------------
router.get('/', (req, res) => {
    if (!req.session || !req.session.userId) {
        // Not logged in: show empty page with message
        return res.render('health', { 
            records: [],
            first: '',
            last: '',
            message: 'Please log in to view your health records.',
            logoutUrl: '/users/logout',
            addUrl: '/health/add'
        });
    }

    db.query(
        'SELECT * FROM health_records WHERE user_id = ?',
        [req.session.userId],
        (err, results) => {
            if (err) throw err;
            res.render('health', { 
                records: results,
                first: req.session.first || '',
                last: req.session.last || '',
                message: '',
                logoutUrl: '/users/logout',
                addUrl: '/health/add'
            });
        }
    );
});


// ------------------------
// GET: Search health records
// ------------------------
router.get('/search', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.render('health', { 
            records: [],
            first: '',
            last: '',
            message: 'Please log in to search your health records.',
            logoutUrl: '/users/logout',
            addUrl: '/health/add'
        });
    }

    const q = req.sanitize(req.query.q);

    // We allow searching in basic fields
    const sql = `
        SELECT * FROM health_records 
        WHERE user_id = ? AND (
            weight LIKE ? OR
            height LIKE ? OR
            blood_pressure LIKE ? OR
            heart_rate LIKE ?
        )
    `;

    const like = `%${q}%`;

    db.query(sql, [req.session.userId, like, like, like, like], (err, results) => {
        if (err) throw err;

        res.render('health', {
            records: results,
            first: req.session.first || '',
            last: req.session.last || '',
            message: results.length === 0 ? 'No records found.' : '',
            logoutUrl: '/users/logout',
            addUrl: '/health/add'
        });
    });
});




// ------------------------
// GET: Add health record form
// ------------------------
router.get('/add', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('../users/login'); // redirect to login
    }
    res.render('add_record'); 
});

// ------------------------
// POST: Handle adding health record
// ------------------------
router.post('/add', (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('../users/login'); // redirect to login
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
        // Redirect back to health list using relative path
        res.redirect('.'); 
    });
});

module.exports = router;
