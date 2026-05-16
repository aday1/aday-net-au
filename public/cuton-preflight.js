(function () {
  try {
    if (sessionStorage.getItem("aday-cuton-done-v1") === "1") {
      document.documentElement.classList.add("cuton-skip");
    }
  } catch {
    // ignore storage errors
  }
})();
