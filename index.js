require('dotenv').config(); // Load environment variables

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

const app = express();
const port = 8000;

// -----------------
// Middleware
// -----------------
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// -----------------
// Session setup
// -----------------
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10 minutes
}));

// Make session available in all EJS templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// -----------------
// App locals
// -----------------
app.locals.shopData = { shopName: "Health & Fitness Hub" };


// -----------------
// Database
// -----------------
const db = mysql.createPool({
    host: 'localhost',
    user: 'fitness_app_user',
    password: 'strongpassword',
    database: 'health',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// -----------------
// Routes
// -----------------
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const workoutsRoutes = require('./routes/workouts');
app.use('/workouts', workoutsRoutes);


// -----------------
// Start server
// -----------------
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
