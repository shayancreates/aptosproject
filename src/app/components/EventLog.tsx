import { ProductBatch } from "../lib/types";

interface EventLogProps {
  batch: ProductBatch;
}

export default function EventLog({ batch }: EventLogProps) {
  if (!batch.events || batch.events.length === 0) {
    return (
      <div className="text-gray-600 text-center py-4">
        No events recorded for this batch yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {batch.events.map((event, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">{event.eventType}</h4>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-sm text-gray-500">{event.notes}</p>
              {event.temperature && (
                <p className="text-sm text-gray-500">
                  Temperature: {event.temperature}°C
                </p>
              )}
              {event.humidity && (
                <p className="text-sm text-gray-500">
                  Humidity: {event.humidity}%
                </p>
              )}
              {event.quantity && (
                <p className="text-sm text-gray-500">
                  Quantity: {event.quantity}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(event.timestamp * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
