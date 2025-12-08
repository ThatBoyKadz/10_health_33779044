const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Show registration page
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Handle registration form
router.post('/register', async (req, res) => {
    const { username, password, first, last, email } = req.body;

    // Check if user exists
    db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                return res.send('Username or email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            db.query(
                'INSERT INTO users (username, password, first, last, email) VALUES (?, ?, ?, ?, ?)',
                [username, hashedPassword, first, last, email],
                (err2, results2) => {
                    if (err2) throw err2;
                    res.redirect('/users/login');
                }
            );
        }
    );
});

// Show login page
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                return res.send('Invalid credentials');
            }

            const user = results[0];

            // Compare password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.send('Invalid credentials');
            }

            // Store user in session
            req.session.user = {
                id: user.id,
                username: user.username,
                first: user.first,
                last: user.last
            };

            res.redirect('/'); // redirect to home after login
        }
    );
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
