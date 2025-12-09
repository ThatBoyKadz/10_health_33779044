require('dotenv').config(); // Load environment variables

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const app = express();
const port = 8000;
const host = '0.0.0.0'; // Listen on all interfaces

// -----------------
// Middleware
// -----------------
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

// Make session available in all templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// -----------------
// App locals
// -----------------
app.locals.appName = "Health & Fitness Hub";
app.locals.shopData = { shopName: "Health & Fitness Hub" };

// -----------------
// Database
// -----------------
// Change host if your MySQL is on another machine
const db = mysql.createPool({
    host: 'localhost', // or the IP of your VM MySQL if remote
    user: 'fitness_app_user',
    password: 'strongpassword', // match your VM credentials
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
app.listen(port, host, () => console.log(`Server listening on http://${host}:${port}`));
