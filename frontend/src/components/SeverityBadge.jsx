import React from "react";

const SeverityBadge = ({ severity }) => {
  const norm = (severity || "MEDIUM").toUpperCase();

  const styles = {
    LOW: "bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB]",
    MEDIUM: "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]",
    HIGH: "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
    CRITICAL: "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold"
  };

  const dotStyles = {
    LOW: "bg-[#6B7280]",
    MEDIUM: "bg-[#2563EB]",
    HIGH: "bg-[#D97706]",
    CRITICAL: "bg-[#DC2626] animate-pulse"
  };

  const currentStyle = styles[norm] || styles.MEDIUM;
  const dot = dotStyles[norm] || dotStyles.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {norm}
    </span>
  );
};

export default SeverityBadge;
