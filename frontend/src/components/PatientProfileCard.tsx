"use client";

import React, { useEffect } from "react";

interface PatientProfileCardProps {
  data: any;
  onClose: () => void;
}

export default function PatientProfileCard({ data, onClose }: PatientProfileCardProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!data) return null;

  // Separate flat fields from nested arrays/objects
  const flatEntries: [string, any][] = [];
  const nestedEntries: [string, any[]][] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "_id") continue;

    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      // $lookup result (array of objects)
      nestedEntries.push([key, value as any[]]);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // $lookup + $unwind result (single object)
      nestedEntries.push([key, [value]]);
    } else {
      flatEntries.push([key, value]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-label="Close modal"
      ></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-inner">
              {data.name ? data.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {data.name || data.patient_id || "Patient Profile"}
              </h2>
              <p className="text-sm text-slate-400">
                {data.patient_id ? `ID: ${data.patient_id}` : "Record Details"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Flat fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {flatEntries.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-base text-slate-200 bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800/50 break-words">
                  {value !== null && value !== undefined ? String(value) : "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Nested linked data */}
          {nestedEntries.map(([key, items]) => (
            <div key={key} className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-slate-700/60"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 px-2">
                  {key.replace(/_/g, " ")} ({items.length})
                </span>
                <div className="h-px flex-1 bg-slate-700/60"></div>
              </div>

              <div className="space-y-3">
                {items.map((item, i) => {
                  const fields = Object.entries(item).filter(
                    ([k]) => k !== "_id" && k !== "patient_id"
                  );
                  return (
                    <div
                      key={i}
                      className="bg-slate-800/40 px-4 py-3 rounded-xl border border-slate-700/40 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3"
                    >
                      {fields.map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            {k.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm text-slate-200">
                            {v !== null && v !== undefined ? String(v) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
