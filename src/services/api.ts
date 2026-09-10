import { CitySummary, EvaluationResult, NetworkProvider, RouterSpec } from '../types';

export interface EvaluatePayload {
  location: string;
  isp: NetworkProvider;
  routerModel?: string;
  routerImei?: string;
  customRouter?: RouterSpec;
}

export interface RecommendationResponse {
  city: string;
  recommendedProvider: NetworkProvider;
  avgThroughputInArea: number;
  primaryRouter: RouterSpec;
  highPerformanceRouter: RouterSpec;
  allRouters: RouterSpec[];
}

export interface DatasetSummary {
  totalSectors: number;
  avgDistrictThroughput: number;
  maxReferenceThroughput: number;
  caBreakdown: {
    ca3ccCount: number;
    ca3ccPercentage: number;
    ca2ccCount: number;
    ca2ccPercentage: number;
    ca1ccCount: number;
    ca1ccPercentage: number;
  };
}

/**
 * Fetches real-time dynamic city summaries aggregated from the 503 sectors dataset on the backend.
 */
export async function fetchLocations(): Promise<CitySummary[]> {
  try {
    const res = await fetch('/api/locations');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchLocations failed, falling back to local dataset:', err);
    return [];
  }
}

/**
 * Evaluates an existing connection against backend sector data using the thesis mathematical model.
 */
export async function evaluateConnectionOnBackend(payload: EvaluatePayload): Promise<EvaluationResult | null> {
  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API evaluate failed, falling back to local calculation:', err);
    return null;
  }
}

/**
 * Fetches optimal broadband provider and router recommendation for a location.
 */
export async function fetchRecommendations(location: string): Promise<RecommendationResponse | null> {
  try {
    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API recommendations failed:', err);
    return null;
  }
}

/**
 * Fetches dataset overview summary.
 */
export async function fetchDatasetSummary(): Promise<DatasetSummary | null> {
  try {
    const res = await fetch('/api/dataset/summary');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API dataset summary failed:', err);
    return null;
  }
}
