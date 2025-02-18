const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection (adjust with your XAMPP settings)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Default password is blank in XAMPP
  database: 'window_management',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// API Endpoints
// 1. Get all windows
app.get('/api/windows', (req, res) => {
  db.query('SELECT * FROM windows', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. Add a new window
app.post('/api/windows', (req, res) => {
  const { name, status } = req.body;
  const query = 'INSERT INTO windows (name, status) VALUES (?, ?)';
  db.query(query, [name, status], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, name, status });
  });
});

// 3. Update a window
app.put('/api/windows/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // Only status should be sent in the request
  console.log(`Received request to update window with ID: ${id}, setting status to: ${status}`);  // Log the received status

  const query = 'UPDATE windows SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Error updating status' });
    }
    console.log(`Updated window with ID: ${id} to status: ${status}`);
    res.json({ id, status });
  });
});



// 4. Delete a window
app.delete('/api/windows/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM windows WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.status(204).send();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
