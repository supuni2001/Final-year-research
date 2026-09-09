export type NetworkProvider = 'Dialog' | 'Mobitel' | 'Hutch' | 'SLT-Mobitel';

export interface SectorRecord {
  sectorName: string;
  sectorId: string;
  siteName: string;
  siteId: string;
  lat: number;
  lon: number;
  caConfig: '1CC' | '2CC' | '3CC';
  caConfigLabel: string; // e.g., '3CC available'
  bbhAvgThroughput: number; // in Mbps
  city: string;
  provider: NetworkProvider;
}

export interface CitySummary {
  city: string;
  avgThroughput: number;
  caConfig: '1CC' | '2CC' | '3CC';
  lat: number;
  lon: number;
  sectorsCount: number;
  topProvider: NetworkProvider;
}

export interface RouterSpec {
  imeiPrefix: string; // TAC (Type Allocation Code, first 8 digits)
  sampleImei: string;
  brand: string;
  model: string;
  category: string; // e.g., 'Cat 4', 'Cat 6', 'Cat 7', 'Cat 12'
  caSupport: '1CC' | '2CC' | '3CC';
  caSupportNum: number; // 1, 2, or 3
  supportedBands: string[];
  maxTheoreticalSpeed: number; // in Mbps
  priceRangeLKR: string;
  imageUrl?: string;
  description: string;
  recommendationRating: number; // 1-5
  badge?: string;
}

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ConfidenceCalculation {
  bbhThroughput: number;
  maxBbhReference: number; // 33 Mbps
  throughputScore: number; // e.g., 18 / 33 = 0.545
  caConfig: '1CC' | '2CC' | '3CC';
  caScore: number; // e.g., 3CC / 3 = 1.0
  confidenceScore: number; // e.g. 0.5 * throughputScore + 0.5 * caScore
  confidencePercentage: number; // e.g. 77.25%
  level: ConfidenceLevel;
  routerCompatibleWithCA: boolean;
  routerBottleneckNotice?: string;
}

export interface EvaluationResult {
  provider: NetworkProvider;
  city: string;
  sector?: SectorRecord;
  router: RouterSpec;
  calculation: ConfidenceCalculation;
  timestamp: string;
}

export type AppScreen = 
  | 'welcome' 
  | 'connection_question' 
  | 'existing_input' 
  | 'new_input' 
  | 'score_result' 
  | 'recommendations' 
  | 'dataset_explorer';
