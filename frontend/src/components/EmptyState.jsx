import React from "react";
import { FolderX, Plus } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderX,
  title = "No data found",
  description = "No records found.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-[#E8E0DE] rounded-xl text-center my-4 font-sans shadow-xs">
      <div className="p-3 bg-[#F5F1F0] border border-[#E8E0DE] rounded-full text-[#6B1A1A] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-[#1A1A1A]">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-[#6B6B6B] max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
