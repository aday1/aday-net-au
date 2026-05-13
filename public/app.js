(() => {
  const body = document.body;
  const button = document.getElementById("scanlineToggle");
  const key = "aday.scanlines";
  const canvas = document.getElementById("crtCanvas");
  const ctx = canvas?.getContext("2d");
  const menuItems = [...document.querySelectorAll(".osd-menu li")];
  let activeIndex = 0;

  const saved = localStorage.getItem(key);
  if (saved === "off") {
    body.classList.remove("scanlines-on");
    body.classList.add("scanlines-off");
  }

  button?.addEventListener("click", () => {
    const off = body.classList.toggle("scanlines-off");
    body.classList.toggle("scanlines-on", !off);
    localStorage.setItem(key, off ? "off" : "on");
  });

  if (!canvas || !ctx) return;

  const fit = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (t) => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0e2b53");
    grad.addColorStop(0.5, "#10203c");
    grad.addColorStop(1, "#24103d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 22; i++) {
      const y = (i / 22) * h + Math.sin((t * 0.0015) + i) * 6;
      ctx.strokeStyle = `rgba(160,220,255,${0.04 + (i % 3) * 0.03})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(80,255,185,0.12)";
    for (let i = 0; i < 6; i++) {
      const x = ((t * 0.02) + i * 180) % (w + 120) - 120;
      const yy = 60 + i * 64 + Math.cos((t * 0.002) + i) * 14;
      ctx.fillRect(x, yy, 92, 3);
    }

    if (Math.random() < 0.08) {
      const gy = Math.random() * h;
      const gh = 8 + Math.random() * 20;
      const sx = (Math.random() - 0.5) * 18;
      ctx.drawImage(canvas, 0, gy, w, gh, sx, gy + (Math.random() - 0.5) * 6, w, gh);
    }

    requestAnimationFrame(draw);
  };

  const cycleMenu = () => {
    if (!menuItems.length) return;
    menuItems[activeIndex]?.classList.remove("active");
    activeIndex = (activeIndex + 1) % menuItems.length;
    menuItems[activeIndex]?.classList.add("active");
  };

  window.addEventListener("resize", fit);
  fit();
  requestAnimationFrame(draw);
  setInterval(cycleMenu, 2200);
})();
