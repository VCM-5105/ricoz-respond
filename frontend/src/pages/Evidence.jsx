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
    <div className="font-sans">
      <Navbar
        title="Evidence Repository"
        subtitle="Forensic evidence files, chain-of-custody artifacts, and captures"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border border-[#E8E0DE] rounded-xl p-5 shadow-xs">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
              Forensic Evidence Files
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              All artifacts collected across active and closed security incidents
            </p>
          </div>
          <button
            onClick={fetchEvidence}
            title="Refresh"
            className="p-2 border border-[#E8E0DE] rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1F0] transition-colors"
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
          <div className="bg-white border border-[#E8E0DE] rounded-xl divide-y divide-[#E8E0DE] overflow-hidden shadow-xs">
            {evidenceList.map((item) => (
              <div
                key={item._id}
                className="p-4 flex items-center justify-between hover:bg-[#F5F1F0]/50 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#6B1A1A]/10 text-[#6B1A1A]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#1A1A1A] block">
                      {item.originalName}
                    </span>
                    <span className="text-[11px] text-[#6B6B6B] block mt-0.5">
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
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#6B1A1A] hover:underline bg-[#6B1A1A]/10 px-2.5 py-0.5 rounded-full border border-[#6B1A1A]/20"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0DE] rounded-lg text-[#1A1A1A] hover:bg-[#F5F1F0] font-medium transition-colors"
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
