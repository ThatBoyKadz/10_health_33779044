Workout Tracker Web App

This is a fitness tracking web application built using Node.js, Express, EJS, and MySQL.
It allows users to register, log in, add workouts, list all workouts, and search workouts stored in a MySQL database.

The application is designed so it can be installed and run on another computer using npm install, SQL setup scripts, and node index.js.

Features

The project includes all required coursework features:

Required Pages

Home page (/)

About page (/about)

Workout pages for adding, listing, and searching workouts

Login System

Users register with first name, last name, email, and password

Login is performed using first name and password (as requested)

Passwords are stored securely using bcrypt hashing

Logged-in user’s name is shown on relevant pages

Workout pages require login before access

Database (MySQL)

The app uses a MySQL database named health, which contains:

users table

workouts table linked by foreign key user_id

Two SQL files are provided:

create_db.sql — creates the database structure

insert_test_data.sql — inserts initial data, including a default login

Installable and Runnable

Running npm install installs all required modules

Running the SQL scripts sets up the full database

node index.js runs the application on port 8000