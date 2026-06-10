"use client";

import React, { useState } from "react";

interface ChatInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function ChatInterface({ onSearch, isLoading }: ChatInterfaceProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 mb-8 sticky top-4 z-10">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about patient data... (e.g. 'Show patients from India with Diabetes')"
          className="flex-1 bg-slate-800/50 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Searching</span>
            </div>
          ) : (
            "Search"
          )}
        </button>
      </form>
    </div>
  );
}
