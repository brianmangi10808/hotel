const express = require('express');
const router = express.Router();
const db = require('../db');



// Create a new table
router.post('/tables', (req, res) => {
    const { table_number, status } = req.body;

    if (table_number === undefined || status === undefined) {
        return res.status(400).json({ error: 'Table number and status are required' });
    }

    const query = 'INSERT INTO tables (table_number, status) VALUES (?, ?)';
    db.query(query, [table_number, status], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Table created', id: results.insertId });
    });
});

// Get all tables
router.get('/tables', (req, res) => {
    const query = 'SELECT * FROM tables';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        else {
            // Set the Content-Range header
            res.setHeader('Content-Range', `category 0-${results.length - 1}/${results.length}`);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.json(results);
          }
    });
});

// Update table status (e.g., occupied, reserved)
router.put('/tables/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const query = 'UPDATE tables SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json({ message: 'Table status updated successfully' });
    });
});

// Delete a table
router.delete('/tables/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM tables WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json({ message: 'Table deleted successfully' });
    });
});

module.exports = router;
