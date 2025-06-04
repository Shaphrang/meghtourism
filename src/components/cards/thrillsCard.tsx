import { Activity } from '@/types/activity';

interface Props {
  activity: Activity;
  className?: string;
}

export default function ThrillCard({ activity, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}>
      <img
        src={activity.image}
        alt={activity.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{activity.name}</h3>
        <p className="text-sm text-gray-600">{activity.description}</p>
        <p className="text-xs text-blue-500 mt-1">Difficulty: {activity.difficulty}</p>
      </div>
    </div>
  );
}
