// --- ELEMENTY DOM MODALA GŁÓWNEGO ---
const modal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');

const badgeSlot = document.getElementById('badge-slot');
const modalTitle = document.getElementById('modal-title');
const modalSpecs = document.getElementById('modal-specs');
const modalDescription = document.getElementById('modal-description');
const heroTargetSlot = document.getElementById('hero-target-slot');
const modalGalleryGrid = document.getElementById('modal-gallery-grid');

// --- ELEMENTY DOM LIGHTBOXA ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCloseBtn = document.getElementById('lightbox-close');
const lightboxPrevBtn = document.getElementById('lightbox-prev');
const lightboxNextBtn = document.getElementById('lightbox-next');
const lightboxSlide = document.getElementById('lightbox-slide');

let isLightboxAnimating = false;
const LIGHTBOX_ANIM_MS = 280; // musi pasować do czasu transition w CSS

let currentProjectImages = [];
let currentImageIndex = 0;

// 1. ŁADOWANIE DANYCH Z JSON
async function loadProjectData(projectId) {
    try {
        const response = await fetch(`./projects/${projectId}.json`);
        
        if (!response.ok) {
            throw new Error(`Nie udało się pobrać danych dla: ${projectId}`);
        }

        const data = await response.json();
        renderModalContent(data);

    } catch (error) {
        console.error('Błąd podczas ładowania pliku JSON:', error);
    }
}

// 2. RENDEROWANIE ZAWARTOŚCI MODALA
function renderModalContent(data) {
    badgeSlot.textContent = data.badge || '';
    modalTitle.textContent = data.title || '';

    // Resetujemy listę zdjęć na potrzeby nawigacji w lightboxie
    currentProjectImages = [];

    // Główne zdjęcie (Hero Image) — indeks 0 na liście
    if (data.heroImage && data.heroImage.src) {
        currentProjectImages.push({
            src: data.heroImage.src,
            caption: data.heroImage.caption || ''
        });

        heroTargetSlot.innerHTML = `
            <div class="hero-image-wrapper" data-index="0" style="cursor: pointer;">
                <img src="${data.heroImage.src}" alt="${data.heroImage.caption || data.title}">
            </div>
        `;
    } else {
        heroTargetSlot.innerHTML = '';
    }

    // Specyfikacja techniczna
    modalSpecs.innerHTML = (data.specs || [])
        .map(spec => `
            <div class="spec-item">
                <span class="spec-label">${spec.label}</span>
                <span class="spec-val">${spec.val}</span>
            </div>
        `)
        .join('');

    // Paragrafy opisu
    modalDescription.innerHTML = (data.description || [])
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');

    // Galeria miniaturowa — każde zdjęcie dostaje kolejny indeks (offset o hero, jeśli istnieje)
    const heroOffset = currentProjectImages.length; // 0 albo 1
    modalGalleryGrid.innerHTML = (data.gallery || [])
        .map((item, i) => {
            currentProjectImages.push({
                src: item.src,
                caption: item.caption || ''
            });
            return `
                <div class="gallery-item" data-index="${heroOffset + i}">
                    <img src="${item.src}" alt="${item.caption || ''}" loading="lazy">
                </div>
            `;
        })
        .join('');
}

// 3. UNIWERSALNE FUNKCJE OTWIERANIA / ZAMYKANIA

// Otwieranie dowolnego zdjęcia w Lightboxie
function openLightbox(index) {
    if (!currentProjectImages.length) return;

    currentImageIndex = ((index % currentProjectImages.length) + currentProjectImages.length) % currentProjectImages.length;
    updateLightboxImage();

    lightbox.classList.toggle('has-multiple', currentProjectImages.length > 1);
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
}

// Update LightBoxa 
function updateLightboxImage(direction = null) {
    const current = currentProjectImages[currentImageIndex];
    if (!current) return;

    // Pierwsze otwarcie lightboxa - bez animacji przesuwania
    if (!direction) {
        lightboxImg.src = current.src;
        lightboxCaption.textContent = current.caption || '';
        return;
    }

    if (isLightboxAnimating) return;
    isLightboxAnimating = true;

    const exitClass = direction === 'next' ? 'lightbox-exit-next' : 'lightbox-exit-prev';
    const enterClass = direction === 'next' ? 'lightbox-enter-from-next' : 'lightbox-enter-from-prev';

    // 1. Animuj obecne zdjęcie "na wyjście"
    lightboxSlide.classList.add(exitClass);

    setTimeout(() => {
        // 2. Podmień zawartość, gdy stare zdjęcie jest już niewidoczne
        lightboxImg.src = current.src;
        lightboxCaption.textContent = current.caption || '';

        // 3. Ustaw nowe zdjęcie po przeciwnej stronie, bez animacji (natychmiastowy skok)
        lightboxSlide.classList.remove(exitClass);
        lightboxSlide.classList.add('lightbox-no-transition', enterClass);

        // wymuszenie przeliczenia layoutu, żeby przeglądarka "zauważyła" pozycję startową
        void lightboxSlide.offsetWidth;

        // 4. W kolejnej klatce włącz animację i wjedź do pozycji docelowej
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                lightboxSlide.classList.remove('lightbox-no-transition', enterClass);
            });
        });

        setTimeout(() => {
            isLightboxAnimating = false;
        }, LIGHTBOX_ANIM_MS);

    }, LIGHTBOX_ANIM_MS);
}

// Następne zdjęcie
function showNextImage() {
    if (currentProjectImages.length < 2 || isLightboxAnimating) return;
    currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
    updateLightboxImage('next');
}

// Poprednie zdjęcie
function showPrevImage() {
    if (currentProjectImages.length < 2 || isLightboxAnimating) return;
    currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
    updateLightboxImage('prev');
}

// Zamykanie Lightboxa
function closeLightbox(e) {
    if (e) e.preventDefault();
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
}

// Zamykanie modala głównego
function closeModal(e) {
    if (e) e.preventDefault();
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

// 4. OBSŁUGA ZDARZEŃ (EVENT LISTENERS)

// Otwieranie modala projektu (delegacja zdarzeń dla dynamicznych lub stałych kart)
document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('[data-gallery-trigger]');
    if (!trigger) return;

    const projectCard = trigger.closest('[data-project-id]');
    if (!projectCard) return;

    const projectId = projectCard.dataset.projectId;

    await loadProjectData(projectId);

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
});

// Zamykanie modala głównego
modalCloseBtn.addEventListener('click', closeModal);

// Powiększanie zdjęcia Hero w Lightboxie
heroTargetSlot.addEventListener('click', (e) => {
    const wrapper = e.target.closest('.hero-image-wrapper');
    if (!wrapper) return;
    openLightbox(parseInt(wrapper.dataset.index, 10));
});

// Powiększanie zdjęć z siatki galerii w Lightboxie
modalGalleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(parseInt(item.dataset.index, 10));
});

// Zamykanie Lightboxa przyciskiem
lightboxCloseBtn.addEventListener('click', closeLightbox);
// Strzałki next/prev image
lightboxPrevBtn.addEventListener('click', () => showPrevImage());
lightboxNextBtn.addEventListener('click', () => showNextImage());

// Zamykanie Lightboxa po kliknięciu w tło
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Zamykanie okien klawiszem ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        } else if (modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    }
});

const galleryGrid = document.getElementById('modal-gallery-grid');
const galleryWrapper = document.querySelector('.gallery-slider-wrapper');
const prevBtn = document.getElementById('gallery-prev');
const nextBtn = document.getElementById('gallery-next');

/* Check if the gallery actually overflows */
function checkGalleryOverflow() {
    if (!galleryGrid || !galleryWrapper) return;
    
    const hasOverflow = galleryGrid.scrollWidth > galleryGrid.clientWidth;
    galleryWrapper.classList.toggle('has-overflow', hasOverflow);
}

/* Scroll handler for buttons */
prevBtn.addEventListener('click', () => {
    galleryGrid.scrollBy({ left: -200, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    galleryGrid.scrollBy({ left: 200, behavior: 'smooth' });
});

/* Observe size changes to update arrow visibility dynamically */
const resizeObserver = new ResizeObserver(() => checkGalleryOverflow());
if (galleryGrid) {
    resizeObserver.observe(galleryGrid);
}

/* Call check after rendering new images inside renderModalContent() */
const originalRenderModal = renderModalContent;
renderModalContent = function(data) {
    originalRenderModal(data);
    setTimeout(checkGalleryOverflow, 50); // Small delay allows DOM to calculate image widths
};