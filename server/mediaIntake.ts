import { storagePut } from "./storage";

export type ApprovedMediaFile = {
  relativePath: string;
  bytes: Uint8Array;
  contentType: string;
  approved: boolean;
};

export async function uploadApprovedMedia(files: ApprovedMediaFile[], prefix = "na-public-media") {
  const results: Array<{ relativePath: string; key: string; url: string }> = [];
  for (const file of files) {
    if (!file.approved) continue;
    if (file.relativePath.includes("..") || file.relativePath.startsWith("/")) {
      throw new Error(`Unsafe media path: ${file.relativePath}`);
    }
    const safePath = file.relativePath.replace(/[^a-zA-Z0-9._/-]/g, "-");
    const uploaded = await storagePut(`${prefix}/${safePath}`, file.bytes, file.contentType);
    results.push({ relativePath: file.relativePath, key: uploaded.key, url: uploaded.url });
  }
  return results;
}
