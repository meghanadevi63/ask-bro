export interface QueryHistoryItem {
  id: string;
  question: string;
  timestamp: Date;
  successful: boolean;
}

export interface SavedInsight {
  id: string;
  title: string;
  question: string;
  response: string;
  visualizations: any[];  // Can be updated with proper types
  timestamp: Date;
}