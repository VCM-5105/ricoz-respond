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
    <div className="font-sans">
      <Navbar
        title="Incident Response Playbooks"
        subtitle="Standard operating procedures and automated response templates"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
              Response Playbooks
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Standardized response playbooks and workflows
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPlaybooks}
              title="Refresh"
              className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
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
                className="bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs hover:border-[#6B1A1A] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-bold text-[#1A1A1A] line-clamp-1">
                      {pb.name}
                    </span>
                    <span className="text-[10px] bg-[#6B1A1A]/10 text-[#6B1A1A] font-mono px-2.5 py-0.5 rounded-full font-medium border border-[#6B1A1A]/20">
                      {pb.incidentType}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mb-4 line-clamp-2">
                    {pb.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E0DE] flex items-center justify-between text-xs">
                  <span className="text-[#6B6B6B] flex items-center gap-1.5 text-[11px]">
                    <ListOrdered className="w-3.5 h-3.5 text-[#9B9B9B]" />
                    {pb.stepCount || 0} response step(s)
                  </span>
                  <Link
                    to={`/playbooks/${pb._id}`}
                    className="inline-flex items-center gap-1 text-[#6B1A1A] font-semibold hover:underline"
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreatePlaybook} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
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
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
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
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
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
                className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#1A1A1A]">
                Action Steps (Turned into real tasks upon execution)
              </label>
              <button
                type="button"
                onClick={handleAddStepField}
                className="text-xs text-[#6B1A1A] hover:underline font-semibold"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {newPlaybook.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#6B1A1A] font-bold">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Step ${idx + 1} title (e.g. Revoke active OAuth sessions)`}
                      value={step.title}
                      onChange={(e) =>
                        handleStepChange(idx, "title", e.target.value)
                      }
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#E8E0DE] rounded-md focus:outline-none focus:border-[#6B1A1A]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description or checklist note"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(idx, "description", e.target.value)
                    }
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#E8E0DE] rounded-md focus:outline-none focus:border-[#6B1A1A]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 border border-[#E8E0DE] rounded-lg text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs disabled:opacity-50"
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
