// Scroll to top on page load
window.addEventListener('load', function() {
    // Scroll to top immediately when page loads
    window.scrollTo(0, 0);
    
    // Also handle cases where browser might restore scroll position
    if (window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Handle hero photo loading error
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
        heroPhoto.addEventListener('error', function() {
            // Hide photo wrapper if image fails to load
            const photoWrapper = this.closest('.hero-photo-wrapper');
            if (photoWrapper) {
                photoWrapper.style.display = 'none';
            }
            // Adjust hero layout if photo is missing
            const heroWrapper = document.querySelector('.hero-wrapper');
            if (heroWrapper) {
                heroWrapper.style.gridTemplateColumns = '1fr';
                heroWrapper.style.textAlign = 'center';
            }
        });
    }

    // Reviews category tabs
    const reviewTabs = document.querySelectorAll('.review-tab');
    const reviewCategories = document.querySelectorAll('.reviews-category');

    reviewTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update active tab
            reviewTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide categories
            reviewCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-reviews`) {
                    cat.classList.add('active');
                }
            });
        });
    });

    // Services category tabs
    const serviceTabs = document.querySelectorAll('.services-content .review-tab');
    const serviceCategories = document.querySelectorAll('.service-category');

    // Function to switch to a specific service tab
    function switchToServiceTab(category) {
        if (!category) return;
        
        // Update active tab
        serviceTabs.forEach(t => {
            t.classList.remove('active');
            if (t.getAttribute('data-category') === category) {
                t.classList.add('active');
            }
        });
        
        // Show/hide service categories
        serviceCategories.forEach(cat => {
            cat.classList.remove('active');
            // Handle both old 'courage' and new 'presentation' IDs
            if (cat.id === `${category}-service` || 
                (category === 'presentation' && cat.id === 'courage-service')) {
                cat.classList.add('active');
            }
        });
        
        // Scroll to services section
        const servicesSection = document.querySelector('.services-content');
        if (servicesSection) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const sectionTop = servicesSection.getBoundingClientRect().top + window.pageYOffset;
            const scrollPosition = sectionTop - headerHeight - 20;
            
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    if (serviceTabs.length > 0 && serviceCategories.length > 0) {
        // Handle tab clicks
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                
                // Map category to URL hash
                const categoryToHash = {
                    'coaching': 'coaching',
                    'mentoring': 'mentoring',
                    'consulting': 'consulting',
                    'presentation': 'public-speaking'
                };
                
                // Update URL hash
                if (category && categoryToHash[category]) {
                    window.location.hash = categoryToHash[category];
                }
                
                switchToServiceTab(category);
            });
        });
        
        // Handle initial hash on page load
        function handleHashChange() {
            const hash = window.location.hash.substring(1); // Remove #
            // Map URL hash to category
            const hashToCategory = {
                'coaching': 'coaching',
                'mentoring': 'mentoring',
                'consulting': 'consulting',
                'public-speaking': 'presentation'
            };
            
            const category = hashToCategory[hash];
            
            if (category) {
                switchToServiceTab(category);
            } else if (!hash) {
                // Default to coaching if no hash
                switchToServiceTab('coaching');
            }
        }
        
        // Check hash on page load
        handleHashChange();
        
        // Listen for hash changes (back/forward buttons)
        window.addEventListener('hashchange', handleHashChange);
    }

    // Review cards expand/collapse
    const reviewCards = document.querySelectorAll('.review-card');
    
    // Function to check if indicator is needed
    function checkIfIndicatorNeeded(card) {
        const textElement = card.querySelector('.review-card-text');
        const indicator = card.querySelector('.review-expand-indicator');
        
        if (!textElement || !indicator) return;
        
        const isExpanded = card.getAttribute('data-expanded') === 'true';
        
        // Temporarily remove all restrictions to measure actual height
        // Save computed styles
        const computedStyle = window.getComputedStyle(textElement);
        
        // Create a clone for measurement
        const clone = textElement.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.display = 'block';
        clone.style.webkitLineClamp = 'none';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.webkitBoxOrient = 'initial';
        clone.style.paddingBottom = '0';
        clone.style.paddingRight = '0';
        clone.style.width = textElement.offsetWidth + 'px';
        
        textElement.parentNode.appendChild(clone);
        
        // Measure actual height
        const actualHeight = clone.scrollHeight;
        const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.7;
        const maxHeight = lineHeight * 3; // 3 lines
        
        // Remove clone
        textElement.parentNode.removeChild(clone);
        
        // Check if text fits in 3 lines
        const needsIndicator = actualHeight > maxHeight + 1;
        
        // Update indicator visibility based on state
        if (needsIndicator && !isExpanded) {
            indicator.style.display = 'flex';
            textElement.style.paddingBottom = '30px';
            textElement.style.paddingRight = '40px';
        } else {
            indicator.style.display = 'none';
            if (!isExpanded && !needsIndicator) {
                textElement.style.paddingBottom = '10px';
                textElement.style.paddingRight = '0';
            } else if (isExpanded) {
                textElement.style.paddingBottom = '10px';
                textElement.style.paddingRight = '0';
            }
        }
    }
    
    reviewCards.forEach(card => {
        // Set initial state
        card.setAttribute('data-expanded', 'false');
        
        // Wait for styles to be applied, then check indicator
        setTimeout(() => {
            checkIfIndicatorNeeded(card);
        }, 10);
        
        card.addEventListener('click', function() {
            const isExpanded = this.getAttribute('data-expanded') === 'true';
            const newState = !isExpanded;
            this.setAttribute('data-expanded', newState ? 'true' : 'false');
            
            // Update indicator state after a brief delay for CSS transition
            setTimeout(() => {
                checkIfIndicatorNeeded(this);
            }, 50);
        });
    });

    // Article cards - show full article between rows (articles page)
    const articleCards = document.querySelectorAll('.article-card');
    const articleFullDisplay = document.getElementById('articleFullDisplay');
    const articleFullContent = document.getElementById('articleFullContent');
    const articleCloseBtn = document.getElementById('articleCloseBtn');
    const articlesGrid = document.querySelector('.articles-grid');

    if (articleCards.length > 0 && articleFullDisplay && articleFullContent && articlesGrid) {
        let currentActiveCard = null;
        let scrollPositionBeforeOpen = null;

        // Function to find all cards in the same row as the clicked card
        function getCardsInSameRow(clickedCard) {
            const allCards = Array.from(articlesGrid.querySelectorAll('.article-card'));
            const clickedRect = clickedCard.getBoundingClientRect();
            const clickedTop = clickedRect.top;
            
            // Find all cards with similar top position (same row)
            const sameRowCards = allCards.filter(card => {
                const cardRect = card.getBoundingClientRect();
                return Math.abs(cardRect.top - clickedTop) < 10; // 10px tolerance
            });
            
            return sameRowCards;
        }

        // Function to insert article display after the last card in a row
        function insertArticleAfterRow(cardsInRow) {
            if (cardsInRow.length === 0) return;
            
            // Find the last card in the row (rightmost)
            const lastCard = cardsInRow.reduce((last, current) => {
                const lastRect = last.getBoundingClientRect();
                const currentRect = current.getBoundingClientRect();
                return currentRect.left > lastRect.left ? current : last;
            });
            
            // Remove existing display if any
            if (articleFullDisplay.parentNode) {
                articleFullDisplay.remove();
            }
            
            // Insert after the last card in the row
            if (lastCard.nextSibling) {
                lastCard.parentNode.insertBefore(articleFullDisplay, lastCard.nextSibling);
            } else {
                lastCard.parentNode.appendChild(articleFullDisplay);
            }
        }

        // Function to show article
        function showArticle(card) {
            const articleFull = card.querySelector('.article-full');
            if (!articleFull) return;
            
            // Save current scroll position before opening
            scrollPositionBeforeOpen = window.pageYOffset || window.scrollY;
            
            // Get article content
            const articleTitle = card.querySelector('h2')?.textContent || '';
            const articleContent = articleFull.innerHTML;
            
            // Set content
            articleFullContent.innerHTML = `
                <h2>${articleTitle}</h2>
                ${articleContent}
            `;
            
            // Find cards in same row and insert display after the row
            const cardsInRow = getCardsInSameRow(card);
            insertArticleAfterRow(cardsInRow);
            
            // Show display
            articleFullDisplay.style.display = 'block';
            currentActiveCard = card;
            
            // Scroll to article display - position it right under the header
            setTimeout(() => {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const articleTop = articleFullDisplay.getBoundingClientRect().top + window.pageYOffset;
                const scrollPosition = articleTop - headerHeight - 20; // 20px padding
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }

        // Function to hide article
        function hideArticle() {
            articleFullDisplay.style.display = 'none';
            articleFullContent.innerHTML = '';
            currentActiveCard = null;
            
            // Restore scroll position to where it was before opening
            if (scrollPositionBeforeOpen !== null) {
                window.scrollTo({
                    top: scrollPositionBeforeOpen,
                    behavior: 'smooth'
                });
                scrollPositionBeforeOpen = null;
            }
        }

        // Add click handlers to cards
        articleCards.forEach(card => {
            card.addEventListener('click', function (event) {
                // Don't trigger on links
                if (event.target.closest('a')) {
                    return;
                }
                
                // Don't trigger on close button
                if (event.target.closest('.article-close-btn')) {
                    return;
                }
                
                // If same card clicked and article is showing, close it
                if (currentActiveCard === card && articleFullDisplay.style.display === 'block') {
                    hideArticle();
                } else {
                    // Show new article
                    showArticle(card);
                }
            });
        });

        // Close button handlers (top and bottom)
        const articleCloseBtnTop = document.getElementById('articleCloseBtnTop');
        const articleCloseBtnBottom = document.getElementById('articleCloseBtnBottom');
        
        if (articleCloseBtnTop) {
            articleCloseBtnTop.addEventListener('click', function(e) {
                e.stopPropagation();
                hideArticle();
            });
        }
        
        if (articleCloseBtnBottom) {
            articleCloseBtnBottom.addEventListener('click', function(e) {
                e.stopPropagation();
                hideArticle();
            });
        }
    }
});
