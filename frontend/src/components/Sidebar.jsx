import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  FileText,
  Users,
  History,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Incidents", path: "/incidents", icon: ShieldAlert },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Playbooks", path: "/playbooks", icon: BookOpen },
  { name: "Evidence", path: "/evidence", icon: FileText },
  { name: "Team", path: "/team", icon: Users },
  { name: "Audit Logs", path: "/audit-logs", icon: History }
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#1F1717] border-r border-[#342424] text-[#D8CECC] flex flex-col h-screen fixed left-0 top-0 select-none z-30 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[#342424]">
        <div className="flex items-center gap-3">
          <div className="logo-box shadow-md">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-serif text-base font-bold tracking-tight text-white">
                Ricoz
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">
                Respond
              </span>
            </div>
            <span className="text-[9px] text-[#A89F9E] tracking-widest uppercase font-semibold">
              Security Operations
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#C9A96E]">
          Investigation & Response
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#6B1A1A] text-white shadow-sm font-semibold"
                    : "text-[#B5AAA8] hover:text-white hover:bg-[#2F2121]"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-[#342424] space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-[#6B1A1A] text-white"
                : "text-[#B5AAA8] hover:text-white hover:bg-[#2F2121]"
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#EF4444] hover:text-[#FCA5A5] hover:bg-[#3E1A1A] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        {/* User Mini Profile */}
        {user && (
          <div className="pt-2 mt-2 border-t border-[#342424] px-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6B1A1A] text-[#C9A96E] font-serif flex items-center justify-center text-xs font-bold uppercase shadow-inner">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-[#A89F9E] truncate">
                {user.role?.name || "Analyst"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
