const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store"
};

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {"Content-Type":"application/json", ...cors}
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, {status:204, headers:cors});

    if (url.pathname === "/api/site") {
      if (request.method === "GET") {
        const raw = await env.SITE_DATA.get("published");
        if (!raw) return json({data:{}, images:{}});
        try { return json(JSON.parse(raw)); }
        catch { return json({error:"Stored site data is invalid."}, 500); }
      }

      if (request.method === "PUT") {
        const auth = request.headers.get("Authorization") || "";
        const expected = env.PUBLISH_TOKEN || "";
        if (!expected || auth !== `Bearer ${expected}`) {
          return json({error:"Unauthorized"}, 401);
        }

        const body = await request.json();
        if (!body || typeof body !== "object" || !body.data) {
          return json({error:"Invalid publish payload"}, 400);
        }

        const serialized = JSON.stringify({
          data: body.data,
          images: body.images || {},
          publishedAt: new Date().toISOString()
        });

        if (serialized.length > 24 * 1024 * 1024) {
          return json({error:"Published data is too large for KV. Reduce image sizes."}, 413);
        }

        await env.SITE_DATA.put("published", serialized);
        return json({ok:true, publishedAt:new Date().toISOString()});
      }

      return json({error:"Method not allowed"}, 405);
    }

    return env.ASSETS.fetch(request);
  }
};
