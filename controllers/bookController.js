import books from '../mock/books.js';

export const getBooks = (req, res) => {
    res.json({books})};

export const registerBook = (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    const newBook = {
        id: (books.length + 1).toString(),
        title,
        author
    };
    books.push(newBook);
    res.status(201).json(newBook);
};