import path from "path";
import sqlite from "better-sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const dbPath = process.env.DATABASE_PATH ?? path.join(__dirname, "database.db");
const db = new sqlite(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export function saveUser(user: { username: string; email: string; password: string }) {
  const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run(user.username, user.email, user.password);
}

export function saveFeedback(feedback: { name: string; email: string; message: string }) {
  const stmt = db.prepare("INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)");
  stmt.run(feedback.name, feedback.email, feedback.message);
}

export function getUser(email: string) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as { username: string; email: string; password: string; id: number } | undefined;
}

export function deleteUser(id: number) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  return stmt.run(id);
}

export function checkPassword(inputPassword: string, storedHash: string) {
  return bcrypt.compare(inputPassword, storedHash);
}

export function generateToken(user: { id: number; email: string; username: string }) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
  }
  return jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
}
