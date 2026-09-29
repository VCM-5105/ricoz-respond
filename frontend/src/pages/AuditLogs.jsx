import React, { useState, useEffect } from "react";
import { History, Shield, Clock, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/audit-logs");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load audit logs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="font-sans">
      <Navbar
        title="Security Audit Logs"
        subtitle="Immutable enterprise platform audit trail"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
              System Audit Trail
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Every sensitive action is recorded in the immutable audit trail
            </p>
          </div>
          <button
            onClick={fetchLogs}
            title="Refresh"
            className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Audit Logs Table or Empty State */}
        {loading ? (
          <Loader message="Loading audit trail..." />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No activity recorded."
            description="There are currently no audit log records available."
          />
        ) : (
          <div className="bg-white border border-[#E8E0DE] rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F1F0] border-b border-[#E8E0DE] text-[#6B6B6B] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0DE]">
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-[#F5F1F0]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-[#6B6B6B] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9B9B9B]" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                      {log.userId?.name || "System"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] bg-[#6B1A1A]/10 text-[#6B1A1A] px-2.5 py-0.5 rounded-full font-semibold border border-[#6B1A1A]/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[#1A1A1A] font-medium">
                        <Shield className="w-3.5 h-3.5 text-[#6B1A1A]" />
                        {log.resource}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6B6B] font-mono text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.details || {})}
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

export default AuditLogs;
