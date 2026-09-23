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
    <div>
      <Navbar
        title="Security Tasks"
        subtitle="Cross-incident operational task management"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
            className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
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
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 shadow-xs">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === "COMPLETED"}
                    onChange={() => handleToggleTaskStatus(task)}
                    className="w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500 cursor-pointer"
                  />
                  <div>
                    <span
                      className={`font-semibold ${
                        task.status === "COMPLETED"
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {task.incidentId && (
                    <Link
                      to={`/incidents/${task.incidentId._id || task.incidentId}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-600 hover:underline bg-sky-50 px-2 py-0.5 rounded border border-sky-100"
                    >
                      <span>
                        {task.incidentId.incidentId || "View Case"}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
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
