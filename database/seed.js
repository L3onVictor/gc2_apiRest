import { initializeDb } from "./database.js";

const db = await initializeDb();
const a = 2;
const b = 7

function teste(params) {
    const result = params + 2
    console.log(result)
}
const books = [
    {
        title: "A arte da guerra",
        author: "Sun Tzu"
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin"
    }
]

for (const book of books) {
    await db.run(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        [book.title, book.author]
    );
}
console.log("Livros inseridos com sucesso!");
await db.close();