// Imports
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');

// ----- Server stuff -----
const app = express();

const HOSTNAME = '127.0.0.1';
const SERVER_PORT = 3000;

const upload = multer();

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
app.use(cors({
    origin: 'http://localhost:8080', // Allow frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- USER AUTHENTICATION -----
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email) {
        return res.status(400).send("Email address is required");
    } else if (!password) {
        return res.status(400).send("Password is required");
    } else if (!name) {
        return res.status(400).send('Name is required')
    }

    console.log(name, email, password);

    try {

        const existingUsers = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUsers.rows.length > 0) {
            return res.status(400).send("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", 
            [name, email, hashedPassword]
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
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' })

        res.status(200).json({
            token: token
        });

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
        console.error(err.message);
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

        const meal = result.rows[0];

        // Convert PostgreSQL array string to actual JSON arrays
        //meal.ingredients = JSON.parse(meal.ingredients); // Fix here!

        res.status(200).json(meal);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Server error');
    }
});

// POST route - add a new recipe
app.post('/recipes', authenticateToken, upload.none(), async (req, res) => {
    //console.log(req.body);
    
    const { name, tags, ingredients, image, steps } = req.body;
    const userId = req.user.userId;

    if (!name || !ingredients || !steps) return res.status(400).send('Missing required fields');

    const formattedTags = JSON.parse(tags);
    const formattedIngredients = JSON.parse(ingredients);
    const formattedSteps = JSON.parse(steps);

    const pgTags = `{${formattedTags.map(tag => `"${tag}"`).join(',')}}`;

    try {
        const result = await pool.query(
            'INSERT INTO recipes (name, ingredients, steps, user_id, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, formattedIngredients, formattedSteps, userId, pgTags]
        );

        const meal = result.rows[0];

        res.status(201).json(meal);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Server error');
    }
});

// PUT route - update existing recipe
app.put('/recipes/:id', authenticateToken, upload.none(), async (req, res) => {
    const mealId = req.params.id;
    const { name, tags, ingredients, image, steps } = req.body;
    const userId = req.user.userId;

    if (!name || !ingredients || !steps) return res.status(400).send('Missing required fields');

    const formattedTags = JSON.parse(tags);
    const formattedIngredients = JSON.parse(ingredients);
    const formattedSteps = JSON.parse(steps);

    const pgTags = `{${formattedTags.map(tag => `"${tag}"`).join(',')}}`;

    try {
        const result = await pool.query(
            'UPDATE recipes SET name = $1, ingredients = $2, steps = $3, tags = $5 WHERE id = $6 AND user_id = $4 RETURNING *',
            [name, formattedIngredients, formattedSteps, userId, pgTags, mealId]
        );

        if (result.rowCount === 0) return res.status(404).send('Meal not found');

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal server error');
    }

});

// DELETE route - delete a recipe
app.delete('/recipes/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query('DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, userId]);

        if (result.rowCount === 0) return res.status(404).send('Recipe not found');
        res.status(204).send('Meal successfully deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(SERVER_PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${SERVER_PORT}`);
});