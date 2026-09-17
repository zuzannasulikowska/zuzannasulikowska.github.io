document.addEventListener('DOMContentLoaded', () => {
    const orb = document.querySelector('.scroll-orb');
    if (!orb) return;

    // Wymuszone style inline — zmieniało position
    Object.assign(orb.style, {
        position: 'fixed',
        top: '0',
        left: 'calc(var(--axis) / 2)',
        width: '18px',
        height: '18px',
        marginLeft: '-9px',
        borderRadius: '50%',
        zIndex: '15',
        pointerEvents: 'none',
        transition: 'background-color 0.5s ease',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased'
    });

    const AXIS_TOP = 100;
    const AXIS_BOTTOM = 100;

    const LERP_POS = 0.05;   // niższa wartość = orb "goni" scroll wolniej / płynniej
    const LERP_SCALE = 0.12;
    const MIN_SCALE = .7;
    const MAX_SCALE = 2.1;

    const sections = document.querySelectorAll('.hero, .about, .projects-intro, .project, .contact');

    let targetY = AXIS_TOP;
    let currentY = AXIS_TOP;
    let targetScale = MIN_SCALE;
    let currentScale = MIN_SCALE;
    let targetColor = getComputedStyle(document.body).getPropertyValue('--black').trim() || '#171515';

    function trackHeight() {
        return window.innerHeight - AXIS_TOP - AXIS_BOTTOM;
    }

    // Pozycja orba = procent przescrollowania całej strony
    function updateScrollTarget() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
        targetY = AXIS_TOP + progress * trackHeight();
    }

    // Znajdź sekcję najbliższą środkowi ekranu -> ustaw kolor i powiększenie
    function updateActiveSection() {
        const viewportCenter = window.innerHeight / 2;
        let closestSection = null;
        let closestDistance = Infinity;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });

        if (!closestSection) return;

        const closeness = Math.max(0, 1 - closestDistance / (window.innerHeight * 0.6));
        targetScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * closeness;

        const color = getComputedStyle(closestSection).getPropertyValue('--orb-color').trim();
        if (color) targetColor = color;
    }

    function onScrollOrResize() {
        updateScrollTarget();
        updateActiveSection();
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    onScrollOrResize();

    // Główna pętla animacji — lerp daje efekt "opóźnionego", płynnego podążania
    function tick() {
        currentY += (targetY - currentY) * LERP_POS;
        currentScale += (targetScale - currentScale) * LERP_SCALE;

        const roundedY = Math.round(currentY * 100) / 100; // zaokrąglenie do 2 miejsc, mniej "drgań" subpikselowych
        orb.style.transform = `translateZ(0) translateY(${roundedY}px) scale(${currentScale.toFixed(3)})`;
        orb.style.backgroundColor = targetColor;

        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
});