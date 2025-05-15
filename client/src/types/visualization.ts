export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface VisualizationData {
  type: ChartType;
  title: string;
  labels: string[];
  datasets: ChartDataset[];
  description?: string;
}

export interface TableData {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
  note?: string;
}