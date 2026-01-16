document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const services = document.getElementById('services');

    function updateHeader() {
        if (!services) return;
        const trigger = services.offsetTop - header.offsetHeight - 10;
        if (window.scrollY >= trigger) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader);
    window.addEventListener('resize', updateHeader);

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Gallery: images with categories (exclude hero image and non-photo icons)
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.gallery-filter button');

    const images = [
        { src: 'floor.png', categories: ['floor'] },
        { src: 'shower_floor.png', categories: ['bathroom','floor'] },
        { src: 'shower.png', categories: ['bathroom'] },
        { src: 'bathtub.png', categories: ['bathroom'] },
        { src: 'poolside.png', categories: ['floor'] },
        { src: 'smart-renovations-kitchen.jpg', categories: ['kitchen'] },
        { src: 'photo-floor-texture-pattern.jpg', categories: ['floor'] },
        { src: 'marble-square-floor.jpg', categories: ['floor'] },
        { src: 'colin-watts-wall.jpg', categories: ['kitchen'] },
        { src: 'sandy-kitchen.jpg', categories: ['kitchen'] },
        { src: 'charlesdeluvio-kitchen.jpg', categories: ['kitchen'] },
        { src: 'close-up-marble-textured-tiles-floor.jpg', categories: ['floor'] },
        { src: 'turquo-cabbit-stairs.jpg', categories: ['floor','stairs'] },
        { src: 'ChatGPT Image-trio.png', categories: [] },
        { src: 'ChatGPT Image-stairs.png', categories: ['stairs'] },
        { src: 'ChatGPT Image-floor.png', categories: ['floor'] }
    ];

    let currentList = [];
    let currentIndex = 0;

    // create a reusable lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-inner" role="dialog" aria-modal="true" aria-hidden="true">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
            <div class="lightbox-content"><img src="" alt=""></div>
            <button class="lightbox-next" aria-label="Next">&#10095;</button>
        </div>
          
    `;
    document.body.appendChild(lightbox);

    const lbInner = lightbox.querySelector('.lightbox-inner');
    const lbImg = lightbox.querySelector('.lightbox-content img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');

    function openLightbox(index) {
        if (!currentList.length) return;
        currentIndex = index;
        lbImg.src = 'images/' + currentList[currentIndex];
        lbImg.alt = currentList[currentIndex].replace(/[-_\.]/g, ' ').replace(/\.[^/.]+$/, '');
        lbInner.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lbInner.setAttribute('aria-hidden', 'true');
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    function showNext() {
        if (!currentList.length) return;
        currentIndex = (currentIndex + 1) % currentList.length;
        lbImg.src = 'images/' + currentList[currentIndex];
    }

    function showPrev() {
        if (!currentList.length) return;
        currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        lbImg.src = 'images/' + currentList[currentIndex];
    }

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Touch support: swipe left/right to navigate, swipe down to close
    let touchStartX = 0, touchStartY = 0, touchCurrentX = 0, touchCurrentY = 0, isTouching = false;
    const SWIPE_THRESHOLD = 50; // pixels horizontal to trigger nav
    const SWIPE_CLOSE_THRESHOLD = 120; // pixels vertical to trigger close

    lbInner.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchCurrentX = touchStartX;
        touchCurrentY = touchStartY;
        lbImg.style.transition = 'none';
    }, { passive: true });

    lbInner.addEventListener('touchmove', (e) => {
        if (!isTouching || e.touches.length !== 1) return;
        touchCurrentX = e.touches[0].clientX;
        touchCurrentY = e.touches[0].clientY;
        const dx = touchCurrentX - touchStartX;
        const dy = touchCurrentY - touchStartY;

        // horizontal swipe - translate X, vertical swipe - translate Y for feedback
        if (Math.abs(dx) > Math.abs(dy)) {
            e.preventDefault(); // prevent scrolling when swiping horizontally
            lbImg.style.transform = `translateX(${dx}px)`;
        } else {
            lbImg.style.transform = `translateY(${dy}px)`;
        }
    }, { passive: false });

    lbInner.addEventListener('touchend', (e) => {
        if (!isTouching) return;
        isTouching = false;
        // determine end values using changedTouches if available
        const touch = (e.changedTouches && e.changedTouches[0]) || {};
        const endX = touch.clientX || touchCurrentX || touchStartX;
        const endY = touch.clientY || touchCurrentY || touchStartY;
        const dx = endX - touchStartX;
        const dy = endY - touchStartY;

        // reset transform (smooth because we re-enable transition)
        lbImg.style.transition = '';
        lbImg.style.transform = '';

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
            // horizontal swipe
            if (dx > 0) showPrev(); else showNext();
            return;
        }

        // vertical swipe down to close
        if (Math.abs(dy) > Math.abs(dx) && dy > SWIPE_CLOSE_THRESHOLD) {
            closeLightbox();
            return;
        }
    }, { passive: true });

    function renderImages(list) {
        if (!galleryGrid) return;
        currentList = list.map(i => i.src);
        galleryGrid.innerHTML = '';
        list.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = 'images/' + item.src;
            img.alt = (item.alt || item.src).replace(/[-_\.]/g, ' ').replace(/\.[^/.]+$/, '');
            img.addEventListener('click', () => openLightbox(idx));
            div.appendChild(img);
            galleryGrid.appendChild(div);
        });
    }

    // Filter button behavior: show images by category
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.textContent.trim().toLowerCase();
            Array.from(filterButtons).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (category === 'all') {
                renderImages(images);
                return;
            }

            const filtered = images.filter(i => i.categories && i.categories.includes(category));
            renderImages(filtered);
        });
    });

    // initial render: show all and mark "All" active
    const firstAll = Array.from(filterButtons).find(b => b.textContent.trim().toLowerCase() === 'all');
    if (firstAll) firstAll.classList.add('active');
    renderImages(images);
});
