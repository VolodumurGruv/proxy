"use strict";

import http from "node:http";
import { proxyRequest } from "./parseProxy.js";

export function runProxy() {
  // Створюємо HTTP сервер
  const server = http.createServer((req, res) => {
    console.log(`Отримано запит на ${req.url}`);
    proxyRequest(req, res);
  });

  // Слухаємо порт 8080
  server.listen(8080, () => {
    console.log("Проксі-сервер запущено на порту 8080");
  });
}
