export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/secure/')) {
      const country = path.replace('/secure/', '').toUpperCase();
      const flag = countryToFlag(country);
      return new Response(`
        <html><body style="font-size: 100px; text-align: center;">
          ${flag || "🏳️"}<br/><div style="font-size: 30px">${country}</div>
        </body></html>
      `, {
        headers: { "Content-Type": "text/html" },
      });
    }

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

function countryToFlag(code) {
  if (!code || code.length !== 2) return null;
  return [...code.toUpperCase()]
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}
