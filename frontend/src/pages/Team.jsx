import React, { useState, useEffect } from "react";
import { Users, Mail, Shield, ShieldAlert, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load team members:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar
        title="Security Operations Team"
        subtitle="Analyst directory and active incident load balancing"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Team Members</h2>
            <p className="text-xs text-gray-500">
              Platform analysts with real-time active incident counts
            </p>
          </div>
          <button
            onClick={fetchUsers}
            title="Refresh"
            className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Team Grid / Table or Mandatory Empty State */}
        {loading ? (
          <Loader message="Loading team members..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members found."
            description="There are currently no registered team members."
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Active Incidents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {member.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {member.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
                        <Shield className="w-3 h-3 text-sky-600" />
                        {member.role?.name || "Analyst"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          member.activeIncidents > 0
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.activeIncidents > 0 && (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        {member.activeIncidents || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
