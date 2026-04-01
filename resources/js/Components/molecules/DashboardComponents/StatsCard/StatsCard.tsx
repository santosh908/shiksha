import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon?: React.ReactNode; // Added type for the icon prop
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, period, icon }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold ml-2">{title}</h3>
        <div className="flex items-center ">
          <span className="text-sm">{value}</span>
        </div>
      </div>
      {icon && <div className="flex-shrink-0 text-blue-500">{icon}</div>}
    </div>
  );
};
export default StatsCard;
