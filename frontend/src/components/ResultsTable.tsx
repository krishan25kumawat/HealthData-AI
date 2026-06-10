"use client";

import React from "react";

interface ResultsTableProps {
  data: any[];
  onRowClick: (patientData: any) => void;
}

export default function ResultsTable({ data, onRowClick }: ResultsTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Only show simple, flat columns in the table — hide nested arrays/objects
  const firstItem = data[0];
  const allKeys = Object.keys(firstItem).filter((key) => {
    if (key === "_id") return false;
    const val = firstItem[key];
    if (Array.isArray(val)) return false;
    if (typeof val === "object" && val !== null) return false;
    return true;
  });

  const prioritized = ["patient_id", "name", "age", "gender", "country", "diagnosis", "medicine", "dosage", "test_name", "test_result", "hospital_name", "scan_type"];
  const headers = prioritized.filter((h) => allKeys.includes(h));
  allKeys.forEach((k) => {
    if (!headers.includes(k)) headers.push(k);
  });

  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 border-b border-white/10 bg-slate-800/40 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-200">Search Results</h2>
        <span className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">
          {data.length} {data.length === 100 ? "(Max Limit Reached)" : "records"}
        </span>
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/60 text-slate-300 sticky top-0 backdrop-blur-md z-10">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 font-medium uppercase tracking-wider text-xs border-b border-white/5">
                  {header.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick(row)}
                className="hover:bg-blue-500/10 cursor-pointer transition-colors group"
              >
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-6 py-4 text-slate-300 group-hover:text-blue-100 max-w-xs truncate">
                    {row[header] !== undefined && row[header] !== null
                      ? String(row[header])
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
