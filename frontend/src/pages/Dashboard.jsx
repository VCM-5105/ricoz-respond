import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Plus,
  Filter,
  RefreshCw
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import IncidentTable from "../components/IncidentTable.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    openIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch dynamic stats directly
      const statsRes = await api.get("/dashboard/stats");
      setStats(statsRes.data);

      // Fetch incidents with applied filters
      const params = {};
      if (search) params.search = search;
      if (severityFilter) params.severity = severityFilter;
      if (statusFilter) params.status = statusFilter;

      const incidentsRes = await api.get("/incidents", { params });
      setIncidents(incidentsRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [severityFilter, statusFilter]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div>
      <Navbar
        title="Security Operations Dashboard"
        subtitle="Real-time incident response metrics and security posture"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon={ShieldAlert}
            color="indigo"
            subtext="All tracked cases"
          />
          <StatCard
            title="Open Incidents"
            value={stats.openIncidents}
            icon={AlertTriangle}
            color="amber"
            subtext="Status = OPEN"
          />
          <StatCard
            title="Critical Incidents"
            value={stats.criticalIncidents}
            icon={Flame}
            color="red"
            subtext="Severity = CRITICAL"
          />
          <StatCard
            title="Resolved Incidents"
            value={stats.resolvedIncidents}
            icon={CheckCircle2}
            color="emerald"
            subtext="Status = RESOLVED"
          />
        </div>

        {/* Section Header & Filters */}
        <div className="bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0DE]">
            <div>
              <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
                Recent Incidents
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Active security cases and investigations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                title="Refresh data"
                className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                to="/incidents"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Incident</span>
              </Link>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search incidents by ID, title, or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A] placeholder-[#9B9B9B] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B6B6B] flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filters:
              </span>

              {/* Severity Filter */}
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

              {/* Status Filter */}
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
          </div>
        </div>

        {/* Incidents Table / Dynamic Empty State */}
        {loading ? (
          <Loader message="Loading incidents..." />
        ) : (
          <IncidentTable incidents={incidents} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
