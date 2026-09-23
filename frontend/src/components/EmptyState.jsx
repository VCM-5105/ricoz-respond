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
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-gray-300 rounded-lg text-center my-4">
      <div className="p-3 bg-gray-50 border border-gray-100 rounded-full text-gray-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
