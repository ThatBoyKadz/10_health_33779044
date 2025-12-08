require('dotenv').config();
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

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

// -----------------
// App locals for EJS
// -----------------
app.locals.shopData = { shopName: "Bertie's Health & Fitness" };
app.locals.appName = "Health & Fitness Hub";

// -----------------
// Database
// -----------------
const db = mysql.createPool({
    host: 'localhost',
    user: 'fitness_app_user',   // make sure this user exists on your VM
    password: 'strongpassword', // update if needed
    database: 'health',         // your VM database name
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

const weatherRoutes = require('./routes/weather');
app.use('/weather', weatherRoutes);

// -----------------
// Start server
// -----------------
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
