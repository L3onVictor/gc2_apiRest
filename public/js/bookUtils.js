export const updateBooks = async (listElementId) => {
  const list = document.getElementById(listElementId);
  try {
    const res = await fetch('/api/books');
    const data = await res.json();

    list.innerHTML = '';
    data.books.forEach(book => {
      const li = document.createElement('li');
      li.textContent = `${book.id} - ${book.title} (${book.author}) `;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Excluir';
      deleteBtn.className = 'btn-delete';
      deleteBtn.onclick = async () => {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
          await deleteBook(book.id, listElementId);
        }
      };

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li>Erro ao carregar livros.</li>';
    console.error(err);
  }
};

const deleteBook = async (id, listElementId) => {
  try {
    const res = await fetch(`/api/books/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      updateBooks(listElementId); // Recarrega a lista
    } else {
      alert('Erro ao excluir o livro.');
    }
  } catch (err) {
    console.error('Erro ao excluir:', err);
    alert('Erro ao excluir o livro.');
  }
};