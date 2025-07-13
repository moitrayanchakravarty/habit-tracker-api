const express = require('express');
const app = express();

const users = require("./data.json");

const PORT = 3000;



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/api/users/:id/habit", (req, res) => {
    //TODO: Implement habit creation logic
    return res.json({ status: "pending", });
});

app.get("/api/users/:id/habit", (req, res) => {
    return res.json(habit);
});