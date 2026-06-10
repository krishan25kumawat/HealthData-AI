"use client";

import React, { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ResultsTable from "@/components/ResultsTable";
import PatientProfileCard from "@/components/PatientProfileCard";

export default function Home() {
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [queryInfo, setQueryInfo] = useState<any | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setQueryInfo(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail?.error || data.detail || "Failed to fetch results");
      }

      setResults(data.results || []);
      setQueryInfo({
        collection: data.query_used?.collection,
        count: data.count
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 max-w-7xl mx-auto relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          HealthData AI
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Query your healthcare database using natural language.
        </p>
      </header>

      <ChatInterface onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3 animate-in fade-in">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold mb-1">Query Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {queryInfo && !isLoading && (
        <div className="mb-6 flex gap-4 text-sm text-slate-400 px-2 animate-in fade-in">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            Queried Collection: <strong className="text-slate-200 capitalize">{queryInfo.collection}</strong>
          </span>
          <span>•</span>
          <span>Found {queryInfo.count} records</span>
        </div>
      )}

      {!isLoading && results !== null && results.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-2xl border-dashed">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-slate-300 mb-2">No records found</h3>
          <p className="text-slate-500">Try adjusting your query or expanding your search terms.</p>
        </div>
      )}

      {!isLoading && results && results.length > 0 && (
        <ResultsTable data={results} onRowClick={(row) => setSelectedPatient(row)} />
      )}

      {selectedPatient && (
        <PatientProfileCard 
          data={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </main>
  );
}
