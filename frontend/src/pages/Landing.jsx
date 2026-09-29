import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  Lock,
  FileText,
  BookOpen,
  CheckCircle2,
  Clock,
  Activity,
  Layers
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F0ECEB] text-[#1A1A1A] font-sans select-none flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#F0ECEB]/90 backdrop-blur-md border-b border-[#E8E0DE]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6B1A1A] flex items-center justify-center text-white shadow-md shadow-[#6B1A1A]/20 font-serif text-xl font-bold transition-transform group-hover:scale-105">
              R
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif text-xl font-bold tracking-tight text-[#1A1A1A]">
                  Ricoz
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">
                  Respond
                </span>
              </div>
              <span className="text-[10px] text-[#6B6B6B] tracking-wider uppercase font-semibold mt-1">
                Security Operations
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#6B6B6B]">
            <a href="#features" className="hover:text-[#6B1A1A] transition-colors">
              Platform Features
            </a>
            <a href="#playbooks" className="hover:text-[#6B1A1A] transition-colors">
              Response Workflows
            </a>
            <a href="#metrics" className="hover:text-[#6B1A1A] transition-colors">
              Operational Metrics
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                <span>Go to Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:text-[#6B1A1A] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 lg:py-28 px-6 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0DE] text-xs font-medium text-[#6B6B6B] shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>Next-Generation Cyber Incident Management</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.15]">
            Enterprise Incident Response & Security Posture
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <span>{isAuthenticated ? "Open Dashboard" : "Access Security Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F5F1F0] text-[#1A1A1A] border border-[#E8E0DE] text-sm font-semibold rounded-lg transition-all"
            >
              <Lock className="w-4 h-4 text-[#6B1A1A]" />
              <span>Analyst Sign In</span>
            </Link>
          </div>
        </section>

        {/* METRICS ROW */}
        <section id="metrics" className="px-6 max-w-6xl mx-auto pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 text-center shadow-xs">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#6B1A1A] block">
                99.9%
              </span>
              <span className="font-serif text-sm font-semibold text-[#1A1A1A] mt-1 block">
                High Availability
              </span>
              <p className="text-[11px] text-[#6B6B6B] mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 text-center shadow-xs">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#6B1A1A] block">
                &lt; 5m
              </span>
              <span className="font-serif text-sm font-semibold text-[#1A1A1A] mt-1 block">
                Mean Containment
              </span>
              <p className="text-[11px] text-[#6B6B6B] mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 text-center shadow-xs">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#6B1A1A] block">
                24/7
              </span>
              <span className="font-serif text-sm font-semibold text-[#1A1A1A] mt-1 block">
                Real-Time Triage
              </span>
              <p className="text-[11px] text-[#6B6B6B] mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 text-center shadow-xs">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#6B1A1A] block">
                100%
              </span>
              <span className="font-serif text-sm font-semibold text-[#1A1A1A] mt-1 block">
                Immutable Auditing
              </span>
              <p className="text-[11px] text-[#6B6B6B] mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Comprehensive Incident Lifecycle Capabilities
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel
              urna in neque fermentum vulputate sed vitae elit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs hover:border-[#6B1A1A] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#6B1A1A]/10 text-[#6B1A1A] flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                Case Triage & Isolation
              </h3>
              <p className="mt-2 text-xs text-[#6B6B6B] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet,
                nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs hover:border-[#6B1A1A] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#6B1A1A]/10 text-[#6B1A1A] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                Automated Playbook Workflows
              </h3>
              <p className="mt-2 text-xs text-[#6B6B6B] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet,
                nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0DE] rounded-xl p-6 shadow-xs hover:border-[#6B1A1A] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#6B1A1A]/10 text-[#6B1A1A] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                Forensic Evidence Custody
              </h3>
              <p className="mt-2 text-xs text-[#6B6B6B] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet,
                nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim
                ligula venenatis dolor.
              </p>
            </div>
          </div>
        </section>

        {/* WORKFLOWS SECTION */}
        <section id="playbooks" className="py-16 px-6 max-w-6xl mx-auto">
          <div className="bg-white border border-[#E8E0DE] rounded-2xl p-8 sm:p-12 shadow-xs">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A96E]">
                Operational Resilience
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-2">
                Standardized Response Playbooks & Execution
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed
                diam eget risus varius blandit sit amet non magna. Integer posuere erat
                a ante venenatis dapibus posuere velit aliquet.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6B6B6B]">
                    <strong className="text-[#1A1A1A]">Rapid Containment:</strong> Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6B6B6B]">
                    <strong className="text-[#1A1A1A]">Team Load Balancing:</strong> Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6B6B6B]">
                    <strong className="text-[#1A1A1A]">Verifiable Audit Trail:</strong> Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B1A1A] hover:bg-[#4A1212] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  <span>Start Responding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="bg-[#6B1A1A] text-white rounded-2xl p-8 sm:p-12 shadow-md text-center">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-xl mx-auto">
              Ready to Accelerate Incident Response?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#F0ECEB]/80 max-w-lg mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia
              odio vitae vestibulum vestibulum integer nec odio.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F0ECEB] text-[#6B1A1A] text-xs font-bold rounded-lg shadow-xs transition-all"
              >
                <span>Create Analyst Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A1212] hover:bg-[#342424] text-white border border-[#C9A96E]/30 text-xs font-bold rounded-lg transition-all"
              >
                <span>Sign In to Console</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* STRICTLY NO FOOTER ANYWHERE IN APPLICATION */}
    </div>
  );
};

export default Landing;
