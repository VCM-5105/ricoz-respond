import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Paperclip, FileText, Download, RefreshCw, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Evidence = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const res = await api.get("/evidence");
      setEvidenceList(res.data || []);
    } catch (err) {
      console.error("Failed to load evidence:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  return (
    <div>
      <Navbar
        title="Evidence Repository"
        subtitle="Forensic evidence files, chain-of-custody artifacts, and captures"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Forensic Evidence Files
            </h2>
            <p className="text-xs text-gray-500">
              All artifacts collected across active and closed security incidents
            </p>
          </div>
          <button
            onClick={fetchEvidence}
            title="Refresh"
            className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Evidence List or Mandatory Empty State */}
        {loading ? (
          <Loader message="Loading evidence files..." />
        ) : evidenceList.length === 0 ? (
          <EmptyState
            icon={Paperclip}
            title="No evidence has been collected."
            description="No evidence documents have been uploaded yet."
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 shadow-xs">
            {evidenceList.map((item) => (
              <div
                key={item._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-sky-50 text-sky-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">
                      {item.originalName}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {item.description || "No description provided"} • {(item.fileSize / 1024).toFixed(1)} KB • Uploaded by{" "}
                      <strong>{item.uploadedBy?.name || "Analyst"}</strong> on{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.incidentId && (
                    <Link
                      to={`/incidents/${item.incidentId._id || item.incidentId}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-sky-600 hover:underline bg-sky-50 px-2 py-0.5 rounded border border-sky-100"
                    >
                      <span>
                        {item.incidentId.incidentId || "View Case"}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  <a
                    href={`http://localhost:5000/api/evidence/download/${item._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidence;
