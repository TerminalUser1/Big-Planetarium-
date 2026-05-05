/* Code assistance acknowledgement: OpenAI Codex was used to draft and refine this original JavaScript from the prompt "Restart the Big Planetarium website from the beginning with a stylish accessible design." */
const navToggle = document.querySelector(".nav-toggle");
const siteMenu = document.querySelector("#site-menu");
const contrastButtons = document.querySelectorAll(".mode-toggle");

// Shared navigation logic keeps the mobile menu state available to assistive technology.
if (navToggle && siteMenu) {
    const setMenuOpen = (isOpen) => {
        navToggle.setAttribute("aria-expanded", String(isOpen));
        siteMenu.classList.toggle("is-open", isOpen);
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
    });

    siteMenu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });
}

// The contrast preference is saved so the accessibility control is consistent between pages.
const savedContrast = localStorage.getItem("bigPlanetariumContrast") === "true";
document.body.classList.toggle("high-contrast", savedContrast);
contrastButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(savedContrast));
    button.addEventListener("click", () => {
        const isActive = !document.body.classList.contains("high-contrast");
        document.body.classList.toggle("high-contrast", isActive);
        localStorage.setItem("bigPlanetariumContrast", String(isActive));
        contrastButtons.forEach((item) => item.setAttribute("aria-pressed", String(isActive)));
    });
});

const planetData = {
    mercury: {
        name: "Mercury",
        family: "Rocky planet",
        image: "assets/images/mercury.png",
        alt: "Illustration of Mercury as a small grey rocky planet with crater markings.",
        summary: "Mercury is the closest planet to the Sun. It is small, rocky, airless, and marked by many craters.",
        position: "First from the Sun",
        clue: "Tiny, fast, and closest to the Sun."
    },
    venus: {
        name: "Venus",
        family: "Rocky planet",
        image: "assets/images/venus.png",
        alt: "Illustration of Venus with warm yellow cloud bands.",
        summary: "Venus is similar in size to Earth but has a thick atmosphere that traps intense heat.",
        position: "Second from the Sun",
        clue: "The hottest planet because its atmosphere traps heat."
    },
    earth: {
        name: "Earth",
        family: "Rocky planet",
        image: "assets/images/earth.png",
        alt: "Illustration of Earth with blue oceans, green land, and white cloud markings.",
        summary: "Earth is our home world, with liquid water, a protective atmosphere, and the only life we currently know.",
        position: "Third from the Sun",
        clue: "Blue oceans make Earth stand out."
    },
    mars: {
        name: "Mars",
        family: "Rocky planet",
        image: "assets/images/mars.png",
        alt: "Illustration of Mars as a rust-red rocky planet with lighter surface markings.",
        summary: "Mars is a cold rocky world. Iron-rich dust gives its surface a red-orange colour.",
        position: "Fourth from the Sun",
        clue: "Known as the red planet."
    },
    jupiter: {
        name: "Jupiter",
        family: "Gas giant",
        image: "assets/images/jupiter.png",
        alt: "Illustration of Jupiter with pale orange and cream cloud bands.",
        summary: "Jupiter is the largest planet in the Solar System, with powerful storms and thick cloud bands.",
        position: "Fifth from the Sun",
        clue: "The giant world with a famous storm."
    },
    saturn: {
        name: "Saturn",
        family: "Gas giant",
        image: "assets/images/saturn.png",
        alt: "Illustration of Saturn with pale bands and a broad ring system.",
        summary: "Saturn is a gas giant best known for its wide rings, made mostly from ice and rock fragments.",
        position: "Sixth from the Sun",
        clue: "The planet with the brightest rings."
    },
    uranus: {
        name: "Uranus",
        family: "Ice giant",
        image: "assets/images/uranus.png",
        alt: "Illustration of Uranus as a pale blue-green planet.",
        summary: "Uranus is an ice giant that rotates almost sideways, creating unusual seasons.",
        position: "Seventh from the Sun",
        clue: "The sideways-spinning planet."
    },
    neptune: {
        name: "Neptune",
        family: "Ice giant",
        image: "assets/images/neptune.png",
        alt: "Illustration of Neptune as a deep blue planet with lighter cloud bands.",
        summary: "Neptune is a distant ice giant with strong winds and dark storms in its atmosphere.",
        position: "Eighth from the Sun",
        clue: "The farthest recognised planet from the Sun."
    }
};

const planetTiles = document.querySelectorAll(".planet-tile");
const filterButtons = document.querySelectorAll(".chip");
const planetName = document.querySelector("#planet-name");
const planetFamily = document.querySelector("#planet-family");
const planetImage = document.querySelector("#planet-image");
const planetSummary = document.querySelector("#planet-summary");
const planetPosition = document.querySelector("#planet-position");
const planetClue = document.querySelector("#planet-clue");

// The atlas updates a single article, reducing repetition while keeping controls keyboard friendly.
function setPlanet(planetKey) {
    const selected = planetData[planetKey];
    if (!selected || !planetName || !planetImage || !planetSummary || !planetFamily) {
        return;
    }

    planetTiles.forEach((tile) => {
        const isSelected = tile.dataset.planet === planetKey;
        tile.classList.toggle("is-selected", isSelected);
        tile.setAttribute("aria-pressed", String(isSelected));
    });

    planetName.textContent = selected.name;
    planetFamily.textContent = selected.family;
    planetImage.src = selected.image;
    planetImage.alt = selected.alt;
    planetSummary.textContent = selected.summary;
    planetPosition.textContent = selected.position;
    planetClue.textContent = selected.clue;
}

planetTiles.forEach((tile) => {
    tile.addEventListener("click", () => setPlanet(tile.dataset.planet));
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => {
            const isActive = item === button;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        planetTiles.forEach((tile) => {
            tile.hidden = filter !== "all" && tile.dataset.kind !== filter;
        });
    });
});

const quiz = document.querySelector("#mars-quiz");
const quizResult = document.querySelector("#quiz-result");

// Quiz feedback is written to a live region, so screen reader users receive the result.
if (quiz && quizResult) {
    quiz.addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = new FormData(quiz).get("mars-colour");

        if (!answer) {
            quizResult.textContent = "Please choose an answer before checking.";
            return;
        }

        quizResult.textContent = answer === "iron"
            ? "Correct. Iron-rich dust and rock give Mars its red colour."
            : "Not quite. Mars looks red because its dust and rocks contain iron minerals.";
    });
}

const canvas = document.querySelector("#orbit-canvas");
const motionToggle = document.querySelector("#motion-toggle");
const speedRange = document.querySelector("#orbit-speed");
const orbitStatus = document.querySelector("#orbit-status");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The canvas model is decorative learning media, but still has labels and user controls.
if (canvas && motionToggle && speedRange && orbitStatus) {
    const context = canvas.getContext("2d");
    const orbitPlanets = [
        { label: "Mercury", radius: 62, size: 5, colour: "#d5d0c4", speed: 0.03 },
        { label: "Earth", radius: 112, size: 9, colour: "#70e0d2", speed: 0.018 },
        { label: "Mars", radius: 154, size: 8, colour: "#ff7a59", speed: 0.014 },
        { label: "Jupiter", radius: 210, size: 15, colour: "#ffd36e", speed: 0.008 },
        { label: "Saturn", radius: 268, size: 13, colour: "#f0c987", speed: 0.006 }
    ];
    let angle = 0;
    let running = !reduceMotion;
    let reducedMotionPause = reduceMotion;

    const drawModel = () => {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        context.clearRect(0, 0, width, height);
        context.fillStyle = "#050b11";
        context.fillRect(0, 0, width, height);

        context.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let star = 0; star < 70; star += 1) {
            const x = (star * 97) % width;
            const y = (star * 53) % height;
            context.fillRect(x, y, 1.5, 1.5);
        }

        context.fillStyle = "#ffd36e";
        context.beginPath();
        context.arc(centerX, centerY, 24, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#fff8ed";
        context.font = "16px Arial";
        context.fillText("Sun", centerX + 34, centerY + 6);

        orbitPlanets.forEach((planet) => {
            context.strokeStyle = "rgba(255, 248, 237, 0.24)";
            context.beginPath();
            context.arc(centerX, centerY, planet.radius, 0, Math.PI * 2);
            context.stroke();

            const x = centerX + Math.cos(angle * planet.speed * 60) * planet.radius;
            const y = centerY + Math.sin(angle * planet.speed * 60) * planet.radius;

            context.fillStyle = planet.colour;
            context.beginPath();
            context.arc(x, y, planet.size, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#fff8ed";
            context.fillText(planet.label, x + 14, y + 5);
        });
    };

    const updateMotionState = () => {
        const speedLabel = Number(speedRange.value) <= 2 ? "slow" : Number(speedRange.value) >= 6 ? "fast" : "steady";
        speedRange.setAttribute("aria-valuetext", `${speedLabel} speed`);
        motionToggle.textContent = running ? "Pause motion" : "Play motion";
        motionToggle.setAttribute("aria-pressed", String(!running));
        orbitStatus.textContent = running
            ? `Motion active at ${speedLabel} speed.`
            : reducedMotionPause
                ? "Motion paused because reduced motion is enabled."
                : "Motion paused.";
    };

    const animate = () => {
        if (running) {
            angle += Number(speedRange.value) / 12;
        }
        drawModel();
        requestAnimationFrame(animate);
    };

    motionToggle.addEventListener("click", () => {
        running = !running;
        if (running) {
            reducedMotionPause = false;
        }
        updateMotionState();
    });

    speedRange.addEventListener("input", updateMotionState);
    updateMotionState();
    animate();
}
