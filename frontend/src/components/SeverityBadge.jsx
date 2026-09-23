import React from "react";

const SeverityBadge = ({ severity }) => {
  const norm = (severity || "MEDIUM").toUpperCase();

  const styles = {
    LOW: "bg-blue-50 text-blue-700 border-blue-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    CRITICAL: "bg-red-50 text-red-700 border-red-200 font-semibold"
  };

  const dotStyles = {
    LOW: "bg-blue-500",
    MEDIUM: "bg-amber-500",
    HIGH: "bg-orange-500",
    CRITICAL: "bg-red-600 animate-pulse"
  };

  const currentStyle = styles[norm] || styles.MEDIUM;
  const dot = dotStyles[norm] || dotStyles.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {norm}
    </span>
  );
};

export default SeverityBadge;
