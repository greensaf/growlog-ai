export interface GrowData {
  date?: string;
  time?: string;
  location?: string;
  regime?: string;
  plantId?: string;
  cycleId: string;
  cycleName?: string;
  strain?: string;
  start?: string;
  startForm?: string;
  sourceId?: string;
  tOutside?: number;
  tAir?: number;
  tSolution?: number;
  tSubstrate?: number;
  hInside?: number;
  hOutside?: number;
  CO2?: number;
  VPD?: number;
  PPFD?: number;
  EC?: number;
  PH?: number;
  Irrigation?: string;
  Event?: string;
  Comment?: string;
  imageUrl?: string;
}
