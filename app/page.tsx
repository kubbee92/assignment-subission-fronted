"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        sendData: (data: string) => void;
        close: () => void;
      };
    };
  }
}

export default function Page() {
  const [mode, setMode] = useState<"link" | "file">("file");
  const [studentId, setStudentId] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const formattedId = studentId.trim().toUpperCase();
    if (!formattedId) {
      setErrorMsg("Please enter a valid Student ID.");
      return;
    }

    const tg = window.Telegram?.WebApp;

    if (mode === "link") {
      if (!driveUrl.trim()) {
        setErrorMsg("Please enter a Google Drive link.");
        return;
      }

      setIsSubmitting(true);
      const payload = JSON.stringify({
        mode: "link",
        student_id: formattedId,
        file_url: driveUrl.trim(),
      });

      if (tg) {
        tg.sendData(payload);
      } else {
        alert("Submitted Link: " + payload);
      }
      return;
    }

    if (mode === "file") {
      if (!selectedFile) {
        setErrorMsg("Please select a PDF or Excel file to submit.");
        return;
      }

      setIsSubmitting(true);
      // Sends registration data to Telegram bot so user can upload directly in chat
      const payload = JSON.stringify({
        mode: "file",
        student_id: formattedId,
        filename: selectedFile.name,
      });

      if (tg) {
        tg.sendData(payload);
      } else {
        alert("File registered for Student ID: " + formattedId + "\nNow attach the file in Telegram chat.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-2">SUBMISSION PORTAL</h1>
        <p className="text-xs text-slate-400 text-center mb-6">
          Fill in your details below to submit your assignment.
        </p>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setMode("link"); setErrorMsg(""); }}
            className={`py-2 px-3 text-sm font-medium rounded-lg border transition ${
              mode === "link"
                ? "bg-cyan-600 border-cyan-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🔗 Drive Link
          </button>
          <button
            type="button"
            onClick={() => { setMode("file"); setErrorMsg(""); }}
            className={`py-2 px-3 text-sm font-medium rounded-lg border transition ${
              mode === "file"
                ? "bg-cyan-600 border-cyan-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            📄 PDF / Excel File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Student ID</label>
            <input
              type="text"
              placeholder="e.g. UGR/1234/15"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Drive Link Input */}
          {mode === "link" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Drive URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          )}

          {/* File Input */}
          {mode === "file" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment File</label>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">Accepts PDF, XLS, or XLSX files (max 10 MB).</p>
            </div>
          )}

          {/* Error Display */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition text-sm shadow-lg shadow-cyan-500/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </form>
      </div>
    </main>
  );
}