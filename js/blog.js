// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    let blogData = null;
    let currentTag = 'all';
    let currentPage = 1;
    const postsPerPage = 6;

    // Load blog data
    function loadBlogData() {
        try {
            // Load from JSON file
            fetch('data/blog-posts.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Blog data loaded from JSON:', data.posts ? data.posts.length : 0, 'posts');
                    if (!data || !data.posts || data.posts.length === 0) {
                        throw new Error('Empty or invalid blog data');
                    }
                    blogData = data;
                    console.log('Total posts:', blogData.posts.length);
                    console.log('First post ID:', blogData.posts[0] ? blogData.posts[0].id : 'none');
                    initializeBlog();
                })
                .catch(error => {
                    console.error('Error loading blog data from JSON:', error);
                    const blogGrid = document.getElementById('blogGrid');
                    if (blogGrid) {
                        blogGrid.innerHTML = 
                            '<p style="text-align: center; padding: 40px; grid-column: 1 / -1;">Ошибка загрузки данных блога. Проверьте консоль браузера (F12).</p>';
                    }
                });
        } catch (error) {
            console.error('Error loading blog data:', error);
            const blogGrid = document.getElementById('blogGrid');
            if (blogGrid) {
                blogGrid.innerHTML = 
                    '<p style="text-align: center; padding: 40px; grid-column: 1 / -1;">Ошибка загрузки данных блога. Проверьте консоль браузера.</p>';
            }
        }
    }

    // Initialize blog
    function initializeBlog() {
        if (!blogData || !blogData.posts) {
            console.error('Blog data is empty or invalid');
            return;
        }
        renderTags();
        renderPosts();
    }

    // Render tags filter
    function renderTags() {
        const tagsFilter = document.getElementById('blogTagsFilter');
        if (!tagsFilter || !blogData || !blogData.tags) return;

        // Add click handler for "Все записи" button
        const allBtn = tagsFilter.querySelector('[data-tag="all"]');
        if (allBtn) {
            allBtn.addEventListener('click', () => filterByTag('all'));
        }

        // Get unique tags from posts
        const allTags = new Set();
        blogData.posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => allTags.add(tag));
            }
        });

        // Create tag buttons
        if (blogData.tags && Array.isArray(blogData.tags)) {
            blogData.tags.forEach(tagInfo => {
                if (allTags.has(tagInfo.name)) {
                    const tagBtn = document.createElement('button');
                    tagBtn.className = 'tag-filter-btn';
                    tagBtn.textContent = tagInfo.name;
                    tagBtn.setAttribute('data-tag', tagInfo.slug);
                    tagBtn.addEventListener('click', () => filterByTag(tagInfo.slug));
                    tagsFilter.appendChild(tagBtn);
                }
            });
        }
    }

    // Filter posts by tag
    function filterByTag(tagSlug) {
        currentTag = tagSlug;
        currentPage = 1;

        // Update active tag button
        document.querySelectorAll('.tag-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tag') === tagSlug) {
                btn.classList.add('active');
            }
        });

        renderPosts();
        
        // Scroll to top of blog content
        const blogContent = document.querySelector('.blog-content');
        if (blogContent) {
            blogContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Get filtered posts
    function getFilteredPosts() {
        if (!blogData || !blogData.posts) return [];

        let filtered = blogData.posts;

        // Filter by tag
        if (currentTag !== 'all') {
            const tagInfo = blogData.tags ? blogData.tags.find(t => t.slug === currentTag) : null;
            if (tagInfo) {
                filtered = filtered.filter(post => post.tags && post.tags.includes(tagInfo.name));
            }
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    }

    // Render posts
    function renderPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        const filteredPosts = getFilteredPosts();
        console.log('Filtered posts:', filteredPosts.length);
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        console.log('Posts to show on page', currentPage, ':', postsToShow.length, 'posts');

        // Clear grid
        blogGrid.innerHTML = '';

        if (postsToShow.length === 0) {
            blogGrid.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1 / -1;">Записи не найдены.</p>';
            renderPagination(0);
            return;
        }

        // Render posts
        postsToShow.forEach(post => {
            const articleCard = createPostCard(post);
            blogGrid.appendChild(articleCard);
        });

        renderPagination(totalPages);
    }

    // Create post card
    function createPostCard(post) {
        // Generate URL for the post using blogId and number (without .html extension)
        const postUrl = `/blog/${post.blogId}/${post.number}`;
        
        const article = document.createElement('article');
        article.className = 'article-card blog-post-card';

        // Tags HTML
        const tagsHTML = post.tags && Array.isArray(post.tags) ? post.tags.map(tag => 
            `<span class="blog-post-tag">${escapeHtml(tag)}</span>`
        ).join('') : '';

        // Create link wrapper for the card
        article.innerHTML = `
            <a href="${postUrl}" class="blog-post-link">
                <div class="article-content">
                    <div class="blog-post-meta">
                        <span class="blog-post-date">${escapeHtml(post.dateFormatted || post.date)}</span>
                        ${tagsHTML ? `<div class="blog-post-tags">${tagsHTML}</div>` : ''}
                    </div>
                    <h2>${escapeHtml(post.title)}</h2>
                    <p>${escapeHtml(post.preview || post.excerpt || '')}</p>
                </div>
            </a>
        `;

        return article;
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

    // Render pagination
    function renderPagination(totalPages) {
        const pagination = document.getElementById('blogPagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';

        // Previous button
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="blogPagination.goToPage(${currentPage - 1})">‹ Предыдущая</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const activeClass = i === currentPage ? 'active' : '';
                paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="blogPagination.goToPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="blogPagination.goToPage(${currentPage + 1})">Следующая ›</button>`;
        }

        paginationHTML += '</div>';
        pagination.innerHTML = paginationHTML;
    }


    // Pagination object (accessible globally)
    window.blogPagination = {
        goToPage: function(page) {
            currentPage = page;
            renderPosts();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Load blog data on page load
    loadBlogData();
});
