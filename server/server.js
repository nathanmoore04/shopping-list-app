const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.json());

// Test route, just lets you know the server is running
app.get('/', (req, res) => {
    res.send("Service is up and running");
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

// Example recipes JSON objects
const recipes = [
    { id: 1, name: 'Spaghetti', ingredients: ['Pasta', 'Tomato Sauce'], steps: ['Do something', 'do something else']},
    { id: 2, name: 'Pancakes', ingredients: ['Flour', 'Milk', 'Eggs'], steps: ['Do something', 'do something else']}
];

// ----- Recipes endpoint -----
// GET route - list all recipes
app.get('/recipes', (req, res) => {
    res.json(recipes);
});

// POST route - add a new recipe
app.post('/recipes', (req, res) => {
    const { name, ingredients, steps } = req.body;
    const newRecipe = {
        id: recipes.length + 1,
        name,
        ingredients,
        steps
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
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