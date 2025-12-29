export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  lastWatered: string;
  wateringFrequency: number;
  sunlightRequirement: 'low' | 'medium' | 'high';
  healthStatus: 'healthy' | 'needs-water' | 'critical';
  notes?: string;
}

export interface CareMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}