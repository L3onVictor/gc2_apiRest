/**
 * Testes unitários: database/database.js
 *
 * Mockamos o módulo 'sqlite' para que `open()` retorne um objeto de banco
 * de dados falso — sem abrir nenhum arquivo .db real em disco.
 *
 * Nota: `database.js` chama startDb() no nível do módulo (linha 34).
 * O mock de 'sqlite' impede que essa chamada cause efeitos colaterais.
 */

import { jest } from '@jest/globals';

// ─── Mock do sqlite (wrapper assíncrono) ────────────────────────────────────
const mockDb = {
    exec: jest.fn().mockResolvedValue(undefined),
};

jest.unstable_mockModule('sqlite', () => ({
    open: jest.fn().mockResolvedValue(mockDb),
}));

// Importações dinâmicas APÓS declarar o mock
const { open } = await import('sqlite');
const { initializeDb, createBookTable, startDb } = await import('../../database/database.js');

beforeEach(() => {
    open.mockResolvedValue(mockDb);
    mockDb.exec.mockResolvedValue(undefined);
});

// ============================================================================
// initializeDb
// ============================================================================
describe('initializeDb', () => {
    it('chama open com o filename correto e retorna o db', async () => {
        const db = await initializeDb();

        expect(open).toHaveBeenCalledWith(
            expect.objectContaining({ filename: './books.db' })
        );
        expect(db).toBe(mockDb);
    });
});

// ============================================================================
// createBookTable
// ============================================================================
describe('createBookTable', () => {
    it('executa CREATE TABLE IF NOT EXISTS books', async () => {
        await createBookTable(mockDb);

        expect(mockDb.exec).toHaveBeenCalledWith(
            expect.stringContaining('CREATE TABLE IF NOT EXISTS books')
        );
    });

    it('garante que a tabela tem as colunas id, title e author', async () => {
        await createBookTable(mockDb);

        const sql = mockDb.exec.mock.calls[0][0];
        expect(sql).toMatch(/id\s+INTEGER\s+PRIMARY\s+KEY/i);
        expect(sql).toMatch(/title\s+TEXT\s+NOT\s+NULL/i);
        expect(sql).toMatch(/author\s+TEXT\s+NOT\s+NULL/i);
    });
});

// ============================================================================
// startDb
// ============================================================================
describe('startDb', () => {
    it('inicializa o banco e cria a tabela com sucesso, retornando o db', async () => {
        const db = await startDb();

        expect(db).toBe(mockDb);
        expect(mockDb.exec).toHaveBeenCalled();
    });

    it('relança o erro quando open falha', async () => {
        open.mockRejectedValueOnce(new Error('cannot open database'));

        await expect(startDb()).rejects.toThrow('cannot open database');
    });
});
