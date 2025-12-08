USE health_fitness_app;

-- Default login credentials
INSERT INTO users (username, password, first, last, email)
VALUES ('gold', '$2b$10$5JdXYYy6JwMJQ1Dz6JuGGu.XnI1/gQyE/Uv/7aA4CzGZVpuL5I1Y6', 'Gold', 'Smith', 'gold@example.com');

-- Example workouts
INSERT INTO workouts (name, type, duration, difficulty, calories_burned)
VALUES 
('Morning Jog', 'Cardio', 30, 'Easy', 200),
('HIIT Session', 'Cardio', 20, 'Hard', 300),
('Weight Lifting', 'Strength', 45, 'Medium', 250);
