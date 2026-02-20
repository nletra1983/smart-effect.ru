// Reusable footer component - loads footer on all pages
(function() {
    'use strict';

    function renderFooter() {
        return `<footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Smart Effect</h4>
                    <p>Профессиональная и личностная самореализация IT-специалистов</p>
                </div>
                <div class="footer-section">
                    <h4>Контакты</h4>
                    <p>
                        <a href="https://t.me/SmartSpeaker_public" target="_blank" rel="noopener">Telegram канал</a><br>
                        <a href="https://t.me/nletra" target="_blank" rel="noopener">Связаться со мной</a>
                    </p>
                </div>
                <div class="footer-section">
                    <h4>Мои каналы</h4>
                    <div class="footer-channels">
                        <a href="https://t.me/SmartSpeaker_public" target="_blank" rel="noopener">Telegram</a>
                        <a href="https://rutube.ru/channel/45719218/" target="_blank" rel="noopener">Rutube</a>
                        <a href="https://youtube.com/@smart-effect?si=CUNhWZvxRqFjnACN" target="_blank" rel="noopener">YouTube</a>
                        <a href="https://vk.com/smartspeakerpublic" target="_blank" rel="noopener">ВКонтакте</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Smart Effect. Все права защищены.</p>
            </div>
        </div>
    </footer>`;
    }

    // Function to insert footer into page
    function insertFooter() {
        const footerPlaceholder = document.querySelector('footer.footer');
        
        if (footerPlaceholder) {
            // Check if footer needs to be replaced
            const hasFooterContent = footerPlaceholder.querySelector('.footer-content');
            const isEmpty = footerPlaceholder.innerHTML.trim() === '';
            
            // Always replace if empty or doesn't have footer structure
            if (!hasFooterContent || isEmpty) {
                footerPlaceholder.outerHTML = renderFooter();
            } else {
                // If footer exists but might be wrong, still replace to ensure consistency
                footerPlaceholder.outerHTML = renderFooter();
            }
        } else {
            // Insert at the end of body if footer doesn't exist
            if (document.body) {
                document.body.insertAdjacentHTML('beforeend', renderFooter());
            }
        }
    }

    // Insert footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertFooter);
    } else {
        // DOM is already ready
        insertFooter();
    }
})();
