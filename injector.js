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
    // Kategoria / Lokalizacja (Badge)
    badgeSlot.textContent = data.badge || '';

    // Tytuł
    modalTitle.textContent = data.title || '';

    // Główne zdjęcie (Hero Image) z obsługą pod powiększenie w Lightboxie
    if (data.heroImage && data.heroImage.src) {
        heroTargetSlot.innerHTML = `
            <div class="hero-image-wrapper" 
                 data-full-src="${data.heroImage.src}" 
                 data-caption="${data.heroImage.caption || ''}" 
                 style="cursor: pointer;">
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

    // Galeria miniaturowa
    modalGalleryGrid.innerHTML = (data.gallery || [])
        .map(item => `
            <div class="gallery-item" data-full-src="${item.src}" data-caption="${item.caption || ''}">
                <img src="${item.src}" alt="${item.caption || ''}" loading="lazy">
            </div>
        `)
        .join('');
}

// 3. UNIWERSALNE FUNKCJE OTWIERANIA / ZAMYKANIA

// Otwieranie dowolnego zdjęcia w Lightboxie
function openLightbox(src, caption) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
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

    openLightbox(wrapper.dataset.fullSrc, wrapper.dataset.caption);
});

// Powiększanie zdjęć z siatki galerii w Lightboxie
modalGalleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    openLightbox(item.dataset.fullSrc, item.dataset.caption);
});

// Zamykanie Lightboxa przyciskiem
lightboxCloseBtn.addEventListener('click', closeLightbox);

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