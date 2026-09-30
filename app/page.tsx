"use client";

import { useState } from "react";
import { Link2, FileText, Lock, ShieldCheck } from "lucide-react";

export default function SubmissionPortal() {
  const [activeTab, setActiveTab] = useState<"drive" | "file">("drive");
  const [studentId, setStudentId] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ activeTab, studentId, driveUrl, file });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Top Status Bar */}
      <div className="flex items-center gap-4 text-xs tracking-widest text-emerald-400 font-mono mb-6 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          DATA SYSTEM_READY
        </span>
        <span className="text-slate-600">//</span>
        <span>99.8% DATA_LINK</span>
        <span className="text-slate-600">//</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE_SSL
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            ASSIGNMENT SUBMISSION PORTAL
          </h1>
          <p className="text-sm text-slate-400">
            Fill in your details below to submit your assignment link.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("drive")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "drive"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Link2 className="w-4 h-4" />
            Drive Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "file"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF / Excel File
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student ID Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Student ID
            </label>
            <input
              type="text"
              required
              placeholder="UGR/XXXX/XX"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 font-mono">
              Format: UGR/XXXX/XX
            </p>
          </div>

          {/* Tab Content: Drive Link */}
          {activeTab === "drive" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Google Drive Link
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/..."
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          )}

          {/* Tab Content: File Upload */}
          {activeTab === "file" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Upload File (PDF / Excel)
              </label>
              <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-slate-700 transition-colors bg-slate-950/50">
                <input
                  type="file"
                  required
                  accept=".pdf,.xls,.xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-medium">
                  {file ? file.name : "Click or drag to upload file"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, XLS, XLSX
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-2"
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </main>
  );
}
