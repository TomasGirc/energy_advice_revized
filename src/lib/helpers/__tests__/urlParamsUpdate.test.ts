import { beforeEach, describe, expect, it } from "vitest";
import { deleteUrlParams, setUrlParams } from "@/lib/helpers/urlParamsUpdate";

describe("url params helpers", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("sets params while preserving existing ones", () => {
    window.history.replaceState({}, "", "/?lat=10");

    setUrlParams({ lng: "20", start_date: "2026-01-01" });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("lat")).toBe("10");
    expect(params.get("lng")).toBe("20");
    expect(params.get("start_date")).toBe("2026-01-01");
  });

  it("deletes selected params", () => {
    window.history.replaceState({}, "", "/?lat=10&lng=20&hourly=rain");

    deleteUrlParams(["lng", "hourly"]);

    const params = new URLSearchParams(window.location.search);
    expect(params.get("lat")).toBe("10");
    expect(params.get("lng")).toBeNull();
    expect(params.get("hourly")).toBeNull();
  });
});
