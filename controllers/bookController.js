import { initializeDb } from '../database/database.js';

export const getBooks = async (req, res) => {
    try {
        const db = await initializeDb();
        const books = await db.all('SELECT * FROM books');
        res.json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}


export const registerBook = async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    const db = await initializeDb();
    const result = await db.run(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        [title, author]
    );

    const newBook = {
        id: result.lastID,
        title,
        author
    };

    res.status(201).json({ message: 'Book created successfully' });
};

export const deleteBook = async (req, res) => {
    const { id } = req.params;

    const db = await initializeDb();
    const result = await db.run('DELETE FROM books WHERE id = ?', [id]);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204);
}