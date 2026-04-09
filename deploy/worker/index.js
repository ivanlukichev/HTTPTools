export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "httptools.net",
        timestamp: new Date().toISOString()
      }, {
        headers: {
          "cache-control": "no-store"
        }
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        ok: false,
        error: "Not found"
      }, {
        status: 404,
        headers: {
          "cache-control": "no-store"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
