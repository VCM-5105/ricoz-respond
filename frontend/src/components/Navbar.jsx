import React from "react";
import { Bell, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ title, subtitle, searchProps }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-base font-bold text-gray-900 leading-tight">
          {title || "Dashboard"}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-500 font-normal">{subtitle}</p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Optional Search */}
        {searchProps && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchProps.placeholder || "Search..."}
              value={searchProps.value}
              onChange={(e) => searchProps.onChange(e.target.value)}
              className="w-64 pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
            />
            <svg
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Notifications */}
        <button
          title="Notifications"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full absolute top-1.5 right-1.5" />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold uppercase shadow-xs">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-800 leading-snug">
              {user?.name || "Analyst"}
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-sky-600" />
              {user?.role?.name || "Security Analyst"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
