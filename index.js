const express = require('express');
const app = express();

const users = require("./data.json");

const fs = require('fs');
const path = require('path');

const PORT = 3000;

//Middleware
app.use(express.urlencoded({ extended: false }));

app.post("/api/users/:id/habit", (req, res) => {

    const userId = parseInt(req.params.id); //Extract the User ID from the URL parameters.
    const body = req.body; //Extracts the request body and stores it in the body variable.

    const user = users.find(u => u.id === userId); //Finds the user with the given ID from the users array.

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!user.habits) {
        user.habits = [];
    }

    const newHabit = {
        habit_id: user.habits.length + 1,
        habit_name: body.habit_name || "Unnamed Habit",
        habit_target_frequency: body.habit_target_frequency || "Not Set",
        created_at: new Date(),
        checked_dates: []
    };

    user.habits.push(newHabit);

    const filePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    
    return res.status(201).json({
        message: "Habit added successfully",
        habit: newHabit
    });

});

app.put("/api/users/:id/habit/:habit_id/check", (req, res) => {
    const userId = parseInt(req.params.id);
    const habitId = parseInt(req.params.habit_id);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const habit = user.habits.find(h => h.habit_id === habitId);

    if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
    }

    const today = new Date().toISOString().split('T')[0]; //YYYY-MM-DD format

    if (!habit.checked_dates.includes(today)) {
        habit.checked_dates.push(today); 
        const filePath = path.join(__dirname, 'data.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    }

    return res.status(200).json({
        message: "Habit checked for today",
        habit: habit
    });
});

app.get("/api/users/:id/habit/streaks", (req, res) => {
    
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!user.habits || user.habits.length === 0) {
        return res.json({ message: "No habits found for this user", streaks: [] });
    }

    const habitLogs = user.habits.map(habit => ({
        habit_id: habit.habit_id,
        habit_name: habit.habit_name,
        checked_dates: habit.checked_dates
    }));

    return res.status(200).json({
        message: "Habit Logs retrieved successfully",
        habit_logs: habitLogs
    });

    
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
