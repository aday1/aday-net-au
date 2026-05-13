(() => {
  const body = document.body;
  const button = document.getElementById("scanlineToggle");
  const key = "aday.scanlines";
  const canvas = document.getElementById("crtCanvas");
  const cursor = document.getElementById("retroCursor");
  const menuItems = [...document.querySelectorAll(".osd-menu li")];
  const repoGrid = document.getElementById("repoGrid");
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

  const bootDone = () => body.classList.remove("boot-seq");
  window.addEventListener("load", () => setTimeout(bootDone, 820));
  setTimeout(bootDone, 1200);

  if (cursor) {
    window.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
  }

  const fit = () => {
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  };

  const initShader = () => {
    if (!canvas) return null;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return null;

    const vertexSource = `
      attribute vec2 aPos;
      void main() {
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 uRes;
      uniform float uTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= uRes.x / uRes.y;

        float t = uTime * 0.22;
        float wave = sin((uv.y + t * 0.8) * 95.0) * 0.04;
        float scan = sin((uv.y + t) * 900.0) * 0.08;
        float n = noise(uv * 380.0 + t * 20.0) * 0.17;
        float band = smoothstep(0.48, 0.52, sin((uv.y + t * 0.7) * 30.0));

        vec3 col = vec3(0.04, 0.14, 0.34);
        col += vec3(0.07, 0.16, 0.44) * (0.5 + 0.5 * sin(uv.x * 12.0 + t * 2.2));
        col += vec3(0.0, 0.24, 0.14) * (band * 0.35);
        col += vec3(wave + scan + n);

        float vignette = smoothstep(1.15, 0.38, length(p));
        col *= vignette;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "aPos");
    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    return { gl, program, aPos, uRes, uTime, buffer };
  };

  const shader = initShader();
  const ctx2d = shader || !canvas ? null : canvas.getContext("2d");

  const drawFallback = (ctx, t) => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#113462");
    grad.addColorStop(0.45, "#0f2444");
    grad.addColorStop(1, "#22133b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 36; i++) {
      const y = (i / 36) * h + Math.sin((t * 0.0017) + i) * 4;
      ctx.strokeStyle = `rgba(130,215,255,${0.03 + (i % 4) * 0.022})`;
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

    if (Math.random() < 0.12) {
      const gy = Math.random() * h;
      const gh = 8 + Math.random() * 20;
      const sx = (Math.random() - 0.5) * 18;
      ctx.drawImage(canvas, 0, gy, w, gh, sx, gy + (Math.random() - 0.5) * 6, w, gh);
    }
  };

  const render = (t) => {
    if (!canvas) return;
    fit();
    if (shader) {
      const { gl, program, aPos, uRes, uTime, buffer } = shader;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else if (ctx2d) {
      const ratio = window.devicePixelRatio || 1;
      ctx2d.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawFallback(ctx2d, t);
    }

    requestAnimationFrame(render);
  };

  const cycleMenu = () => {
    if (!menuItems.length) return;
    menuItems[activeIndex]?.classList.remove("active");
    activeIndex = (activeIndex + 1) % menuItems.length;
    menuItems[activeIndex]?.classList.add("active");
  };

  const scrambleText = (el, target) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let frame = 0;
    const max = target.length + 14;
    const run = () => {
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (i < frame - 6) out += target[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      frame += 1;
      if (frame <= max) requestAnimationFrame(run);
      else el.textContent = target;
    };
    run();
  };

  const animateTextFx = () => {
    const nodes = [...document.querySelectorAll(".decrypt")];
    nodes.forEach((node, idx) => {
      const text = node.dataset.text || node.textContent || "";
      setTimeout(() => scrambleText(node, text), 180 + idx * 120);
    });

    const line = document.querySelector(".decrypt-line");
    if (line && window.anime) {
      const txt = line.textContent || "";
      line.textContent = "";
      let i = 0;
      const timer = setInterval(() => {
        line.textContent += txt[i] || "";
        i += 1;
        if (i >= txt.length) clearInterval(timer);
      }, 18);
      window.anime({
        targets: ".decrypt-line",
        opacity: [0.3, 1],
        duration: 1400,
        easing: "easeOutQuad"
      });
    }
  };

  const moshImage = (img) => {
    if (img.dataset.moshReady === "1") return;
    const wrap = document.createElement("div");
    wrap.className = "mosh-wrap";
    img.parentNode?.insertBefore(wrap, img);
    wrap.appendChild(img);

    const layer = document.createElement("canvas");
    layer.className = "mosh-layer";
    wrap.appendChild(layer);
    const lctx = layer.getContext("2d");
    if (!lctx) return;

    const size = () => {
      layer.width = img.clientWidth;
      layer.height = img.clientHeight;
    };

    const draw = () => {
      size();
      lctx.clearRect(0, 0, layer.width, layer.height);
      for (let i = 0; i < 7; i++) {
        const sy = Math.random() * layer.height;
        const sh = 4 + Math.random() * 20;
        const dx = (Math.random() - 0.5) * 14;
        lctx.globalAlpha = 0.14 + Math.random() * 0.3;
        lctx.drawImage(img, 0, sy, layer.width, sh, dx, sy, layer.width, sh);
      }
      lctx.globalAlpha = 0.18;
      lctx.fillStyle = `rgba(${Math.floor(Math.random() * 90)}, ${200 + Math.floor(Math.random() * 50)}, 255, 0.28)`;
      lctx.fillRect(0, Math.random() * layer.height, layer.width, 1 + Math.random() * 2);
    };

    setInterval(draw, 240);
    window.addEventListener("resize", size);
    img.dataset.moshReady = "1";
  };

  const hydrateRepoGrid = async () => {
    if (!repoGrid) return;
    try {
      const response = await fetch("https://api.github.com/users/aday1/repos?per_page=100&sort=updated");
      if (!response.ok) return;
      const repos = await response.json();
      const picks = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 24);

      repoGrid.innerHTML = "";
      for (let i = 0; i < picks.length; i++) {
        const repo = picks[i];
        const card = document.createElement("article");
        card.className = "card";

        const shot = `https://opengraph.githubassets.com/aday-radar-${i}/${repo.owner.login}/${repo.name}`;
        const liveGuess = repo.homepage && repo.homepage.trim() !== ""
          ? repo.homepage
          : (repo.name.includes(".aday.net.au") ? `https://${repo.name}` : `https://aday1.github.io/${repo.name}/`);

        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p class="repo-meta">${(repo.description || "No description yet").slice(0, 120)}</p>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">repo</a>
          <a href="${liveGuess}" target="_blank" rel="noopener noreferrer">live/page</a>
          <img class="repo-shot mosh-image" src="${shot}" alt="${repo.name} preview">
        `;
        repoGrid.appendChild(card);
      }

      document.querySelectorAll("img.mosh-image").forEach((img) => {
        if (img.complete) moshImage(img);
        else img.addEventListener("load", () => moshImage(img), { once: true });
      });
    } catch {
      // silent degrade
    }
  };

  window.addEventListener("resize", fit);
  fit();
  if (canvas) requestAnimationFrame(render);
  setInterval(cycleMenu, 2200);
  animateTextFx();
  hydrateRepoGrid();

  document.querySelectorAll("img.mosh-image").forEach((img) => {
    if (img.complete) moshImage(img);
    else img.addEventListener("load", () => moshImage(img), { once: true });
  });
})();
