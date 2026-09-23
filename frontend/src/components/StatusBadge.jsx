import React from "react";

const StatusBadge = ({ status }) => {
  const norm = (status || "OPEN").toUpperCase();

  const styles = {
    OPEN: "bg-sky-50 text-sky-700 border-sky-200",
    INVESTIGATING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    CONTAINED: "bg-amber-50 text-amber-700 border-amber-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200"
  };

  const currentStyle = styles[norm] || styles.OPEN;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}
    >
      {norm}
    </span>
  );
};

export default StatusBadge;
