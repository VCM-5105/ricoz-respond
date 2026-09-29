import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, ShieldAlert, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import IncidentTable from "../components/IncidentTable.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incidentType: "Phishing Attempt",
    severity: "MEDIUM",
    status: "OPEN",
    assignedTo: ""
  });

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (severityFilter) params.severity = severityFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get("/incidents", { params });
      setIncidents(res.data || []);
    } catch (err) {
      console.error("Failed to load incidents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Load users
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err.message);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchUsers();
  }, [severityFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIncidents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Incident title is required");
      return;
    }

    try {
      setFormLoading(true);
      await api.post("/incidents", {
        ...formData,
        assignedTo: formData.assignedTo || null
      });

      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        incidentType: "Phishing Attempt",
        severity: "MEDIUM",
        status: "OPEN",
        assignedTo: ""
      });
      fetchIncidents();
    } catch (err) {
      setFormError(err.message || "Failed to create incident");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Incident Management"
        subtitle="Active security cases and investigation workflows"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs font-sans">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search incidents by title, ID, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] placeholder-[#9B9B9B] transition-all"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
            >
              <option value="">All Severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="CONTAINED">Contained</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchIncidents}
              title="Refresh"
              className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Incident</span>
            </button>
          </div>
        </div>

        {/* Content / Table */}
        {loading ? (
          <Loader message="Loading incidents..." />
        ) : (
          <IncidentTable
            incidents={incidents}
            loading={loading}
            onRefresh={fetchIncidents}
          />
        )}
      </div>

      {/* Create Incident Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Security Incident"
        maxWidth="max-w-xl"
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateIncident} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suspicious outbound connections on Web-01"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Provide background, observed anomalies, or affected endpoints..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Incident Type
              </label>
              <input
                type="text"
                placeholder="e.g. Malware, Phishing, Unauthorized Access"
                value={formData.incidentType}
                onChange={(e) =>
                  setFormData({ ...formData, incidentType: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
              >
                <option value="OPEN">OPEN</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="CONTAINED">CONTAINED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Assign Analyst
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] transition-all"
              >
                <option value="">-- Unassigned --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role?.name || "Analyst"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs disabled:opacity-50 transition-colors"
            >
              {formLoading ? "Creating Incident..." : "Create Incident"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Incidents;
