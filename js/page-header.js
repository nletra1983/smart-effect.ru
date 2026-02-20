// Reusable page header component - loads page header on all pages except index
(function() {
    'use strict';

    function getCurrentPage() {
        // Get current page name from window location
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(part => part.length > 0);
        
        // Get the last part of the path (the filename)
        let currentPage = pathParts[pathParts.length - 1];
        
        // If no filename or it's just the domain, it's the index page
        if (!currentPage || currentPage === window.location.hostname) {
            currentPage = '';
        }
        
        // Normalize index page variations
        if (currentPage === '' || currentPage === '/' || currentPage === 'index' || currentPage === 'index.html') {
            currentPage = '';
        }
        
        return currentPage;
    }

    function renderPageHeader(title, subtitle) {
        // Calculate path depth to determine correct relative paths
        const pathname = window.location.pathname;
        // Normalize pathname: remove trailing slash and split
        const normalizedPath = pathname.replace(/\/$/, ''); // Remove trailing slash
        const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
        
        let depth = pathParts.length;
        // If last part is index or empty, don't count it (we're in that folder)
        if (pathParts.length > 0 && (pathParts[pathParts.length - 1] === 'index' || pathParts[pathParts.length - 1] === 'index.html')) {
            depth = pathParts.length - 1; // Don't count index itself
        }
        
        // Calculate basePath:
        // - For root files (depth=1): no prefix needed
        // - For nested folders (depth>=2): go up 'depth' levels
        const basePath = depth > 1 ? '../'.repeat(depth) : '';
        
        // Default photo - can be customized per page if needed
        const photoSrc = basePath + 'images/nk-3.png';
        
        return `<section class="page-header-video">
        <div class="container">
            <div class="page-header-wrapper">
                <div class="page-header-content">
                    <h1 class="page-header-title">${title}</h1>
                    ${subtitle ? `<p class="page-header-subtitle">${subtitle}</p>` : ''}
                </div>
                <div class="page-header-image">
                    <div class="page-header-photo-wrapper">
                        <img src="${photoSrc}" alt="Наталья Кузменкова" class="page-header-photo">
                    </div>
                </div>
            </div>
        </div>
    </section>`;
    }

    // Function to insert page header into page
    function insertPageHeader() {
        const currentPage = getCurrentPage();
        
        // Don't insert on index page (it has its own hero section)
        if (currentPage === '' || currentPage === 'index' || currentPage === 'index.html') {
            return;
        }

        // Find page header placeholder or existing page header
        const pageHeaderPlaceholder = document.querySelector('section.page-header-video, section.page-header');
        const headerElement = document.querySelector('header.header');
        
        if (pageHeaderPlaceholder) {
            // Get title and subtitle from existing content if available
            const existingTitle = pageHeaderPlaceholder.querySelector('.page-header-title, h1');
            const existingSubtitle = pageHeaderPlaceholder.querySelector('.page-header-subtitle, .page-subtitle');
            
            const title = existingTitle ? existingTitle.textContent.trim() : '';
            const subtitle = existingSubtitle ? existingSubtitle.textContent.trim() : '';
            
            // Only replace if we have a title, otherwise keep existing
            if (title) {
                pageHeaderPlaceholder.outerHTML = renderPageHeader(title, subtitle);
            }
        } else {
            // Try to find h1 after header to extract title
            if (headerElement) {
                const nextSibling = headerElement.nextElementSibling;
                if (nextSibling && nextSibling.tagName === 'SECTION') {
                    const h1 = nextSibling.querySelector('h1');
                    if (h1) {
                        const title = h1.textContent.trim();
                        const subtitleEl = nextSibling.querySelector('p');
                        const subtitle = subtitleEl ? subtitleEl.textContent.trim() : '';
                        
                        // Replace the section with our page header
                        nextSibling.outerHTML = renderPageHeader(title, subtitle);
                    }
                }
            }
        }
    }

    // Insert page header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertPageHeader);
    } else {
        // DOM is already ready
        insertPageHeader();
    }
})();
