const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// --- Database setup ---
const db = mysql.createPool({
    host: 'localhost',
    user: 'fitness_app_user',   // your DB user
    password: 'strongpassword', // your DB password
    database: 'health'          // your DB name
});

// Make db accessible in routers
app.use((req, res, next) => {
    req.db = db;
    next();
});

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- Session setup ---
app.use(session({
    secret: 'superrandomstuff', 
    resave: false,
    saveUninitialized: true
}));

// Make session and appName available in all EJS templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.appName = "Health & Fitness Hub";
    next();
});

// --- View engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Static files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
const workoutsRouter = require('./routes/workouts');
const usersRouter = require('./routes/users');

app.use('/workouts', workoutsRouter);
app.use('/users', usersRouter);

// --- Home page ---
app.get('/', (req, res) => {
    res.render('index'); // index.ejs uses <%= appName %> and session
});

// --- About page ---
app.get('/about', (req, res) => {
    res.render('about'); // create about.ejs
});

// --- Start server ---
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
