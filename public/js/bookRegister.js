const form = document.getElementById('bookForm');

// Submeter o formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    });

    if (res.ok) {
        alert('Livro cadastrado com sucesso!');
        window.location.href = 'index.html';
    } else {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
    }

    form.reset();
    updateBooks();
});

// Carrega lista inicial
updateBooks();