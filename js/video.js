// Video functionality
document.addEventListener('DOMContentLoaded', function() {
    let videosData = null;

    // Load videos data
    function loadVideosData() {
        fetch('data/videos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Videos data loaded:', data.videos ? data.videos.length : 0, 'videos');
                if (!data || !data.videos || data.videos.length === 0) {
                    throw new Error('Empty or invalid videos data');
                }
                videosData = data;
                renderVideos();
            })
            .catch(error => {
                console.error('Error loading videos data:', error);
                const videoGrid = document.getElementById('videoGrid');
                if (videoGrid) {
                    videoGrid.innerHTML = 
                        '<p style="text-align: center; padding: 40px; grid-column: 1 / -1;">Ошибка загрузки данных видео. Проверьте консоль браузера (F12).</p>';
                }
            });
    }

    // Render videos
    function renderVideos() {
        const videoGrid = document.getElementById('videoGrid');
        if (!videoGrid || !videosData || !videosData.videos) return;

        // Clear grid
        videoGrid.innerHTML = '';

        // Render video cards
        videosData.videos.forEach(video => {
            const videoCard = createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });
    }

    // Create video card
    function createVideoCard(video) {
        // Generate URL for the video (without .html extension)
        const videoUrl = `/video/${video.slug}`;
        
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'video-card-wrapper';

        // Image URL - use YouTube thumbnail or local image
        const imageUrl = video.image || '';
        
        // Conference name and year (extract from conference field)
        const conferenceText = video.conference || '';
        
        // Links HTML
        let linksHTML = '';
        if (video.video_url_youtube) {
            linksHTML += `<a href="${escapeHtml(video.video_url_youtube)}" target="_blank" rel="noopener">YouTube</a>`;
        }
        if (video.video_url_rutube) {
            linksHTML += `<a href="${escapeHtml(video.video_url_rutube)}" target="_blank" rel="noopener">Rutube</a>`;
        }
        if (video.video_url_vk) {
            linksHTML += `<a href="${escapeHtml(video.video_url_vk)}" target="_blank" rel="noopener">VK</a>`;
        }
        if (video.pdf_url) {
            linksHTML += `<a href="${escapeHtml(video.pdf_url)}" download>PDF</a>`;
        }

        cardWrapper.innerHTML = `
            <div class="video-card-content">
                <div class="video-card-main">
                    <a href="${videoUrl}" class="video-thumbnail-link">
                        <div class="video-thumbnail">
                            ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(video.title)}" loading="lazy" onerror="this.onerror=null; this.src='${escapeHtml(imageUrl.replace('maxresdefault', 'hqdefault'))}'; this.parentElement.innerHTML='🎥';">` : '🎥'}
                        </div>
                    </a>
                    <div class="video-info">
                        <p class="video-conference">${escapeHtml(conferenceText)}</p>
                        <h3 class="video-title"><a href="${videoUrl}">${escapeHtml(video.title)}</a></h3>
                        <p class="video-description">${escapeHtml(video.preview || video.excerpt || '')}</p>
                    </div>
                </div>
                <div class="video-card-links">
                    ${linksHTML}
                </div>
            </div>
        `;

        return cardWrapper;
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

    // Load videos data on page load
    loadVideosData();
});
