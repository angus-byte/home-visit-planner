// Cliniko pass-through for Home Visit Planner (Cloudflare Worker).
//
// Browsers can't call Cliniko's API directly: it doesn't send CORS headers and it
// requires a User-Agent the browser won't let a page set. This Worker forwards
// GET requests from the planner to Cliniko and adds both.
//
// It stores nothing and logs nothing. The API key travels in the Authorization
// header from the planner and is passed straight on to Cliniko.
//
// Settings (Worker > Settings > Variables):
//   ALLOWED_ORIGIN  e.g. https://angus-byte.github.io   (only this site may use it)
//   CONTACT_EMAIL   the practice's email, sent to Cliniko in the User-Agent as they require
//
// Request shape: https://<worker>/<shard>/v1/<path>?<query>
//   e.g. https://cliniko-proxy.example.workers.dev/au1/v1/patients?per_page=100

const ALLOWED_PATHS = /^\/v1\/(patients|individual_appointments)(\/\d+)?$/;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Accept",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    if (!allowed || origin !== allowed) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return new Response("Read-only", { status: 405, headers: cors });

    const url = new URL(request.url);
    const m = url.pathname.match(/^\/([a-z]{2}\d+)(\/v1\/.*)$/);
    if (!m || !ALLOWED_PATHS.test(m[2])) return new Response("Not found", { status: 404, headers: cors });

    const upstream = `https://api.${m[1]}.cliniko.com${m[2]}${url.search}`;
    const res = await fetch(upstream, {
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        Accept: "application/json",
        "User-Agent": `Home Visit Planner (${env.CONTACT_EMAIL || "unknown"})`,
      },
    });
    const headers = new Headers(cors);
    headers.set("Content-Type", res.headers.get("Content-Type") || "application/json");
    headers.set("Cache-Control", "no-store");
    return new Response(res.body, { status: res.status, headers });
  },
};
