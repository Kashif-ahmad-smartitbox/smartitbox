import React from "react";

interface P {
  title: string;
  description: string;
}

const CommonDashHeader: React.FC<P> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default CommonDashHeader;
