import React from "react";
import { Bell, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ title, subtitle, searchProps }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E8E0DE] flex items-center justify-between px-8 sticky top-0 z-20 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Title & Subtitle with Live Pulse Dot */}
      <div className="flex items-center gap-3">
        <span className="live-dot" title="Operational - Live Connected" />
        <div>
          <h1 className="text-base font-bold text-[#1A1A1A] leading-tight">
            {title || "Dashboard"}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#6B6B6B] font-normal">{subtitle}</p>
          )}
        </div>
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
              className="w-64 pl-8 pr-3 py-1.5 text-xs bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white transition-all text-[#1A1A1A] placeholder-[#9B9B9B]"
            />
            <svg
              className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-2.5 top-2.5"
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
          className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F5F1F0] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 bg-[#6B1A1A] rounded-full absolute top-1.5 right-1.5" />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E8E0DE]">
          <div className="w-8 h-8 rounded-lg bg-[#6B1A1A] text-[#C9A96E] font-serif flex items-center justify-center text-xs font-semibold uppercase shadow-xs">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1A1A1A] leading-snug">
              {user?.name || "Analyst"}
            </span>
            <span className="text-[10px] text-[#6B6B6B] flex items-center gap-1 font-medium">
              <Shield className="w-2.5 h-2.5 text-[#6B1A1A]" />
              {user?.role?.name || "Security Analyst"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
