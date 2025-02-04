// Imports
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// ----- Server stuff -----
const app = express();

const HOSTNAME = '127.0.0.1';
const SERVER_PORT = 3000;

// ----- DB stuff -----
const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Database connected');
    }
});

// ----- App stuff ------
app.use(cors());

app.use(express.json());

// Start server
app.listen(SERVER_PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${SERVER_PORT}`);
});

// ----- USER AUTHENTICATION -----
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send("Email address is required");
    } else if (!password) {
        return res.status(400).send("Password is required");
    }

    try {

        const existingUsers = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUsers.rows.length > 0) {
            return res.status(400).send("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email", 
            [email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Ensure all fields are present
    if (!email) {
        return res.status(400).send('Email is required');
    } else if (!password) {
        return res.status(400).send('Password is required');
    }

    try {

        // Get user from database
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).send('Invalid email or password');
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json(token);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Middleware to authenticate a JWT token from the client
const authenticateToken = (req, res, next) => {
    // Get the token from the request header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (err) {
        res.status(403).send('Invalid token');
    }
};

// ----- ROUTES -----
// Route for checking if a user token is valid, used in protecting frontend routes
app.get('/auth', authenticateToken, (req, res) => {
    try {
        res.status(200).send('User authenticated');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Test route, just lets you know the server is running
app.get('/', (req, res) => {
    res.send("Service is up and running");
});

// GET route - list all of a user's recipes
app.get('/recipes', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE user_id = $1', [req.user.userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET a specific recipe
app.get('/recipes/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [req.params.id]);

        if (result.rows.length == 0) return res.status(404).send('Recipe not found');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST route - add a new recipe
app.post('/recipes', async (req, res) => {
    const { name, ingredients, steps } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO recipes (name, ingredients, steps) VALUES ($1, $2, $3) RETURNING *',
            [name, ingredients, steps]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT route - update existing recipe
app.put('/recipes/:id', (req, res) => {
    const { id } = req.params;
    const { name, ingredients, steps } = req.body;

    const recipe = recipes.find((r) => r.id === parseInt(id));
    if (!recipe) {
        res.status(404).send("Recipe not found");   
    } else {
        recipe.name = name || recipe.name;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.steps = steps || recipe.steps;
        res.json(recipe);
    }
});

// DELETE route - delete a recipe
app.delete('/recipes/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rows.length == 0) return res.status(404).send('Recipe not found');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});