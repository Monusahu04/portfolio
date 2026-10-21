document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const scrollProgress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const typedRole = document.getElementById("typedRole");
    const currentYear = document.getElementById("currentYear");

    // Enable reveal animation only after JavaScript loads.
    document.documentElement.classList.add("js-reveal-enabled");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Mobile navigation
    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation menu" : "Close navigation menu"
            );

            navLinks.classList.toggle("open", !isOpen);
            document.body.classList.toggle("menu-open", !isOpen);
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        document.addEventListener("click", event => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) closeMenu();
        });
    }

    // Scroll progress and header
    function updateScrollUI() {
        const scrollTop = window.scrollY ||
            document.documentElement.scrollTop;

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (scrollTop / scrollableHeight) * 100
            : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        if (header) {
            header.classList.toggle("scrolled", scrollTop > 25);
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollTop > 450);
        }
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Reveal animations
    const revealElements = document.querySelectorAll(".reveal");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    // Active navigation
    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    navItems.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${sectionId}`
                        );
                    });
                });
            },
            {
                rootMargin: "-30% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Typing animation: name + role (types, holds, deletes, repeats)
    const typedFirst = document.getElementById("typedFirst");
    const typedLast = document.getElementById("typedLast");
    const typedDot = document.getElementById("typedDot");
    const cursorFirst = document.getElementById("cursorFirst");
    const cursorLast = document.getElementById("cursorLast");

    if (typedRole && typedFirst && typedLast && !prefersReducedMotion) {
        const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

        async function typeText(element, text, speed) {
            for (let i = 1; i <= text.length; i++) {
                element.textContent = text.slice(0, i);
                await sleep(speed);
            }
        }

        async function deleteText(element, speed) {
            const text = element.textContent;
            for (let i = text.length - 1; i >= 0; i--) {
                element.textContent = text.slice(0, i);
                await sleep(speed);
            }
        }

        function showCursor(which) {
            if (cursorFirst) cursorFirst.hidden = which !== 1;
            if (cursorLast) cursorLast.hidden = which !== 2;
        }

        let nameReady;
        const nameTypedOnce = new Promise(resolve => { nameReady = resolve; });

        // Name: Monu / Sahu.
        async function nameLoop() {
            typedFirst.textContent = "";
            typedLast.textContent = "";
            if (typedDot) typedDot.textContent = "";

            while (true) {
                showCursor(1);
                await typeText(typedFirst, "Monu", 120);
                showCursor(2);
                await typeText(typedLast, "Sahu", 120);
                if (typedDot) typedDot.textContent = ".";
                nameReady();

                await sleep(3200);

                if (typedDot) typedDot.textContent = "";
                await deleteText(typedLast, 70);
                showCursor(1);
                await deleteText(typedFirst, 70);
                await sleep(700);
            }
        }

        // Role: I'M A + Full Stack Developer (cycles through roles)
        async function roleLoop() {
            const roles = [
                "Full Stack Developer",
                "B.Tech Student",
                "Software Developer"
            ];

            typedRole.textContent = "";
            await nameTypedOnce;
            await sleep(300);

            let index = 0;
            while (true) {
                await typeText(typedRole, roles[index], 75);
                await sleep(1800);
                await deleteText(typedRole, 45);
                await sleep(400);
                index = (index + 1) % roles.length;
            }
        }

        nameLoop();
        roleLoop();
    }
});
// Certificate cards: slide in when visible, slide out when scrolled away
// (runs again every time, in both scroll directions)
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".certificate-item");
    if (!items.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const card = entry.target.querySelector(".certificate-card");
                if (card) card.classList.toggle("in-view", entry.isIntersecting);
            });
        },
        { threshold: 0.25 }
    );

    items.forEach(item => {
        const card = item.querySelector(".certificate-card");
        if (card) card.classList.add("cert-slide");
        observer.observe(item);
    });
});

// Contact section: left block and right rows slide in/out on every scroll
document.addEventListener("DOMContentLoaded", () => {
    const panel = document.querySelector(".contact-panel");
    if (!panel || !("IntersectionObserver" in window)) return;

    const items = [];

    const left = panel.querySelector(".contact-content");
    if (left) {
        left.classList.add("slide-item", "from-left");
        items.push(left);
    }

    panel.querySelectorAll(".contact-detail").forEach((row, index) => {
        row.classList.add("slide-item", "from-right");
        row.style.setProperty("--delay", `${index * 0.12}s`);
        items.push(row);
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                items.forEach(item =>
                    item.classList.toggle("in-view", entry.isIntersecting)
                );
            });
        },
        { threshold: 0.2 }
    );

    observer.observe(panel);
});