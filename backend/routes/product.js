const express = require('express');
const router = express.Router();
const db = require('../db');
const sharp = require('sharp');
const multer = require('multer');
const axios = require('axios');

// Configure multer for file upload
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// POST endpoint to create a product
router.post('/products', upload.single('image'), async (req, res) => {
    const { name, description, status, price, quantity, unit, category_id } = req.body;
    let image = null;
    let image_type = 'image/jpeg'; // Store the image type as JPEG

    // Check if image was uploaded and process it
    if (req.file) {
        try {
            image = await sharp(req.file.buffer).jpeg().toBuffer(); // Convert to JPEG format
        } catch (error) {
            console.error('Error processing image:', error);
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    // Validation check
    if (!name || !price || !quantity || !unit || !category_id) {
        return res.status(400).json({ error: 'Name, unit, price, quantity, and category_id are required' });
    }

    const query = 'INSERT INTO products (name, description, status, price, quantity, unit, category_id, image, image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, status, price, quantity, unit, category_id, image, image_type], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Send response after successful insertion
        res.status(201).json({
            data: {
                id: results.insertId, // Assuming `insertId` is available from your database insert
                name,
                description,
                status,
                price,
                quantity,
                unit,
                category_id,
                image_type,
            }
        });
    });
});

// Serving image endpoint
router.get('/products/:id/image', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT image FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { image } = results[0];
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.setHeader('Content-Type', 'image/jpeg'); // Serve as JPEG
        res.send(image);
    });
});

// PUT endpoint to update product
router.put('/products/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, status, price, quantity, unit, category_id } = req.body;
    let image = null;

    // If image is provided, process it
    if (req.file) {
        try {
            image = await sharp(req.file.buffer).jpeg().toBuffer(); // Convert to JPEG format
        } catch (error) {
            console.error('Error processing image:', error);
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    // Validate required fields
    if (!name || !price || !quantity || !unit || !category_id) {
        return res.status(400).json({ error: 'Name, price, quantity, and category_id are required' });
    }

    // Prepare the update query with optional image update
    const query = `
        UPDATE products 
        SET name = ?, description = ?, status = ?, price = ?, 
            quantity = ?, unit = ?, category_id = ?, image = ?
        WHERE id = ?`;

    // If no image is provided, skip the image update by passing `null`
    const params = image ? [name, description, status, price, quantity, unit, category_id, image, id] 
                         : [name, description, status, price, quantity, unit, category_id, null, id];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send successful update response
        res.status(200).json({ message: 'Product updated successfully' });
    });
});


// GET endpoint to fetch a product by ID
router.get('/products/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(results[0]);
    });
});

// DELETE endpoint to delete a product by ID
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    });
});

// GET endpoint to fetch all products
// GET endpoint to fetch all product
// GET endpoint to fetch all products
router.get('/products-client', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Convert image buffer to base64 string
        const products = results.map(product => {
            if (product.image) {
                product.image = product.image.toString('base64');
            }
            return product;
        });

        // Set the Content-Range header
        res.setHeader('Content-Range', `products 0-${results.length - 1}/${results.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(products);
    });
});
// GET endpoint to fetch all products
router.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Convert image buffer to base64 string and include MIME type prefix
        const products = results.map(product => {
            if (product.image) {
                product.image = `data:${product.image_type};base64,${product.image.toString('base64')}`;
            }
            return product;
        });

        // Set the Content-Range header
        res.setHeader('Content-Range', `products 0-${results.length - 1}/${results.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(products);
    });
});



// GET products by category
router.get('/categories/:category_id/products', (req, res) => {
    const { category_id } = req.params;

    const query = 'SELECT * FROM products WHERE category_id = ?';
    db.query(query, [category_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Convert image buffer to base64 string
        const products = results.map(product => {
            if (product.image) {
                product.image = product.image.toString('base64');
            }
            return product;
        });

        // Set the Content-Range header
        res.setHeader('Content-Range', `products 0-${results.length - 1}/${results.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(products);
    });
});

module.exports = router;
