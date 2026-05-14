(() => {
  const body = document.body;
  const button = document.getElementById("scanlineToggle");
  const key = "aday.scanlines";
  const bgShader = document.getElementById("bgShader");
  const canvas = document.getElementById("crtCanvas");
  const crtMedia = document.getElementById("crtMedia");
  const crtCaption = document.getElementById("crtCaption");
  const nodeMapCanvas = document.getElementById("nodeMapCanvas");
  const cursor = document.getElementById("retroCursor");
  const menuItems = [...document.querySelectorAll(".osd-menu li")];
  const repoGrid = document.getElementById("repoGrid");
  const pageTransition = document.getElementById("pageTransition");
  const ytFrame = document.getElementById("ytEmbedFrame");
  const ytSelector = document.getElementById("ytSelector");
  const ytRandom = document.getElementById("ytRandom");
  const randomImage = document.getElementById("randomImage");
  const randomImageBtn = document.getElementById("randomImageBtn");
  let activeIndex = 0;
  let mediaIndex = 0;

  const mediaFeed = [
    {
      src: "https://raw.githubusercontent.com/aday1/error-diffusion/main/public/assets/max-patch-1.png",
      title: "error-diffusion / visual patch output"
    },
    {
      src: "https://avatars.githubusercontent.com/u/1834001?v=4",
      title: "aday avatar"
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png",
      title: "acid-banger project visual"
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/acid-banger-visual.gif",
      title: "acid-banger animated preview"
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/macroverse.aday.net.au",
      title: "macroverse project card"
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/artbastard.aday.net.au",
      title: "artbastard project card"
    },
    {
      src: "https://content.pouet.net/logos/neuroxfra.gif",
      title: "pouet scene archive visual"
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/acid-banger",
      title: "acid-banger repository card"
    }
  ];
  const svgPreviewFallback = (title) => {
    const safe = (title || "project card").slice(0, 42);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='#0b1832'/><stop offset='100%' stop-color='#132f52'/></linearGradient></defs><rect width='1200' height='630' fill='url(#g)'/><rect x='32' y='32' width='1136' height='566' fill='none' stroke='#4f8ccf' stroke-width='4'/><text x='72' y='312' fill='#bde7ff' font-family='Consolas, monospace' font-size='42'>${safe}</text><text x='72' y='362' fill='#8eff79' font-family='Consolas, monospace' font-size='24'>preview unavailable - fallback render</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const armRepoImageFallback = (img, owner, repo, label) => {
    if (!img || img.dataset.fallbackReady === "1") return;
    const rawCandidates = owner && repo ? [
      `https://raw.githubusercontent.com/${owner}/${repo}/main/preview.png`,
      `https://raw.githubusercontent.com/${owner}/${repo}/master/preview.png`,
      `https://raw.githubusercontent.com/${owner}/${repo}/main/screenshot.png`,
      `https://raw.githubusercontent.com/${owner}/${repo}/main/docs/preview.png`
    ] : [];
    const candidates = [...rawCandidates, svgPreviewFallback(label)];
    let idx = 0;
    img.addEventListener("error", () => {
      if (idx >= candidates.length) return;
      img.src = candidates[idx];
      idx += 1;
    });
    img.dataset.fallbackReady = "1";
  };


  const ytSources = [
    "https://www.youtube-nocookie.com/embed?listType=user_uploads&list=aday1",
    "https://www.youtube-nocookie.com/embed?listType=user_uploads&list=Aday",
    "https://www.youtube-nocookie.com/embed?listType=search&list=aday+macroverse+visual",
    "https://www.youtube-nocookie.com/embed?listType=search&list=aday+chiptune+live"
  ];

  const randomImageSources = [
    "https://raw.githubusercontent.com/aday1/error-diffusion/main/public/assets/max-patch-1.png",
    "https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png",
    "https://opengraph.githubassets.com/aday-mv/aday1/macroverse.aday.net.au",
    "https://opengraph.githubassets.com/aday-ab/aday1/artbastard.aday.net.au",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
  ];

  const livePageOverrides = {
    ZealPalace: "https://aday1.github.io/ZealPalace/",
    "acid-banger": "https://aday1.github.io/acid-banger/",
    "error-diffusion": "https://errordiffusion.net"
  };

  const projectBlurbOverrides = {
    ZealPalace: "Text-based RPG simulator fishbowl for Raspberry Pi with autonomous IRC personas, MUD loops, and social simulation.",
    "acid-banger": "Acid 303 browser groovebox fork with extra sync/control workflows for live coding and performance sessions.",
    "macroverse.aday.net.au": "Web browser GLSL and wire-VJ performance platform for live shader scenes and visual state routing.",
    "artbastard.aday.net.au": "Web DMX platform and live control plane bridging OSC, MIDI, DMX, and Art-Net for stage rigs.",
    "error-diffusion": "Live glitch processing lab and diffusion-visual toolkit powering errordiffusion.net experiments.",
    OpenSoundLab: "Browser audio sandbox for synthesis, sequencing, and sonic prototype tooling.",
    "bitwig-mcp-server": "MCP bridge exposing Bitwig operations for scripted and agent-driven automation.",
    MoveMusicSaveEditor: "Move Music save editor for quickly patching controller maps, choreography data, and test-state values.",
    "The-DAW-Horsemen-of-the-apocalypse-MCP-survival-Pack": "High-speed MCP macro pack for repetitive DAW editing and envelope batching."
  };

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
  window.addEventListener("load", () => {
    setTimeout(bootDone, 600);
    setTimeout(() => pageTransition?.classList.add("hidden"), 600);
  });
  setTimeout(bootDone, 5000);
  setTimeout(() => pageTransition?.classList.add("hidden"), 5000);

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

      float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 5; i++) {
          f += w * noise(p);
          p *= 2.1;
          w *= 0.55;
        }
        return f;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= uRes.x / uRes.y;

        float t = uTime * 0.32;
        float wave = sin((uv.y + t * 0.9) * 92.0) * 0.05;
        float scan = sin((uv.y + t) * 1220.0) * 0.09;
        float n = noise(uv * 450.0 + t * 40.0) * 0.18;
        float neb = fbm(uv * 6.0 + vec2(t * 0.8, -t * 0.25));
        float swirl = sin((p.x * p.x + p.y * p.y) * 18.0 - t * 4.0);

        vec3 col = vec3(0.03, 0.10, 0.32);
        col += vec3(0.06, 0.16, 0.45) * neb;
        col += vec3(0.16, 0.05, 0.24) * (0.5 + 0.5 * swirl);
        col += vec3(0.02, 0.24, 0.16) * smoothstep(0.4, 0.8, neb);
        col += vec3(wave + scan + n);
        col += vec3(0.1, 0.24, 0.08) * smoothstep(0.7, 1.0, sin((uv.y - t * 0.6) * 26.0));

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

  const initBgShader = () => {
    if (!bgShader) return null;
    const gl = bgShader.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return null;

    const vsSource = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `;
    const fsSource = `
      precision mediump float;
      uniform vec2 uRes;
      uniform float uTime;

      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n(vec2 p){
        vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1.0,0.0)),u.x),mix(h(i+vec2(0.0,1.0)),h(i+vec2(1.0,1.0)),u.x),u.y);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec2 p = uv*2.0-1.0;
        p.x *= uRes.x/uRes.y;
        float t = uTime * 0.22;

        float m = n(uv*8.0 + vec2(t*0.6, -t*0.4));
        float z = sin((p.x+p.y+t*0.4)*18.0) * 0.5 + 0.5;
        float ring = smoothstep(0.55, 0.1, abs(length(p)-0.4-0.08*sin(t*0.8)));

        vec3 col = vec3(0.02,0.06,0.15);
        col += vec3(0.02,0.18,0.45) * m;
        col += vec3(0.20,0.06,0.28) * z * 0.45;
        col += vec3(0.10,0.35,0.18) * ring * 0.35;

        float fade = smoothstep(1.2,0.1,length(p));
        col *= fade;
        gl_FragColor = vec4(col, 0.85);
      }
    `;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    return {
      gl,
      program,
      aPos: gl.getAttribLocation(program, "aPos"),
      uRes: gl.getUniformLocation(program, "uRes"),
      uTime: gl.getUniformLocation(program, "uTime"),
      buffer
    };
  };

  const bgShaderCtx = initBgShader();

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

  const renderBg = (t) => {
    if (!bgShaderCtx || !bgShader) return;
    const { gl, program, aPos, uRes, uTime, buffer } = bgShaderCtx;
    const ratio = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(window.innerWidth * ratio));
    const h = Math.max(1, Math.floor(window.innerHeight * ratio));
    if (bgShader.width !== w || bgShader.height !== h) {
      bgShader.width = w;
      bgShader.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(renderBg);
  };

  const runNodeMap = () => {
    if (!nodeMapCanvas) return;
    const ctx = nodeMapCanvas.getContext("2d");
    if (!ctx) return;
    let hoverNodeId = "";
    const liveNodes = new Map();

    const nodes = [
      { id: "aday", x: 0.50, y: 0.25, r: 7, c: "#9eff89", label: "aday.net.au", url: "https://aday.net.au" },
      { id: "macroverse", x: 0.27, y: 0.50, r: 6, c: "#9fd4ff", label: "macroverse", url: "https://macroverse.aday.net.au" },
      { id: "artbastard", x: 0.73, y: 0.50, r: 6, c: "#9fd4ff", label: "artbastard", url: "https://artbastard.aday.net.au" },
      { id: "acid", x: 0.20, y: 0.74, r: 6, c: "#d697ff", label: "acid-banger", url: "https://aday1.github.io/acid-banger/" },
      { id: "blog", x: 0.50, y: 0.74, r: 6, c: "#9eff89", label: "blog", url: "https://blog.aday.net.au" },
      { id: "codepen", x: 0.80, y: 0.74, r: 6, c: "#88f7ff", label: "codepen", url: "https://codepen.io/aday_net_au/" },
      { id: "clan", x: 0.12, y: 0.33, r: 5, c: "#b2ffa8", label: "clan", url: "https://www.clananalogue.org/artists/aday/" },
      { id: "demozoo", x: 0.88, y: 0.33, r: 5, c: "#b2ffa8", label: "demozoo", url: "https://demozoo.org/sceners/28006/" }
    ];
    const edges = [
      ["aday", "macroverse"], ["aday", "artbastard"], ["aday", "blog"], ["aday", "codepen"],
      ["aday", "acid"], ["aday", "clan"], ["aday", "demozoo"], ["macroverse", "artbastard"],
      ["blog", "acid"], ["codepen", "artbastard"]
    ];

    const pickNode = (mx, my) => {
      let picked = null;
      liveNodes.forEach((node) => {
        const dx = mx - node.px;
        const dy = my - node.py;
        const distSq = dx * dx + dy * dy;
        const hitR = node.r + 9;
        if (distSq <= hitR * hitR) picked = node;
      });
      return picked;
    };

    const pointerPosition = (event) => {
      const rect = nodeMapCanvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    nodeMapCanvas.addEventListener("mousemove", (event) => {
      const p = pointerPosition(event);
      const node = pickNode(p.x, p.y);
      hoverNodeId = node?.id || "";
      nodeMapCanvas.style.cursor = node ? "pointer" : "none";
    });

    nodeMapCanvas.addEventListener("mouseleave", () => {
      hoverNodeId = "";
      nodeMapCanvas.style.cursor = "none";
    });

    nodeMapCanvas.addEventListener("click", (event) => {
      const p = pointerPosition(event);
      const node = pickNode(p.x, p.y);
      if (!node?.url) return;
      if (event.metaKey || event.ctrlKey) {
        window.open(node.url, "_blank", "noopener,noreferrer");
        return;
      }
      window.location.href = node.url;
    });

    const renderGraph = (time) => {
      const ratio = window.devicePixelRatio || 1;
      const rect = nodeMapCanvas.getBoundingClientRect();
      nodeMapCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
      nodeMapCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      const map = new Map();
      nodes.forEach((n, i) => {
        const nx = n.x * w + Math.sin(t * 0.7 + i) * 6;
        const ny = n.y * h + Math.cos(t * 0.9 + i * 0.5) * 5;
        map.set(n.id, { ...n, px: nx, py: ny });
      });
      liveNodes.clear();
      map.forEach((n) => liveNodes.set(n.id, n));

      edges.forEach(([a, b], idx) => {
        const na = map.get(a);
        const nb = map.get(b);
        if (!na || !nb) return;
        const pulse = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2 + idx));
        ctx.strokeStyle = `rgba(130, 210, 255, ${pulse})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.stroke();
      });

      map.forEach((n) => {
        const hovered = hoverNodeId === n.id;
        ctx.fillStyle = n.c;
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r + (hovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = n.c;
        ctx.shadowBlur = hovered ? 22 : 16;
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (hovered) {
          ctx.strokeStyle = "rgba(190,255,185,0.92)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.px, n.py, n.r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = hovered ? "rgba(220,255,228,0.96)" : "rgba(200,240,255,0.9)";
        ctx.font = "12px Consolas, monospace";
        ctx.fillText(n.label, n.px + 10, n.py + 4);
      });

      requestAnimationFrame(renderGraph);
    };

    requestAnimationFrame(renderGraph);
  };

  const cycleMenu = () => {
    if (!menuItems.length) return;
    const prev = menuItems[activeIndex];
    prev?.classList.remove("active");
    activeIndex = (activeIndex + 1) % menuItems.length;
    const next = menuItems[activeIndex];
    next?.classList.add("active");

    if (window.anime && next) {
      window.anime({
        targets: next,
        translateX: [-8, 0],
        opacity: [0.45, 1],
        duration: 420,
        easing: "easeOutExpo"
      });
    }
  };

  const cycleCrtMedia = () => {
    if (!crtMedia) return;
    mediaIndex = (mediaIndex + 1) % mediaFeed.length;
    const item = mediaFeed[mediaIndex];
    crtMedia.src = item.src;
    crtCaption.textContent = item.title;
    if (window.anime) {
      window.anime({
        targets: crtMedia,
        opacity: [0.2, 0.82],
        duration: 650,
        easing: "easeOutCubic"
      });
      window.anime({
        targets: crtCaption,
        translateY: [8, 0],
        opacity: [0.3, 1],
        duration: 420,
        easing: "easeOutExpo"
      });
    }
  };

  const initYoutubeDeck = () => {
    if (!ytFrame) return;
    ytSelector?.addEventListener("change", () => {
      ytFrame.src = ytSelector.value;
      if (window.anime) {
        window.anime({
          targets: ".yt-crt",
          opacity: [0.25, 1],
          duration: 380,
          easing: "easeOutQuad"
        });
      }
    });

    ytRandom?.addEventListener("click", () => {
      const src = ytSources[Math.floor(Math.random() * ytSources.length)];
      ytFrame.src = src;
      if (ytSelector) ytSelector.value = src;
      if (window.anime) {
        window.anime({
          targets: ".yt-controls, .yt-crt",
          translateX: [-6, 0],
          opacity: [0.6, 1],
          duration: 450,
          easing: "easeOutExpo"
        });
      }
    });
  };

  const initRandomImageDeck = () => {
    if (!randomImage || !randomImageBtn) return;
    randomImageBtn.addEventListener("click", () => {
      const src = randomImageSources[Math.floor(Math.random() * randomImageSources.length)];
      randomImage.src = src;
      if (window.anime) {
        window.anime({
          targets: randomImage,
          scale: [0.985, 1],
          opacity: [0.55, 1],
          duration: 460,
          easing: "easeOutExpo"
        });
      }
    });
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

  const animateHeaders = () => {
    if (!window.anime) return;
    const headers = [...document.querySelectorAll("h1, h2, h3")];
    window.anime({
      targets: headers,
      translateY: [14, 0],
      opacity: [0, 1],
      duration: 900,
      delay: window.anime.stagger(70, { start: 120 }),
      easing: "easeOutExpo"
    });
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
        .slice(0, 12);

      repoGrid.innerHTML = "";
      for (let i = 0; i < picks.length; i++) {
        const repo = picks[i];
        const card = document.createElement("article");
        card.className = "card";

        const shot = `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
        const override = livePageOverrides[repo.name];
        const liveGuess = override ? override : (repo.homepage && repo.homepage.trim() !== ""
          ? repo.homepage
          : (repo.name.includes(".aday.net.au") ? `https://${repo.name}` : `https://aday1.github.io/${repo.name}/`));

        const updatedMs = Date.now() - new Date(repo.updated_at).getTime();
        const days = Math.floor(updatedMs / (1000 * 60 * 60 * 24));
        const activity = days < 14 ? "hot" : days < 60 ? "warm" : "cold";

        const blurb = projectBlurbOverrides[repo.name] || (repo.description || "No description yet").slice(0, 120);
        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p class="repo-meta">${blurb}</p>
          <p class="repo-meta repo-activity repo-activity-${activity}">activity: ${activity} / updated ${days}d ago</p>
          <a href="${liveGuess}" target="_blank" rel="noopener noreferrer">open project page</a>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">source</a>
          <img class="repo-shot mosh-image" src="${shot}" alt="${repo.name} preview">
        `;
        repoGrid.appendChild(card);
        const image = card.querySelector("img.repo-shot");
        armRepoImageFallback(image, repo.owner.login, repo.name, repo.name);
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
  if (bgShaderCtx) requestAnimationFrame(renderBg);
  runNodeMap();
  setInterval(cycleMenu, 2200);
  if (crtMedia) setInterval(cycleCrtMedia, 4200);
  animateTextFx();
  animateHeaders();
  initYoutubeDeck();
  initRandomImageDeck();
  hydrateRepoGrid();

  document.querySelectorAll("img.mosh-image").forEach((img) => {
    if (img.complete) moshImage(img);
    else img.addEventListener("load", () => moshImage(img), { once: true });
  });

  document.querySelectorAll("img.repo-shot[data-repo]").forEach((img) => {
    const parts = (img.dataset.repo || "").split("/");
    if (parts.length === 2) {
      armRepoImageFallback(img, parts[0], parts[1], parts[1]);
    } else {
      armRepoImageFallback(img, "", "", img.alt || "project card");
    }
  });
})();
