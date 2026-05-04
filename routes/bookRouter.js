import { Router } from 'express';
import { getBooks, registerBook, deleteBook } from '../controllers/bookController.js';
const router = Router();

// Rota para obter todos os livros
router.get('/books', getBooks);

// Rota para cadastrar um novo livro
router.post('/books', registerBook);

// Rota para deletar um livro
router.delete('/books/:id', deleteBook);


export default router;