"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const TODO_FILE = path_1.default.join(__dirname, "../../data.json");
const initializeDataFile = async () => {
    try {
        await fs_1.promises.access(TODO_FILE);
    }
    catch {
        await fs_1.promises.writeFile(TODO_FILE, JSON.stringify([]));
    }
};
// Create the data file
initializeDataFile().then(() => {
    console.log("Data file initialization completed.");
});
let userArr = [];
let message;
router.post("/add", async (req, res) => {
    let name = req.body.name;
    let todo = req.body.todo;
    try {
        const todoData = await fs_1.promises.readFile(TODO_FILE, "utf8");
        userArr = JSON.parse(todoData);
    }
    catch (err) {
        message = 'Error';
    }
    const updatedUsers = [...userArr];
    let userFound = false;
    for (let i = 0; i < updatedUsers.length; i++) {
        if (updatedUsers[i].name === name) {
            userFound = true;
            updatedUsers[i] = {
                ...updatedUsers[i],
                todos: [...updatedUsers[i].todos, todo],
            };
            break;
        }
    }
    if (!userFound) {
        updatedUsers.push({ name, todos: [todo] });
    }
    await fs_1.promises.writeFile(TODO_FILE, JSON.stringify(updatedUsers, null, 2), "utf8");
    message = `Todo added successfully for user ${name}.`;
    res.json({ message: message });
}); // End add()
//  Fetch users and their todos based on their name
router.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fs_1.promises.readFile(TODO_FILE, "utf8");
        const userArr = JSON.parse(data);
        const user = userArr.find((u) => u.name === id);
        console.log('tyep of user: ', typeof user);
        if (typeof user === "undefined") {
            //message = `User with name ${id} not found.`
            message = "User not found";
            res.json({ message: message, data: '' });
        }
        else {
            message = 'User found';
            res.json({ message: message, data: user });
        }
    }
    catch (err) {
        console.error("Error fetching user:", err);
    }
});
// End Fetch users
// Delete route
router.delete("/delete", async (req, res) => {
    let name = req.body.name;
    try {
        const data = await fs_1.promises.readFile(TODO_FILE, "utf8");
        let userArr = JSON.parse(data);
        const initialLength = userArr.length;
        userArr = userArr.filter((u) => u.name !== name);
        if (userArr.length === initialLength) {
            res.json({ message: `User with name "${name}" not found.`, "data": "" });
        }
        await fs_1.promises.writeFile(TODO_FILE, JSON.stringify(userArr, null, 2));
        res.json({ message: "User deleted successfully.", "data": "" });
    }
    catch (err) {
        console.error("Error deleting user:", err);
    }
});
// update todos (delete todos)
router.put("/update", async (req, res) => {
    const { name, todo } = req.body;
    let todoDelete = false;
    try {
        const data = await fs_1.promises.readFile(TODO_FILE, "utf8");
        const userArr = JSON.parse(data);
        const userIndex = userArr.findIndex((user) => user.name === name);
        if (userIndex === -1) {
            message = "User not found";
            res.json({ message: message });
            process.exit(0);
        }
        const todoIndex = userArr[userIndex].todos.indexOf(todo);
        if (todoIndex === -1) {
            message = "Todo not found";
            res.json({ message: message });
            process.exit(0);
        }
        userArr[userIndex].todos.splice(todoIndex, 1);
        await fs_1.promises.writeFile(TODO_FILE, JSON.stringify(userArr, null, 2));
        message = "Todo deleted successfully.";
        todoDelete = true;
        res.json({ message: message, todoDelete: todoDelete });
    }
    catch (err) {
        console.error("Error updating todo:", err);
    }
});
exports.default = router;
