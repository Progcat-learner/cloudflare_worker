export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/secure') {
      const email = request.headers.get("cf-access-identity-email") || "unknown@example.com";
      const country = request.cf?.country || "??";
      const timestamp = new Date().toISOString();

      const body = `
        <html>
          <body style="font-family: sans-serif;">
            <p>${email} authenticated at ${timestamp} from 
              <a href="/secure/${country}">${country}</a>
            </p>
          </body>
        </html>
      `;

      return new Response(body, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
