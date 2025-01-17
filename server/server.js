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

// Recipes endpoint
app.get('/recipes', (req, res) => {
    res.json(recipes);
});