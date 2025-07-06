import { BatchEvent } from "../lib/types";

interface TemperatureGraphProps {
  events: BatchEvent[];
}

export default function TemperatureGraph({ events }: TemperatureGraphProps) {
  const temperatureEvents = events.filter(
    (event) => event.temperature !== undefined
  );

  if (temperatureEvents.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No temperature data available for this batch.
      </div>
    );
  }

  const maxTemp = Math.max(...temperatureEvents.map((e) => e.temperature!));
  const minTemp = Math.min(...temperatureEvents.map((e) => e.temperature!));

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Max: {maxTemp}°C</span>
        <span>Min: {minTemp}°C</span>
      </div>

      <div className="space-y-2">
        {temperatureEvents.map((event, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{event.temperature}°C</span>
                <span className="text-gray-500">
                  {new Date(event.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((event.temperature! - minTemp) / (maxTemp - minTemp)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Temperature readings over time for this batch
      </div>
    </div>
  );
}
