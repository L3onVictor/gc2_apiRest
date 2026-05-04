import { jest } from '@jest/globals';

const mockGetBooks = jest.fn();
const mockRegisterBook = jest.fn();
const mockDeleteBook = jest.fn();

jest.unstable_mockModule('../../controllers/bookController.js', () => ({
    getBooks: mockGetBooks,
    registerBook: mockRegisterBook,
    deleteBook: mockDeleteBook,
}));

jest.unstable_mockModule('../../database/database.js', () => ({
    initializeDb: jest.fn(),
    createBookTable: jest.fn(),
    startDb: jest.fn(),
}));

const { default: bookRouter } = await import('../../routes/bookRouter.js');

function getRoutes(router) {
    return router.stack
        .filter(layer => layer.route)
        .map(layer => ({
            method: Object.keys(layer.route.methods)[0].toUpperCase(),
            path: layer.route.path,
        }));
}

// Verificação das rotas
describe('bookRouter — rotas registradas', () => {
    it('registra GET /books', () => {
        const routes = getRoutes(bookRouter);
        expect(routes).toContainEqual({ method: 'GET', path: '/books' });
    });

    it('registra POST /books', () => {
        const routes = getRoutes(bookRouter);
        expect(routes).toContainEqual({ method: 'POST', path: '/books' });
    });

    it('registra DELETE /books/:id', () => {
        const routes = getRoutes(bookRouter);
        expect(routes).toContainEqual({ method: 'DELETE', path: '/books/:id' });
    });

    it('tem exatamente 3 rotas registradas', () => {
        const routes = getRoutes(bookRouter);
        expect(routes).toHaveLength(3);
    });
});
