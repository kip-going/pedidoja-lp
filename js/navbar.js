// Flickering Grid Background
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("flickering-grid");
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const squareSize = 6;
  const gridGap = 8;
  const flickerChance = 0.1;
  const color = "rgb(255, 165, 0)"; // Yellowish orange
  const maxOpacity = 0.3;

  const toRGBA = (color) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, 1, 1);
    const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b},`;
  };
  const memoizedColor = toRGBA(color);

  let animationFrameId;
  let squares;
  let cols, rows;
  let lastTime = 0;

  const setupCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    cols = Math.floor(width / (squareSize + gridGap));
    rows = Math.floor(height / (squareSize + gridGap));
    squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random() * maxOpacity;
    }
    return dpr;
  };

  const updateSquares = (deltaTime) => {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[i] = Math.random() * maxOpacity;
      }
    }
  };

  const drawGrid = (dpr) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        ctx.fillStyle = `${memoizedColor}${opacity})`;
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  };

  const animate = (time) => {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    updateSquares(deltaTime);
    drawGrid(window.devicePixelRatio || 1);
    animationFrameId = requestAnimationFrame(animate);
  };

  const dpr = setupCanvas();
  animate(0);

  window.addEventListener("resize", () => {
    setupCanvas();
  });
});

// Custom Cursor
document.addEventListener('DOMContentLoaded', function() {
    // Hide default cursor
    document.body.style.cursor = 'none';

    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.3; // Increased lerp factor for less delay
        cursorY += dy * 0.3;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`; // Hotspot at top-left
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
});

// Sparkles Text
document.addEventListener("DOMContentLoaded", function () {
  const sparklesText = document.querySelector(".sparkles-text");
  if (!sparklesText) return;

  const foodImages = ["pizza_1f355.png", "hamburger_1f354.png", "french-fries_1f35f.png", "poultry-leg_1f357.png", "soft-ice-cream_1f366.png", "rice-ball_1f359.png", "taco_1f32e.png", "hot-dog_1f32d.png"];
  const sparklesCount = 8;

  const generateSparkle = () => {
    const imageName = foodImages[Math.floor(Math.random() * foodImages.length)];
    const x = Math.random() * 100 + "%";
    const y = Math.random() * 100 + "%";
    const delay = Math.random() * 2;
    const scale = Math.random() * 1 + 0.3;

    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    const img = document.createElement("img");
    img.src = "/assets/images/" + imageName;
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.objectFit = "contain";
    sparkle.appendChild(img);
    sparkle.style.left = x;
    sparkle.style.top = y;
    sparkle.style.animationDelay = delay + "s";
    sparkle.style.transform = `scale(${scale})`;

    return sparkle;
  };

  for (let i = 0; i < sparklesCount; i++) {
    const sparkle = generateSparkle();
    sparklesText.appendChild(sparkle);
  }

  // Update sparkles periodically
  setInterval(() => {
    const sparkles = sparklesText.querySelectorAll(".sparkle");
    sparkles.forEach((sparkle) => {
      if (Math.random() < 0.05) { // Reduced chance to 5%
        sparkle.remove();
        const newSparkle = generateSparkle();
        sparklesText.appendChild(newSparkle);
      }
    });
  }, 500); // Increased interval to 500ms
});

// Navbar word rotation on hover
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const words = JSON.parse(link.dataset.words);
    const wordSpan = link.querySelector(".word");
    let intervalId = null;
    let currentIndex = 0;

    const changeWord = () => {
      wordSpan.classList.add("exit");
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        wordSpan.textContent = words[currentIndex];
        wordSpan.classList.remove("exit");
        wordSpan.classList.add("enter");
        setTimeout(() => {
          wordSpan.classList.remove("enter");
        }, 250);
      }, 125);
    };

    link.addEventListener("mouseenter", function () {
      if (intervalId) clearInterval(intervalId);
      // Change immediately
      changeWord();
      // Then rotate every 2.5s
      intervalId = setInterval(changeWord, 2500);
    });

    link.addEventListener("mouseleave", function () {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      // Reset to first word
      currentIndex = 0;
      wordSpan.textContent = words[0];
      wordSpan.classList.remove("exit", "enter");
    });
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
  }
});
