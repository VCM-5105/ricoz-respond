import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Filter, RefreshCw, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/tasks", { params });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="font-sans">
      <Navbar
        title="Security Tasks"
        subtitle="Cross-incident operational task management"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B6B6B] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#9B9B9B]" />
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#6B1A1A]"
            >
              <option value="">All Tasks</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <button
            onClick={fetchTasks}
            title="Refresh"
            className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Task List or Mandatory Empty State */}
        {loading ? (
          <Loader message="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description="There are currently no tasks matching the criteria."
          />
        ) : (
          <div className="bg-white border border-[#E8E0DE] rounded-xl divide-y divide-[#E8E0DE] overflow-hidden shadow-xs">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 flex items-center justify-between hover:bg-[#F5F1F0]/50 transition-colors text-xs"
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
                      className={`font-semibold ${
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

                <div className="flex items-center gap-4">
                  {task.incidentId && (
                    <Link
                      to={`/incidents/${task.incidentId._id || task.incidentId}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#6B1A1A] hover:underline bg-[#6B1A1A]/10 px-2.5 py-0.5 rounded-full border border-[#6B1A1A]/20"
                    >
                      <span>
                        {task.incidentId.incidentId || "View Case"}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  <span className="text-[11px] text-[#6B6B6B] bg-[#F5F1F0] px-2.5 py-1 rounded-md font-medium border border-[#E8E0DE]">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
