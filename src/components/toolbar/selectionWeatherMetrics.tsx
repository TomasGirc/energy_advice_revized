import { useState, useEffect } from "react";
import { useLocationStore } from "@/store/location/locationStore";
import { paramsURL, setUrlParams } from "@/lib/helpers/urlParamsUpdate";
import { METRICS } from "@/lib/constants";

const SelectionWeatherMetrics = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  // Use lazy initialization to avoid setState in effect
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = paramsURL;
      const urlHourly = params.get("hourly");
      if (urlHourly) {
        return urlHourly.split(",").filter(Boolean);
      }
    }
    return [];
  });

  // Update store and URL when selected changes
  useEffect(() => {
    setLocation({ ...location, hourly: selected });
    setUrlParams({
      hourly: selected.length > 0 ? selected.join(",") : undefined,
    });
    // eslint-disable-next-line
  }, [selected]);

  const handleChange = (metric: string) => {
    setSelected((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric],
    );
  };

  return (
    <div className="flex flex-col">
      <h4 className="mr-5 font-bold">Metrics :</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        {METRICS.map((metric) => (
          <label key={metric.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(metric.key)}
              onChange={() => handleChange(metric.key)}
            />
            {metric.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectionWeatherMetrics;
