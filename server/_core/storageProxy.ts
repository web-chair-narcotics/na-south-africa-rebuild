import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      const assetResp = await fetch(url);
      if (!assetResp.ok) {
        console.error(`[StorageProxy] signed asset error: ${assetResp.status}`);
        res.status(502).send("Storage asset unavailable");
        return;
      }

      const contentType = assetResp.headers.get("content-type") || "application/octet-stream";
      const contentLength = assetResp.headers.get("content-length");
      const assetBytes = Buffer.from(await assetResp.arrayBuffer());
      res.set("Cache-Control", "public, max-age=300");
      res.set("Content-Type", contentType);
      if (contentLength) res.set("Content-Length", contentLength);
      res.status(200).send(assetBytes);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
