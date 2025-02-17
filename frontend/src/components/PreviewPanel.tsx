"use client";
import React from "react";
import {
  Mail,
  Calendar,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

const PreviewPanel = ({
  results,
  loading,
  selectedEmail,
  setSelectedEmail,
}: {
  results: SearchResult | null;
  loading: boolean;
  selectedEmail: number | null;
  setSelectedEmail: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          {results?.relevant_emails && (
            <CardDescription>
              Found {results.relevant_emails.length} relevant emails
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-4 text-sm text-gray-500">
                Searching through your emails...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results?.relevant_emails?.map((email, index) => (
                <EmailCard
                  key={index}
                  email={email}
                  isSelected={selectedEmail === index}
                  onClick={() =>
                    setSelectedEmail(selectedEmail === index ? null : index)
                  }
                />
              ))}

              {results?.relevant_emails?.length === 0 && (
                <div className="text-center py-12">
                  <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">No matching emails found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewPanel;
