// Imports
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// ----- Server stuff -----
const app = express();

const hostname = '127.0.0.1';
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
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Database connected');
    }
});

// ----- App stuff ------
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})

// Test route, just lets you know the server is running
app.get('/', (req, res) => {
    res.send("Service is up and running");
});

app.listen(SERVER_PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${SERVER_PORT}`);
});

// ----- Recipes endpoint -----
// GET route - list all recipes
app.get('/recipes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET a specific recipe
app.get('/recipes/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [req.params.id]);

        if (result.rows.length == 0) res.status(404).send('Recipe not found');
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

        if (result.rows.length == 0) res.status(404).send('Recipe not found');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});