const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Change this to your MySQL username
  password: '',  // Change this to your MySQL password
  database: 'window_db',  // Use the database you created
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get all accounts
app.get('/api/accounts', (req, res) => {
  db.query('SELECT * FROM accounts', (err, result) => {
    if (err) {
      console.error('Error fetching accounts:', err);
      return res.status(500).send('Error fetching accounts');
    }
    res.json(result);
  });
});

// Add new account
app.post('/api/accounts', (req, res) => {
  const { username, password, window_name } = req.body;
  const status = 'active';  // Default status is active
  const query = 'INSERT INTO accounts (username, password, window_name, status) VALUES (?, ?, ?, ?)';

  db.query(query, [username, password, window_name, status], (err, result) => {
    if (err) {
      console.error('Error adding account:', err);
      return res.status(500).send('Error adding account');
    }
    res.status(201).json({ id: result.insertId, username, password, window_name, status });
  });
});

// Delete account
app.delete('/api/accounts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM accounts WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting account:', err);
      return res.status(500).send('Error deleting account');
    }
    res.status(200).send('Account deleted');
  });
});

// Update account status (Active/Inactive) using POST
app.post('/api/accounts/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // 'active' or 'inactive'
  const query = 'UPDATE accounts SET status = ? WHERE id = ?';

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).send('Error updating status');
    }
    res.status(200).send('Status updated');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
