// Reusable menu component - loads menu on all pages
(function() {
    'use strict';

    // Menu items configuration
    const menuItems = [
        { href: '', text: 'ГЛАВНАЯ' }, // Empty string for index (root)
        { href: 'services.html', text: 'УСЛУГИ' },
        { href: 'articles.html', text: 'СТАТЬИ' },
        { href: 'blog.html', text: 'БЛОГ' },
        { href: 'video.html', text: 'ВИДЕО' },
        { href: 'conference.html', text: 'КОНФЕРЕНЦИЯ' },
        { href: 'reviews.html', text: 'ОТЗЫВЫ' }
    ];

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

    function renderMenu(currentPage) {
        // Normalize currentPage for comparison
        const normalizedCurrentPage = currentPage.toLowerCase();
        const pathname = window.location.pathname;
        
        // Calculate path depth to determine correct relative paths
        // For /blog/1136878/001/ -> need ../../../ (3 levels up: 001 -> 1136878 -> blog -> root)
        // For /blog -> no prefix needed (root file)
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
        // Examples:
        //   /blog -> depth=1 -> basePath='' (root file)
        //   /blog/1136878/001/ -> depth=3 -> basePath='../../../' (3 levels up)
        const basePath = depth > 1 ? '../'.repeat(depth) : '';
        
        // Debug logging (can be removed later)
        console.log('Menu.js - Path calculation:', {
            pathname: pathname,
            normalizedPath: normalizedPath,
            pathParts: pathParts,
            depth: depth,
            basePath: basePath
        });
        
        // Use the same logo on all pages (same as index page)
        const logoImage = basePath + 'images/logo-400.png';
        const logoText = ''; // No text on any page

        // Build menu items HTML
        const menuItemsHTML = menuItems.map(item => {
            // Check if this item should be active (case-insensitive comparison)
            const itemHrefLower = item.href.toLowerCase();
            let isActive = false;
            
            // Compare normalized page names
            const itemHrefNormalized = item.href === '' ? '' : item.href.toLowerCase();
            const currentPageNormalized = normalizedCurrentPage;
            
            if (currentPageNormalized === itemHrefNormalized) {
                isActive = true;
            } else if (currentPageNormalized === '' && itemHrefNormalized === '') {
                isActive = true;
            }
            
            // Also check by pathname for more reliable detection
            if (!isActive && pathname) {
                const pathnameLower = pathname.toLowerCase();
                if (pathnameLower === '/' || pathnameLower.endsWith('/')) {
                    if (itemHrefNormalized === '') {
                        isActive = true;
                    }
                } else if (pathnameLower.endsWith('/' + itemHrefNormalized) || pathnameLower === '/' + itemHrefNormalized) {
                    isActive = true;
                }
            }
            
            // For blog posts, check if we're in a blog path
            if (!isActive && item.href === 'blog' && pathname.toLowerCase().includes('/blog/')) {
                isActive = true;
            }
            
            const activeClass = isActive ? ' class="active"' : '';
            const itemHref = basePath + item.href;
            return `<li><a href="${itemHref}"${activeClass}>${item.text}</a></li>`;
        }).join('');

        // Build complete menu HTML
        const indexHref = basePath || './';
        return `<header class="header">
        <div class="container">
            <nav class="navbar">
                <div class="logo">
                    <a href="${indexHref}">
                        <img src="${logoImage}" alt="Smart Effect Logo">
                        ${logoText}
                    </a>
                </div>
                <ul class="nav-menu" id="navMenu">
${menuItemsHTML}
                </ul>
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    </header>`;
    }

    // Function to insert menu into page
    function insertMenu() {
        const currentPage = getCurrentPage();
        const pathname = window.location.pathname;
        const headerPlaceholder = document.querySelector('header.header');
        
        // Debug: log current page detection (can be removed later)
        console.log('Menu.js - Current page detected:', currentPage, 'Pathname:', pathname);
        
        if (headerPlaceholder) {
            // Check if header needs to be replaced
            const hasNavbar = headerPlaceholder.querySelector('.navbar');
            const isEmpty = headerPlaceholder.innerHTML.trim() === '';
            
            // Always replace if empty or doesn't have navbar structure
            if (!hasNavbar || isEmpty) {
                console.log('Menu.js - Replacing header with menu');
                headerPlaceholder.outerHTML = renderMenu(currentPage);
            } else {
                // If navbar exists but might be wrong, still replace to ensure consistency
                console.log('Menu.js - Header already has navbar, but replacing for consistency');
                headerPlaceholder.outerHTML = renderMenu(currentPage);
            }
        } else {
            // Insert at the beginning of body if header doesn't exist
            if (document.body) {
                console.log('Menu.js - Inserting menu at beginning of body');
                document.body.insertAdjacentHTML('afterbegin', renderMenu(currentPage));
            }
        }
    }

    // Insert menu when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertMenu);
    } else {
        // DOM is already ready
        insertMenu();
    }
})();
