import express from "express";
import bcrypt from "bcrypt";
import sqlite from "better-sqlite3";
import cors from "cors";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });
const app = express();

const dbPath = path.join(__dirname, "..", "database.db");
const db = new sqlite(dbPath);

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "https://localhost:8080"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function saveUser(user: { username: string; email: string; password: string }) {
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(user.username, user.email, user.password);
}

function getUser(email: string) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as { username: string; email: string; password: string; id: number } | undefined;
}

function deleteUser(id: number) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  return stmt.run(id);
}

function checkPassword(inputPassword: string, storedHash: string) {
  return bcrypt.compare(inputPassword, storedHash);
}

function generateToken(user: { id: number; email: string; username: string }) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
  }
  return jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
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

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    res.cookie("session", token, { httpOnly: true });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: { email: user.email, username: user.username },
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

    const newUser = getUser(email)!;

    const token = generateToken({ id: newUser.id, email, username });
    res.cookie("session", token, { httpOnly: true });

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

app.get("/me", (req, res) => {
  try {
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables.");
    }
    const payload = jwt.verify(token, process.env.SECRET_KEY) as { id: string; email: string; username: string };

    res.json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        username: payload.username,
      },
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

app.delete("/me", (req, res) => {
  try {
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables.");
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY) as { id: number };
    const result = deleteUser(payload.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("session", { httpOnly: true });
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

app.use("/logout", (req, res) => {
  res.clearCookie("session", { httpOnly: true });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

app.use("/", (req, res) => {
  res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
