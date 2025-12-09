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


app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
// -----------------
// Database
// -----------------
const db = mysql.createPool({
    host: 'localhost',
    user: 'health_app_user', // your DB user
    password: 'yourpassword', // your DB password
    database: 'health', // health database
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

const healthRoutes = require('./routes/health'); // CRUD for health records
app.use('/health', healthRoutes);

//const exercisesRoutes = require('./routes/exercises'); // CRUD for exercise logs
//app.use('/exercises', exercisesRoutes);


// -----------------
// Start server
// -----------------
app.listen(port, () => console.log(`Health app server listening on port ${port}!`));
