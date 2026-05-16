(() => {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const small = window.innerWidth < 720;
  if (prefersReduced || coarse || small) return;

  const charW = 10;
  const charH = 14;
  const cols = Math.ceil(window.innerWidth / charW) + 2;
  const rows = Math.ceil(window.innerHeight / charH) + 2;
  const charset = "0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ$#*<>[]/\\|";

  const canvas = document.createElement("canvas");
  canvas.className = "microbee-matrix";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const glitchBand = document.createElement("div");
  glitchBand.className = "microbee-glitch-band";
  glitchBand.setAttribute("aria-hidden", "true");
  document.body.appendChild(glitchBand);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const trails = Array.from({ length: Math.min(36, Math.floor(cols * 0.45)) }, () => ({
    x: Math.floor(Math.random() * cols),
    y: Math.random() * rows * -0.5,
    vy: 4 + Math.random() * 14
  }));

  let width = 0;
  let height = 0;
  let dpr = 1;
  let glitchY = 0.8;
  let lastGlitchAt = 0;
  let lastT = performance.now();
  let rafId = 0;
  let running = true;
  const GLITCH_COOLDOWN_MS = 3200;

  const isEnabled = () => {
    const body = document.body;
    return (
      body.classList.contains("microbee-crt-on")
      && !body.classList.contains("microbee-off")
      && !body.classList.contains("animations-off")
      && !body.classList.contains("scanlines-off")
    );
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    glitchBand.style.top = `${glitchY * height - 3}px`;
  };

  const randomize = (seed) => {
    const n = seed % 2147483647;
    const safe = n > 0 ? n : n + 2147483646;
    return (safe * 16807) % 2147483647;
  };

  const pickChar = (index, y) => {
    const seed = randomize(index + y * cols * 50 + 1500);
    return charset[seed % charset.length];
  };

  const drawMatrix = (delta) => {
    ctx.fillStyle = "rgba(0, 8, 4, 0.14)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${charH}px Consolas, "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    trails.forEach((trail, index) => {
      trail.y += trail.vy * delta;
      if (trail.y > rows + 1) {
        trail.x = Math.floor(Math.random() * cols);
        trail.y = -2 - Math.random() * 8;
        trail.vy = 4 + Math.random() * 14;
      }
      const flicker = 0.72 + (randomize(index + Math.floor(trail.y * 17)) % 100) / 220;
      const pink = index % 11 === 0;
      ctx.fillStyle = pink
        ? `rgba(255, 120, 168, ${0.35 * flicker})`
        : `rgba(0, 255, ${Math.floor(80 + flicker * 60)}, ${0.42 * flicker})`;
      ctx.fillText(
        pickChar(index, Math.floor(trail.y)),
        (trail.x + 0.5) * charW,
        trail.y * charH,
        charW
      );
    });
  };

  const triggerGlitch = () => {
    const now = performance.now();
    if (now - lastGlitchAt < GLITCH_COOLDOWN_MS) return;
    lastGlitchAt = now;
    glitchY = (glitchY + 0.11 + Math.random() * 0.08) % 1;
    glitchBand.style.top = `${glitchY * height - 3}px`;
    glitchBand.classList.add("is-hot");
    document.body.classList.add("microbee-glitch-slice");
    window.setTimeout(() => {
      glitchBand.classList.remove("is-hot");
      document.body.classList.remove("microbee-glitch-slice");
    }, 140);
  };

  const frame = (now) => {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const delta = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    if (!isEnabled()) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    drawMatrix(delta);

    if (Math.random() < delta * 0.22) triggerGlitch();
  };

  document.body.classList.add("microbee-crt-on");

  const observer = new MutationObserver(() => {
    canvas.style.display = isEnabled() ? "" : "none";
    glitchBand.style.display = isEnabled() ? "" : "none";
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  resize();
  window.addEventListener("resize", resize);
  rafId = requestAnimationFrame(frame);

  window.crtMicrobee = {
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
      glitchBand.remove();
      document.body.classList.remove("microbee-crt-on", "microbee-off", "microbee-glitch-slice");
      observer.disconnect();
    }
  };
})();
