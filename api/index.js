export const config = {
  runtime: "edge",
};

const TARGET = "https://goldprice.novix.fyi:2096"; // your VPS inbound port

const STRIP_HEADERS = [
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
];

export default async function handler(req) {
  const url = new URL(req.url);

  const targetUrl = TARGET + url.pathname + url.search;

  const headers = new Headers(req.headers);

  STRIP_HEADERS.forEach(h => headers.delete(h));

  const res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.body,
    redirect: "manual",
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
