/**
 * Testes de integração leve: routes/bookRouter.js
 *
 * Verificamos que as rotas estão registradas corretamente no Express
 * sem subir um servidor HTTP real e sem usar supertest.
 *
 * Estratégia:
 *  - Mockamos o controller para que cada handler seja um jest.fn() vazio.
 *  - Instanciamos o router diretamente e inspecionamos a tabela de rotas
 *    (router.stack) para confirmar método, path e handler.
 */

import { jest } from '@jest/globals';

// ─── 1. Mocks declarados antes de qualquer import ────────────────────────────
const mockGetBooks    = jest.fn();
const mockRegisterBook = jest.fn();
const mockDeleteBook  = jest.fn();

jest.unstable_mockModule('../../controllers/bookController.js', () => ({
    getBooks:     mockGetBooks,
    registerBook: mockRegisterBook,
    deleteBook:   mockDeleteBook,
}));

// database.js é importado indiretamente pelo controller; mockamos para evitar
// que o `startDb()` de nível de módulo tente abrir um arquivo .db real.
jest.unstable_mockModule('../../database/database.js', () => ({
    initializeDb: jest.fn(),
    createBookTable: jest.fn(),
    startDb: jest.fn(),
}));

// ─── 2. Import dinâmico do router APÓS os mocks ───────────────────────────────
const { default: bookRouter } = await import('../../routes/bookRouter.js');

// ─── Helper: extrai as rotas registradas no router ───────────────────────────
function getRoutes(router) {
    return router.stack
        .filter(layer => layer.route)
        .map(layer => ({
            method: Object.keys(layer.route.methods)[0].toUpperCase(),
            path:   layer.route.path,
        }));
}

// ============================================================================
// Verificação estrutural das rotas
// ============================================================================
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
