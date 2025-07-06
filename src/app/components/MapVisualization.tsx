interface MapVisualizationProps {
  batchId: string;
}

export default function MapVisualization({ batchId }: MapVisualizationProps) {
  const locations = [
    { name: "Farm A, Colombia", timestamp: Date.now() - 86400000 * 7 },
    { name: "Processing Center", timestamp: Date.now() - 86400000 * 5 },
    { name: "Port of Cartagena", timestamp: Date.now() - 86400000 * 3 },
    { name: "Warehouse B, USA", timestamp: Date.now() - 86400000 * 1 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Location history for batch {batchId}
      </div>
      <div className="space-y-3">
        {locations.map((location, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{location.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(location.timestamp).toLocaleDateString()}
              </div>
            </div>
            {index < locations.length - 1 && (
              <div className="w-px h-8 bg-gray-300 mx-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
