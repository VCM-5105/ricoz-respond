import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <main className="flex-1">
          <Outlet />
        </main>
        {/* Strictly NO FOOTER anywhere in application as requested */}
      </div>
    </div>
  );
};

export default DashboardLayout;
