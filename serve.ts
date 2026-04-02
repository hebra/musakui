// deno-lint-ignore-file no-import-prefix no-unversioned-import
import { serveDir } from "jsr:@std/http/file-server";
const PORT = 8000;
/**
 * Basic Deno script to serve the 'web' folder locally.
 * Usage: deno run --allow-net --allow-read serve.ts
 */
Deno.serve({ port: PORT }, (req) => {
  const url = new URL(req.url);
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} ${url.pathname}`,
  );
  return serveDir(req, {
    fsRoot: "web",
    showIndex: true,
  });
});
