/* =========================================================
   GSAP
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   ELEMENT
========================================================= */

const orb = document.querySelector(".scroll-orb");


/* =========================================================
   CONFIG
========================================================= */

const COLORS = {

    black: "#171515",
    olive: "#687052",
    red: "#c93435",
    blue: "#4474a7",
    brown: "#75615b"

};


/* =========================================================
   INITIAL POSITION
========================================================= */

gsap.set(orb, {
    y: window.innerHeight * 0.28,
    scale: 1
});


/* =========================================================
   HERO — START
========================================================= */

const heroTimeline = gsap.timeline({
    defaults: {
        ease: "power3.out"
    }
});


heroTimeline

    .from(".hero-small", {

        y: 30,
        opacity: 0,

        duration: 0.8

    })

    .from(".hero-title-block", {

        y: 80,
        opacity: 0,

        duration: 1.2

    }, "-=0.5")

    .from(".hero-year", {

        scale: 0,
        rotation: -20,

        duration: 1

    }, "-=0.8")

    .from(".hero-caption", {

        y: 20,
        opacity: 0,

        duration: 0.7

    }, "-=0.6");


/* =========================================================
   HERO ORB
========================================================= */

gsap.to(orb, {

    scale: 1.5,

    scrollTrigger: {

        trigger: ".hero",

        start: "top top",

        end: "bottom top",

        scrub: 1

    }

});


/* =========================================================
   INTRO
========================================================= */

gsap.from(".intro-content", {

    y: 100,
    opacity: 0,

    scrollTrigger: {

        trigger: ".intro",

        start: "top 75%",

        end: "top 25%",

        scrub: true

    }

});


gsap.from(".circle-image--intro", {

    scale: 0.65,
    rotation: -12,

    scrollTrigger: {

        trigger: ".intro",

        start: "top 80%",

        end: "center center",

        scrub: true

    }

});


/* =========================================================
   ABOUT
========================================================= */

gsap.from(".circle-image--portrait", {

    scale: 0.6,
    x: -100,
    rotation: 10,

    scrollTrigger: {

        trigger: ".about",

        start: "top 80%",

        end: "center center",

        scrub: true

    }

});


gsap.from(".about-text", {

    x: 100,
    opacity: 0,

    scrollTrigger: {

        trigger: ".about",

        start: "top 70%",

        end: "center center",

        scrub: true

    }

});


/* =========================================================
   COMPETENCES
========================================================= */

gsap.utils
    .toArray(".competence-row")
    .forEach((row, index) => {

        gsap.from(row, {

            x: index % 2 === 0 ? -80 : 80,

            opacity: 0,

            scrollTrigger: {

                trigger: row,

                start: "top 90%",

                end: "top 65%",

                scrub: true

            }

        });

    });


/* =========================================================
   PROJECT ANIMATIONS
========================================================= */

const projects =
    gsap.utils.toArray(".project");


projects.forEach((project, index) => {

    const image =
        project.querySelector(".project-image");

    const title =
        project.querySelector(".project-title");

    const description =
        project.querySelector(".project-description");


    /* ---------------------------------------------
       Image
    --------------------------------------------- */

    gsap.fromTo(

        image,

        {
            scale: 0.7,
            rotation: index % 2 === 0 ? -8 : 8
        },

        {
            scale: 1,
            rotation: 0,

            ease: "none",

            scrollTrigger: {

                trigger: project,

                start: "top bottom",

                end: "center center",

                scrub: 1.3

            }

        }

    );


    /* ---------------------------------------------
       Title
    --------------------------------------------- */

    gsap.from(title, {

        y: 120,
        opacity: 0,

        scrollTrigger: {

            trigger: project,

            start: "top 75%",

            end: "center 45%",

            scrub: true

        }

    });


    /* ---------------------------------------------
       Description
    --------------------------------------------- */

    if (description) {

        gsap.from(description, {

            y: 50,
            opacity: 0,

            scrollTrigger: {

                trigger: project,

                start: "top 70%",

                end: "center center",

                scrub: true

            }

        });

    }

});


/* =========================================================
   PROJECT IMAGE PARALLAX
========================================================= */

projects.forEach((project, index) => {

    const image =
        project.querySelector("img");

    if (!image) return;


    gsap.to(image, {

        yPercent: index % 2 === 0 ? -7 : 7,

        ease: "none",

        scrollTrigger: {

            trigger: project,

            start: "top bottom",

            end: "bottom top",

            scrub: 1

        }

    });

});


/* =========================================================
   SINGLE ORB — STORY
=========================================================

   To jest najważniejszy fragment.

   Orb przechodzi przez wszystkie sekcje.

   Nie tworzymy nowych orbów.

========================================================= */


/*
    Każda sekcja dostaje własny punkt historii.

    0.00 = początek
    0.15 = intro
    0.30 = about
    0.42 = kompetencje
    0.55 = projekt 01
    0.65 = projekt 02
    0.75 = projekt 03
    0.84 = projekt 04
    0.92 = projekt 05
    1.00 = kontakt
*/


const storySections = [

    {
        selector: ".hero",
        color: COLORS.black,
        scale: 1
    },

    {
        selector: ".intro",
        color: COLORS.olive,
        scale: 1.25
    },

    {
        selector: ".about",
        color: COLORS.black,
        scale: 0.8
    },

    {
        selector: ".competences",
        color: COLORS.red,
        scale: 1.5
    },

    {
        selector: ".project-01",
        color: COLORS.black,
        scale: 1
    },

    {
        selector: ".project-02",
        color: COLORS.olive,
        scale: 1.35
    },

    {
        selector: ".project-03",
        color: COLORS.brown,
        scale: 0.75
    },

    {
        selector: ".project-04",
        color: COLORS.red,
        scale: 1.4
    },

    {
        selector: ".project-05",
        color: COLORS.blue,
        scale: 1
    },

    {
        selector: ".contact",
        color: COLORS.black,
        scale: 1.6
    }

];


/* =========================================================
   BUILD ORB TIMELINE
========================================================= */

function buildStory() {

    const timeline =
        gsap.timeline({

            scrollTrigger: {

                trigger: "body",

                start: "top top",

                end: "bottom bottom",

                scrub: 1.5

            }

        });


    storySections.forEach((item, index) => {

        const section =
            document.querySelector(item.selector);

        if (!section) return;


        /*
            Pozycja sekcji w viewport.

            Orb porusza się od jednej sekcji
            do następnej.
        */

        const sectionCenter =
            section.offsetTop +
            section.offsetHeight * 0.5;


        /*
            Żeby orb nie wylatywał poza ekran.
        */

        const targetY =
            Math.max(
                window.innerHeight * 0.12,
                Math.min(
                    sectionCenter,
                    document.documentElement.scrollHeight
                )
            );


        /*
            Ruch orbita.

            Każdy etap jest trochę inny:
            - zmiana skali
            - kolor
            - delikatna rotacja
        */

        timeline.to(

            orb,

            {

                y:
                    targetY - window.scrollY,

                scale:
                    item.scale,

                backgroundColor:
                    item.color,

                duration: 1,

                ease: "none"

            }

        );

    });

}


/* =========================================================
   LEPSZA WERSJA ORB — POWIĄZANIE ZE SCROLLEM
=========================================================

   Ponieważ strona jest responsywna, zamiast
   polegać wyłącznie na wartościach zapisanych
   podczas inicjalizacji, aktualizujemy orb przy
   każdym scrollu.

========================================================= */

function updateStoryOrb() {

    const scroll =
        window.scrollY;

    const viewport =
        window.innerHeight;

    const documentHeight =
        document.documentElement.scrollHeight;

    const progress =
        scroll /
        (documentHeight - viewport);


    /*
        Orb porusza się po całej wysokości strony.
    */

    const minY =
        viewport * 0.12;

    const maxY =
        viewport * 0.88;


    /*
        Dzięki temu orb pozostaje widoczny
        na ekranie i prowadzi użytkownika.
    */

    const y =
        minY +
        (maxY - minY) * progress;


    /*
        Bazowa skala.
    */

    const pulse =
        1 +
        Math.sin(progress * Math.PI * 12) * 0.12;


    gsap.set(orb, {

        y: y,

        scale: pulse

    });

}


/* =========================================================
   SECTION COLOR / SCALE
========================================================= */

function updateOrbState() {

    const viewportCenter =
        window.scrollY +
        window.innerHeight * 0.5;


    let closest =
        null;

    let closestDistance =
        Infinity;


    storySections.forEach((item) => {

        const section =
            document.querySelector(item.selector);

        if (!section) return;


        const center =
            section.offsetTop +
            section.offsetHeight * 0.5;


        const distance =
            Math.abs(
                center -
                viewportCenter
            );


        if (distance < closestDistance) {

            closestDistance =
                distance;

            closest =
                item;

        }

    });


    if (!closest) return;


    gsap.to(orb, {

        backgroundColor:
            closest.color,

        scale:
            closest.scale,

        duration: 0.5,

        overwrite: true

    });

}


/* =========================================================
   SCROLL EVENTS
========================================================= */

let ticking = false;

window.addEventListener("scroll", () => {

    if (!ticking) {

        window.requestAnimationFrame(() => {

            updateStoryOrb();
            updateOrbState();

            ticking = false;

        });

        ticking = true;

    }

});


/* =========================================================
   PROJECT IMAGE HOVER
========================================================= */

projects.forEach((project) => {

    const image =
        project.querySelector(".project-image");

    if (!image) return;


    project.addEventListener(
        "mouseenter",
        () => {

            gsap.to(orb, {

                scale: 2.2,

                duration: 0.5,

                ease: "power3.out"

            });

        }
    );


    project.addEventListener(
        "mouseleave",
        () => {

            gsap.to(orb, {

                scale: 1,

                duration: 0.5,

                ease: "power3.out"

            });

        }
    );

});


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(".header-nav a")
    .forEach((link) => {

        link.addEventListener("click", (event) => {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );

            if (!target) return;

            event.preventDefault();


            gsap.to(window, {

                scrollTo: target,

                duration: 1.5,

                ease: "power3.inOut"

            });

        });

    });


/*
    Jeżeli nie chcemy ScrollToPlugin,
    korzystamy z natywnego scrollIntoView.
*/

document
    .querySelectorAll(".header-nav a")
    .forEach((link) => {

        link.addEventListener("click", () => {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );

            if (!target) return;

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });


/* =========================================================
   REFRESH
========================================================= */

window.addEventListener("load", () => {

    updateStoryOrb();

    updateOrbState();

    ScrollTrigger.refresh();

});


window.addEventListener("resize", () => {

    updateStoryOrb();

    updateOrbState();

    ScrollTrigger.refresh();

});