# MealPlanner (working title)
This repository contains all project files and documentation for the recipe shopping list web app.  *Created for CSC 490: Senior Project at Berry College.*  This document represents the overall idea and to-do list for the project during the development process.

## Idea

The goal is to create a dynamic, reactive, responsive web app that allows users to:
- Create and save recipes with ingredient lists to their account.  (Maybe) get recipes from other users.  Support CRUD operations for recipes.
- Query the app to create a customizable meal schedule for a specified period of time.
- Output a customizable shopping list that corresponds to the generated meal schedule.
- (Maybe) output this shopping list to major grocery chain apps/query grocery stores for price/availability data.

## Deliverables

The completed app will contain the following features:
- Users can create and log in to accounts
- Users can create, read, update, and delete recipes
- Recipes have fields for name, ingredients, and instructions
- Users can create a meal schedule for a variable time period, with the option for "off-days" or eating elsewhere, that contains the recipes that they have saved
- Schedules are saved to users' accounts and can be reused
- User accounts contain schedule history and recent recipes
- Users can output a shopping list for their chosen schedule
- Shopping lists can be edited to add or remove ingredients as needed

## To-do

1. Design frontend
    - Wireframe recipe creation/editing, schedule calendar view, shopping list displays, landing page
    - Ensure responsive layout
2. Develop frontend
    - CRUD operations for recipes and schedules
    - Dynamic shopping lists
    - User authentication
3. Testing
4. Deploy

## In progress

1. Finalize core feature list (Integration with grocery store APIs later)
    - Recipe Management: Allow users to create, view, edit, and save recipes. Include fields like ingredients, quantities, instructions, prep time, etc.
    - Meal Scheduling: Provide a calendar or planner interface for users to schedule meals.
    - Shopping List Generation: Automatically create shopping lists based on recipes and schedules, grouping ingredients by category.
2. Investigate and choose tech stack
    - User authentication: OAuth, Firebase
    - Hosting: AWS, Vercel, GitHub
3. Design and develop backend
    - Ingredients, schedules, and lists tables with links to users and necessary routes/endpoints
4. Plan and implement user authentication
    - Add users database table
    - Create authentication routes on server
    - Investigate middleware for protecting routes?
    - JSON web tokens
    - Frontend integration
        - POST requests to backend routes
        - Return JWT to client
        - Store JWT in LocalStorage
        - Attach JWT to requests
        - Handle logout

## Completed

1. Investigate and choose tech stack
    - Frontend: Vue.js with Axios for backend connection, Bootstrap for styling
    - Backend (recipes, meal schedules, API interactions.): Node.js, Express
    - Database: PostgreSQL
2. Design and develop backend
    - Recipes table and GET, POST, PUT, DELETE endpoints
