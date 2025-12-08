const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// --- Registration page ---
router.get('/register', (req, res) => {
    res.render('users/register', { errors: [] });
});

// --- Handle registration ---
router.post('/register', async (req, res) => {
    const { username, password, first, last, email } = req.body;
    const db = req.db;

    if (!username || !password || !first || !last || !email) {
        return res.render('users/register', { errors: ['All fields are required'] });
    }

    db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.render('users/register', { errors: ['Username or email already exists'] });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO users (username, password, first, last, email) VALUES (?, ?, ?, ?, ?)',
                [username, hashedPassword, first, last, email],
                (err2) => {
                    if (err2) throw err2;
                    res.redirect('/users/login');
                }
            );
        }
    );
});

// --- Login page ---
router.get('/login', (req, res) => {
    res.render('users/login', { errors: [] });
});

// --- Handle login ---
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = req.db;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.render('users/login', { errors: ['Invalid credentials'] });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('users/login', { errors: ['Invalid credentials'] });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            first: user.first,
            last: user.last
        };

        // redirect to logged-in page
        res.redirect('/users/loggedin');
    });
});

router.get('/loggedin', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    res.redirect('users/loggedin');
});


// --- Logout ---
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
