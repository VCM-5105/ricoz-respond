import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Plus, ListOrdered, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const PlaybookDetails = () => {
  const { id } = useParams();
  const [playbook, setPlaybook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const fetchPlaybook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/playbooks/${id}`);
      setPlaybook(res.data);
    } catch (err) {
      setErrorBanner(err.message || "Failed to load playbook");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaybook();
  }, [id]);

  const handleAddStep = async (e) => {
    e.preventDefault();
    if (!stepTitle.trim()) return;

    try {
      setActionLoading(true);
      await api.post(`/playbooks/${id}/steps`, {
        title: stepTitle.trim(),
        description: stepDesc.trim()
      });
      setIsStepModalOpen(false);
      setStepTitle("");
      setStepDesc("");
      fetchPlaybook();
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading playbook details..." />;
  }

  if (!playbook) {
    return (
      <div className="p-8">
        <EmptyState
          title="Playbook Not Found"
          description="The requested playbook could not be found."
        />
        <div className="mt-4 text-center">
          <Link to="/playbooks" className="text-xs text-sky-600 hover:underline">
            Back to Playbooks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        title={playbook.name}
        subtitle="Standard operating procedure configuration"
      />

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Playbooks</span>
          </Link>
        </div>

        {errorBanner && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded">
            {errorBanner}
          </div>
        )}

        {/* Playbook Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-semibold border border-sky-100">
              {playbook.incidentType}
            </span>
            <span className="text-xs text-gray-400">
              Created: {new Date(playbook.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-base font-bold text-gray-900">{playbook.name}</h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {playbook.description || "No description provided."}
          </p>
        </div>

        {/* Step List Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Action Steps ({playbook.steps?.length || 0})
              </h3>
              <p className="text-xs text-gray-500">
                When executed against an incident, each step generates an operational task
              </p>
            </div>
            <button
              onClick={() => setIsStepModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          {!playbook.steps || playbook.steps.length === 0 ? (
            <EmptyState
              icon={ListOrdered}
              title="No steps defined"
              description="This playbook does not have any response steps yet."
              actionLabel="Add First Step"
              onAction={() => setIsStepModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {playbook.steps.map((step, idx) => (
                <div
                  key={step._id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {step.order || idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    {step.description && (
                      <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD STEP MODAL */}
      <Modal
        isOpen={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        title="Add Playbook Response Step"
      >
        <form onSubmit={handleAddStep} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Step Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Block malicious domain in DNS firewall"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Detailed Instructions
            </label>
            <textarea
              rows="3"
              placeholder="Operational notes, CLI commands, or validation checks..."
              value={stepDesc}
              onChange={(e) => setStepDesc(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsStepModalOpen(false)}
              className="px-3 py-1.5 border rounded text-xs text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold shadow-xs"
            >
              {actionLoading ? "Saving Step..." : "Save Step"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlaybookDetails;
