import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0ECEB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 select-none font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#6B1A1A] flex items-center justify-center text-white shadow-md shadow-[#6B1A1A]/20 mb-3 font-serif text-2xl font-bold">
          R
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Ricoz
          </h2>
          <span className="text-sm font-semibold uppercase tracking-wider text-[#C9A96E]">
            Respond
          </span>
        </div>
        <p className="mt-1 text-xs text-[#6B6B6B]">
          Enterprise Security Incident Response Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl sm:px-8 border border-[#E8E0DE]">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Sign in</h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Authenticate to access the security operations console
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]">
                Email Address
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9B9B9B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="analyst@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg text-[#1A1A1A] placeholder-[#9B9B9B] focus:outline-none focus:border-[#6B1A1A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]">
                Password
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9B9B9B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-[#F5F1F0] border border-[#E8E0DE] rounded-lg text-[#1A1A1A] placeholder-[#9B9B9B] focus:outline-none focus:border-[#6B1A1A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-[#6B1A1A] hover:bg-[#4A1212] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B1A1A] disabled:opacity-50 transition-colors"
            >
              {loading ? "Authenticating..." : "Sign in to Console"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E8E0DE] text-center">
            <p className="text-xs text-[#6B6B6B]">
              Need an analyst account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#6B1A1A] hover:text-[#4A1212] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
