import express from "express";
import bcrypt from "bcrypt";
import sqlite from "better-sqlite3";
const app = express();
const db = new sqlite("database.db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function saveUser(user: { username: string; email: string; password: string }) {
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(user.username, user.email, user.password);
}

function getUser(email: string) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as { username: string; email: string; password: string } | undefined;
}

function checkPassword(inputPassword: string, storedHash: string) {
  return bcrypt.compare(inputPassword, storedHash);
}

app.post("/form", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Form submitted successfully!",
    data: { name, email, message },
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const user = getUser(email);
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const isValidPassword = await checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Email or Password");
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: { email },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const existingUser = getUser(email);
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    saveUser({ username, email, password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Registration successful!",
      data: { username, email },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
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
