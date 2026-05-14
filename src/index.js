export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "qr-zipper.aday.net.au") {
      const mirrorUrl = new URL("https://aday1.github.io");
      if (url.pathname === "/" || url.pathname === "") {
        mirrorUrl.pathname = "/qr-zipper/qr-zipper.html";
      } else if (url.pathname.startsWith("/qr-zipper/")) {
        mirrorUrl.pathname = url.pathname;
      } else {
        mirrorUrl.pathname = `/qr-zipper${url.pathname}`;
      }
      mirrorUrl.search = url.search;
      const mirrorRequest = new Request(mirrorUrl.toString(), request);
      return fetch(mirrorRequest);
    }

    if (url.hostname === 'www.aday.net.au') {
      url.hostname = 'aday.net.au';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
