import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin text-[#6B1A1A] mb-2" />
      <span className="text-xs font-medium text-[#6B6B6B]">{message}</span>
    </div>
  );
};

export default Loader;
