// Articles functionality
document.addEventListener('DOMContentLoaded', function() {
    let articlesData = null;

    // Load articles data
    function loadArticlesData() {
        fetch('data/articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Articles data loaded:', data.articles ? data.articles.length : 0, 'articles');
                if (!data || !data.articles || data.articles.length === 0) {
                    throw new Error('Empty or invalid articles data');
                }
                articlesData = data;
                renderArticles();
            })
            .catch(error => {
                console.error('Error loading articles data:', error);
                const articlesGrid = document.getElementById('articlesGrid');
                if (articlesGrid) {
                    articlesGrid.innerHTML = 
                        '<p style="text-align: center; padding: 40px; grid-column: 1 / -1;">Ошибка загрузки данных статей. Проверьте консоль браузера (F12).</p>';
                }
            });
    }

    // Render articles
    function renderArticles() {
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid || !articlesData || !articlesData.articles) return;

        // Clear grid
        articlesGrid.innerHTML = '';

        // Render article cards
        articlesData.articles.forEach(article => {
            const articleCard = createArticleCard(article);
            articlesGrid.appendChild(articleCard);
        });
    }

    // Create article card
    function createArticleCard(article) {
        // Generate URL for the article (without .html extension)
        const articleUrl = `/articles/${article.slug}`;
        
        const articleElement = document.createElement('article');
        articleElement.className = 'article-card';

        // Image URL (use local path if available)
        const imageUrl = article.image || '';

        articleElement.innerHTML = `
            <a href="${articleUrl}" class="article-card-link">
                <div class="article-image">
                    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.title)}" loading="lazy">` : ''}
                </div>
                <div class="article-content">
                    <h2>${escapeHtml(article.title)}</h2>
                    <p>${escapeHtml(article.preview || article.excerpt || '')}</p>
                </div>
            </a>
        `;

        return articleElement;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Load articles data on page load
    loadArticlesData();
});
