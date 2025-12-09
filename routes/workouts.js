const express = require('express');
const router = express.Router();

// List workouts
router.get('/list', (req, res) => {
    req.db.query('SELECT * FROM workouts', (err, results) => {
        if (err) throw err;
        res.render('workouts_list', { workouts: results });
    });
});

// Add workout form
router.get('/add', (req, res) => {
    res.render('workout_add');
});

// Process add workout
router.post('/add', (req, res) => {
    const { name, type, duration, difficulty, calories_burned } = req.body;
    req.db.query(
        'INSERT INTO workouts (name, type, duration, difficulty, calories_burned) VALUES (?, ?, ?, ?, ?)',
        [name, type, duration, difficulty, calories_burned],
        (err) => {
            if (err) throw err;
            res.redirect('/workouts/list');
        }
    );
});

// Search form
router.get('/search', (req, res) => {
    res.render('workout_search');
});

// Search results
router.get('/search-results', (req, res) => {
    const { keyword } = req.query;
    req.db.query(
        'SELECT * FROM workouts WHERE name LIKE ?',
        ['%' + keyword + '%'],
        (err, results) => {
            if (err) throw err;
            res.render('workout_search_results', { keyword, workouts: results });
        }
    );
});

module.exports = router;
