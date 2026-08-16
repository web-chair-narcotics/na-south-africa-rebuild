import { describe, expect, it, vi } from "vitest";

vi.mock("./storage", () => ({
  storagePut: vi.fn(async (key: string) => ({ key, url: `/manus-storage/${key}` })),
}));

import { uploadApprovedMedia } from "./mediaIntake";

describe("media intake storage mapping", () => {
  it("uploads only approved safe paths and returns managed URLs", async () => {
    const result = await uploadApprovedMedia([
      { relativePath: "literature/basic-text.pdf", bytes: new Uint8Array([1, 2]), contentType: "application/pdf", approved: true },
      { relativePath: "private.txt", bytes: new Uint8Array([3]), contentType: "text/plain", approved: false },
    ]);
    expect(result).toEqual([{ relativePath: "literature/basic-text.pdf", key: "na-public-media/literature/basic-text.pdf", url: "/manus-storage/na-public-media/literature/basic-text.pdf" }]);
  });

  it("rejects unsafe archive paths before storage upload", async () => {
    await expect(uploadApprovedMedia([{ relativePath: "../private.txt", bytes: new Uint8Array([1]), contentType: "text/plain", approved: true }])).rejects.toThrow("Unsafe media path");
  });
});
