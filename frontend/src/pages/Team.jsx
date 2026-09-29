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
    <div className="font-sans">
      <Navbar
        title="Security Operations Team"
        subtitle="Analyst directory and active incident load balancing"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">Team Members</h2>
            <p className="text-xs text-[#6B6B6B]">
              Platform analysts with real-time active incident counts
            </p>
          </div>
          <button
            onClick={fetchUsers}
            title="Refresh"
            className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
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
          <div className="bg-white border border-[#E8E0DE] rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F1F0] border-b border-[#E8E0DE] text-[#6B6B6B] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Active Incidents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0DE]">
                {users.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-[#F5F1F0]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6B1A1A] text-[#C9A96E] font-serif flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {member.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-[#1A1A1A]">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6B6B]">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#9B9B9B]" />
                        {member.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6B1A1A]/10 text-[#6B1A1A] border border-[#6B1A1A]/20">
                        <Shield className="w-3 h-3 text-[#6B1A1A]" />
                        {member.role?.name || "Analyst"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          member.activeIncidents > 0
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-[#F5F1F0] text-[#6B6B6B] border border-[#E8E0DE]"
                        }`}
                      >
                        {member.activeIncidents > 0 && (
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
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
