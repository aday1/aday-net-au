(function () {
  try {
    if (sessionStorage.getItem("aday-cuton-done-v1") === "1") {
      document.documentElement.classList.add("cuton-skip");
      document.addEventListener("DOMContentLoaded", () => {
        document.body?.classList.add("cuton-settled");
      }, { once: true });
    }
  } catch {
    // ignore storage errors
  }
})();
