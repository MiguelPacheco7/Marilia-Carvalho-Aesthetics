// Define o ano atual no rodapé para ambas as versões
document.getElementById('currentYearMobile').textContent = new Date().getFullYear();
document.getElementById('currentYearDesktop').textContent = new Date().getFullYear();

// Lógica para o menu mobile
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
    });
}

const closeMenu = () => {
    if (mobileMenu) {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

if (mobileMenu) {
    const allNavLinks = mobileMenu.querySelectorAll('a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                closeMenu();
            }, 100);
        });
    });
}

// LÓGICA DO CARROSSEL ATUALIZADA COM AUTOPLAY E SWIPE
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainers = document.querySelectorAll('.carousel-3d-container');
    if (!carouselContainers.length) return;

    carouselContainers.forEach(container => {
        const track = container.querySelector('.carousel-3d-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextButton = container.querySelector('#next-btn');
        const prevButton = container.querySelector('#prev-btn');
        const descriptionContainer = container.nextElementSibling;
        if (!descriptionContainer || !descriptionContainer.classList.contains('carousel-3d-descriptions')) return;
        const descriptions = Array.from(descriptionContainer.children);

        let currentIndex = 0;
        const slideCount = slides.length;

        let autoplayInterval = null;
        const AUTOPLAY_DELAY = 5000;

        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50;

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(goToNext, AUTOPLAY_DELAY);
        };

        const updateCarousel = () => {
            slides.forEach(slide => slide.classList.remove('active', 'prev', 'next'));
            descriptions.forEach(desc => desc.classList.remove('active'));

            const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
            const nextIndex = (currentIndex + 1) % slideCount;

            if (slides[currentIndex]) slides[currentIndex].classList.add('active');
            if (slides[prevIndex]) slides[prevIndex].classList.add('prev');
            if (slides[nextIndex]) slides[nextIndex].classList.add('next');
            if (descriptions[currentIndex]) descriptions[currentIndex].classList.add('active');
        };

        const goToNext = () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        };

        const goToPrev = () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToNext();
                startAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToPrev();
                startAutoplay();
            });
        }

        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        const handleSwipe = () => {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance < 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        };

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            startAutoplay();
        });

        updateCarousel();
        startAutoplay();
    });
});

// Lógica para o scroll suave (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);