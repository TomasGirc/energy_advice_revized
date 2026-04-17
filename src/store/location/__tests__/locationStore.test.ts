import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Location } from "@/lib/types";

const mockParamsURL = {
  get: vi.fn(() => null),
};

vi.mock("@/lib/helpers/urlParamsUpdate", () => ({
  paramsURL: mockParamsURL,
}));

const loadStore = async () => {
  vi.resetModules();
  const module = await import("@/store/location/locationStore");
  return module.useLocationStore;
};

const baseLocation: Location = {
  latitude: 10,
  longitude: 20,
  hourly: [],
  timezone: "auto",
  start_date: "2026-01-01",
  end_date: "2026-01-02",
};

describe("locationStore", () => {
  beforeEach(() => {
    localStorage.clear();
    mockParamsURL.get.mockReset();
    mockParamsURL.get.mockReturnValue(null);
  });

  it("makes a newly saved location active and deactivates previous saved locations", async () => {
    localStorage.setItem(
      "locationList",
      JSON.stringify([
        { ...baseLocation, latitude: 1, longitude: 2, active: true },
        { ...baseLocation, latitude: 3, longitude: 4, active: false },
      ]),
    );

    const store = await loadStore();
    store.getState().setLocation({ ...baseLocation, latitude: 50, longitude: 60 });

    store.getState().saveLocation();

    expect(store.getState().locationList).toEqual([
      { ...baseLocation, latitude: 1, longitude: 2, active: false },
      { ...baseLocation, latitude: 3, longitude: 4, active: false },
      { ...baseLocation, latitude: 50, longitude: 60, active: true },
    ]);
  });

  it("keeps an updated saved location active when re-saving existing coordinates", async () => {
    localStorage.setItem(
      "locationList",
      JSON.stringify([
        { ...baseLocation, latitude: 1, longitude: 2, active: true },
        { ...baseLocation, latitude: 3, longitude: 4, active: false },
      ]),
    );

    const store = await loadStore();
    store.getState().setLocation({
      ...baseLocation,
      latitude: 3,
      longitude: 4,
      start_date: "2026-02-01",
      end_date: "2026-02-03",
    });

    store.getState().saveLocation();

    expect(store.getState().locationList).toEqual([
      { ...baseLocation, latitude: 1, longitude: 2, active: false },
      {
        ...baseLocation,
        latitude: 3,
        longitude: 4,
        start_date: "2026-02-01",
        end_date: "2026-02-03",
        active: true,
      },
    ]);
  });

  it("marks only the selected saved location active", async () => {
    localStorage.setItem(
      "locationList",
      JSON.stringify([
        { ...baseLocation, latitude: 1, longitude: 2, active: true },
        { ...baseLocation, latitude: 3, longitude: 4, active: false },
      ]),
    );

    const store = await loadStore();
    store.getState().setActiveLocation(3, 4);

    expect(store.getState().locationList).toEqual([
      { ...baseLocation, latitude: 1, longitude: 2, active: false },
      { ...baseLocation, latitude: 3, longitude: 4, active: true },
    ]);
  });
});
