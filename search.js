  const input = document.getElementById('searchInput');
  const resultsList = document.getElementById('results');
  let products = [];

  // Get the search query from the URL ?q= parameter
  const params = new URLSearchParams(window.location.search);
  const queryRaw = params.get('q') || '';
  input.value = queryRaw;

  // Fetch product data from JSON file
  fetch('/products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      showResults(queryRaw);
    })
    .catch(err => {
      console.error('Failed to load products.json:', err);
      resultsList.innerHTML = '<li>Error loading products.</li>';
    });

  // Function to display results filtered by query
  function showResults(q) {
    const lowerQ = q.toLowerCase();

    if (!q) {
      resultsList.innerHTML = '<li></li>';
      return;
    }

    const filtered = products.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(lowerQ);
      const tagsMatch = Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(lowerQ));
      return titleMatch || tagsMatch;
    });

    if (filtered.length === 0) {
      resultsList.innerHTML = `<li>No results for "<strong>${q}</strong>"</li>`;
      return;
    }

    resultsList.innerHTML = filtered
      .map(p => `<li><a href="${p.url}">${p.title}</a></li>`)
      .join('');
  }

  // Update results live as user types
  input.addEventListener('input', e => {
    showResults(e.target.value);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const iconBtn = document.getElementById('search-icon-btn');
  const fullSearch = document.getElementById('full-search-bar');
  const searchInput = fullSearch.querySelector('input');

  iconBtn.addEventListener('click', () => {
    iconBtn.style.display = 'none';        // Hide icon button
    fullSearch.style.display = 'flex';     // Show full search bar
    searchInput.focus();
  });