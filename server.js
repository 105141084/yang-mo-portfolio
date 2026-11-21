const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const root = __dirname;
const preferredPort = Number(process.env.PORT || 4174);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2"
};

function send(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache"
  });
  response.end(body);
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = path.resolve(root, requested);
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, "index.html")) {
    return null;
  }
  return filePath;
}

function serve(port) {
  const server = http.createServer((request, response) => {
    const filePath = resolveFile(request.url || "/");
    if (!filePath) {
      send(response, 403, "Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        send(response, 404, "Not found");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extension] || "application/octet-stream";
      const shouldRevalidate = [".html", ".css", ".js"].includes(extension);
      response.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stats.size,
        "Cache-Control": shouldRevalidate ? "no-cache" : "public, max-age=3600"
      });
      fs.createReadStream(filePath).pipe(response);
    });
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
      serve(port + 1);
      return;
    }
    console.error(error.message);
    process.exitCode = 1;
  });

  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}`;
    console.log(`Portfolio preview: ${url}`);
    console.log("Close this window to stop the local server.");
    if (process.platform === "win32" && !process.env.NO_OPEN) {
      exec(`start "" "${url}"`);
    }
  });
}

serve(preferredPort);
