import React, { useState } from 'react';
import { Search, Briefcase, FileCheck, CheckCircle, Clock, Sparkles, Send, Download } from 'lucide-react';

export const CandidatePortalView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [signed, setSigned] = useState(false);
  const [signatureText, setSignatureText] = useState('Sarah Chen');

  const jobs = [
    {
      id: 'JOB-101',
      title: 'Principal AI Architect',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$210,000 - $260,000',
      matchScore: 96.5,
      description: 'Lead agentic AI system architecture and multi-agent LangGraph orchestration for TalentOS AI.'
    },
    {
      id: 'JOB-102',
      title: 'Lead Frontend UX Engineer',
      department: 'Design & Product',
      location: 'Remote',
      salary: '$170,000 - $210,000',
      matchScore: 92.0,
      description: 'Build modern, responsive, WCAG-accessible enterprise components in React & TypeScript.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Candidate Portal & Career Hub
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, Sarah Chen</h1>
          <p className="text-slate-400 text-sm mt-1">Track your active applications and discover AI-matched career opportunities.</p>
        </div>
        
        {/* Profile Completeness Card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center bg-amber-500/10 text-amber-400 rounded-full font-bold text-lg border border-amber-500/30">
            92%
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Profile Match Score</div>
            <div className="text-xs text-amber-400 font-medium mt-0.5">High Candidate Compatibility</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Job Search & Application Tracking */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search job title, skill (e.g., LangGraph, PyTorch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md">
              Search Jobs
            </button>
          </div>

          {/* Active Application Status Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Active Application Timeline
            </h2>
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-base">Principal AI Architect</h3>
                  <span className="text-xs text-slate-400">Engineering • San Francisco, CA</span>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Offer Extended
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 my-4">
                <div className="h-2 bg-emerald-500 rounded-full"></div>
                <div className="h-2 bg-emerald-500 rounded-full"></div>
                <div className="h-2 bg-emerald-500 rounded-full"></div>
                <div className="h-2 bg-amber-400 rounded-full animate-pulse"></div>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">1. Applied</span>
                <span className="text-emerald-400 font-semibold">2. Screened</span>
                <span className="text-emerald-400 font-semibold">3. Interviewed</span>
                <span className="text-amber-400 font-semibold">4. Offer E-Sign</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Jobs */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI-Matched Career Opportunities
            </h2>
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <span className="text-xs text-slate-400">{job.department} • {job.location}</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                    {job.matchScore}% Match
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-emerald-400">{job.salary}</span>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-amber-400" /> Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Sidebar: Digital Offer E-Signature & AI Feedback */}
        <div className="space-y-8">
          {/* E-Signature Offer Portal Widget */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" /> Formal Offer Letter
            </h2>
            <p className="text-xs text-slate-400 mb-4">Principal AI Architect • Base: $210,000/yr + $25,000 Signing Bonus</p>

            {signed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-emerald-400">Offer E-Signed Successfully</div>
                <div className="text-xs text-slate-300 mt-1">Onboarding workflow triggered for Sarah Chen.</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Type Full Legal Signature</label>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-serif italic text-lg rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setSigned(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-md"
                >
                  Accept & E-Sign Offer Letter
                </button>
              </div>
            )}
          </div>

          {/* AI Resume Feedback Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Resume Optimizer Feedback
            </h2>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-1">Recommendation</span>
                Add AWS Solutions Architect certification to boost matching score by +5%.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">Key Strengths</span>
                Deep expertise in PyTorch, LangGraph, TypeScript, and distributed vector search.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
