import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CheckboxGroup from "@/components/toolbar/checkboxGroup";

describe("CheckboxGroup", () => {
  it("renders title/items and triggers onChange", () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup
        title="Metrics"
        items={[
          { key: "temp", label: "Temperature" },
          { key: "rain", label: "Rain" },
        ]}
        selected={["temp"]}
        onChange={onChange}
      />,
    );

    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeChecked();
    expect(screen.getByLabelText("Rain")).not.toBeChecked();

    fireEvent.click(screen.getByLabelText("Rain"));
    expect(onChange).toHaveBeenCalledWith("rain");
  });
});
