export interface StyleDefinition {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedPhoto {
  styleId: string;
  status: GenerationStatus;
  imageUrl?: string;
  error?: string;
}