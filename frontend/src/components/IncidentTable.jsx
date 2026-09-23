import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, UserCheck, Clock, Calendar } from "lucide-react";
import SeverityBadge from "./SeverityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import EmptyState from "./EmptyState.jsx";

const IncidentTable = ({ incidents = [], loading = false, onRefresh }) => {
  if (!loading && incidents.length === 0) {
    return (
      <EmptyState
        title="No incidents found"
        description="No security incidents match the current criteria or have been created in the database."
      />
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Severity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Assigned To</th>
            <th className="py-3 px-4">Created</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {incidents.map((incident) => (
            <tr
              key={incident._id}
              className="hover:bg-gray-50/70 transition-colors group"
            >
              {/* ID */}
              <td className="py-3 px-4 font-mono font-medium text-sky-700">
                <Link
                  to={`/incidents/${incident._id}`}
                  className="hover:underline"
                >
                  {incident.incidentId || incident._id.substring(0, 8)}
                </Link>
              </td>

              {/* Title */}
              <td className="py-3 px-4">
                <div className="font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
                  <Link to={`/incidents/${incident._id}`}>
                    {incident.title}
                  </Link>
                </div>
                <div className="text-[11px] text-gray-400 truncate max-w-xs">
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
              <td className="py-3 px-4 text-gray-700">
                {incident.assignedTo ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {incident.assignedTo.name?.charAt(0)}
                    </span>
                    {incident.assignedTo.name}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </td>

              {/* Created */}
              <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  {incident.createdAt
                    ? new Date(incident.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </td>

              {/* Action */}
              <td className="py-3 px-4 text-right">
                <Link
                  to={`/incidents/${incident._id}`}
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-medium px-2 py-1 rounded hover:bg-sky-50 transition-colors"
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
