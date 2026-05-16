(() => {
  const UI_PREF_KEY = "aday-ui-prefs";
  const EXIT_MS = 1280;
  const EXIT_MS_REDUCED = 280;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const isEnabled = () => {
    try {
      const raw = localStorage.getItem(UI_PREF_KEY);
      if (!raw) return true;
      const parsed = JSON.parse(raw);
      return parsed.friendExitTransition !== false;
    } catch {
      return true;
    }
  };

  const ensureOverlay = () => {
    let overlay = document.getElementById("friendExitOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "friendExitOverlay";
    overlay.className = "friend-exit-overlay";
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="friend-exit-main">' +
      '<div class="friend-exit-globe-stage">' +
      '<div class="friend-exit-orbit"><div class="friend-exit-strip" aria-hidden="true"></div></div>' +
      '<svg class="friend-exit-globe" viewBox="0 0 66 63" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M30 0H27H24V3H21H18H15V6H12V9H9V12H6V15H3V18V21H0V24V27V30V33V36V39V42H3V45L3 48H6L6 51H9V54H12V57H15V60H18H21H24V63H27H30H33H36H39H42V60H45H48H51V57H54V54H57V51H60V48H63V45V42H66V39V36V33V30V27V24V21H63V18V15H60V12H57V9H54V6H51V3H48H45H42V0H39H36H33H30ZM42 3V6H45H48H51V9H54V12V15H57H60V18V21H63V24V27V30V33V36V39V42H60V45V48H57H54V51H51V54V57H48H45H42V60H39H36H33H30H27H24V57H21H18H15V54V51H12V48H9H6V45V42H3L3 39V36V33V30V27V24V21H6V18H9V15V12H12V9H15V6H18H21H24V3H27H30H33H36H39H42Z" fill="currentColor"/>' +
      "</svg></div>" +
      '<p class="friend-exit-host" id="friendExitHost">routing signal</p></div>';

    document.body.appendChild(overlay);
    return overlay;
  };

  const injectStyles = () => {
    if (document.getElementById("friendExitTransitionCss")) return;
    const link = document.createElement("link");
    link.id = "friendExitTransitionCss";
    link.rel = "stylesheet";
    link.href = "./friend-exit-transition.css";
    document.head.appendChild(link);
  };

  const isFriendsPage = () => /friends\.html$/i.test(location.pathname);

  const isExitLink = (anchor) => {
    if (!(anchor instanceof HTMLAnchorElement)) return false;
    if (anchor.hasAttribute("download") || anchor.getAttribute("data-no-exit") === "1") return false;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;

    let url;
    try {
      url = new URL(href, location.href);
    } catch {
      return false;
    }

    if (url.origin === location.origin) return false;

    if (anchor.closest(".friend-brand-link")) return true;
    if (anchor.closest(".quicklink-headliner, .quicklink-satellite, .quicklink-network")) return true;
    if (isFriendsPage() && anchor.closest("main.shell")) return true;

    return false;
  };

  let exiting = false;

  const playExit = (url, newTab) => {
    if (exiting) return;
    exiting = true;

    const overlay = ensureOverlay();
    const hostEl = document.getElementById("friendExitHost");
    let hostLabel = "routing signal";
    try {
      hostLabel = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      // keep default
    }
    if (hostEl) hostEl.textContent = "exit // " + hostLabel;

    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      overlay.classList.add("is-active");
      document.body.classList.add("friend-exit-active");
    });

    const delay = prefersReduced ? EXIT_MS_REDUCED : EXIT_MS;
    window.setTimeout(() => {
      if (newTab) {
        window.open(url, "_blank", "noopener,noreferrer");
        overlay.classList.remove("is-active");
        document.body.classList.remove("friend-exit-active");
        overlay.hidden = true;
        overlay.setAttribute("aria-hidden", "true");
        exiting = false;
        return;
      }
      location.href = url;
    }, delay);
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!isEnabled() || exiting) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !isExitLink(anchor)) return;

      event.preventDefault();
      event.stopPropagation();
      playExit(anchor.href, anchor.target === "_blank");
    },
    true
  );

  injectStyles();
  ensureOverlay();
})();
