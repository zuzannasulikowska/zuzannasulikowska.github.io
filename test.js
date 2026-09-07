document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Flip);

    // Gallery project images
    const photos = [
        { src: '/images/mural z humbakiem.png', alt: 'Szkic muralu z humbakiem' },
        { src: '/images/mural z kutrem.png', alt: 'Szkic muralu z kutrem' },
        { src: '/images/mural z łososiem.png', alt: 'Mural z motywem łososia' },
        { src: '/images/mural z płetwalem.png', alt: 'Wizualizacja z płetwalem' },
        { src: '/images/mural z sardynką.png', alt: 'Detal z sardynkami' },
        { src: '/images/mural z sardynką02.png', alt: 'Koncepcja drugoplanowa' }
    ];

    // DOM References
    const triggerContainer = document.querySelector('[data-gallery-trigger]');
    const animatedImageWrapper = document.querySelector('[data-flip-id="main-photo"]');
    const heroTargetSlot = document.querySelector('[data-hero-slot]');
    const overlay = document.querySelector('[data-gallery-overlay]');
    const closeBtn = document.querySelector('[data-gallery-close]');
    const carouselTrack = document.querySelector('[data-carousel-track]');
    const galleryDetails = document.querySelector('[data-gallery-details]');

    // Lightbox References
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImg = document.querySelector('[data-lightbox-img]');
    const lightboxCaption = document.querySelector('[data-lightbox-caption]');
    const lightboxClose = document.querySelector('[data-lightbox-close]');

    let isGalleryOpen = false;

    /* =========================================================
       1. BUILD CAROUSEL ITEMS & ATTACH CLICK TO LIGHTBOX
    ========================================================= */
    function buildCarousel() {
        carouselTrack.innerHTML = '';
        photos.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt;

            card.appendChild(img);

            // Click event to open clicked picture inside full screen Lightbox
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(photo);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(photo);
                }
            });

            carouselTrack.appendChild(card);
        });
    }

    buildCarousel();

    /* =========================================================
       2. OPEN GALLERY (GSAP FLIP)
    ========================================================= */
    function openGallery() {
        if (isGalleryOpen) return;
        isGalleryOpen = true;

        // Record initial position of main hero image
        const state = Flip.getState(animatedImageWrapper);

        // Append hero image wrapper inside the overlay target slot
        heroTargetSlot.appendChild(animatedImageWrapper);

        // Set initial overlay UI states
        gsap.set(overlay, { visibility: 'visible', opacity: 0 });
        gsap.set(galleryDetails, { opacity: 0, y: 20 });
        gsap.set('.carousel-card', { opacity: 0, y: 15 });
        gsap.set(closeBtn, { opacity: 0 });

        document.body.style.overflow = 'hidden';

        // Animate overlay background and components as one synchronized timeline
        const tl = gsap.timeline();

        tl.to(overlay, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out"
        })
        .add(
            Flip.from(state, {
                duration: 0.7,
                ease: "power3.inOut",
                absolute: true,
                scale: true,
                nested: true
            }),
            "-=0.25"
        )
        .to(galleryDetails, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out"
        }, "-=0.35")
        .to('.carousel-card', {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out"
        }, "-=0.35")
        .to(closeBtn, {
            opacity: 1,
            duration: 0.25
        }, "-=0.2");
    }

    /* =========================================================
       3. CLOSE GALLERY
    ========================================================= */
    function closeGallery() {
        if (!isGalleryOpen) return;

        // Record current position of hero image inside overlay
        const state = Flip.getState(animatedImageWrapper);

        // Move main image DOM node back to main page project section
        triggerContainer.appendChild(animatedImageWrapper);

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { visibility: 'hidden' });
                document.body.style.overflow = '';
                isGalleryOpen = false;
            }
        });

        tl.to([galleryDetails, '.carousel-card', closeBtn], {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
        })
        .add(
            Flip.from(state, {
                duration: 0.55,
                ease: "power3.inOut",
                absolute: true,
                scale: true,
                nested: true
            })
        )
        .to(overlay, {
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
    // Open overview on main image click
    triggerContainer.addEventListener('click', openGallery);
    triggerContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery();
        }
    });

    // Close button click handler
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeGallery();
    });

    // Close when clicking dimmed backdrop outside the white details box
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeGallery();
        }
    });

    // Lightbox close events
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Escape key handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('is-active')) {
                closeLightbox();
            } else if (isGalleryOpen) {
                closeGallery();
            }
        }
    });
});