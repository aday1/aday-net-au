(() => {
  const body = document.body;
  const canvas = document.getElementById("crtCanvas");
  const atzCanvas = document.getElementById("atzCanvas");
  const crtMedia = document.getElementById("crtMedia");
  const crtCaption = document.getElementById("crtCaption");
  const screen = document.querySelector(".screen");
  const crtChannelLabel = document.querySelector(".channel");
  const osdMenuHeader = document.querySelector(".osd-menu header");
  const nodeMapCanvas = document.getElementById("nodeMapCanvas");
  const cursor = document.getElementById("retroCursor");
  const menuItems = [...document.querySelectorAll(".osd-menu li")];
  const repoGrid = document.getElementById("repoGrid");
  const pageTransition = document.getElementById("pageTransition");
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
  const deckATypeFilter = document.getElementById("deckATypeFilter");
  const deckBTypeFilter = document.getElementById("deckBTypeFilter");
  const djCrossfader = document.getElementById("djCrossfader");
  const deckALevel = document.getElementById("deckALevel");
  const deckBLevel = document.getElementById("deckBLevel");
  const acidVisualWrap = document.getElementById("acidVisualWrap");
  const acidRelayGif = document.getElementById("acidRelayGif");
  const acidRelayLoop = document.getElementById("acidRelayLoop");
  const wbTrackSelector = document.getElementById("wbTrackSelector");
  const wbOpenTrack = document.getElementById("wbOpenTrack");
  const wbSortSelector = document.getElementById("wbSortSelector");
  const wbYearFilter = document.getElementById("wbYearFilter");
  const wbWeekFilter = document.getElementById("wbWeekFilter");
  const wbPageSelect = document.getElementById("wbPageSelect");
  const wbPagePrev = document.getElementById("wbPagePrev");
  const wbPageNext = document.getElementById("wbPageNext");
  const wbTrackMeta = document.getElementById("wbTrackMeta");
  const galleryFilters = [...document.querySelectorAll(".gallery-filter")];
  const galleryCards = [...document.querySelectorAll(".gallery-card")];
  const ENABLE_RETRO_CURSOR = true;
  const UI_PREF_KEY = "aday-ui-prefs-v1";
  const prefersReducedMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const coarsePointer = !!window.matchMedia?.("(pointer: coarse)")?.matches;
  const smallViewport = window.innerWidth <= 820;
  const performanceMode = prefersReducedMotion || coarsePointer || smallViewport;
  const ultraLiteMode = prefersReducedMotion || window.innerWidth <= 640;
  const MAX_CANVAS_DPR = 1;
  const crtFrameBudgetMs = ultraLiteMode ? 50 : (performanceMode ? 34 : 16);
  const nodeMapFrameBudgetMs = ultraLiteMode ? 70 : (performanceMode ? 52 : 32);
  const canUseRetroCursor = ENABLE_RETRO_CURSOR && !coarsePointer;
  let activeIndex = 0;
  let mediaIndex = 0;
  const sessionEdgeSeed = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  const mediaFeed = [
    {
      src: "https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png",
      title: "error-diffusion / visual patch output",
      menuLabel: "Error Diffusion",
      osdTitle: "Max patch output",
      href: "https://github.com/aday1/error-diffusion",
      fallbacks: ["https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png"]
    },
    {
      src: "https://avatars.githubusercontent.com/u/1834001?v=4",
      title: "aday avatar",
      menuLabel: "GitHub",
      osdTitle: "aday1 account",
      href: "https://github.com/aday1",
      fallbacks: ["https://avatars.githubusercontent.com/u/1834001?v=4"]
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png",
      title: "acid-banger project visual",
      menuLabel: "Acid Banger",
      osdTitle: "Project preview",
      href: "https://github.com/aday1/acid-banger",
      fallbacks: ["https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png"]
    },
    {
      src: "https://raw.githubusercontent.com/aday1/acid-banger/main/acid-banger-visual.gif",
      title: "acid-banger animated preview",
      menuLabel: "Acid Banger",
      osdTitle: "Original visual loop",
      href: "https://aday1.github.io/acid-banger/",
      fallbacks: ["https://raw.githubusercontent.com/aday1/acid-banger/main/preview.png"]
    },
    {
      src: "/assets/repo-cards/macroverse-loop-pingpong.gif",
      title: "macroverse visual relay card",
      menuLabel: "Macroverse",
      osdTitle: "Live visual relay card",
      href: "https://macroverse.aday.net.au",
      fallbacks: [
        "/assets/repo-cards/card-radar-core.jpg",
        "https://raw.githubusercontent.com/aday1/macroverse.aday.net.au/main/preview.png",
        "https://raw.githubusercontent.com/aday1/macroverse.aday.net.au/main/screenshot.png"
      ]
    },
    {
      src: "/assets/repo-cards/artbastard-loop-pingpong.gif",
      title: "artbastard live control card",
      menuLabel: "ArtBastard",
      osdTitle: "Live control card",
      href: "https://artbastard.aday.net.au",
      fallbacks: [
        "/assets/repo-cards/card-dmx-console.jpg",
        "https://raw.githubusercontent.com/aday1/artbastard.aday.net.au/main/preview.png",
        "https://raw.githubusercontent.com/aday1/artbastard.aday.net.au/main/screenshot.png"
      ]
    },
    {
      src: "https://content.pouet.net/logos/neuroxfra.gif",
      title: "pouet scene archive visual",
      menuLabel: "Pouet",
      osdTitle: "Scene archive visual",
      href: "https://m.pouet.net/groups.php?which=12461",
      fallbacks: ["https://content.pouet.net/logos/neuroxfra.gif"]
    },
    {
      src: "/assets/repo-cards/movemusicsaveeditor-loop-pingpong.gif",
      title: "MoveMusicSaveEditor workflow signal",
      menuLabel: "GitHub",
      osdTitle: "MoveMusicSaveEditor",
      href: "https://github.com/aday1/MoveMusicSaveEditor",
      fallbacks: [
        "https://raw.githubusercontent.com/aday1/MoveMusicSaveEditor/main/test.gif",
        "/assets/repo-cards/card-daw-timeline.jpg"
      ]
    },
    {
      src: "/assets/repo-cards/card-forum-map.jpg",
      title: "blog post / Media Deck and Time Log",
      menuLabel: "Blog",
      osdTitle: "Media Deck and Time Log",
      href: "https://blog.aday.net.au/posts/2026-05-14-media-deck-and-timelog.html",
      fallbacks: ["/assets/repo-cards/card-neon-code.jpg"]
    },
    {
      src: "/assets/repo-cards/card-system-tree.jpg",
      title: "blog node / recent ingest log",
      menuLabel: "Blog",
      osdTitle: "Recent ingest log",
      href: "https://blog.aday.net.au",
      fallbacks: ["/assets/repo-cards/card-forum-map.jpg"]
    },
    {
      src: "/assets/repo-cards/card-synth-rack.jpg",
      title: "weeklybeats / 2026 release index",
      menuLabel: "WeeklyBeats",
      osdTitle: "2026 releases",
      href: "https://weeklybeats.com/music/aday?year=2026",
      fallbacks: ["/assets/repo-cards/card-daw-timeline.jpg"]
    },
    {
      src: "/assets/repo-cards/card-daw-timeline.jpg",
      title: "weeklybeats / EpochJam (PixiTracker)",
      menuLabel: "WeeklyBeats",
      osdTitle: "EpochJam",
      href: "https://weeklybeats.com/aday/music/epochjam-pixitracker",
      fallbacks: ["/assets/repo-cards/card-synth-rack.jpg"]
    },
    {
      src: "/assets/repo-cards/card-audio-rack.jpg",
      title: "weeklybeats / Anxious Goth Rabbit",
      menuLabel: "WeeklyBeats",
      osdTitle: "Anxious Rabbit",
      href: "https://weeklybeats.com/aday/music/anxious-goth-rabbit-2",
      fallbacks: ["/assets/repo-cards/card-daw-timeline.jpg"]
    },
    {
      src: "/assets/repo-cards/card-circuit-blue.jpg",
      title: "weeklybeats / Doomsday data",
      menuLabel: "WeeklyBeats",
      osdTitle: "Doomsday Data",
      href: "https://weeklybeats.com/aday/music/doomsday-data",
      fallbacks: ["/assets/repo-cards/card-audio-rack.jpg"]
    },
    {
      src: "/assets/repo-cards/card-synth-rack.jpg",
      title: "weeklybeats / Cubic Waveform",
      menuLabel: "WeeklyBeats",
      osdTitle: "Cubic Waveform",
      href: "https://weeklybeats.com/music/aday",
      fallbacks: ["/assets/repo-cards/card-audio-rack.jpg"]
    },
    {
      src: "/assets/repo-cards/card-daw-timeline.jpg",
      title: "weeklybeats / Late Calibration Test",
      menuLabel: "WeeklyBeats",
      osdTitle: "Late Calibration",
      href: "https://weeklybeats.com/music/aday",
      fallbacks: ["/assets/repo-cards/card-synth-rack.jpg"]
    },
    {
      src: "/assets/repo-cards/card-social-map-crt.jpg",
      title: "mastodon / @aday_net_au",
      menuLabel: "Mastodon",
      osdTitle: "@aday_net_au",
      href: "https://mastodon.social/@aday_net_au",
      fallbacks: ["https://avatars.githubusercontent.com/u/1834001?v=4"]
    },
    {
      src: "/assets/repo-cards/card-circuit-blue.jpg",
      title: "youtube / channel feed",
      menuLabel: "YouTube",
      osdTitle: "@aday1 channel",
      href: "https://www.youtube.com/@aday1",
      fallbacks: ["https://raw.githubusercontent.com/aday1/error-diffusion/master/public/assets/max-patch-1.png"]
    },
    {
      src: "/assets/repo-cards/card-radar-core.jpg",
      title: "twitch / live stream node",
      menuLabel: "Twitch",
      osdTitle: "aday_net_au live",
      href: "https://www.twitch.tv/aday_net_au",
      fallbacks: ["/assets/repo-cards/card-social-map-crt.jpg"]
    },
    {
      src: "/assets/repo-cards/card-audio-rack.jpg",
      title: "soundcloud / profile signal",
      menuLabel: "Soundcloud",
      osdTitle: "adaynetau tracks",
      href: "https://soundcloud.com/adaynetau",
      fallbacks: ["/assets/repo-cards/card-daw-timeline.jpg"]
    },
    {
      src: "/assets/repo-cards/card-neon-code.jpg",
      title: "codepen / sketch feed",
      menuLabel: "CodePen",
      osdTitle: "aday_net_au pens",
      href: "https://codepen.io/aday_net_au/",
      fallbacks: ["/assets/repo-cards/card-forum-map.jpg"]
    },
    {
      src: "/assets/repo-cards/card-security-lock.jpg",
      title: "keys / trust and identity",
      menuLabel: "Keys",
      osdTitle: "public key vault",
      href: "https://keys.aday.net.au",
      fallbacks: ["/assets/repo-cards/card-system-tree.jpg"]
    },
    {
      src: "https://media.demozoo.org/screens/t/dc/3c/d2ca.pl765305.jpg",
      title: "demozoo / orbital syntax frame",
      menuLabel: "Demozoo",
      osdTitle: "Orbital Syntax frame",
      href: "https://demozoo.org/graphics/380235/",
      fallbacks: ["https://media.demozoo.org/screens/t/60/9a/54e1.352183.jpg"]
    },
    {
      src: "https://media.demozoo.org/screens/t/0d/47/2883.187843.jpg",
      title: "demozoo / demobus from the sky",
      menuLabel: "Demozoo",
      osdTitle: "Demobus from the Sky",
      href: "https://demozoo.org/graphics/204829/",
      fallbacks: ["https://media.demozoo.org/screens/t/d7/36/0130.173990.png"]
    }
  ];
  const gifPingPongSourceMap = {
    "/assets/repo-cards/macroverse-loop.gif": "/assets/repo-cards/macroverse-loop-pingpong.gif",
    "/assets/repo-cards/artbastard-loop.gif": "/assets/repo-cards/artbastard-loop-pingpong.gif",
    "https://raw.githubusercontent.com/aday1/MoveMusicSaveEditor/main/test.gif": "/assets/repo-cards/movemusicsaveeditor-loop-pingpong.gif"
  };
  const normalizeKnownGifSource = (value) => {
    const src = String(value || "");
    return gifPingPongSourceMap[src] || src;
  };
  const isGifLikeSource = (value) => /\.gif(?:[?#].*)?$/i.test(String(value || ""));
  const classifySignalImage = (img, sourceValue) => {
    if (!(img instanceof HTMLImageElement)) return;
    const probe = normalizeKnownGifSource(sourceValue || img.currentSrc || img.src || "");
    const animated = isGifLikeSource(probe);
    img.classList.toggle("signal-animated", animated);
    img.classList.toggle("signal-static", !animated);
  };
  const getMenuLabel = (item) => {
    if (item?.menuLabel) return item.menuLabel;
    return "Signal";
  };
  const formatOsdEntry = (item) => {
    const label = (item?.menuLabel || "Signal").toUpperCase();
    const title = (item?.osdTitle || item?.title || "preview").replace(/^.*\/\s*/, "");
    return `${label} // ${title}`;
  };
  const getOsdItemHref = (item) => {
    return item?.href || "";
  };
  const renderOsdPreviewList = (currentItem) => {
    if (!menuItems.length || !mediaFeed.length) return;
    const visibleCount = menuItems.length;
    const activeSlot = Math.min(2, visibleCount - 1);
    for (let slot = 0; slot < visibleCount; slot += 1) {
      const feedIndex = (mediaIndex - activeSlot + slot + mediaFeed.length) % mediaFeed.length;
      const item = mediaFeed[feedIndex];
      const row = menuItems[slot];
      const href = getOsdItemHref(item);
      let link = row.querySelector("a");
      if (!link) {
        link = document.createElement("a");
        row.textContent = "";
        row.appendChild(link);
      }
      let textSpan = link.querySelector(".osd-link-text");
      if (!textSpan) {
        textSpan = document.createElement("span");
        textSpan.className = "osd-link-text";
        link.textContent = "";
        link.appendChild(textSpan);
      }
      const rowText = formatOsdEntry(item);
      textSpan.textContent = rowText;
      link.classList.remove("is-scrolling");
      link.style.removeProperty("--osd-scroll-distance");
      link.style.removeProperty("--osd-scroll-duration");
      if (href) {
        link.setAttribute("href", href);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      } else {
        link.removeAttribute("href");
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
      row.classList.toggle("active", slot === activeSlot);
      if (slot === activeSlot && uiPrefs.osdMarquee) {
        requestAnimationFrame(() => {
          const overflowPx = textSpan.scrollWidth - link.clientWidth;
          if (overflowPx > 6) {
            const distance = Math.ceil(overflowPx + 24);
            const duration = Math.min(16, Math.max(7, distance / 20));
            link.style.setProperty("--osd-scroll-distance", `${distance}px`);
            link.style.setProperty("--osd-scroll-duration", `${duration}s`);
            link.classList.add("is-scrolling");
          }
        });
      }
    }
    activeIndex = activeSlot;
    const menuText = (currentItem?.menuLabel || getMenuLabel(currentItem)).trim();
    if (crtChannelLabel) crtChannelLabel.textContent = `CH-${String(mediaIndex + 1).padStart(2, "0")} ${menuText.toUpperCase()}`;
    if (osdMenuHeader) osdMenuHeader.textContent = `Surf // ${menuText}`;
  };
  const syncCrtMenuState = (item) => {
    if (!menuItems.length) return;
    renderOsdPreviewList(item);
    const next = menuItems[activeIndex];
    if (window.anime && next) {
      window.anime({
        targets: next,
        translateX: [-8, 0],
        opacity: [0.45, 1],
        duration: 300,
        easing: "easeOutExpo"
      });
    }
  };
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
      img.src = normalizeKnownGifSource(candidates[idx]);
      classifySignalImage(img, img.src);
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
    img.src = normalizeKnownGifSource(img.getAttribute("src") || img.src);
    classifySignalImage(img, img.src);
    const explicit = (img.dataset.fallbacks || "")
      .split("|")
      .map((item) => item.trim())
      .map((item) => normalizeKnownGifSource(item))
      .filter(Boolean);
    const repoData = parseRepoData(img.dataset.repo || "");
    if (repoData) {
      armRepoImageFallback(img, repoData.owner, repoData.repo, img.alt || repoData.repo);
      return;
    }
    const label = img.alt || "image";
    const candidates = [...explicit, svgPreviewFallback(label)];
    let idx = 0;
    img.addEventListener("error", () => {
      if (idx >= candidates.length) return;
      img.src = normalizeKnownGifSource(candidates[idx]);
      classifySignalImage(img, img.src);
      idx += 1;
    });
    img.dataset.fallbackReady = "1";
  };

  const hashString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const escapeXml = (value) => String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");

  const wrapWords = (text, maxChars = 30, maxLines = 2) => {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const next = current ? `${current} ${words[i]}` : words[i];
      if (next.length > maxChars) {
        if (current) lines.push(current);
        current = words[i];
      } else {
        current = next;
      }
      if (lines.length >= maxLines) break;
    }
    if (lines.length < maxLines && current) lines.push(current);
    return lines.slice(0, maxLines);
  };

  const buildRepoPoster = (repo, seed) => {
    const palettes = [
      { bgA: "#041108", bgB: "#0a2618", line: "#7dffb1", ink: "#d2ffe6", accent: "#46c77b", glow: "#89ffba" },
      { bgA: "#080a17", bgB: "#11253d", line: "#8fd8ff", ink: "#d5edff", accent: "#4a8fd9", glow: "#9adfff" },
      { bgA: "#120510", bgB: "#2a1130", line: "#ff9ceb", ink: "#ffe1fa", accent: "#d86ad6", glow: "#ffabf1" },
      { bgA: "#1a1204", bgB: "#3b2608", line: "#ffd57e", ink: "#fff0ca", accent: "#d2a24f", glow: "#ffe198" },
      { bgA: "#071313", bgB: "#0f2b2b", line: "#89ffe6", ink: "#d8fff6", accent: "#48c7ad", glow: "#9cfff0" },
      { bgA: "#0c0f05", bgB: "#22330d", line: "#c8ff85", ink: "#efffd4", accent: "#92d84a", glow: "#d9ff9b" }
    ];
    const palette = palettes[seed % palettes.length];
    let state = (seed % 2147483647) || 1;
    const rnd = () => {
      state = (state * 48271) % 2147483647;
      return state / 2147483647;
    };
    const rawDesc = projectBlurbOverrides[repo.name] || repo.description || "Creative software signal relay.";
    const haystack = `${repo.name} ${rawDesc} ${(repo.language || "")}`.toLowerCase();
    const theme = haystack.includes("audio") || haystack.includes("music") || haystack.includes("midi")
      ? "audio"
      : haystack.includes("shader") || haystack.includes("visual") || haystack.includes("video")
        ? "visual"
        : haystack.includes("forum") || haystack.includes("blog") || haystack.includes("archive")
          ? "archive"
          : haystack.includes("key") || haystack.includes("security") || haystack.includes("auth")
            ? "security"
            : "code";
    const repoName = escapeXml(repo.name || "repo");
    const ownerName = escapeXml(repo.owner?.login || "aday1");
    const descLines = wrapWords(rawDesc, 36, 2).map((line, idx) => (
      `<text x="56" y="${470 + idx * 34}" fill="${palette.ink}" opacity="0.9" font-family="Consolas, monospace" font-size="25">${escapeXml(line)}</text>`
    )).join("");
    const language = escapeXml(repo.language || "mixed");
    const tagLine = escapeXml([language, `updated:${new Date(repo.updated_at).toLocaleDateString("en-AU")}`, `theme:${theme}`].join("  /  "));

    const stars = Array.from({ length: 16 }, () => {
      const x = 70 + rnd() * 1060;
      const y = 74 + rnd() * 262;
      const r = 0.8 + rnd() * 2.6;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${palette.glow}" opacity="${(0.18 + rnd() * 0.6).toFixed(3)}" />`;
    }).join("");
    const wave = Array.from({ length: 28 }, (_, i) => {
      const x = 36 + i * 42;
      const y = 286 + Math.sin(i * 0.55 + rnd() * 3) * (18 + rnd() * 20);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    const bars = Array.from({ length: 26 }, (_, i) => {
      const h = 8 + rnd() * 96;
      const x = 44 + i * 42;
      const y = 340 - h;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="24" height="${h.toFixed(1)}" fill="${palette.accent}" opacity="${(0.24 + rnd() * 0.5).toFixed(3)}" />`;
    }).join("");
    const circuit = Array.from({ length: 10 }, (_, i) => {
      const y = 98 + i * 26;
      const x2 = 840 + (i % 4) * 84;
      return `<path d="M30 ${y} H${x2} v${(i % 2 ? 16 : -16)} H1150" stroke="${palette.accent}" stroke-width="2" fill="none" opacity="0.52" />`;
    }).join("");
    const archiveGrid = Array.from({ length: 36 }, (_, i) => {
      const x = 36 + (i % 12) * 94;
      const y = 84 + Math.floor(i / 12) * 72;
      const w = 34 + (i % 3) * 10;
      return `<rect x="${x}" y="${y}" width="${w}" height="18" fill="${palette.glow}" opacity="${(0.1 + (i % 6) * 0.07).toFixed(2)}" />`;
    }).join("");
    const lockShape = `<path d="M985 218 h122 v112 h-122 z M1018 218 v-40 a28 28 0 0 1 56 0 v40" fill="none" stroke="${palette.line}" stroke-width="4" opacity="0.72" />`;

    const motif = theme === "audio"
      ? `${bars}<polyline points="${wave}" fill="none" stroke="${palette.line}" stroke-width="3" opacity="0.78" />`
      : theme === "visual"
        ? `${stars}<polyline points="${wave}" fill="none" stroke="${palette.glow}" stroke-width="2" opacity="0.72" />`
        : theme === "archive"
          ? archiveGrid
          : theme === "security"
            ? `${circuit}${lockShape}`
            : `${circuit}${stars}`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
      <defs>
        <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.bgA}" />
          <stop offset="100%" stop-color="${palette.bgB}" />
        </linearGradient>
        <pattern id="scan-${seed}" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="2" fill="rgba(255,255,255,0.03)" />
          <rect y="2" width="4" height="2" fill="rgba(0,0,0,0.07)" />
        </pattern>
      </defs>
      <rect width="1200" height="700" fill="url(#bg-${seed})" />
      <rect x="20" y="20" width="1160" height="660" fill="none" stroke="${palette.line}" stroke-width="3" />
      <rect x="32" y="32" width="1136" height="636" fill="none" stroke="${palette.accent}" stroke-width="1.5" opacity="0.7" />
      ${motif}
      <rect x="38" y="38" width="1124" height="624" fill="url(#scan-${seed})" opacity="0.34" />
      <text x="56" y="126" fill="${palette.glow}" font-family="Consolas, monospace" font-size="30" opacity="0.92">${ownerName}</text>
      <text x="56" y="188" fill="${palette.ink}" font-family="Consolas, monospace" font-size="62" font-weight="700">${repoName}</text>
      <text x="56" y="244" fill="${palette.line}" font-family="Consolas, monospace" font-size="22">${tagLine}</text>
      <text x="56" y="414" fill="${palette.accent}" font-family="Consolas, monospace" font-size="20" opacity="0.84">imagine-signal: generated per-repo poster frame</text>
      ${descLines}
      <circle cx="1088" cy="96" r="34" fill="none" stroke="${palette.line}" stroke-width="2.5" opacity="0.78" />
      <circle cx="1088" cy="96" r="18" fill="${palette.glow}" opacity="0.24" />
      <line x1="1050" y1="96" x2="1126" y2="96" stroke="${palette.line}" stroke-width="2" opacity="0.8" />
      <line x1="1088" y1="58" x2="1088" y2="134" stroke="${palette.line}" stroke-width="2" opacity="0.8" />
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };


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

  let djDeckSources = [
    // Stable uploads playlists (avoid deprecated listType=user_uploads/search embeds).
    // Aday: UCIAFCgAIIABAjGuoBogfmAQ -> uploads playlist UUIAFCgAIIABAjGuoBogfmAQ
    // Clan Analogue: UC7t6b5NpEJGq71jPu8DqBVW -> uploads playlist UU7t6b5NpEJGq71jPu8DqBVW
    // Aisjam: UC1_w2-bcOXGXzxS79c2qnqA -> uploads playlist UU1_w2-bcOXGXzxS79c2qnqA
    {
      id: "aday-yt-uploads",
      label: "Aday YouTube uploads",
      type: "music",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aday-yt-legacy",
      label: "Aday YouTube archive uploads",
      type: "music",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aday-yt-live",
      label: "Aday YouTube live visual stream",
      type: "live",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aday-yt-weeklybeats",
      label: "Aday YouTube WeeklyBeats clips",
      type: "weeklybeats",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "aisjam-yt",
      label: "Aisjam YouTube uploads",
      type: "music",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UU1_w2-bcOXGXzxS79c2qnqA&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "clan-yt",
      label: "Clan Analogue YouTube uploads",
      type: "live",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UU7t6b5NpEJGq71jPu8DqBVW&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "hungee-funk-yt",
      label: "Aday + friends YouTube mix",
      type: "friends",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "friend-breakcore-yt",
      label: "Breakcore + scene YouTube mix",
      type: "friends",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UU7t6b5NpEJGq71jPu8DqBVW&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "vimeo-onlinedoof",
      label: "Vimeo / Onlinedoof archive clip",
      type: "archive",
      kind: "vimeo",
      embed: "https://player.vimeo.com/video/35409288?autoplay=0&title=0&byline=0&portrait=0"
    },
    {
      id: "vimeo-binaural",
      label: "Vimeo / Binaural Percolator",
      type: "archive",
      kind: "vimeo",
      embed: "https://player.vimeo.com/video/84038041?autoplay=0&title=0&byline=0&portrait=0"
    },
    {
      id: "aday-sc-profile",
      label: "Aday SoundCloud profile",
      type: "music",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "aday-sc-tracks",
      label: "Aday SoundCloud tracks",
      type: "music",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/adaynetau/tracks&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "clan-sc",
      label: "Clan Analogue SoundCloud",
      type: "music",
      kind: "soundcloud",
      embed: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/clan-analogue&color=%2300b4ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    },
    {
      id: "yt-livecoding",
      label: "YouTube / Live coding visual picks",
      type: "coding",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UUIAFCgAIIABAjGuoBogfmAQ&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "yt-drone-flight",
      label: "YouTube / Drone flight reels (curated)",
      type: "drone",
      kind: "youtube",
      embed: "https://www.youtube-nocookie.com/embed/videoseries?list=UU1_w2-bcOXGXzxS79c2qnqA&enablejsapi=1&playsinline=1&rel=0"
    },
    {
      id: "weeklybeats-profile",
      label: "WeeklyBeats / aday profile",
      type: "weeklybeats",
      kind: "web",
      embed: "https://weeklybeats.com/aday"
    },
    {
      id: "weeklybeats-library",
      label: "WeeklyBeats / aday track library",
      type: "weeklybeats",
      kind: "web",
      embed: "https://weeklybeats.com/music/aday"
    }
  ];

  const sanitizeDjSourceId = (value) => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const appendDjSources = (extraSources = []) => {
    if (!Array.isArray(extraSources) || !extraSources.length) return;
    const existingIds = new Set(djDeckSources.map((source) => source.id));
    extraSources.forEach((source) => {
      if (!source?.id || existingIds.has(source.id)) return;
      existingIds.add(source.id);
      djDeckSources.push(source);
    });
  };

  const enrichDjDeckSourcesWithWeeklyBeats = async () => {
    try {
      const response = await fetch("./data/weeklybeats_tracks.json", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      const tracks = Array.isArray(payload?.tracks) ? payload.tracks : [];
      const extraSources = tracks.slice(0, 40).map((track, index) => {
        const year = Number.isFinite(track?.year) ? track.year : "----";
        const week = Number.isFinite(track?.week) ? `W${track.week}` : "W?";
        const title = String(track?.title || `track-${index + 1}`).trim();
        const slug = sanitizeDjSourceId(track?.slug || `${year}-${week}-${title}`);
        return {
          id: `wb-track-${slug || index + 1}`,
          label: `WeeklyBeats / ${year} ${week} / ${title}`,
          type: "weeklybeats",
          kind: "web",
          embed: String(track?.url || "https://weeklybeats.com/music/aday")
        };
      });
      appendDjSources(extraSources);
    } catch {
      // ignore weeklybeats fetch failures for deck source loading
    }
  };

  const inferDjSourceType = (source) => {
    if (source.type) return source.type;
    const haystack = `${source.label || ""} ${source.id || ""} ${source.embed || ""}`.toLowerCase();
    if (haystack.includes("weeklybeats")) return "weeklybeats";
    if (haystack.includes("friend")) return "friends";
    if (haystack.includes("drone") || haystack.includes("fpv") || haystack.includes("flight")) return "drone";
    if (haystack.includes("live coding") || haystack.includes("shader") || haystack.includes("coding")) return "coding";
    if (haystack.includes("archive") || haystack.includes("vimeo")) return "archive";
    if (haystack.includes("live")) return "live";
    return "music";
  };

  const djTypeLabel = (type) => {
    if (type === "all") return "All";
    if (!type) return "Other";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getDjTypes = () => {
    const types = [...new Set(djDeckSources.map((source) => inferDjSourceType(source)))];
    return ["all", ...types];
  };

  const buildDeckOptionHtml = (typeFilter = "all") => {
    const activeType = typeFilter || "all";
    return djDeckSources
      .filter((source) => activeType === "all" || inferDjSourceType(source) === activeType)
      .map((source) => `<option value="${source.id}">${source.label}</option>`)
      .join("");
  };

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
    MoveMusicSaveEditor: "/assets/repo-cards/movemusicsaveeditor-loop-pingpong.gif",
    "macroverse.aday.net.au": "/assets/repo-cards/macroverse-loop-pingpong.gif",
    "artbastard.aday.net.au": "/assets/repo-cards/artbastard-loop-pingpong.gif",
    "error-diffusion": "/assets/repo-cards/card-security-lock.jpg",
    "acid-banger": "https://raw.githubusercontent.com/aday1/acid-banger/main/acid-banger-visual.gif",
    "blog.aday.net.au": "/assets/repo-cards/card-forum-map.jpg",
    "aday-net-au": "/assets/repo-cards/card-synth-rack.jpg",
    "keys-aday-net-au": "/assets/repo-cards/card-security-lock.jpg",
    "breakcore-forums-placeholder": "/assets/repo-cards/card-system-tree.jpg",
    "breakcore-com-au": "/assets/repo-cards/card-social-map-crt.jpg",
    OpenSoundLab: "/assets/repo-cards/card-audio-rack.jpg",
    "bitwig-mcp-server": "/assets/repo-cards/card-daw-timeline.jpg",
    ZealPalace: "/assets/repo-cards/card-neon-code.jpg"
  };

  const localRepoCardPool = [
    "/assets/repo-cards/card-audio-rack.jpg",
    "/assets/repo-cards/card-circuit-blue.jpg",
    "/assets/repo-cards/card-daw-timeline.jpg",
    "/assets/repo-cards/card-dmx-console.jpg",
    "/assets/repo-cards/card-forum-map.jpg",
    "/assets/repo-cards/card-radar-core.jpg",
    "/assets/repo-cards/card-security-lock.jpg",
    "/assets/repo-cards/card-social-map-crt.jpg",
    "/assets/repo-cards/card-synth-rack.jpg",
    "/assets/repo-cards/card-system-tree.jpg"
  ];

  const pickLocalRepoCard = (repoName, seed) => {
    const lower = (repoName || "").toLowerCase();
    if (lower.includes("key") || lower.includes("auth") || lower.includes("secure")) return "/assets/repo-cards/card-security-lock.jpg";
    if (lower.includes("macroverse")) return "/assets/repo-cards/macroverse-loop-pingpong.gif";
    if (lower.includes("art") || lower.includes("dmx") || lower.includes("light")) return "/assets/repo-cards/artbastard-loop-pingpong.gif";
    if (lower.includes("sound") || lower.includes("audio") || lower.includes("music") || lower.includes("daw")) return "/assets/repo-cards/card-audio-rack.jpg";
    if (lower.includes("blog") || lower.includes("forum")) return "/assets/repo-cards/card-forum-map.jpg";
    if (lower.includes("breakcore")) return "/assets/repo-cards/card-social-map-crt.jpg";
    if (lower.includes("acid")) return "https://raw.githubusercontent.com/aday1/acid-banger/main/acid-banger-visual.gif";
    if (lower.includes("move") && lower.includes("music")) return "/assets/repo-cards/movemusicsaveeditor-loop-pingpong.gif";
    if (!localRepoCardPool.length) return "";
    return localRepoCardPool[seed % localRepoCardPool.length];
  };

  const wrapMediaWithCrtEffect = (root = document) => {
    const mediaNodes = root.querySelectorAll("img.repo-shot, img.asset-image, img.project-loop, video");
    mediaNodes.forEach((node) => {
      if (node instanceof HTMLImageElement) classifySignalImage(node, node.getAttribute("src") || node.src);
      const parent = node.parentElement;
      if (!parent || parent.classList.contains("crt-media-wrap")) return;
      const wrap = document.createElement("span");
      const inlineMedia = node.classList.contains("service-icon")
        || node.classList.contains("headliner-badge")
        || node.classList.contains("masthead-avatar");
      wrap.className = inlineMedia ? "crt-media-wrap crt-media-wrap-inline" : "crt-media-wrap";
      parent.insertBefore(wrap, node);
      wrap.appendChild(node);
    });
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

  const bootDone = () => body.classList.remove("boot-seq");
  const hideTransition = () => pageTransition?.classList.add("hidden");
  /* Overlap shell reveal with the tail of the CRT wash so load does not feel stuck behind a dead-air overlay */
  const CUTON_BOOT_MS = 520;
  const CUTON_HIDE_MS = 960;
  let cutOnScheduled = false;
  const runCutOnSequence = (forceImmediate = false) => {
    if (forceImmediate) {
      bootDone();
      hideTransition();
      cutOnScheduled = true;
      return;
    }
    if (cutOnScheduled) return;
    cutOnScheduled = true;
    setTimeout(bootDone, CUTON_BOOT_MS);
    setTimeout(hideTransition, CUTON_HIDE_MS);
  };
  const loadUiPrefs = () => {
    const defaults = {
      retroCursor: canUseRetroCursor,
      crtStatic: true,
      osdMenu: true,
      scanlines: true,
      animations: true,
      bgShader: true,
      osdMarquee: true
    };
    try {
      const raw = localStorage.getItem(UI_PREF_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        retroCursor: canUseRetroCursor && parsed.retroCursor !== false,
        crtStatic: parsed.crtStatic !== false,
        osdMenu: parsed.osdMenu !== false,
        scanlines: parsed.scanlines !== false,
        animations: parsed.animations !== false,
        bgShader: parsed.bgShader !== false,
        osdMarquee: parsed.osdMarquee !== false
      };
    } catch {
      return defaults;
    }
  };
  const uiPrefs = loadUiPrefs();
  const saveUiPrefs = () => {
    try {
      localStorage.setItem(UI_PREF_KEY, JSON.stringify(uiPrefs));
    } catch {
      // ignore storage errors
    }
  };
  const applyUiPrefs = () => {
    body.classList.toggle("retro-cursor-on", canUseRetroCursor && uiPrefs.retroCursor);
    body.classList.toggle("hide-crt-static", !uiPrefs.crtStatic);
    body.classList.toggle("hide-osd-menu", !uiPrefs.osdMenu);
    body.classList.toggle("scanlines-off", !uiPrefs.scanlines);
    body.classList.toggle("animations-off", !uiPrefs.animations);
    body.classList.toggle("hide-atz-bg", !uiPrefs.bgShader);
    body.classList.toggle("disable-osd-marquee", !uiPrefs.osdMarquee);
    if (cursor) cursor.style.display = "none";
  };
  const initUiToggleMenu = () => {
    const menu = document.createElement("div");
    menu.className = "ui-toggle-menu";
    menu.innerHTML = [
      "<button type=\"button\" data-pref=\"retroCursor\">Toggle retro cursor</button>",
      "<button type=\"button\" data-pref=\"scanlines\">Toggle scanlines</button>",
      "<button type=\"button\" data-pref=\"animations\">Toggle animations</button>",
      "<button type=\"button\" data-pref=\"bgShader\">Toggle shader background</button>",
      "<button type=\"button\" data-pref=\"osdMarquee\">Toggle OSD marquee</button>",
      "<button type=\"button\" data-pref=\"crtStatic\">Toggle CRT static overlay</button>",
      "<button type=\"button\" data-pref=\"osdMenu\">Toggle TV OSD menu</button>"
    ].join("");
    const updateMenuState = () => {
      menu.querySelectorAll("button[data-pref]").forEach((btn) => {
        const key = btn.getAttribute("data-pref");
        const active = !!uiPrefs[key];
        btn.classList.toggle("is-on", active);
        btn.textContent = `${active ? "[on] " : "[off] "}${btn.textContent.replace(/^\[(?:on|off)\]\s+/i, "")}`;
      });
    };
    const closeMenu = () => {
      menu.classList.remove("is-open");
    };
    document.body.appendChild(menu);
    updateMenuState();

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      updateMenuState();
      const menuW = 240;
      const menuH = (menu.querySelectorAll("button[data-pref]").length * 36) + 16;
      const x = Math.min(event.clientX, window.innerWidth - menuW - 8);
      const y = Math.min(event.clientY, window.innerHeight - menuH - 8);
      menu.style.left = `${Math.max(8, x)}px`;
      menu.style.top = `${Math.max(8, y)}px`;
      menu.classList.add("is-open");
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!menu.contains(target)) {
        closeMenu();
        return;
      }
      const button = target.closest("button[data-pref]");
      if (!(button instanceof HTMLButtonElement)) return;
      const pref = button.getAttribute("data-pref");
      if (!pref || !(pref in uiPrefs)) return;
      uiPrefs[pref] = !uiPrefs[pref];
      if (pref === "retroCursor" && !canUseRetroCursor) uiPrefs[pref] = false;
      applyUiPrefs();
      saveUiPrefs();
      updateMenuState();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", closeMenu);
  };
  document.addEventListener("DOMContentLoaded", () => {
    runCutOnSequence();
  });
  window.addEventListener("load", () => {
    runCutOnSequence();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) runCutOnSequence(true);
  });
  applyUiPrefs();
  initUiToggleMenu();

  let crtWidth = 0;
  let crtHeight = 0;
  let nodeMapWidth = 0;
  let nodeMapHeight = 0;

  const fit = () => {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(rect.width * ratio));
    const nextHeight = Math.max(1, Math.floor(rect.height * ratio));
    if (nextWidth === crtWidth && nextHeight === crtHeight) return;
    crtWidth = nextWidth;
    crtHeight = nextHeight;
    canvas.width = crtWidth;
    canvas.height = crtHeight;
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

  let lastCrtFrameTime = 0;
  const render = (t) => {
    if (!canvas) return;
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }
    if (t - lastCrtFrameTime < crtFrameBudgetMs) {
      requestAnimationFrame(render);
      return;
    }
    lastCrtFrameTime = t;
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
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
      ctx2d.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawFallback(ctx2d, t);
    }

    requestAnimationFrame(render);
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
    const particles = Array.from({ length: 22 }, (_, i) => ({
      seed: i * 0.71 + 1,
      speed: 0.11 + Math.random() * 0.24
    }));
    let isVisible = true;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(nodeMapCanvas);
    }
    let lastFrameTime = 0;

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
      if (document.hidden || !isVisible) {
        requestAnimationFrame(renderGraph);
        return;
      }
      if (time - lastFrameTime < nodeMapFrameBudgetMs) {
        requestAnimationFrame(renderGraph);
        return;
      }
      lastFrameTime = time;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
      const rect = nodeMapCanvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(rect.width * ratio));
      const nextHeight = Math.max(1, Math.floor(rect.height * ratio));
      if (nextWidth !== nodeMapWidth || nextHeight !== nodeMapHeight) {
        nodeMapWidth = nextWidth;
        nodeMapHeight = nextHeight;
        nodeMapCanvas.width = nodeMapWidth;
        nodeMapCanvas.height = nodeMapHeight;
      }
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

      particles.forEach((particle) => {
        const t2 = t * particle.speed + particle.seed;
        const px = (0.5 + 0.45 * Math.sin(t2 * 1.3)) * w;
        const py = (0.5 + 0.45 * Math.cos(t2 * 0.9)) * h;
        const size = 1 + 1.6 * (0.5 + 0.5 * Math.sin(t2 * 2.6));
        ctx.fillStyle = "rgba(150, 255, 190, 0.42)";
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      });

      map.forEach((n) => {
        const hovered = hoverNodeId === n.id;
        ctx.fillStyle = n.c;
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r + (hovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();
        const ringRadius = n.r + 8 + (2.4 * (0.5 + 0.5 * Math.sin(t * 2 + n.r)));
        ctx.strokeStyle = "rgba(145, 255, 173, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
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

  const initAcidVisualCrossfade = () => {
    if (!acidVisualWrap || !acidRelayGif || !acidRelayLoop) return;
    let isVisible = true;
    let showingVideo = false;
    const crossfadeMs = performanceMode ? 14000 : 10000;

    const applyState = () => {
      acidRelayGif.classList.toggle("is-active", !showingVideo);
      acidRelayLoop.classList.toggle("is-active", showingVideo);
      if (!showingVideo || document.hidden || !isVisible) {
        acidRelayLoop.pause();
        return;
      }
      acidRelayLoop.play().catch(() => {});
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (!isVisible) acidRelayLoop.pause();
          else applyState();
        });
      }, { threshold: 0.05 });
      observer.observe(acidVisualWrap);
    }

    acidRelayLoop.addEventListener("error", () => {
      showingVideo = false;
      applyState();
    });
    applyState();

    setInterval(() => {
      if (document.hidden || !isVisible) return;
      showingVideo = !showingVideo;
      applyState();
    }, crossfadeMs);
  };

  const cycleMenu = () => {
    syncCrtMenuState(mediaFeed[mediaIndex]);
  };

  const cycleCrtMedia = () => {
    if (!crtMedia) return;
    mediaIndex = (mediaIndex + 1) % mediaFeed.length;
    const item = mediaFeed[mediaIndex];
    const menuLabel = getMenuLabel(item);
    const queue = [item.src, ...(item.fallbacks || []), svgPreviewFallback(item.title)]
      .map((candidate) => normalizeKnownGifSource(candidate));
    let idx = 0;
    const applyCandidate = () => {
      if (idx >= queue.length) return;
      crtMedia.src = queue[idx];
      classifySignalImage(crtMedia, queue[idx]);
      idx += 1;
    };
    crtMedia.onerror = () => applyCandidate();
    applyCandidate();
    crtCaption.textContent = `${menuLabel.toLowerCase()} // ${item.title}`;
    syncCrtMenuState(item);
    if (screen) {
      screen.classList.add("crt-switching");
      setTimeout(() => screen.classList.remove("crt-switching"), 700);
    }
    if (window.anime) {
      window.anime({
        targets: crtMedia,
        opacity: [0.12, 0.86],
        scale: [1.02, 1],
        duration: 1050,
        easing: "easeOutCubic"
      });
      window.anime({
        targets: crtCaption,
        translateY: [12, 0],
        opacity: [0.15, 1],
        duration: 760,
        easing: "easeOutExpo"
      });
    }
  };

  const pulseCrtBurst = () => {
    if (!screen) return;
    screen.classList.add("crt-burst");
    setTimeout(() => screen.classList.remove("crt-burst"), 320);
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
      deck.status.textContent = `${deckKey === "a" ? "deck a" : "deck b"}: ${source.label}`;
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

  const initWeeklyBeatsNode = async () => {
    if (!wbTrackSelector || !wbOpenTrack || !wbSortSelector || !wbYearFilter || !wbWeekFilter || !wbPageSelect || !wbPagePrev || !wbPageNext || !wbTrackMeta) return;
    let tracks = [];
    let filtered = [];
    let page = 1;
    const pageSize = 10;

    const sortTracks = (rows) => {
      const mode = wbSortSelector.value || "year-desc";
      const list = [...rows];
      list.sort((a, b) => {
        if (mode === "year-asc") return (a.year - b.year) || ((a.week || 99) - (b.week || 99));
        if (mode === "week-asc") return ((a.week || 99) - (b.week || 99)) || (b.year - a.year);
        if (mode === "week-desc") return ((b.week || 0) - (a.week || 0)) || (b.year - a.year);
        if (mode === "title-asc") return String(a.title || "").localeCompare(String(b.title || ""));
        return (b.year - a.year) || ((a.week || 99) - (b.week || 99));
      });
      return list;
    };

    const renderTrackOptions = () => {
      const year = wbYearFilter.value || "all";
      const week = wbWeekFilter.value || "all";
      filtered = sortTracks(tracks.filter((item) => {
        const yearPass = year === "all" || String(item.year) === year;
        const weekPass = week === "all" || String(item.week || "") === week;
        return yearPass && weekPass;
      }));
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.max(1, Math.min(page, pages));

      wbPageSelect.innerHTML = "";
      for (let i = 1; i <= pages; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = `page ${i} / ${pages}`;
        if (i === page) opt.selected = true;
        wbPageSelect.appendChild(opt);
      }

      const start = (page - 1) * pageSize;
      const pageItems = filtered.slice(start, start + pageSize);
      wbTrackSelector.innerHTML = "";
      pageItems.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item.url;
        opt.textContent = `${item.year} / W${item.week || "?"} / ${item.title}`;
        opt.dataset.description = item.description || "";
        wbTrackSelector.appendChild(opt);
      });
      wbPagePrev.disabled = page <= 1;
      wbPageNext.disabled = page >= pages;
      if (!pageItems.length) {
        wbTrackMeta.textContent = "No tracks in this filter selection.";
      } else {
        wbTrackSelector.selectedIndex = 0;
        const desc = pageItems[0].description || "No track description available.";
        wbTrackMeta.textContent = desc;
      }
    };

    try {
      const resp = await fetch("./data/weeklybeats_tracks.json", { cache: "no-store" });
      if (!resp.ok) throw new Error("weeklybeats manifest load failed");
      const payload = await resp.json();
      tracks = Array.isArray(payload.tracks) ? payload.tracks : [];
    } catch {
      tracks = [];
    }

    const years = [...new Set(tracks.map((item) => item.year).filter((v) => Number.isFinite(v)))].sort((a, b) => b - a);
    years.forEach((y) => {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      wbYearFilter.appendChild(opt);
    });
    const weeks = [...new Set(tracks.map((item) => item.week).filter((v) => Number.isFinite(v)))].sort((a, b) => a - b);
    weeks.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = String(w);
      opt.textContent = `week ${w}`;
      wbWeekFilter.appendChild(opt);
    });

    wbSortSelector.addEventListener("change", () => {
      page = 1;
      renderTrackOptions();
    });
    wbYearFilter.addEventListener("change", () => {
      page = 1;
      renderTrackOptions();
    });
    wbWeekFilter.addEventListener("change", () => {
      page = 1;
      renderTrackOptions();
    });
    wbPageSelect.addEventListener("change", () => {
      page = Number(wbPageSelect.value) || 1;
      renderTrackOptions();
    });
    wbPagePrev.addEventListener("click", () => {
      page = Math.max(1, page - 1);
      renderTrackOptions();
    });
    wbPageNext.addEventListener("click", () => {
      page += 1;
      renderTrackOptions();
    });
    wbTrackSelector.addEventListener("change", () => {
      const opt = wbTrackSelector.selectedOptions[0];
      wbTrackMeta.textContent = opt?.dataset.description || "No track description available.";
    });
    wbOpenTrack.addEventListener("click", () => {
      const url = wbTrackSelector.value;
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
    });

    renderTrackOptions();
  };

  const initAtzedentBackdrop = () => {
    if (!atzCanvas || performanceMode || ultraLiteMode) return;
    const gl = atzCanvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
    if (!gl) return;

    const vertexSource = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform vec2 wheel;
#define FC gl_FragCoord.xy
#define R resolution
#define T (25.0 + time)
#define S smoothstep
#define N normalize
#define MN min(R.x, R.y)
#define rnd(p) fract(sin(dot(p, vec2(12.9898, 78.233))) * 345678.0)
#define rot(a) mat2(cos((a) - vec4(0.0, 11.0, 33.0, 0.0)))

float box(vec3 p, vec3 s, float r) {
  p = abs(p) - s + r;
  return length(max(p, 0.0)) + min(0.0, max(max(p.x, p.y), p.z)) - r;
}

float map(vec3 p) {
  float s = sign(p.y);
  p.y = abs(p.y) - 2.5;
  vec2 id = floor(p.xz - s);
  if (mod(id.y, 2.0) == 0.0) {
    p.x -= T * 0.5;
    id.x = floor(p.x - s);
  }
  float f = 1.0 - dot(abs(fract(p * 42.0) - 0.5) - 0.25, vec3(1.0)) * 0.5;
  p.xz = fract(p.xz - s) - 0.5;
  return box(p, vec3(0.1 + 0.3 * rnd(id), 2.0 - 0.6 * rnd(id), 0.2), f * f * 0.0125) - 0.001 * f;
}

vec3 norm(vec3 p) {
  float h = 0.001;
  vec2 k = vec2(-1.0, 1.0);
  return N(
    k.xyy * map(p + k.xyy * h) +
    k.yxy * map(p + k.yxy * h) +
    k.yyx * map(p + k.yyx * h) +
    k.xxx * map(p + k.xxx * h)
  );
}

bool march(inout vec3 p, vec3 rd, out float dd) {
  dd = 0.0;
  for (int i = 0; i < 260; i++) {
    float d = map(p);
    if (abs(d) < 0.001) return true;
    if (dd > 15.0) return false;
    p += rd * d * 0.5;
    dd += d * 0.5;
  }
  return false;
}

float occ(vec3 p, vec3 n, float d) {
  return clamp(map(p + n * d) / d, 0.0, 1.0);
}

vec3 dir(vec2 uv, vec3 p, vec3 t, float z) {
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 f = N(t - p);
  vec3 r = N(cross(up, f));
  vec3 u = N(cross(f, r));
  return mat3(r, u, f) * N(vec3(uv, z));
}

void cam(inout vec3 p) {
  p.xz *= rot(0.2 - move.x / MN + 0.2 * T * 0.01);
}

vec3 render(vec2 uv) {
  vec3 col = vec3(0.0);
  vec3 p = vec3(0.0, -0.3, -23.5 - wheel.y / MN - 100.0 * sin(T * 0.005));
  cam(p);
  vec3 rd = dir(uv, p, vec3(0.0, 5.5, 0.0), 1.2);
  vec3 lp = p;
  lp.z += 0.5;
  float dd = 0.0;
  if (march(p, rd, dd)) {
    vec3 n = norm(p);
    vec3 l = N(lp - p);
    float dif = clamp(dot(l, n), 0.0, 1.0);
    float spe = pow(clamp(dot(N(lp - rd), n), 0.0, 1.0), 21.0);
    float ao = occ(p, n, 0.5) * 0.8 * occ(p, n, 1.0);
    float ld = distance(lp, p);
    float atten = 1.0 / (1.0 + ld * 0.25 + ld * ld * 0.125);
    vec3 mat = vec3(5.8, 2.6, 1.2);
    col += 0.16 + dif * mat * ao * atten * 1.25;
    col += spe * atten * 1.4;
    col += vec3(0.18, 0.07, 0.03) * ao * atten;
  }
  col = mix(vec3(0.0), col, exp(-0.0125 * dd * dd * dd));
  col = tanh(col * 1.18);
  col = pow(col, vec3(0.82));
  col = mix(vec3(0.0), col, min(time * 0.3, 1.0));
  vec2 c = FC / R;
  c *= 1.0 - c.yx;
  float vig = c.x * c.y * 25.0;
  vig = pow(vig, 0.5);
  col *= vig;
  return col;
}

void main() {
  vec2 uv = (FC - 0.5 * R) / MN;
  vec3 col = render(uv);
  O = vec4(col, 1.0);
}`;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "time");
    const resLoc = gl.getUniformLocation(program, "resolution");
    const moveLoc = gl.getUniformLocation(program, "move");
    const wheelLoc = gl.getUniformLocation(program, "wheel");

    let autoMoveX = 0;
    let autoWheelY = 0;
    let raf = 0;
    let last = 0;
    const fpsStep = 1000 / 20;

    const resizeBackdrop = () => {
      const scale = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
      const width = Math.max(1, Math.floor(window.innerWidth * scale));
      const height = Math.max(1, Math.floor(window.innerHeight * scale));
      atzCanvas.width = width;
      atzCanvas.height = height;
      atzCanvas.style.width = `${window.innerWidth}px`;
      atzCanvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, width, height);
    };
    resizeBackdrop();
    window.addEventListener("resize", resizeBackdrop);

    body.classList.add("atz-on");

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (now - last < fpsStep) return;
      last = now;
      const axis = Math.min(atzCanvas.width, atzCanvas.height);
      autoMoveX = Math.sin(now * 0.00023) * axis * 0.18;
      autoWheelY = (Math.sin(now * 0.00017) + Math.sin(now * 0.00007) * 0.5) * 90.0;
      gl.useProgram(program);
      gl.uniform1f(timeLoc, now * 0.001);
      gl.uniform2f(resLoc, atzCanvas.width, atzCanvas.height);
      gl.uniform2f(moveLoc, autoMoveX, 0);
      gl.uniform2f(wheelLoc, 0, autoWheelY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    raf = requestAnimationFrame(draw);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(draw);
    });
  };

  const initDjCrossfader = async () => {
    if (!deckASelect || !deckBSelect || !deckALoad || !deckBLoad || !djCrossfader) return;
    await enrichDjDeckSourcesWithWeeklyBeats();
    const applyTypeFilterOptions = (filterEl) => {
      if (!filterEl) return;
      const typeOptions = getDjTypes()
        .map((type) => `<option value="${type}">${djTypeLabel(type)}</option>`)
        .join("");
      filterEl.innerHTML = typeOptions;
      filterEl.value = "all";
    };
    const loadOptionsForDeck = (deckKey) => {
      const isDeckA = deckKey === "a";
      const selectEl = isDeckA ? deckASelect : deckBSelect;
      const filterEl = isDeckA ? deckATypeFilter : deckBTypeFilter;
      const fallbackSource = isDeckA ? "vimeo-onlinedoof" : "aday-sc-profile";
      const currentValue = selectEl.value;
      const optionHtml = buildDeckOptionHtml(filterEl?.value || "all");
      selectEl.innerHTML = optionHtml;
      if (!selectEl.options.length) {
        selectEl.innerHTML = `<option value="${fallbackSource}">fallback source</option>`;
      }
      if ([...selectEl.options].some((opt) => opt.value === currentValue)) {
        selectEl.value = currentValue;
      } else if ([...selectEl.options].some((opt) => opt.value === fallbackSource)) {
        selectEl.value = fallbackSource;
      } else {
        selectEl.selectedIndex = 0;
      }
      mountDeck(deckKey, selectEl.value);
    };

    applyTypeFilterOptions(deckATypeFilter);
    applyTypeFilterOptions(deckBTypeFilter);
    loadOptionsForDeck("a");
    loadOptionsForDeck("b");

    deckALoad.addEventListener("click", () => mountDeck("a", deckASelect.value));
    deckBLoad.addEventListener("click", () => mountDeck("b", deckBSelect.value));
    deckASelect.addEventListener("change", () => mountDeck("a", deckASelect.value));
    deckBSelect.addEventListener("change", () => mountDeck("b", deckBSelect.value));
    deckATypeFilter?.addEventListener("change", () => loadOptionsForDeck("a"));
    deckBTypeFilter?.addEventListener("change", () => loadOptionsForDeck("b"));
    djCrossfader.addEventListener("input", applyCrossfader);
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

  const typeInText = (el, text, stepMs = 18) => {
    if (!el) return;
    el.textContent = "";
    let i = 0;
    const tick = () => {
      el.textContent += text[i] || "";
      i += 1;
      if (i < text.length) setTimeout(tick, stepMs);
    };
    tick();
  };

  const initHeaderLoops = () => {
    const headers = [...document.querySelectorAll("h1, h2, h3")];
    const subHeaders = [...document.querySelectorAll(".decrypt-line")];
    const nodes = [...headers, ...subHeaders];
    if (!nodes.length) return;

    const activeNodes = nodes.slice(0, performanceMode ? 6 : 10);
    activeNodes.forEach((node, idx) => {
      const baseText = (node.dataset.text || node.textContent || "").trim();
      if (!baseText) return;
      node.dataset.baseText = baseText;
      if (performanceMode) {
        setTimeout(() => typeInText(node, baseText, node.matches("h1") ? 22 : 18), 120 + idx * 60);
        return;
      }
      const run = () => {
        scrambleText(node, baseText);
        setTimeout(() => typeInText(node, baseText, node.matches("h1") ? 20 : 14), 260);
        if (window.anime) {
          window.anime({
            targets: node,
            translateX: [0, -1.2, 1.2, 0],
            opacity: [1, 0.84, 1],
            duration: 320,
            easing: "linear"
          });
        }
        const next = 8800 + Math.floor(Math.random() * 5200);
        setTimeout(run, next);
      };
      setTimeout(run, 320 + idx * 120);
    });

    if (window.anime && !performanceMode) {
      window.anime({
        targets: activeNodes,
        textShadow: [
          "0 0 4px rgba(132,255,160,0.2)",
          "0 0 9px rgba(132,255,160,0.55)",
          "0 0 4px rgba(132,255,160,0.2)"
        ],
        duration: 3200,
        easing: "linear",
        loop: true
      });
    }
  };

  let activeMoshCount = 0;
  const MAX_MOSH_IMAGES = 0;
  const moshImage = (img) => {
    if (img.id === "crtMedia") return;
    if (img.dataset.moshReady === "1") return;
    if (activeMoshCount >= MAX_MOSH_IMAGES) return;
    const wrap = document.createElement("div");
    wrap.className = "mosh-wrap";
    img.parentNode?.insertBefore(wrap, img);
    wrap.appendChild(img);

    const layer = document.createElement("canvas");
    layer.className = "mosh-layer";
    wrap.appendChild(layer);
    const lctx = layer.getContext("2d");
    if (!lctx) return;
    activeMoshCount += 1;

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

    let tick = 0;
    setInterval(() => {
      if (document.hidden) return;
      tick += 1;
      if (tick % 3 !== 0) return;
      draw();
    }, performanceMode ? 560 : 420);
    window.addEventListener("resize", size);
    img.dataset.moshReady = "1";
  };

  const hydrateRepoGrid = async () => {
    if (!repoGrid) return;
    try {
      const response = await fetch("https://api.github.com/users/aday1/repos?per_page=100&sort=updated");
      if (!response.ok) return;
      const repos = await response.json();
      const mustIncludeRepos = new Set([
        "macroverse.aday.net.au",
        "artbastard.aday.net.au",
        "error-diffusion",
        "acid-banger",
        "qr-zipper",
        "MoveMusicSaveEditor",
        "bitwig-mcp-server",
        "The-DAW-Horsemen-of-the-apocalypse-MCP-survival-Pack",
        "ZealPalace",
        "Cidewinder",
        "OpenSoundLab",
        "ArtBastard-DMX512",
        "glsl-vjay",
        "soundstagevr"
      ]);
      const skipRepoNames = new Set([
        "blog-aday-net-au",
        "breakcore-com-au",
        "breakcore-forums-placeholder"
      ]);
      const placeholderPattern = /(placeholder|test[_-]?branch|backup|tmp|temp)/i;
      const twoYearsMs = 1000 * 60 * 60 * 24 * 365 * 2;
      const nowMs = Date.now();
      const picks = repos
        .filter((repo) => !repo.fork && !repo.private && !repo.archived)
        .filter((repo) => {
          if (mustIncludeRepos.has(repo.name)) return true;
          if (skipRepoNames.has(repo.name)) return false;
          const description = (repo.description || "").trim();
          if (placeholderPattern.test(repo.name) || placeholderPattern.test(description)) return false;
          const updatedMs = new Date(repo.updated_at).getTime();
          const stale = Number.isFinite(updatedMs) && (nowMs - updatedMs) > twoYearsMs;
          const tinySkeleton = (repo.size || 0) < 20 && !repo.has_pages && !(repo.homepage || "").trim();
          if (stale && tinySkeleton) return false;
          if (!description && tinySkeleton) return false;
          return true;
        })
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, performanceMode ? 10 : 16);

      repoGrid.innerHTML = "";
      for (let i = 0; i < picks.length; i++) {
        const repo = picks[i];
        const seed = hashString(repo.name);
        const variant = seed % 4;
        const hue = 126 + (seed % 42);
        const channelModes = ["SYNC", "BURST", "FIELD", "NOISE", "DRIFT", "PHASE"];
        const channelMode = channelModes[seed % channelModes.length];
        const card = document.createElement("article");
        card.className = `card repo-tv repo-tv-variant-${variant}`;
        card.style.setProperty("--tv-hue", String(hue));

        const localShot = repoImageOverrides[repo.name] || pickLocalRepoCard(repo.name, seed);
        const generatedShot = buildRepoPoster(repo, seed);
        const shot = normalizeKnownGifSource(localShot || generatedShot);
        const shotFallbacks = [
          localShot,
          generatedShot,
          `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/preview.png`,
          `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/master/preview.png`,
          `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/screenshot.png`,
          `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/docs/preview.png`
        ].map((url) => normalizeKnownGifSource(url)).filter((url, idx, all) => url && all.indexOf(url) === idx);
        const mediaMarkup = `<img class="repo-shot" src="${shot}" alt="${repo.name} preview" data-fallbacks="${shotFallbacks.join("|")}">`;
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
            <span class="repo-tv-channel">${channelMode}-${String(i + 1).padStart(2, "0")}</span>
          </div>
          <div class="repo-tv-screen">
            ${mediaMarkup}
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
        if (image) {
          classifySignalImage(image, image.src);
          armGenericImageFallback(image);
          wrapMediaWithCrtEffect(card);
        }
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
  initAtzedentBackdrop();
  if (canvas) requestAnimationFrame(render);
  runNodeMap();
  initAcidVisualCrossfade();
  if (crtMedia) {
    crtMedia.src = normalizeKnownGifSource(crtMedia.getAttribute("src") || crtMedia.src);
    classifySignalImage(crtMedia, crtMedia.src);
  }
  cycleMenu();
  if (crtMedia) setInterval(cycleCrtMedia, performanceMode ? 12500 : 10000);
  setInterval(pulseCrtBurst, performanceMode ? 9800 : 7800);
  initHeaderLoops();
  randomizeFrameGeneration();
  initRandomImageDeck();
  initSoundcloudDeck();
  initWeeklyBeatsNode();
  initGalleryFilters();
  void initDjCrossfader();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => hydrateRepoGrid(), { timeout: 3000 });
  } else {
    setTimeout(() => hydrateRepoGrid(), 1400);
  }

  document.querySelectorAll("img.mosh-image").forEach((img) => {
    img.src = normalizeKnownGifSource(img.getAttribute("src") || img.src);
    classifySignalImage(img, img.src);
    armGenericImageFallback(img);
    if (img.complete) moshImage(img);
    else img.addEventListener("load", () => moshImage(img), { once: true });
  });
  document.querySelectorAll("img:not(.mosh-image)").forEach((img) => {
    img.src = normalizeKnownGifSource(img.getAttribute("src") || img.src);
    classifySignalImage(img, img.src);
    armGenericImageFallback(img);
  });
  wrapMediaWithCrtEffect();
  document.addEventListener("visibilitychange", () => {
    const repoVideos = document.querySelectorAll("video.repo-shot-video");
    repoVideos.forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    });
    if (acidRelayLoop) {
      if (document.hidden) acidRelayLoop.pause();
      else if (acidRelayLoop.classList.contains("is-active")) acidRelayLoop.play().catch(() => {});
    }
  });
})();
