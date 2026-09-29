import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Shield, Plus, Check, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Modal from "../components/Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Settings = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    try {
      setRoleLoading(true);
      setErrorMsg("");
      await api.post("/roles", {
        name: roleName.trim(),
        description: roleDesc.trim(),
        permissions: ["read", "write"]
      });
      setIsRoleModalOpen(false);
      setRoleName("");
      setRoleDesc("");
      setStatusMsg("Role created successfully");
      fetchRoles();
    } catch (err) {
      setErrorMsg(err.message || "Failed to create role");
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <Navbar
        title="Platform Settings"
        subtitle="Manage analyst profile, access roles, and security policies"
      />

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {statusMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-lg flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg("")} className="font-bold">×</button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs">
          <h3 className="font-serif text-base font-bold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E8E0DE]">
            Analyst Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#6B6B6B] block text-[11px] font-semibold uppercase">
                Name
              </span>
              <span className="font-semibold text-[#1A1A1A] text-sm mt-0.5 block">
                {user?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-[#6B6B6B] block text-[11px] font-semibold uppercase">
                Email Address
              </span>
              <span className="font-medium text-[#1A1A1A] mt-0.5 block">
                {user?.email || "-"}
              </span>
            </div>
            <div>
              <span className="text-[#6B6B6B] block text-[11px] font-semibold uppercase">
                Active Role
              </span>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6B1A1A]/10 text-[#6B1A1A] border border-[#6B1A1A]/20">
                <Shield className="w-3 h-3 text-[#6B1A1A]" />
                {user?.role?.name || "Security Analyst"}
              </span>
            </div>
            <div>
              <span className="text-[#6B6B6B] block text-[11px] font-semibold uppercase">
                Account ID
              </span>
              <span className="font-mono text-[#6B6B6B] mt-0.5 block">
                {user?._id || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Security Roles Card */}
        <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E0DE]">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                Security Roles
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Configured organizational roles and permission sets
              </p>
            </div>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="divide-y divide-[#E8E0DE]">
            {roles.map((r) => (
              <div
                key={r._id}
                className="py-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#1A1A1A] block">
                    {r.name}
                  </span>
                  <span className="text-[#6B6B6B] text-[11px]">
                    {r.description || "No description"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#6B6B6B]">
                  {r.permissions?.length || 0} permission(s)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Add Security Role"
      >
        {errorMsg && (
          <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleCreateRole} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Role Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Incident Commander, Threat Hunter"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Description
            </label>
            <textarea
              rows="2"
              placeholder="Role responsibilities..."
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg focus:outline-none focus:border-[#6B1A1A] focus:bg-white text-[#1A1A1A]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0DE]">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="px-3.5 py-1.5 border border-[#E8E0DE] rounded-lg text-xs text-[#1A1A1A] hover:bg-[#F5F1F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roleLoading}
              className="px-4 py-1.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white rounded-lg text-xs font-medium shadow-xs"
            >
              {roleLoading ? "Saving..." : "Save Role"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
