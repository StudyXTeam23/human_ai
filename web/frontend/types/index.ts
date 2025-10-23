/**
 * Type definitions for AI Text Humanizer
 */

// Input modes
export type InputMode = "text" | "document";

// Parameter types
export type LengthOption = "Normal" | "Concise" | "Expanded";
export type SimilarityOption = "Low" | "Moderate" | "High" | "Neutral";
export type StyleOption =
  | "Neutral"
  | "Academic"
  | "Business"
  | "Creative"
  | "Technical"
  | "Friendly"
  | "Informal"
  | "Reference"
  | "Custom";

// History item
export interface HistoryItem {
  id: string;
  preview: string; // First 100 chars
  fullText: string; // Complete input text
  outputText: string; // Complete output text
  timestamp: number;
  params: {
    length: LengthOption;
    similarity: SimilarityOption;
    style: StyleOption;
    customStyle?: string;
  };
}

// API Request/Response types
export interface HumanizeRequest {
  source: {
    mode: InputMode;
    text: string;
  };
  params: {
    length: LengthOption;
    similarity: SimilarityOption;
    style: StyleOption;
    customStyle?: string;
  };
}

export interface HumanizeResponse {
  content: string;
  chars: number;
  processingTime?: number;
}

// Fine-tune parameters (frontend only)
export interface FineTuneParams {
  tone: number; // 0-100: Formal to Casual
  sentenceLength: number; // 0-100: Short to Long
  complexity: number; // 0-100: Simple to Complex
}

