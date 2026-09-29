import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  UserCheck,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  CheckSquare,
  Paperclip,
  History,
  BookOpen,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Play
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import SeverityBadge from "../components/SeverityBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const IncidentDetails = () => {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Tab Data States
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, completedTasks: 0 });
  const [evidenceList, setEvidenceList] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({ title: "", description: "", incidentType: "", severity: "" });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAnalyst, setSelectedAnalyst] = useState("");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "" });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceDesc, setEvidenceDesc] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/incidents/${id}`);
      setIncident(res.data);
      setEditForm({
        title: res.data.title,
        description: res.data.description || "",
        incidentType: res.data.incidentType,
        severity: res.data.severity
      });
      setSelectedStatus(res.data.status);
      setSelectedAnalyst(res.data.assignedTo?._id || "");
    } catch (err) {
      setErrorBanner(err.message || "Failed to load incident");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/incident/${id}`);
      setTasks(res.data.tasks || []);
      setTaskStats({
        totalTasks: res.data.totalTasks || 0,
        completedTasks: res.data.completedTasks || 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvidence = async () => {
    try {
      const res = await api.get(`/evidence/incident/${id}`);
      setEvidenceList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await api.get(`/timeline/incident/${id}`);
      setTimeline(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlaybooks = async () => {
    try {
      const res = await api.get("/playbooks");
      setPlaybooks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    if (activeTab === "tasks") fetchTasks();
    if (activeTab === "evidence") fetchEvidence();
    if (activeTab === "timeline") fetchTimeline();
    if (activeTab === "playbook") fetchPlaybooks();
  }, [activeTab, id]);

  const handleUpdateIncident = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.put(`/incidents/${id}`, editForm);
      setIsEditModalOpen(false);
      setSuccessBanner("Incident updated successfully");
      fetchIncidentDetails();
      fetchTimeline();
    } catch (err) {
      setErrorBanner(err.message || "Failed to update incident");
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.put(`/incidents/${id}`, { status: selectedStatus });
      setIsStatusModalOpen(false);
      setSuccessBanner(`Status changed to ${selectedStatus}`);
      fetchIncidentDetails();
      fetchTimeline();
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignAnalyst = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.put(`/incidents/${id}`, { assignedTo: selectedAnalyst || null });
      setIsAssignModalOpen(false);
      setSuccessBanner("Analyst assignment updated");
      fetchIncidentDetails();
      fetchTimeline();
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    try {
      setActionLoading(true);
      await api.post("/tasks", {
        incidentId: id,
        ...taskForm,
        assignedTo: taskForm.assignedTo || null
      });
      setIsTaskModalOpen(false);
      setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      fetchTasks();
      fetchTimeline();
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      fetchTasks();
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceFile) return;

    try {
      setActionLoading(true);
      const data = new FormData();
      data.append("file", evidenceFile);
      data.append("incidentId", id);
      data.append("description", evidenceDesc);

      await api.post("/evidence", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setIsEvidenceModalOpen(false);
      setEvidenceFile(null);
      setEvidenceDesc("");
      fetchEvidence();
      fetchTimeline();
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecutePlaybook = async (playbookId) => {
    try {
      setActionLoading(true);
      await api.post(`/playbooks/${playbookId}/execute`, { incidentId: id });
      setSuccessBanner("Playbook executed! Real response tasks created successfully.");
      fetchTasks();
      fetchTimeline();
      setActiveTab("tasks");
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading incident records..." />;
  }

  if (!incident) {
    return (
      <div className="p-8 font-sans">
        <EmptyState
          title="Incident Not Found"
          description="The requested incident could not be found."
        />
        <div className="mt-4 text-center">
          <Link to="/incidents" className="text-xs text-[#6B1A1A] hover:underline font-medium">
            Back to Incidents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Navbar
        title={`Incident ${incident.incidentId || incident._id.substring(0, 8)}`}
        subtitle="Detailed case investigation workspace"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incidents</span>
          </Link>
        </div>

        {/* Notifications Banners */}
        {errorBanner && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center justify-between">
            <span>{errorBanner}</span>
            <button onClick={() => setErrorBanner("")} className="font-bold ml-2">×</button>
          </div>
        )}
        {successBanner && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-lg flex items-center justify-between">
            <span>{successBanner}</span>
            <button onClick={() => setSuccessBanner("")} className="font-bold ml-2">×</button>
          </div>
        )}

        {/* Incident Header Card */}
        <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#6B1A1A] bg-[#6B1A1A]/10 px-2.5 py-0.5 rounded-md border border-[#6B1A1A]/20">
                  {incident.incidentId || incident._id}
                </span>
                <span className="text-xs text-[#6B6B6B] font-medium">
                  {incident.incidentType}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">{incident.title}</h2>
              <div className="flex items-center gap-3 mt-3">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
                <span className="text-xs text-[#6B6B6B] flex items-center gap-1.5 pl-2 border-l border-[#E8E0DE]">
                  <UserCheck className="w-3.5 h-3.5 text-[#9B9B9B]" />
                  Assigned:{" "}
                  <strong className="text-[#1A1A1A] font-medium">
                    {incident.assignedTo?.name || "Unassigned"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
              >
                <Edit2 className="w-3 h-3 text-[#6B6B6B]" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
              >
                <CheckCircle className="w-3 h-3 text-[#6B6B6B]" />
                <span>Change Status</span>
              </button>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Investigation Tabs */}
        <div className="border-b border-[#E8E0DE] bg-white rounded-t-xl px-4 pt-1 shadow-xs">
          <div className="flex space-x-6 text-xs font-semibold">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "tasks", label: "Tasks", icon: CheckSquare },
              { id: "evidence", label: "Evidence", icon: Paperclip },
              { id: "timeline", label: "Timeline", icon: History },
              { id: "playbook", label: "Playbook", icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 border-b-2 font-medium transition-colors ${
                    isActive
                      ? "border-[#6B1A1A] text-[#6B1A1A] font-semibold"
                      : "border-transparent text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#E8E0DE]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Case Description
              </h3>
              <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">
                {incident.description || "No description provided for this incident."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Incident Type
                </span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {incident.incidentType}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Severity Level
                </span>
                <div className="mt-1">
                  <SeverityBadge severity={incident.severity} />
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Current Status
                </span>
                <div className="mt-1">
                  <StatusBadge status={incident.status} />
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Assigned Analyst
                </span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {incident.assignedTo?.name || "Unassigned"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Created Date
                </span>
                <span className="font-medium text-gray-600 mt-0.5 block">
                  {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase font-semibold">
                  Last Updated
                </span>
                <span className="font-medium text-gray-600 mt-0.5 block">
                  {incident.updatedAt ? new Date(incident.updatedAt).toLocaleString() : "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === "tasks" && (
          <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-6 shadow-xs">
            {/* Header + Dynamic Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0DE]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Incident Tasks</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  Completed tasks:{" "}
                  <strong className="text-emerald-600 font-semibold">
                    {taskStats.completedTasks}
                  </strong>{" "}
                  / Total tasks:{" "}
                  <strong className="text-[#1A1A1A] font-semibold">{taskStats.totalTasks}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
            </div>

            {/* Task List or Mandatory Empty State */}
            {tasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No tasks for this incident"
                description="There are currently no tasks assigned or created for this case."
                actionLabel="Create First Task"
                onAction={() => setIsTaskModalOpen(true)}
              />
            ) : (
              <div className="divide-y divide-[#E8E0DE] border border-[#E8E0DE] rounded-xl overflow-hidden bg-white">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3.5 flex items-center justify-between hover:bg-[#F5F1F0]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === "COMPLETED"}
                        onChange={() => handleToggleTaskStatus(task)}
                        className="w-4 h-4 text-[#6B1A1A] accent-[#6B1A1A] rounded border-[#E8E0DE] focus:ring-[#6B1A1A] cursor-pointer"
                      />
                      <div>
                        <span
                          className={`text-xs font-semibold ${
                            task.status === "COMPLETED"
                              ? "line-through text-[#9B9B9B]"
                              : "text-[#1A1A1A]"
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#6B6B6B] bg-[#F5F1F0] px-2.5 py-1 rounded-md font-medium border border-[#E8E0DE]">
                        {task.assignedTo?.name || "Unassigned"}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-[#9B9B9B] hover:text-red-600 p-1 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EVIDENCE */}
        {activeTab === "evidence" && (
          <div className="bg-white border border-[#E8E0DE] rounded-b-xl p-6 space-y-6 shadow-xs font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0DE]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Collected Evidence</h3>
                <p className="text-xs text-[#6B6B6B]">
                  Forensic artifacts, PCAP captures, memory dumps, and logs stored securely
                </p>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Evidence</span>
              </button>
            </div>

            {/* Evidence List or Mandatory Empty State */}
            {evidenceList.length === 0 ? (
              <EmptyState
                icon={Paperclip}
                title="No evidence has been collected for this incident."
                description="Upload log files, screenshots, or memory dumps to attach evidence to this case."
                actionLabel="Upload Evidence"
                onAction={() => setIsEvidenceModalOpen(true)}
              />
            ) : (
              <div className="divide-y divide-[#E8E0DE] border border-[#E8E0DE] rounded-xl overflow-hidden bg-white">
                {evidenceList.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-4 flex items-center justify-between hover:bg-[#F5F1F0]/50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#6B1A1A]/10 text-[#6B1A1A] rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#1A1A1A] block">
                          {ev.originalName}
                        </span>
                        <span className="text-[11px] text-[#6B6B6B] block mt-0.5">
                          {ev.description || "No description"} • Uploaded by{" "}
                          <strong>{ev.uploadedBy?.name || "Analyst"}</strong> on{" "}
                          {new Date(ev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`http://localhost:5000/api/evidence/download/${ev._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0DE] rounded-lg text-[#1A1A1A] hover:bg-[#F5F1F0] font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="bg-white border border-[#E8E0DE] rounded-b-xl p-6 space-y-6 shadow-xs font-sans">
            <div className="pb-4 border-b border-[#E8E0DE]">
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Incident Audit Timeline</h3>
              <p className="text-xs text-[#6B6B6B]">
                Chronological record of all investigation activities
              </p>
            </div>

            {/* Timeline List or Mandatory Empty State */}
            {timeline.length === 0 ? (
              <EmptyState
                icon={History}
                title="No activity recorded."
                description="Actions taken on this incident will automatically appear here."
              />
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E0DE]">
                {timeline.map((entry) => (
                  <div key={entry._id} className="relative flex items-start gap-3">
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[#6B1A1A] ring-4 ring-white" />
                    <div className="flex-1 bg-[#F5F1F0] border border-[#E8E0DE] p-3 rounded-lg text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#1A1A1A]">
                          {entry.action}
                        </span>
                        <span className="text-[10px] text-[#9B9B9B]">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#6B6B6B] text-[11px]">{entry.description}</p>
                      <span className="text-[10px] text-[#6B1A1A] font-medium mt-1 block">
                        Logged by: {entry.userId?.name || "System"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PLAYBOOK */}
        {activeTab === "playbook" && (
          <div className="bg-white border border-[#E8E0DE] rounded-b-xl p-6 space-y-6 shadow-xs font-sans">
            <div className="pb-4 border-b border-[#E8E0DE] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Response Playbooks</h3>
                <p className="text-xs text-[#6B6B6B]">
                  Execute pre-configured response playbooks to auto-generate tasks and audit logs
                </p>
              </div>
              <Link
                to="/playbooks"
                className="text-xs text-[#6B1A1A] hover:underline font-semibold"
              >
                Manage Playbooks
              </Link>
            </div>

            {playbooks.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No playbooks available"
                description="No response playbooks are available yet. Create one to run simulated response workflows."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playbooks.map((pb) => (
                  <div
                    key={pb._id}
                    className="border border-[#E8E0DE] rounded-xl p-5 hover:border-[#6B1A1A] transition-all flex flex-col justify-between bg-white shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          {pb.name}
                        </span>
                        <span className="text-[10px] bg-[#6B1A1A]/10 text-[#6B1A1A] px-2.5 py-0.5 rounded-full font-mono font-medium border border-[#6B1A1A]/20">
                          {pb.incidentType}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B6B] mb-4">
                        {pb.description || "Automated response playbook workflow."}
                      </p>
                    </div>

                    <button
                      onClick={() => handleExecutePlaybook(pb._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs disabled:opacity-50 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Run Playbook</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Incident"
      >
        <form onSubmit={handleUpdateIncident} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Incident Type
              </label>
              <input
                type="text"
                value={editForm.incidentType}
                onChange={(e) =>
                  setEditForm({ ...editForm, incidentType: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Severity
              </label>
              <select
                value={editForm.severity}
                onChange={(e) =>
                  setEditForm({ ...editForm, severity: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* CHANGE STATUS MODAL */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change Incident Status"
      >
        <form onSubmit={handleChangeStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Select Lifecycle Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="CONTAINED">CONTAINED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium"
            >
              Update Status
            </button>
          </div>
        </form>
      </Modal>

      {/* ASSIGN ANALYST MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Analyst"
      >
        <form onSubmit={handleAssignAnalyst} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Assign Analyst
            </label>
            <select
              value={selectedAnalyst}
              onChange={(e) => setSelectedAnalyst(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            >
              <option value="">-- Unassigned --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role?.name || "Analyst"})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium"
            >
              Save Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE TASK MODAL */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create Incident Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Isolate compromised workstation host"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Task Description
            </label>
            <textarea
              rows="2"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Assign Task To
            </label>
            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignedTo: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            >
              <option value="">-- Unassigned --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>

      {/* UPLOAD EVIDENCE MODAL */}
      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Upload Forensic Evidence"
      >
        <form onSubmit={handleUploadEvidence} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Select Evidence File *
            </label>
            <input
              type="file"
              required
              onChange={(e) => setEvidenceFile(e.target.files[0])}
              className="w-full text-xs p-2 border border-[#E8E0DE] rounded-lg bg-[#F5F1F0] text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              File Description
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Wireshark PCAP from core switch interface..."
              value={evidenceDesc}
              onChange={(e) => setEvidenceDesc(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsEvidenceModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium"
            >
              {actionLoading ? "Uploading..." : "Upload Evidence"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IncidentDetails;
