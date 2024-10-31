import http from "node:http";
import https from "node:https";
import url from "node:url";

// Функція для проксування запитів
export function proxyRequest(req, res) {
  const { path, protocol } = url.parse(req.url);
  console.log(protocol);
  // Розбираємо URL цільового сервера
  const targetUrl = `http://0.0.0.0`; // Задайте потрібний URL
  const parsedTargetUrl = url.parse(targetUrl);

  // Налаштування для проксування
  const options = {
    hostname: parsedTargetUrl.hostname,
    port: parsedTargetUrl.port || 8080,
    path: req.url, // Використовуємо той самий шлях, що і в запиті користувача
    method: req.method,
    headers: {
      ...req.headers,
      // Видаляємо деякі заголовки для анонімізації
      "x-forwarded-for": "0.0.0.0", // Видаляємо IP-адресу користувача
      via: "HTTP/1.1 GWA"
    }
  };

  // Використовуємо HTTP або HTTPS в залежності від цільового сервера
  const proxy = (parsedTargetUrl.protocol === "https:"
    ? https
    : http).request(options, proxyRes => {
    // Передаємо відповідь назад до клієнта
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  // Обробляємо помилки проксування
  proxy.on("error", err => {
    console.error("Помилка проксування:", err.message);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Помилка при проксуванні");
  });

  // Передаємо тіло запиту (якщо є)
  req.pipe(proxy, { end: true });
}
