(() => {
  let rafId = 0;
  let running = false;
  let canvasRef = null;
  let startTime = 0;

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    canvasRef = null;
  };

  const draw = (now) => {
    if (!running || !canvasRef) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w * 0.5;
    const cy = h * 0.52;
    const radius = Math.min(w, h) * 0.46;
    const t = (now - startTime) * 0.001;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0, 4, 10, 0.55)";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);

    for (let ring = 1; ring <= 8; ring += 1) {
      const r = (radius / 8) * ring;
      ctx.strokeStyle = ring % 2 === 0 ? "rgba(180, 255, 255, 0.14)" : "rgba(120, 200, 255, 0.06)";
      ctx.lineWidth = ring % 2 === 0 ? 1.2 : 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const spokes = 48;
    for (let i = 0; i < spokes; i += 1) {
      const a = (i / spokes) * Math.PI * 2;
      ctx.strokeStyle = i % 6 === 0 ? "rgba(210, 255, 255, 0.12)" : "rgba(120, 180, 220, 0.04)";
      ctx.lineWidth = i % 6 === 0 ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      ctx.stroke();
    }

    const sweep = (t * 1.55) % (Math.PI * 2);
    const tailSteps = 42;
    for (let i = 0; i < tailSteps; i += 1) {
      const angle = sweep - (i / tailSteps) * 1.15;
      const alpha = Math.pow(1 - i / tailSteps, 2.2) * 0.72;
      const noise = 0.82 + Math.sin(t * 6 + i * 0.4) * 0.18;
      ctx.strokeStyle = `rgba(220, 255, 255, ${alpha * noise})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();
    }

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.2);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    const vignette = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.05);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.65)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    rafId = requestAnimationFrame(draw);
  };

  const resize = (canvas) => {
    const host = canvas.parentElement;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };

  const start = (canvas) => {
    stop();
    if (!canvas) return;
    canvasRef = canvas;
    running = true;
    startTime = performance.now();
    resize(canvas);
    rafId = requestAnimationFrame(draw);
  };

  window.crtAboutRadar = {
    start,
    stop,
    resize: () => {
      if (canvasRef) resize(canvasRef);
    }
  };

  window.addEventListener("resize", () => {
    if (running && canvasRef) resize(canvasRef);
  });
})();
