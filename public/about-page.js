(() => {
  const root = document.getElementById("aboutPageBody");
  if (!root) return;

  const esc = (v) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const fallback = {
    name: "Aday (Adrian Richardson)",
    teaser: "Chiptune, breakcore, and live visuals from Melbourne.",
    imageCredit: "Clan Analogue artist profile",
    clanBio: "",
    macroverseBio: "",
    tags: [],
    sources: []
  };

  const render = (bio) => {
    const data = { ...fallback, ...bio };
    const tags = (data.tags || [])
      .map((tag) => `<span class="about-tag">${esc(tag)}</span>`)
      .join("");
    const sourceLinks = (data.sources || [])
      .map(
        (s) =>
          `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`
      )
      .join("");
    root.innerHTML = `
      <div class="about-hero">
        <div>
          <img class="about-portrait" src="/assets/about/aday-profile-geoshed.jpg" alt="${esc(data.name)} portrait" width="768" height="512" loading="eager" decoding="async">
          <p class="about-credit">${esc(data.imageCredit || "")}</p>
        </div>
        <div>
          <p class="about-lede">${esc(data.teaser || "")}</p>
          <div class="about-section">
            <h3>Clan Analogue</h3>
            <p>${esc(data.clanBio || "")}</p>
          </div>
          <div class="about-section">
            <h3>MacroVerse</h3>
            <p>${esc(data.macroverseBio || "")}</p>
          </div>
          <p class="about-links">${sourceLinks}</p>
          <div class="about-tags">${tags}</div>
        </div>
      </div>`;
  };

  fetch("./data/aday-about-bio.json")
    .then((r) => (r.ok ? r.json() : fallback))
    .then(render)
    .catch(() => render(fallback));
})();
