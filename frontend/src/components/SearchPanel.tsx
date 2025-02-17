"use client";

import React from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SearchPanelProps } from "@/models/email-card";

const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  loading,
  results,
  setLoading,
  setResults,
  error,
  setSelectedEmail,
  setError,
}) => {
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSelectedEmail(null);

    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError("An error occurred while searching. Please try again.");
      console.error("Error searching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Search</CardTitle>
          <CardDescription>
            Search through your email history using natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search your emails..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {results?.summary && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom duration-300">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Summary
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{results.summary}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SearchPanel;
