export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.aday.net.au') {
      url.hostname = 'aday.net.au';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
