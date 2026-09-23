import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, ListOrdered, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Playbooks = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [newPlaybook, setNewPlaybook] = useState({
    name: "",
    description: "",
    incidentType: "Phishing",
    steps: [{ title: "", description: "" }]
  });

  const fetchPlaybooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/playbooks");
      setPlaybooks(res.data || []);
    } catch (err) {
      console.error("Failed to load playbooks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  const handleAddStepField = () => {
    setNewPlaybook({
      ...newPlaybook,
      steps: [...newPlaybook.steps, { title: "", description: "" }]
    });
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...newPlaybook.steps];
    updated[index][field] = value;
    setNewPlaybook({ ...newPlaybook, steps: updated });
  };

  const handleCreatePlaybook = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newPlaybook.name.trim()) {
      setFormError("Playbook name is required");
      return;
    }

    try {
      setFormLoading(true);
      const filteredSteps = newPlaybook.steps.filter((s) => s.title.trim());
      await api.post("/playbooks", {
        name: newPlaybook.name,
        description: newPlaybook.description,
        incidentType: newPlaybook.incidentType,
        steps: filteredSteps
      });

      setIsModalOpen(false);
      setNewPlaybook({
        name: "",
        description: "",
        incidentType: "Phishing",
        steps: [{ title: "", description: "" }]
      });
      fetchPlaybooks();
    } catch (err) {
      setFormError(err.message || "Failed to create playbook");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Incident Response Playbooks"
        subtitle="Standard operating procedures and automated response templates"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Response Playbooks
            </h2>
            <p className="text-xs text-gray-500">
              Standardized response playbooks and workflows
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPlaybooks}
              title="Refresh"
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Playbook</span>
            </button>
          </div>
        </div>

        {/* Playbooks Grid or Mandatory Empty State */}
        {loading ? (
          <Loader message="Loading playbooks..." />
        ) : playbooks.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No playbooks available"
            description="There are currently no response playbooks available. Create one to automate incident tasks."
            actionLabel="Create Playbook"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playbooks.map((pb) => (
              <div
                key={pb._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900 line-clamp-1">
                      {pb.name}
                    </span>
                    <span className="text-[10px] bg-sky-50 text-sky-700 font-mono px-2 py-0.5 rounded font-medium border border-sky-100">
                      {pb.incidentType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                    {pb.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                    <ListOrdered className="w-3.5 h-3.5" />
                    {pb.stepCount || 0} response step(s)
                  </span>
                  <Link
                    to={`/playbooks/${pb._id}`}
                    className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:underline"
                  >
                    <span>View Steps</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE PLAYBOOK MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Response Playbook"
        maxWidth="max-w-xl"
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreatePlaybook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Playbook Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Credential Stuffing Remediation"
              value={newPlaybook.name}
              onChange={(e) =>
                setNewPlaybook({ ...newPlaybook, name: e.target.value })
              }
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Target Incident Type
              </label>
              <input
                type="text"
                placeholder="e.g. Account Takeover, Phishing"
                value={newPlaybook.incidentType}
                onChange={(e) =>
                  setNewPlaybook({
                    ...newPlaybook,
                    incidentType: e.target.value
                  })
                }
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brief Description
              </label>
              <input
                type="text"
                placeholder="Overview of this procedure"
                value={newPlaybook.description}
                onChange={(e) =>
                  setNewPlaybook({
                    ...newPlaybook,
                    description: e.target.value
                  })
                }
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700">
                Action Steps (Turned into real tasks upon execution)
              </label>
              <button
                type="button"
                onClick={handleAddStepField}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {newPlaybook.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-gray-50 border border-gray-200 rounded space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Step ${idx + 1} title (e.g. Revoke active OAuth sessions)`}
                      value={step.title}
                      onChange={(e) =>
                        handleStepChange(idx, "title", e.target.value)
                      }
                      className="w-full text-xs px-2 py-1 bg-white border border-gray-300 rounded"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description or checklist note"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(idx, "description", e.target.value)
                    }
                    className="w-full text-xs px-2 py-1 bg-white border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {formLoading ? "Saving Playbook..." : "Save Playbook"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Playbooks;
