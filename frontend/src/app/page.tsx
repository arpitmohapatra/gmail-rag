"use client";

import React, { useState } from "react";
import { Mail, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import SearchPanel from "../components/SearchPanel";
import PreviewPanel from "../components/PreviewPanel";
import { EmailCardProps, SearchResult } from "@/models/email-card";

const EmailCard: React.FC<EmailCardProps> = ({
  email,
  isSelected,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 border border-blue-200 shadow-sm"
          : "bg-white border hover:bg-gray-50 hover:shadow-sm"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {email.metadata.subject || "No Subject"}
            </p>
            <p className="text-sm text-gray-500 line-clamp-1">
              {email.metadata.from}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(email.metadata.date)}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 overflow-hidden">
          <div className="p-4 bg-white rounded border animate-in slide-in-from-top duration-200">
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {email.content}
            </p>
          </div>
        </div>
      )}

      <div className="mt-2 flex justify-end">
        {isSelected ? (
          <div className="flex items-center text-sm text-gray-500">
            <ChevronUp className="w-4 h-4" />
            <span className="ml-1">Show less</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            <ChevronDown className="w-4 h-4" />
            <span className="ml-1">Show more</span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmailRAG = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          <SearchPanel
            query={query}
            setQuery={setQuery}
            loading={loading}
            setLoading={setLoading}
            results={results}
            setResults={setResults}
            error={error}
            setSelectedEmail={setSelectedEmail}
            setError={setError}
          />
          <PreviewPanel
            results={results}
            loading={loading}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailRAG;
