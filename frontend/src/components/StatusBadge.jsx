import React from "react";

const StatusBadge = ({ status }) => {
  const norm = (status || "OPEN").toUpperCase();

  const styles = {
    OPEN: "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]",
    INVESTIGATING: "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]",
    CONTAINED: "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
    RESOLVED: "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]",
    CLOSED: "bg-[#F5F1F0] text-[#6B6B6B] border border-[#E8E0DE]"
  };

  const currentStyle = styles[norm] || styles.OPEN;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${currentStyle}`}
    >
      {norm}
    </span>
  );
};

export default StatusBadge;
