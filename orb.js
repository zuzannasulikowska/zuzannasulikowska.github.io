gsap.registerPlugin(ScrollTrigger);

const orb = document.querySelector(".scroll-orb");

const COLORS = {
    black: "#171515",
    olive: "#687052",
    red: "#c93435",
    blue: "#4474a7",
    brown: "#75615b"
};

gsap.set(orb, {
    y: window.innerHeight * 0.28,
    scale: 1
});

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
    }, 
    "-=0.5")
    .from(".hero-year", {
        scale: 0,
        rotation: -20,
        duration: 1
    }, 
    "-=0.8")
    .from(".hero-caption", {
        y: 20,
        opacity: 0,
        duration: 0.7
    }, 
    "-=0.6"
);

gsap.to(orb, {
    scale: 1.5,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

