import React from "react";

const StatCard = ({ title, value, icon: Icon, color = "burgundy", subtext }) => {
  const colorMap = {
    burgundy: "text-[#6B1A1A] bg-[#6B1A1A14] border-[#6B1A1A30]",
    amber: "text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]",
    red: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]",
    emerald: "text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]"
  };

  const badgeColor = colorMap[color] || colorMap.burgundy;

  return (
    <div className="bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#6B1A1A40] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${badgeColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          {value}
        </span>
      </div>
      {subtext && <p className="mt-1 text-xs text-[#9B9B9B]">{subtext}</p>}
    </div>
  );
};

export default StatCard;
