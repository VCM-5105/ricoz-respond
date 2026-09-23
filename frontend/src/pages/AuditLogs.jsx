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
    <div>
      <Navbar
        title="Security Audit Logs"
        subtitle="Immutable database-backed platform audit trail"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              System Audit Trail
            </h2>
            <p className="text-xs text-gray-500">
              Every sensitive action is recorded in the immutable audit trail
            </p>
          </div>
          <button
            onClick={fetchLogs}
            title="Refresh"
            className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
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
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {log.userId?.name || "System"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <Shield className="w-3 h-3 text-sky-600" />
                        {log.resource}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-[11px] max-w-xs truncate">
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
