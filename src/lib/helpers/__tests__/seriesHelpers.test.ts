import { describe, expect, it } from "vitest";
import { movingAverage } from "@/lib/helpers/movingAverage";
import { minLine } from "@/lib/helpers/minLine";
import { maxLine } from "@/lib/helpers/maxLine";
import { trendLine } from "@/lib/helpers/trendLine";

describe("series helpers", () => {
  it("computes moving average with rolling window", () => {
    expect(movingAverage([1, 2, 3, 4], 2)).toEqual([1, 1.5, 2.5, 3.5]);
  });

  it("builds flat min line", () => {
    expect(minLine([3, 1, 2])).toEqual([1, 1, 1]);
  });

  it("builds flat max line", () => {
    expect(maxLine([3, 1, 2])).toEqual([3, 3, 3]);
  });

  it("returns empty trend line for empty data", () => {
    expect(trendLine([])).toEqual([]);
  });

  it("fits linear trend for monotonic data", () => {
    expect(trendLine([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });
});
