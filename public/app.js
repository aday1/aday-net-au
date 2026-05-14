(() => {
  const body = document.body;
  const button = document.getElementById("scanlineToggle");
  const key = "aday.scanlines";
  const bgShader = document.getElementById("bgShader");
  const canvas = document.getElementById("crtCanvas");
  const crtMedia = document.getElementById("crtMedia");
  const crtCaption = document.getElementById("crtCaption");
  const screen = document.querySelector(".screen");
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
  const scFrame = document.getElementById("scEmbedFrame");
  const scSelector = document.getElementById("scSelector");
  const scRandom = document.getElementById("scRandom");
  const deckASelect = document.getElementById("deckASelect");
  const deckALoad = document.getElementById("deckALoad");
  const deckAFrame = document.getElementById("deckAFrame");
  const deckAState = document.getElementById("deckAState");
  const deckBSelect = document.getElementById("deckBSelect");
  const deckBLoad = document.getElementById("deckBLoad");
  const deckBFrame = document.getElementById("deckBFrame");
  const deckBState = document.getElementById("deckBState");
  const djCrossfader = document.getElementById("djCrossfader");
  const deckALevel = document.getElementById("deckALevel");
  const deckBLevel = document.getElementById("deckBLevel");
  const galleryFilters = [...document.querySelectorAll(".gallery-filter")];
  const galleryCards = [...document.querySelectorAll(".gallery-card")];
  let activeIndex = 0;
  let mediaIndex = 0;
  let bgCycleIndex = 0;
  const sessionEdgeSeed = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  const mediaFeed = [
    {
      src: "https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png",
      title: "error-diffusion / visual patch output",
      fallbacks: ["https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png"]
    },
    {
      src: "https://avatars.githubusercontent.com/u/1834001?v=4",
      title: "aday avatar",
      fallbacks: ["https://avatars.githubusercontent.com/u/1834001?v=4"]
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png",
      title: "acid-banger project visual",
      fallbacks: ["https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png"]
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/acid-banger-visual.gif",
      title: "acid-banger animated preview",
      fallbacks: ["https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png"]
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/macroverse.aday.net.au",
      title: "macroverse project card",
      fallbacks: [
        "https://raw.githubusercontent.com/aday1/macroverse.aday.net.au/main/preview.png",
        "https://raw.githubusercontent.com/aday1/macroverse.aday.net.au/main/screenshot.png"
      ]
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/artbastard.aday.net.au",
      title: "artbastard project card",
      fallbacks: [
        "https://raw.githubusercontent.com/aday1/artbastard.aday.net.au/main/preview.png",
        "https://raw.githubusercontent.com/aday1/artbastard.aday.net.au/main/screenshot.png"
      ]
    },
    {
      src: "https://content.pouet.net/logos/neuroxfra.gif",
      title: "pouet scene archive visual",
      fallbacks: ["https://content.pouet.net/logos/neuroxfra.gif"]
    },
    {
      src: "https://opengraph.githubassets.com/1/aday1/acid-banger",
      title: "acid-banger repository card",
      fallbacks: ["https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png"]
    },
    {
      src: "https://media.demozoo.org/screens/t/dc/3c/d2ca.pl765305.jpg",
      title: "demozoo / orbital syntax frame",
      fallbacks: ["https://media.demozoo.org/screens/t/60/9a/54e1.352183.jpg"]
    },
    {
      src: "https://media.demozoo.org/screens/t/0d/47/2883.187843.jpg",
      title: "demozoo / demobus from the sky",
      fallbacks: ["https://media.demozoo.org/screens/t/d7/36/0130.173990.png"]
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

  const parseRepoData = (value) => {
    const parts = (value || "").split("/");
    if (parts.length !== 2) return null;
    return { owner: parts[0], repo: parts[1] };
  };

  const armGenericImageFallback = (img) => {
    if (!img || img.dataset.fallbackReady === "1") return;
    const explicit = (img.dataset.fallbacks || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const repoData = parseRepoData(img.dataset.repo || "");
    if (repoData) {
      armRepoImageFallback(img, repoData.owner, repoData.repo, img.alt || repoData.repo);
      return;
    }
    if (!explicit.length) return;
    const label = img.alt || "image";
    const candidates = [...explicit, svgPreviewFallback(label)];
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
    "https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png",
    "https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png",
    "https://raw.githubusercontent.com/aday1/macroverse.aday.net.au/main/preview.png",
    "https://raw.githubusercontent.com/aday1/artbastard.aday.net.au/main/preview.png",
    "https://media.demozoo.org/screens/t/dc/3c/d2ca.pl765305.jpg",
    "https://media.demozoo.org/screens/t/0d/47/2883.187843.jpg",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
  ];

  const soundcloudSources = [
    "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau/tracks&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau/sets&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
  ];

  const bgCyclePalette = [
    { a: "#2a4572", b: "#13233f", c: "#091426", d: "#060d18" },
    { a: "#4c2a72", b: "#1a203f", c: "#0a1628", d: "#060913" },
    { a: "#1f5a64", b: "#122f42", c: "#08192a", d: "#050d17" },
    { a: "#61334a", b: "#2a1d3f", c: "#121329", d: "#070913" }
  ];

  const djDeckSources = [
    {
      id: "aday-yt-uploads",
      label: "Aday YouTube uploads",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed?listType=user_uploads&list=aday1&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aday-yt-live",
      label: "Aday YouTube live visual search",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed?listType=search&list=aday+chiptune+live+visual&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aisjam-yt",
      label: "Aisjam YouTube feature",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/GFBpXcUfIqM?enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "clan-yt",
      label: "Clan Analogue YouTube channel",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed?listType=search&list=clan+analogue+live+electronic+music&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aday-sc-profile",
      label: "Aday SoundCloud profile",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "aday-sc-tracks",
      label: "Aday SoundCloud tracks",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau/tracks&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "clan-sc",
      label: "Clan Analogue SoundCloud",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/clan-analogue&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "wb-cubic-waveform",
      label: "WeeklyBeats / Cubic Waveform",
      kind: "weeklybeats",
      embed: "https://weeklybeats.com/music/aday"
    },
    {
      id: "wb-late-calibration",
      label: "WeeklyBeats / Late Calibration Test",
      kind: "weeklybeats",
      embed: "https://weeklybeats.com/music/aday"
    },
    {
      id: "wb-doomsday-data",
      label: "WeeklyBeats / Doomsday data",
      kind: "weeklybeats",
      embed: "https://weeklybeats.com/aday/music/doomsday-data"
    },
    {
      id: "wb-anxious-goth-rabbit",
      label: "WeeklyBeats / Anxious Goth Rabbit",
      kind: "weeklybeats",
      embed: "https://weeklybeats.com/aday/music/anxious-goth-rabbit-2"
    }
  ];

  const djDeckState = {
    a: { frame: deckAFrame, status: deckAState, kind: "", widget: null, sourceId: "" },
    b: { frame: deckBFrame, status: deckBState, kind: "", widget: null, sourceId: "" }
  };

  const livePageOverrides = {
    ZealPalace: "https://aday1.github.io/ZealPalace/",
    "acid-banger": "https://aday1.github.io/acid-banger/",
    "error-diffusion": "https://errordiffusion.net",
    MoveMusicSaveEditor: "https://movemusic.com/"
  };

  const repoImageOverrides = {
    MoveMusicSaveEditor: "https://raw.githubusercontent.com/aday1/MoveMusicSaveEditor/main/test.gif"
  };

  const projectBlurbOverrides = {
    ZealPalace: "Text-based RPG simulator fishbowl for Raspberry Pi with autonomous IRC personas, MUD loops, and social simulation.",
    "acid-banger": "Acid 303 browser groovebox fork with extra sync/control workflows for live coding and performance sessions.",
    "macroverse.aday.net.au": "Web browser GLSL and wire-VJ performance platform for live shader scenes and visual state routing.",
    "artbastard.aday.net.au": "Web DMX platform and live control plane bridging OSC, MIDI, DMX, and Art-Net for stage rigs.",
    "error-diffusion": "Live glitch processing lab and diffusion-visual toolkit powering errordiffusion.net experiments.",
    OpenSoundLab: "Browser audio sandbox for synthesis, sequencing, and sonic prototype tooling.",
    "bitwig-mcp-server": "MCP bridge exposing Bitwig operations for scripted and agent-driven automation.",
    MoveMusicSaveEditor: "Move Music save editor for quickly patching controller maps and choreography data for Tim Arterbury's MoveMusic platform.",
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
  const hideTransition = () => pageTransition?.classList.add("hidden");
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hideTransition, 1500);
  });
  window.addEventListener("load", () => {
    setTimeout(bootDone, 800);
    setTimeout(hideTransition, 900);
  });
  window.addEventListener("pageshow", () => {
    setTimeout(hideTransition, 120);
  });
  setTimeout(bootDone, 3600);
  setTimeout(hideTransition, 3800);

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
        float wave = sin((uv.y + t * 0.9) * 92.0) * 0.06;
        float scan = sin((uv.y + t) * 1520.0) * 0.11;
        float n = noise(uv * 450.0 + t * 40.0) * 0.18;
        float neb = fbm(uv * 6.0 + vec2(t * 0.8, -t * 0.25));
        float swirl = sin((p.x * p.x + p.y * p.y) * 18.0 - t * 4.0);
        float snow = noise(uv * vec2(900.0, 600.0) + vec2(t * 120.0, t * 80.0));
        float bar = step(0.975, fract(uv.y * 7.0 + t * 1.6)) * (0.12 + 0.12 * noise(vec2(t * 12.0, uv.y * 32.0)));
        vec2 gUv = uv + vec2(sin(uv.y * 40.0 + t * 8.0) * 0.003, 0.0);
        float ghost = fbm(gUv * 8.2 + vec2(t * 0.2, t * -0.14));

        vec3 col = vec3(0.03, 0.10, 0.32);
        col += vec3(0.06, 0.16, 0.45) * neb;
        col += vec3(0.16, 0.05, 0.24) * (0.5 + 0.5 * swirl);
        col += vec3(0.02, 0.24, 0.16) * smoothstep(0.4, 0.8, neb);
        col += vec3(wave + scan + n);
        col += vec3(0.1, 0.24, 0.08) * smoothstep(0.7, 1.0, sin((uv.y - t * 0.6) * 26.0));
        col += vec3(0.08, 0.14, 0.2) * ghost * 0.45;
        col += vec3(0.12, 0.12, 0.12) * snow * 0.3;
        col += vec3(bar, bar * 0.85, bar * 0.65);

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
        float speck = n(uv * vec2(340.0, 220.0) + vec2(t * 45.0, t * 30.0));
        float pulse = step(0.985, fract(uv.y * 6.5 + t * 1.2)) * 0.22;

        vec3 col = vec3(0.02,0.06,0.15);
        col += vec3(0.02,0.18,0.45) * m;
        col += vec3(0.20,0.06,0.28) * z * 0.45;
        col += vec3(0.10,0.35,0.18) * ring * 0.35;
        col += vec3(0.09,0.11,0.14) * speck * 0.22;
        col += vec3(pulse, pulse * 0.6, pulse * 0.9);

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
        if (hovered) {
          const tip = `open: ${n.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
          ctx.font = "11px Consolas, monospace";
          const tw = ctx.measureText(tip).width;
          const tx = Math.min(w - tw - 16, n.px + 12);
          const ty = Math.max(14, n.py - 14);
          ctx.fillStyle = "rgba(7, 14, 25, 0.9)";
          ctx.fillRect(tx - 6, ty - 12, tw + 12, 18);
          ctx.strokeStyle = "rgba(142, 255, 137, 0.7)";
          ctx.lineWidth = 1;
          ctx.strokeRect(tx - 6, ty - 12, tw + 12, 18);
          ctx.fillStyle = "rgba(180, 255, 169, 0.95)";
          ctx.fillText(tip, tx, ty + 1);
        }
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
    const queue = [item.src, ...(item.fallbacks || []), svgPreviewFallback(item.title)];
    let idx = 0;
    const applyCandidate = () => {
      if (idx >= queue.length) return;
      crtMedia.src = queue[idx];
      idx += 1;
    };
    crtMedia.onerror = () => applyCandidate();
    applyCandidate();
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

  const pulseCrtBurst = () => {
    if (!screen) return;
    screen.classList.add("crt-burst");
    setTimeout(() => screen.classList.remove("crt-burst"), 320);
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
    armGenericImageFallback(randomImage);
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

  const initSoundcloudDeck = () => {
    if (!scFrame) return;
    scSelector?.addEventListener("change", () => {
      scFrame.src = scSelector.value;
      if (window.anime) {
        window.anime({
          targets: ".media-frame-wrap",
          opacity: [0.45, 1],
          duration: 360,
          easing: "easeOutQuad"
        });
      }
    });
    scRandom?.addEventListener("click", () => {
      const src = soundcloudSources[Math.floor(Math.random() * soundcloudSources.length)];
      scFrame.src = src;
      if (scSelector) scSelector.value = src;
      if (window.anime) {
        window.anime({
          targets: ".media-frame-wrap, #scRandom",
          translateX: [-5, 0],
          opacity: [0.65, 1],
          duration: 420,
          easing: "easeOutExpo"
        });
      }
    });
  };

  const initGalleryFilters = () => {
    if (!galleryFilters.length || !galleryCards.length) return;
    const applyFilter = (tag) => {
      galleryCards.forEach((card) => {
        const album = (card.dataset.album || "").toLowerCase();
        const show = tag === "all" || album === tag;
        card.classList.toggle("gallery-hidden", !show);
      });
    };
    galleryFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = (btn.dataset.galleryFilter || "all").toLowerCase();
        galleryFilters.forEach((node) => node.classList.toggle("active", node === btn));
        applyFilter(tag);
        if (window.anime) {
          window.anime({
            targets: ".gallery-card:not(.gallery-hidden)",
            opacity: [0.45, 1],
            translateY: [4, 0],
            duration: 320,
            easing: "easeOutQuad"
          });
        }
      });
    });
  };

  const sendYoutubeCommand = (frame, func, args = []) => {
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func,
      args
    }), "*");
  };

  const setDeckVolume = (deck, volume) => {
    const vol = Math.max(0, Math.min(100, Math.round(volume)));
    if (!deck?.frame || !deck.kind) return;
    if (deck.kind === "youtube") {
      sendYoutubeCommand(deck.frame, "setVolume", [vol]);
      if (vol === 0) sendYoutubeCommand(deck.frame, "mute");
      else sendYoutubeCommand(deck.frame, "unMute");
      return;
    }
    if (deck.kind === "soundcloud" && deck.widget && typeof deck.widget.setVolume === "function") {
      deck.widget.setVolume(vol);
      return;
    }
    if (deck.kind === "weeklybeats") {
      // WeeklyBeats pages do not expose an iframe API for programmatic volume control.
      return;
    }
  };

  const applyCrossfader = () => {
    if (!djCrossfader) return;
    const pos = Number(djCrossfader.value) || 50;
    const volA = 100 - pos;
    const volB = pos;
    if (deckALevel) deckALevel.textContent = `A ${volA}%`;
    if (deckBLevel) deckBLevel.textContent = `B ${volB}%`;
    setDeckVolume(djDeckState.a, volA);
    setDeckVolume(djDeckState.b, volB);
  };

  const mountDeck = (deckKey, sourceId) => {
    const deck = djDeckState[deckKey];
    const source = djDeckSources.find((item) => item.id === sourceId);
    if (!deck || !source || !deck.frame) return;
    deck.kind = source.kind;
    deck.sourceId = source.id;
    deck.widget = null;
    if (deck.status) {
      const wbNote = source.kind === "weeklybeats" ? " (manual volume mode)" : "";
      deck.status.textContent = `${deckKey === "a" ? "deck a" : "deck b"}: ${source.label}${wbNote}`;
    }
    deck.frame.src = source.embed;
    deck.frame.addEventListener("load", () => {
      if (source.kind === "soundcloud" && window.SC && typeof window.SC.Widget === "function") {
        deck.widget = window.SC.Widget(deck.frame);
        if (window.SC.Widget.Events?.READY) {
          deck.widget.bind(window.SC.Widget.Events.READY, () => {
            applyCrossfader();
          });
        }
      } else {
        setTimeout(applyCrossfader, 200);
      }
    }, { once: true });
  };

  const randomizeFrameGeneration = () => {
    document.querySelectorAll(".panel, .card").forEach((node) => {
      const edgeLen = 8 + Math.floor(Math.random() * 20);
      const edgeGap = 5 + Math.floor(Math.random() * 16);
      const edgeCut = 7 + Math.floor(Math.random() * 14);
      const edgeAlpha = (0.33 + Math.random() * 0.42).toFixed(2);
      const edgeShift = 14 + Math.floor(Math.random() * 30);
      const edgeDrift = (6.2 + Math.random() * 8.6).toFixed(2);
      node.style.setProperty("--edge-len", `${edgeLen}px`);
      node.style.setProperty("--edge-gap", `${edgeGap}px`);
      node.style.setProperty("--edge-cut", `${edgeCut}px`);
      node.style.setProperty("--edge-alpha", edgeAlpha);
      node.style.setProperty("--edge-shift", `${edgeShift}px`);
      node.style.setProperty("--edge-drift", `${edgeDrift}s`);
      node.dataset.edgeSeed = sessionEdgeSeed;
    });
  };

  const cycleBackgroundPalette = () => {
    const swatch = bgCyclePalette[bgCycleIndex % bgCyclePalette.length];
    bgCycleIndex += 1;
    if (!swatch) return;
    body.style.setProperty("--bg-cycle-a", swatch.a);
    body.style.setProperty("--bg-cycle-b", swatch.b);
    body.style.setProperty("--bg-cycle-c", swatch.c);
    body.style.setProperty("--bg-cycle-d", swatch.d);
  };

  const scheduleFrameRandomizer = () => {
    const roll = () => {
      randomizeFrameGeneration();
      const next = 5200 + Math.floor(Math.random() * 6200);
      setTimeout(roll, next);
    };
    roll();
  };

  const initDjCrossfader = () => {
    if (!deckASelect || !deckBSelect || !deckALoad || !deckBLoad || !djCrossfader) return;
    const optionHtml = djDeckSources
      .map((source) => `<option value="${source.id}">${source.label}</option>`)
      .join("");
    deckASelect.innerHTML = optionHtml;
    deckBSelect.innerHTML = optionHtml;
    deckASelect.value = "aday-yt-uploads";
    deckBSelect.value = "aday-sc-profile";
    deckALoad.addEventListener("click", () => mountDeck("a", deckASelect.value));
    deckBLoad.addEventListener("click", () => mountDeck("b", deckBSelect.value));
    deckASelect.addEventListener("change", () => mountDeck("a", deckASelect.value));
    deckBSelect.addEventListener("change", () => mountDeck("b", deckBSelect.value));
    djCrossfader.addEventListener("input", applyCrossfader);
    mountDeck("a", deckASelect.value);
    mountDeck("b", deckBSelect.value);
    applyCrossfader();
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
    if (line) {
      const txt = line.textContent || "";
      line.textContent = "";
      let i = 0;
      const timer = setInterval(() => {
        line.textContent += txt[i] || "";
        i += 1;
        if (i >= txt.length) clearInterval(timer);
      }, 18);
      if (window.anime) {
        window.anime({
          targets: ".decrypt-line",
          opacity: [0.3, 1],
          duration: 1400,
          easing: "easeOutQuad"
        });
      }
    }
  };

  const animateHeaders = () => {
    const headers = [...document.querySelectorAll("h1, h2, h3")];
    if (!headers.length) return false;
    if (!window.anime) return false;
    window.anime({
      targets: headers,
      translateY: [14, 0],
      opacity: [0, 1],
      duration: 900,
      delay: window.anime.stagger(70, { start: 120 }),
      easing: "easeOutExpo"
    });
    return true;
  };

  const waitForAnime = (onReady) => {
    if (typeof onReady !== "function") return;
    if (window.anime) {
      onReady();
      return;
    }
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.anime) {
        clearInterval(timer);
        onReady();
      } else if (attempts >= 30) {
        clearInterval(timer);
      }
    }, 120);
  };

  const moshImage = (img) => {
    if (img.id === "crtMedia") return;
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
        card.className = "card repo-tv";

        const shot = repoImageOverrides[repo.name] || `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
        const override = livePageOverrides[repo.name];
        const homepage = (repo.homepage || "").trim();
        const hasHomepage = homepage.startsWith("http://") || homepage.startsWith("https://");
        const liveGuess = override
          || (hasHomepage ? homepage : "")
          || (repo.name.includes(".aday.net.au") ? `https://${repo.name}` : "")
          || (repo.has_pages ? `https://aday1.github.io/${repo.name}/` : "");
        const primaryHref = liveGuess || repo.html_url;
        const primaryLabel = liveGuess ? "open project page" : "open repo";

        const updatedMs = Date.now() - new Date(repo.updated_at).getTime();
        const days = Math.floor(updatedMs / (1000 * 60 * 60 * 24));
        const activity = days < 14 ? "hot" : days < 60 ? "warm" : "cold";

        const blurb = projectBlurbOverrides[repo.name] || (repo.description || "No description yet").slice(0, 120);
        const lastUpdated = new Date(repo.updated_at).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "short",
          day: "2-digit"
        });
        const createdAt = new Date(repo.created_at).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "short",
          day: "2-digit"
        });
        card.innerHTML = `
          <div class="repo-tv-head">
            <h3>${repo.name}</h3>
            <span class="repo-tv-channel">TV-${String(i + 1).padStart(2, "0")}</span>
          </div>
          <div class="repo-tv-screen">
            <img class="repo-shot mosh-image" src="${shot}" alt="${repo.name} preview">
          </div>
          <p class="repo-meta">${blurb}</p>
          <p class="repo-meta repo-activity repo-activity-${activity}">activity: ${activity} / updated ${days}d ago</p>
          <p class="repo-meta">last commit signal: ${lastUpdated}</p>
          <p class="repo-meta">project date: ${createdAt}</p>
          <div class="repo-tv-links">
            <a href="${primaryHref}" target="_blank" rel="noopener noreferrer">${primaryLabel}</a>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">source</a>
          </div>
        `;
        repoGrid.appendChild(card);
        const image = card.querySelector("img.repo-shot");
        armRepoImageFallback(image, repo.owner.login, repo.name, repo.name);
      }

      document.querySelectorAll("img.mosh-image").forEach((img) => {
        if (img.complete) moshImage(img);
        else img.addEventListener("load", () => moshImage(img), { once: true });
      });
      randomizeFrameGeneration();
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
  setInterval(pulseCrtBurst, 6400);
  animateTextFx();
  waitForAnime(() => animateHeaders());
  randomizeFrameGeneration();
  cycleBackgroundPalette();
  initYoutubeDeck();
  initRandomImageDeck();
  initSoundcloudDeck();
  initGalleryFilters();
  initDjCrossfader();
  hydrateRepoGrid();
  scheduleFrameRandomizer();
  setInterval(cycleBackgroundPalette, 9200);

  document.querySelectorAll("img.mosh-image").forEach((img) => {
    armGenericImageFallback(img);
    if (img.complete) moshImage(img);
    else img.addEventListener("load", () => moshImage(img), { once: true });
  });
})();
