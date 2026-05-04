/**
 * Testes unitários: controllers/bookController.js
 *
 * Com ESM ("type":"module"), usamos jest.unstable_mockModule() antes dos
 * imports dinâmicos — essa é a API oficial do Jest para mockar módulos ESM.
 *
 * Estratégia:
 *  - Mockamos database/database.js para que initializeDb() retorne um objeto
 *    de banco de dados falso (mockDb), sem tocar em nenhum arquivo .db real.
 *  - Criamos um helper makeRes() que imita o objeto `res` do Express,
 *    eliminando a necessidade de supertest ou de subir um servidor HTTP.
 */

import { jest } from '@jest/globals';

// ─── 1. Configurar o mock do banco ANTES de importar o controller ────────────
// jest.unstable_mockModule é obrigatório em projetos ESM nativos.
const mockDb = {
    all: jest.fn(),
    run: jest.fn(),
};

jest.unstable_mockModule('../../database/database.js', () => ({
    initializeDb: jest.fn().mockResolvedValue(mockDb),
}));

// ─── 2. Importar os módulos DEPOIS de declarar os mocks (import dinâmico) ───
const { initializeDb } = await import('../../database/database.js');
const { getBooks, registerBook, deleteBook } = await import('../../controllers/bookController.js');

// ─── 3. Garantir que initializeDb sempre retorna mockDb em cada teste ────────
beforeEach(() => {
    initializeDb.mockResolvedValue(mockDb);
});

// ─── Helper: imita res do Express sem precisar do Express ────────────────────
function makeRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // encadeamento: res.status(400).json(...)
    res.json   = jest.fn().mockReturnValue(res);
    res.send   = jest.fn().mockReturnValue(res);
    return res;
}

// ============================================================================
// getBooks
// ============================================================================
describe('getBooks', () => {
    it('retorna 200 com lista de livros quando DB responde com sucesso', async () => {
        const fakeBooks = [
            { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
            { id: 2, title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
        ];
        mockDb.all.mockResolvedValue(fakeBooks);

        const req = {};
        const res = makeRes();

        await getBooks(req, res);

        expect(initializeDb).toHaveBeenCalledTimes(1);
        expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM books');
        expect(res.json).toHaveBeenCalledWith({ books: fakeBooks });
    });

    it('retorna 500 quando o banco lança uma exceção', async () => {
        mockDb.all.mockRejectedValue(new Error('connection refused'));

        const req = {};
        const res = makeRes();

        await getBooks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
});

// ============================================================================
// registerBook
// ============================================================================
describe('registerBook', () => {
    it('cria livro e retorna 201 com os dados salvos', async () => {
        mockDb.run.mockResolvedValue({ lastID: 7 });

        const req = { body: { title: 'Domain-Driven Design', author: 'Eric Evans' } };
        const res = makeRes();

        await registerBook(req, res);

        expect(mockDb.run).toHaveBeenCalledWith(
            'INSERT INTO books (title, author) VALUES (?, ?)',
            ['Domain-Driven Design', 'Eric Evans']
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Book created successfully',
            book: { id: 7, title: 'Domain-Driven Design', author: 'Eric Evans' },
        });
    });

    it('retorna 400 quando title está ausente', async () => {
        const req = { body: { author: 'Alguém' } };
        const res = makeRes();

        await registerBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Title and author are required' });
        expect(mockDb.run).not.toHaveBeenCalled();
    });

    it('retorna 400 quando author está ausente', async () => {
        const req = { body: { title: 'Algum Livro' } };
        const res = makeRes();

        await registerBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Title and author are required' });
    });

    it('retorna 400 quando body está completamente vazio', async () => {
        const req = { body: {} };
        const res = makeRes();

        await registerBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retorna 500 quando o banco lança uma exceção ao inserir', async () => {
        mockDb.run.mockRejectedValue(new Error('constraint violation'));

        const req = { body: { title: 'Livro X', author: 'Autor Y' } };
        const res = makeRes();

        await registerBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
});

// ============================================================================
// deleteBook
// ============================================================================
describe('deleteBook', () => {
    it('deleta o livro e retorna 204 sem corpo', async () => {
        mockDb.run.mockResolvedValue({ changes: 1 });

        const req = { params: { id: '3' } };
        const res = makeRes();

        await deleteBook(req, res);

        expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM books WHERE id = ?', ['3']);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('retorna 404 quando nenhuma linha foi afetada (livro não existe)', async () => {
        mockDb.run.mockResolvedValue({ changes: 0 });

        const req = { params: { id: '999' } };
        const res = makeRes();

        await deleteBook(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
    });

    it('retorna 500 quando o banco lança uma exceção ao deletar', async () => {
        mockDb.run.mockRejectedValue(new Error('disk I/O error'));

        const req = { params: { id: '1' } };
        const res = makeRes();

        await deleteBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    });
});
