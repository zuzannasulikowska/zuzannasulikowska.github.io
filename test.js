/* =========================================================
   SCRIPT FILE: test.js
   Uses GSAP + Flip Plugin for smooth shared-element transitions.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP Flip plugin
    gsap.registerPlugin(Flip);

    // Dynamic photo database per project (supports portrait, landscape, square)
    const projectGalleryData = {
        "project-01": [
            { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", alt: "Living Space View" },
            { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", alt: "Kitchen Island Detail" },
            { src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", alt: "Master Bedroom Suite" },
            { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Bathroom Stone Details" },
            { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", alt: "Exterior Glass Entrance" }
        ]
    };

    // DOM Elements
    const cardHeroWrapper = document.querySelector('[data-flip-id="p1-hero"]');
    const heroTargetSlot = document.getElementById('hero-target-slot');
    const triggers = document.querySelectorAll('[data-gallery-trigger]');
    
    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalGalleryGrid = document.getElementById('modal-gallery-grid');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close');

    let isModalOpen = false;

    /* =========================================================
       1. POPULATE MODAL GALLERY
    ========================================================= */
    function populateGallery(projectId) {
        modalGalleryGrid.innerHTML = '';
        const photos = projectGalleryData[projectId] || [];

        photos.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt;
            img.loading = 'lazy';

            card.appendChild(img);

            // Lightbox Click Event
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(photo);
            });

            modalGalleryGrid.appendChild(card);
        });
    }

    populateGallery("project-01");

    /* =========================================================
       2. OPEN MODAL WITH GSAP FLIP
    ========================================================= */
    function openModal() {
        if (isModalOpen) return;
        isModalOpen = true;

        // Step 1: Capture initial position of hero image wrapper
        const state = Flip.getState(cardHeroWrapper);

        // Step 2: Reparent element to target container in modal
        heroTargetSlot.appendChild(cardHeroWrapper);

        // Step 3: Set initial visibility
        gsap.set(modalOverlay, { visibility: 'visible', opacity: 0 });
        
        const galleryCards = modalGalleryGrid.querySelectorAll('.gallery-card');
        gsap.set(galleryCards, { opacity: 0, y: 20 });
        gsap.set('.modal-info-side', { opacity: 0, x: 20 });

        document.body.style.overflow = 'hidden';

        // Step 4: Construct smooth entry timeline
        const tl = gsap.timeline();

        tl.to(modalOverlay, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out"
        })
        // Shared element transform: Morphs hero photo seamlessly into modal slot
        .add(
            Flip.from(state, {
                targets: [cardHeroWrapper],
                duration: 0.65,
                ease: "power3.inOut",
                scale: true
            }),
            "-=0.25"
        )
        .to('.modal-info-side', {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.3")
        .to(galleryCards, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "transform"
        }, "-=0.3");
    }

    /* =========================================================
       3. CLOSE MODAL WITH GSAP FLIP
    ========================================================= */
    function closeModal() {
        if (!isModalOpen) return;

        // Capture current state inside modal
        const state = Flip.getState(cardHeroWrapper);

        // Reparent back to original project card slot
        const originalParent = document.querySelector('.hero-box');
        originalParent.appendChild(cardHeroWrapper);

        const galleryCards = modalGalleryGrid.querySelectorAll('.gallery-card');

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(modalOverlay, { visibility: 'hidden' });
                document.body.style.overflow = '';
                isModalOpen = false;
            }
        });

        tl.to([galleryCards, '.modal-info-side'], {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
        })
        .add(
            Flip.from(state, {
                targets: [cardHeroWrapper],
                duration: 0.55,
                ease: "power3.inOut",
                scale: true
            })
        )
        .to(modalOverlay, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.inOut"
        }, "-=0.25");
    }

    /* =========================================================
       4. LIGHTBOX CONTROLS
    ========================================================= */
    function openLightbox(photo) {
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        lightboxCaption.textContent = photo.alt;
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    /* =========================================================
       5. EVENT LISTENERS
    ========================================================= */
    triggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside content area
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('is-active')) {
                closeLightbox();
            } else if (isModalOpen) {
                closeModal();
            }
        }
    });
});