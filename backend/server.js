const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Default XAMPP MySQL username
  password: '',  // Default XAMPP MySQL password is empty
  database: 'window_management',  // The name of your database
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// POST route for adding an account
app.post('/api/accounts', (req, res) => {
  const { username, password, windowName } = req.body;
  
  // Insert data into MySQL
  const query = 'INSERT INTO accounts (username, password, window_name) VALUES (?, ?, ?)';
  
  db.query(query, [username, password, windowName], (err, result) => {
    if (err) {
      console.error('Error inserting account:', err);
      return res.status(500).json({ error: 'Failed to create account' });
    }
    res.status(201).json({
      id: result.insertId,
      username,
      password,
      windowName,
    });
  });
});

// Get all accounts (for displaying purposes)
app.get('/api/accounts', (req, res) => {
  db.query('SELECT * FROM accounts', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }
    res.status(200).json(results);
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
