import { Router } from 'express';
import books from '../mock/books.js';

const router = Router();

// Rota para obter todos os livros
router.get('/books', (req, res) => {
    res.status(200).json({
        sucess: true,
        message: 'Lista de livros' ,
        data: books
    });
});

export default router;