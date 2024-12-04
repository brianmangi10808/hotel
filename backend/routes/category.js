const express = require('express');
const router = express.Router();
const db = require('../db');



// Create a New Category
router.post('/category', (req, res) => {
    const { name } = req.body;

    if (!name === undefined) {
        return res.status(400).json({ error: 'Category name  rate are required' });
    }

    const query = 'INSERT INTO category (name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Category created', id: results.insertId });
    });
});

// Update an Existing Category

router.put('/category/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name === undefined) {
        return res.status(400).json({ error: 'Category name  rate are required' });
    }

    const query = 'UPDATE category SET name = ? WHERE id = ?';
    db.query(query, [name, id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated' });
    });
});


// Delete a Category
router.delete('/category/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM category WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    });
});

// Get All Categories
router.get('/category', (req, res) => {
    const query = 'SELECT * FROM category';
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

// Get a Single Category by ID
router.get('/category/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM category WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(results[0]); // Return the category object
    });
});




module.exports = router;