import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initializeDb() {
    const db = await open({
        filename: "./books.db",
        driver: sqlite3.Database
    })
    return db;
}

export async function createBookTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
        )
        `)
}

export async function startDb() {
    try {
    const db = await initializeDb();
        await createBookTable(db);
        console.log("Database initialized and book table created successfully.");
        return db;
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

startDb();