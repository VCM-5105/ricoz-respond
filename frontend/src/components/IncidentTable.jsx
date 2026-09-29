import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Calendar } from "lucide-react";
import SeverityBadge from "./SeverityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import EmptyState from "./EmptyState.jsx";

const IncidentTable = ({ incidents = [], loading = false, onRefresh }) => {
  if (!loading && incidents.length === 0) {
    return (
      <EmptyState
        title="No incidents found"
        description="No security incidents match the current criteria or have been recorded."
      />
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-[#E8E0DE] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <table className="w-full text-left border-collapse text-xs font-sans">
        <thead>
          <tr className="bg-[#F5F1F0] border-b border-[#E8E0DE] text-[#6B6B6B] uppercase tracking-wider font-semibold text-[11px]">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Severity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Assigned To</th>
            <th className="py-3 px-4">Created</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E0DE]">
          {incidents.map((incident) => (
            <tr
              key={incident._id}
              className="hover:bg-[#F5F1F0]/70 transition-colors group"
            >
              {/* ID */}
              <td className="py-3 px-4 font-mono font-semibold text-[#6B1A1A]">
                <Link
                  to={`/incidents/${incident._id}`}
                  className="hover:underline"
                >
                  {incident.incidentId || incident._id.substring(0, 8)}
                </Link>
              </td>

              {/* Title */}
              <td className="py-3 px-4">
                <div className="font-semibold text-[#1A1A1A] group-hover:text-[#6B1A1A] transition-colors">
                  <Link to={`/incidents/${incident._id}`}>
                    {incident.title}
                  </Link>
                </div>
                <div className="text-[11px] text-[#6B6B6B] truncate max-w-xs">
                  {incident.incidentType || "Security Incident"}
                </div>
              </td>

              {/* Severity */}
              <td className="py-3 px-4">
                <SeverityBadge severity={incident.severity} />
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <StatusBadge status={incident.status} />
              </td>

              {/* Assigned To */}
              <td className="py-3 px-4 text-[#1A1A1A]">
                {incident.assignedTo ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                    <span className="w-5 h-5 rounded-full bg-[#6B1A1A14] text-[#6B1A1A] flex items-center justify-center text-[10px] font-bold">
                      {incident.assignedTo.name?.charAt(0)}
                    </span>
                    {incident.assignedTo.name}
                  </span>
                ) : (
                  <span className="text-[#9B9B9B] italic">Unassigned</span>
                )}
              </td>

              {/* Created */}
              <td className="py-3 px-4 text-[#6B6B6B] whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#9B9B9B]" />
                  {incident.createdAt
                    ? new Date(incident.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </td>

              {/* Action */}
              <td className="py-3 px-4 text-right">
                <Link
                  to={`/incidents/${incident._id}`}
                  className="inline-flex items-center gap-1 text-[#6B1A1A] hover:text-[#4A1212] font-semibold px-2 py-1 rounded hover:bg-[#6B1A1A0F] transition-colors"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;
