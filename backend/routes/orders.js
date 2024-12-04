const express = require('express');
const db = require('../db'); // Database connection
const router = express.Router();

// Place a New Order
router.post('/order', (req, res) => {
  const { table_number, items } = req.body;

  if (!table_number || !items || items.length === 0) {
    return res.status(400).json({ error: 'Table number and items are required' });
  }

  // Calculate total price
  const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Insert order into the orders table
  const orderQuery = 'INSERT INTO orders (table_number, total_price, status) VALUES (?, ?, ?)';
  db.query(orderQuery, [table_number, total_price, 'pending'], (err, orderResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const orderId = orderResult.insertId;

    // Insert items into the order_items table
    const orderItems = items.map(item => [orderId, item.name, item.quantity, item.price]);
    const itemQuery = 'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES ?';
    db.query(itemQuery, [orderItems], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save order items' });
      }
      res.status(201).json({ message: 'Order placed successfully', orderId });
    });
  });
});

router.patch('/order/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Order status is required' });
  }

  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    // Fetch the updated record
    const selectQuery = 'SELECT * FROM orders WHERE id = ?';
    db.query(selectQuery, [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch updated order' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found after update' });
      }
      res.json(results[0]); // Return the updated order
    });
  });
});

router.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, table_number, total_price } = req.body;

  if (!status || !table_number || !total_price) {
    return res.status(400).json({ error: 'All fields are required for a full update' });
  }

  const query = 'UPDATE orders SET status = ?, table_number = ?, total_price = ? WHERE id = ?';
  db.query(query, [status, table_number, total_price, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update order' });
    }

    // Fetch the updated record
    const selectQuery = 'SELECT * FROM orders WHERE id = ?';
    db.query(selectQuery, [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch updated order' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found after update' });
      }

      
      res.json(results[0]); // Return the updated order
    });
  });
});


// Get All Orders
router.get('/orders', (req, res) => {
  const query = 'SELECT * FROM orders';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve orders' });
    }

    // Include Content-Range header
    res.setHeader('Content-Range', `orders 0-${results.length}/${results.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range'); // Ensure CORS support

    res.json(results);
  });
});




// Get an Order by ID
// Get an Order by ID
router.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT o.*, oi.id as item_id, oi.item_name, oi.quantity, oi.price, oi.total_price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve order' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Transform the results into a structured format
    const order = {
      id: results[0].id,
      table_number: results[0].table_number,
      status: results[0].status,
      total_price: results[0].total_price,
      order_time: results[0].order_time,
      items: results.map(row => ({
        item_id: row.item_id,
        item_name: row.item_name,
        quantity: row.quantity,
        price: row.price,
        total_price: row.total_price
      }))
    };

    res.json(order);
  });
});

// router.get('/orders/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'SELECT * FROM orders WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to retrieve order' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

    
//     res.json(results[0]);
//   });
// });

router.get('/orders/status/:table_number', (req, res) => {
  const { table_number } = req.params;

  // Query to fetch the latest order for the given table
  const query = `
      SELECT o.id, o.status, o.total_price, o.order_time, o.table_number
      FROM orders o
      WHERE o.table_number = ?
      ORDER BY o.order_time DESC
      LIMIT 1
  `;

  db.query(query, [table_number], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to retrieve order status' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No orders found for this table' });
      }

      res.json(results[0]); // Return the latest order's status
  });
});

// Get Items for a Specific Order
router.get('/order_items/:order_id', (req, res) => {
  const { order_id } = req.params;
  const query = 'SELECT * FROM order_items WHERE order_id = ?';
  
  db.query(query, [order_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve order items' });
    }
    
    res.json(results);
  });
});



module.exports = router;
