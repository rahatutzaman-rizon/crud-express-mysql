const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // or '127.0.0.1'
    user: 'root',      // MySQL username
    password: 'password', // MySQL password
    database: 'database1',   // The name of the database you created
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create the users table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
        );
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created or already exists.');
        }
    });
});

// Sample route to get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// POST route to insert a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    // Validate request data
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    // Insert data into the users table
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err); // Log the error
            return res.status(500).json({ message: 'Error inserting user' });
        }
        res.status(201).json({
            message: 'User added successfully',
            userId: results.insertId,
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
