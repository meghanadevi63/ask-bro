import { VisualizationData, TableData } from './visualization';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  visualizations?: VisualizationData[];
  data?: TableData;
  sql?: string;
}