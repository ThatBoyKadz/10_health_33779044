const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { check, validationResult } = require("express-validator");

// ------------------------
// GET: Registration Page
// ------------------------
router.get("/register", (req, res) => {
    res.render("register.ejs", { errors: [], oldInput: {} });
});

// ------------------------
// POST: Handle Registration
// ------------------------
router.post(
    "/register",
    [
        check("email").isEmail().withMessage("Please enter a valid email."),
        check("username").isLength({ min: 4, max: 20 }).withMessage("Username must be 5–20 characters."),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 8 characters."),
        check("first").notEmpty().withMessage("First name is required."),
        check("last").notEmpty().withMessage("Last name is required.")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("register.ejs", { errors: errors.array(), oldInput: req.body });
        }

        const username = req.sanitize(req.body.username);
        const password = req.sanitize(req.body.password);
        const first = req.sanitize(req.body.first);
        const last = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) return next(err);

            const sql = `
                INSERT INTO users (username, first, last, email, hashedPassword)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [username, first, last, email, hashedPassword];

            db.query(sql, params, (err) => {
                if (err) return next(err);
                // Redirect relative to the router mount
                res.redirect("login");
            });
        });
    }
);

// ------------------------
// GET: Login Page
// ------------------------
router.get("/login", (req, res) => {
    res.render("login.ejs", { errors: [] });
});

// ------------------------
// POST: Handle Login
// ------------------------
router.post("/login", (req, res, next) => {
    if (req.session.userId) return res.redirect("loggedin"); // relative redirect

    const usernameInput = req.sanitize(req.body.username);
    const passwordInput = req.sanitize(req.body.password);

    const sql = "SELECT id, hashedPassword, first, last FROM users WHERE username = ?";
    db.query(sql, [usernameInput], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            return res.render("login.ejs", { errors: [{ msg: "Username not found" }] });
        }

        const user = results[0];
        const success = bcrypt.compareSync(passwordInput, user.hashedPassword);

        if (success) {
            req.session.userId = user.id;
            req.session.username = usernameInput;
            req.session.first = user.first;
            req.session.last = user.last;

            res.redirect("loggedin"); // relative redirect
        } else {
            res.render("login.ejs", { errors: [{ msg: "Incorrect password" }] });
        }
    });
});

// ------------------------
// GET: Logout
// ------------------------
router.get("/logout", (req, res) => {
    if (!req.session.userId) return res.redirect("login");

    req.session.destroy(err => {
        if (err) return res.redirect("loggedin");
        res.clearCookie("connect.sid");
        res.redirect("login"); // relative redirect
    });
});

// ------------------------
// GET: Logged In Page
// ------------------------
router.get("/loggedin", (req, res) => {
    if (!req.session.userId) return res.redirect("login");

    res.render("loggedin.ejs", {
        username: req.session.username,
        first: req.session.first,
        last: req.session.last,
        message: "You are successfully logged in!"
    });
});

module.exports = router;
