import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SelectionWeatherMetrics from "@/components/toolbar/selectionWeatherMetrics";

const mocks = vi.hoisted(() => ({
  setLocation: vi.fn(),
  setUrlParams: vi.fn(),
}));

const location = {
  latitude: 10,
  longitude: 20,
  start_date: "2026-01-01",
  end_date: "2026-01-02",
  hourly: [],
  timezone: "auto",
};

vi.mock("@/store/location/locationStore", () => ({
  useLocationStore: (
    selector: (state: {
      location: typeof location;
      setLocation: typeof mocks.setLocation;
    }) => unknown,
  ) => selector({ location, setLocation: mocks.setLocation }),
}));

vi.mock("@/lib/helpers/urlParamsUpdate", () => ({
  paramsURL: new URLSearchParams(""),
  setUrlParams: mocks.setUrlParams,
}));

describe("SelectionWeatherMetrics", () => {
  beforeEach(() => {
    mocks.setLocation.mockClear();
    mocks.setUrlParams.mockClear();
  });

  it("updates location hourly metrics and URL param", async () => {
    render(<SelectionWeatherMetrics />);

    fireEvent.click(screen.getByLabelText("Temperature (°C)"));

    await waitFor(() => {
      expect(mocks.setLocation).toHaveBeenLastCalledWith({
        ...location,
        hourly: ["temperature_2m"],
      });
      expect(mocks.setUrlParams).toHaveBeenLastCalledWith({
        hourly: "temperature_2m",
      });
    });
  });
});
