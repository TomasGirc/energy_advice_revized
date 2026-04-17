import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SelectionComputedSeries from "@/components/toolbar/selectionComputedSeries";

const mocks = vi.hoisted(() => ({
  setComputedSeries: vi.fn(),
  setUrlParams: vi.fn(),
  deleteUrlParams: vi.fn(),
}));

vi.mock("@/store/computedSeriesStore", () => ({
  useComputedSeriesStore: (
    selector: (state: {
      setComputedSeries: typeof mocks.setComputedSeries;
    }) => unknown,
  ) => selector({ setComputedSeries: mocks.setComputedSeries }),
}));

vi.mock("@/lib/helpers/urlParamsUpdate", () => ({
  paramsURL: new URLSearchParams(""),
  setUrlParams: mocks.setUrlParams,
  deleteUrlParams: mocks.deleteUrlParams,
}));

describe("SelectionComputedSeries", () => {
  beforeEach(() => {
    mocks.setComputedSeries.mockClear();
    mocks.setUrlParams.mockClear();
    mocks.deleteUrlParams.mockClear();
  });

  it("updates store and URL when selecting computed series", async () => {
    render(<SelectionComputedSeries />);

    fireEvent.click(screen.getByLabelText("Moving Average"));

    await waitFor(() => {
      expect(mocks.setComputedSeries).toHaveBeenLastCalledWith([
        "moving_average",
      ]);
      expect(mocks.setUrlParams).toHaveBeenLastCalledWith({
        computed_series: "moving_average",
      });
    });
  });

  it("removes URL param when selection is cleared", async () => {
    render(<SelectionComputedSeries />);

    const checkbox = screen.getByLabelText("Moving Average");
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mocks.setComputedSeries).toHaveBeenLastCalledWith([]);
      expect(mocks.deleteUrlParams).toHaveBeenCalledWith(["computed_series"]);
    });
  });
});
