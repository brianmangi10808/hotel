const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();


// Create a new user with role
router.post('/users', async (req, res) => {
  const { username, password, role } = req.body;
  
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';

  // Perform the database query to insert the new user
  db.query(query, [username, hashedPassword, role], (err, result) => {
    if (err) {
      // Handle errors, send an appropriate response
      res.status(500).json({ message: 'User creation failed', error: err });
    } else {
      // Assuming the user was successfully inserted, get the inserted user's ID
      const userId = result.insertId; // This is the auto-generated ID for the new user

      // Return the created user object with the ID in the correct format
      res.status(201).json({
        data: {
          id: userId,        // Return the generated ID
          username: username, // Include the username
          role: role          // Include the role
        }
      });
    }
  });
});

// Get all users
// Get all users
router.get('/users',   (req, res) => {
    db.query('SELECT id, username, role FROM users', (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
      } else {
        // Set the Content-Range header
        res.setHeader('Content-Range', `users 0-${results.length - 1}/${results.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(results);
      }
    });
  });
  

// Update user role
router.put('/users/:id', (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  db.query('UPDATE users SET role = ? WHERE id = ?', [role, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error updating role', error: err });
    } else {
      res.json({ message: 'User role updated successfully' });
    }
  });
});

// Delete a user
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error deleting user', error: err });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

module.exports = router;
