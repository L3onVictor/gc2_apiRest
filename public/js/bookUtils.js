export const updateBooks = async (listElementId) => {
  const list = document.getElementById(listElementId);
  try {
    const res = await fetch('/api/books');
    const data = await res.json();

    list.innerHTML = '';
    data.books.forEach(book => {
      const li = document.createElement('li');
      li.textContent = `${book.id} - ${book.title} (${book.author})`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li>Erro ao carregar livros.</li>';
    console.error(err);
  }
};