import { describe, expect, it } from 'vitest'
import { init } from "../src/app.js";

describe("/health", () => {
  const app = init();

  it("returns ok:true and has CORS header", async () => {
    const res = await app.request("/health", { method: "GET" });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");

    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it("handles OPTIONS preflight", async () => {
    const res = await app.request("/health", { method: "OPTIONS" });
    expect([200, 204]).toContain(res.status);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});
