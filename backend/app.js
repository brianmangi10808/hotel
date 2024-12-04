const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const product= require('./routes/product');
const users= require('./routes/users');
const login= require('./routes/login');
const category= require('./routes/category');
const tables= require('./routes/tables');
const orders= require('./routes/orders');
const session = require('express-session');
const app = express();


app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow credentials to be sent (required for sessions)
}));


  app.use(session({
    secret: 'your_secret_key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true } // Secure: false for HTTP (set to true for HTTPS)
  }));

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

app.use('/api/', product);
app.use('/api/',users);
app.use('/api/',category);
app.use('/api/',login);
app.use('/api/',tables);
app.use('/api/',orders);


  
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
