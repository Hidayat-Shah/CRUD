const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'sql123', // Your MySQL password
    database: 'med_store',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Helper function to validate inputs
const validateInput = (input, type) => {
    if (type === 'string') return input && input.trim() !== '';
    if (type === 'number') return !isNaN(input) && input !== '';
    return false;
};

// CRUD operations
// Create
app.post('/products', (req, res) => {
    const { name, price, quantity } = req.body;

    // Validate inputs
    if (!validateInput(name, 'string') || !validateInput(price, 'number') || !validateInput(quantity, 'number')) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const query = 'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)';
    db.query(query, [name, parseFloat(price), parseInt(quantity)], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Read
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Update
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    // Validate inputs
    if (!validateInput(name, 'string') || !validateInput(price, 'number') || !validateInput(quantity, 'number')) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const query = 'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, parseFloat(price), parseInt(quantity), id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Delete
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.listen(5000, () => {
    console.log('Backend server running on port 5000');
});
