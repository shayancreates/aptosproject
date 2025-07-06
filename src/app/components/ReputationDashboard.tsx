import { ActorReputation } from "../lib/types";

interface ReputationDashboardProps {
  reputation: ActorReputation;
}

export default function ReputationDashboard({ reputation }: ReputationDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{reputation.score}</div>
          <div className="text-sm text-gray-600">Reputation Score</div>
          <div className={`text-sm font-medium ${getScoreColor(reputation.score)}`}>
            {getScoreLabel(reputation.score)}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {reputation.successful_deliveries}
          </div>
          <div className="text-sm text-gray-600">Successful Deliveries</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{reputation.disputes}</div>
          <div className="text-sm text-gray-600">Disputes</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Address</h3>
        <p className="text-sm text-gray-600 font-mono">
          {reputation.address}
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Tips for Better Reputation</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Ensure timely delivery of products</li>
          <li>• Maintain product quality standards</li>
          <li>• Provide accurate product information</li>
          <li>• Respond promptly to customer inquiries</li>
          <li>• Resolve disputes amicably</li>
        </ul>
      </div>
    </div>
  );
} 