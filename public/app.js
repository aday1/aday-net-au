(() => {
  const body = document.body;
  const button = document.getElementById("scanlineToggle");
  const key = "aday.scanlines";

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
})();
