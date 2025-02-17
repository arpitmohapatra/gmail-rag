import { Dispatch, SetStateAction } from "react";

export interface EmailCardProps {
  email: {
    metadata: {
      subject: string;
      from: string;
      date: string;
    };
    content: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export interface Email {
  metadata: {
    subject: string;
    from: string;
    date: string;
  };
  content: string;
}

export interface SearchResult {
  summary?: string;
  relevant_emails?: Email[];
}

export interface PreviewPanelProps {
  results: SearchResult | null;
  loading: boolean;
  selectedEmail: number | null;
  setSelectedEmail: Dispatch<SetStateAction<number | null>>;
}

export interface SearchPanelProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  results: SearchResult | null;
  setResults: React.Dispatch<React.SetStateAction<SearchResult | null>>;
  setSelectedEmail: React.Dispatch<React.SetStateAction<number | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
