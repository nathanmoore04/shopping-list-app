// Imports
const express = require('express');
const { Pool } = require('pg');

// ----- Server stuff -----
const app = express();

const hostname = '127.0.0.1';
const SERVER_PORT = 3000;

// ----- DB stuff -----
const pool = new Pool({
    user: 'postgres', // Default superuser
    host: 'localhost', // Server address
    database: 'recipes_app_test', // Database name
    password: 'N8K9$wims', // Replace with your password
    port: 5432, // Default PostgreSQL port
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
app.delete('/recipes/:id', (req, res) => {
    const { id } = req.params;
    const index = recipes.findIndex((r) => r.id === parseInt(id));

    if (index == -1) res.status(404).send("Recipe not found");
    else {
        recipes.splice(index, 1);
        res.status(204).send();
    }
    
});