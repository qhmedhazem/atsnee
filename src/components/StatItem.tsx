import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
}

const StatItem: React.FC<Props> = ({ value, label }) => {
  return (
    <div className="space-y-2 group">
      <div className="w-fit">
        <h3 className="text-2xl font-bold">{value}</h3>
        <hr className="w-10 border-t-4 border-blue-500 transition-all rounded-xl group-hover:w-full" />
        <p className="text-gray-700">{label}</p>
      </div>
    </div>
  );
};

export default StatItem;
