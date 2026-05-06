import express from "express";
import bcrypt from "bcrypt";
import sqlite from "better-sqlite3";
const app = express();
const db = new sqlite("database.db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/form", (req, res) => {
    const { name, email, message } = req.body;

    res.status(200).json({
        success: true,
        message: "Form submitted successfully!",
        data: { name, email, message },
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (email && password) {
        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: { email },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Email and password are required.",
        });
    }
});

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    );
    stmt.run(username, email, hashedPassword);

    if (username && email && password) {
        res.status(200).json({
            success: true,
            message: "Registration successful!",
            data: { username, email },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Username, email, and password are required.",
        });
    }
});

app.use("/", (req, res) => {
    res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
