import { ConfidenceCalculation, ConfidenceLevel, RouterSpec } from '../types';
import { MAX_BBH_THROUGHPUT } from '../data/colomboDataset';

export function calculateConfidence(
  bbhThroughput: number,
  siteCaConfig: '1CC' | '2CC' | '3CC',
  routerSpec?: RouterSpec
): ConfidenceCalculation {
  // 1. Throughput Score calculation as defined in Thesis:
  // Throughput Score = Respective throughput for the city / BBH maximum (33)
  const maxBbh = MAX_BBH_THROUGHPUT;
  const rawThroughputScore = bbhThroughput / maxBbh;
  const throughputScore = Math.min(Math.max(rawThroughputScore, 0), 1);

  // 2. CA Score calculation:
  // Site CA configuration capability
  const siteCaNumeric = siteCaConfig === '3CC' ? 3 : siteCaConfig === '2CC' ? 2 : 1;
  
  // If router is provided, check if router bottlenecks the site CA capability!
  let effectiveCaNumeric = siteCaNumeric;
  let routerCompatibleWithCA = true;
  let routerBottleneckNotice: string | undefined = undefined;

  if (routerSpec) {
    if (routerSpec.caSupportNum < siteCaNumeric) {
      // Router hardware limits CA
      effectiveCaNumeric = routerSpec.caSupportNum;
      routerCompatibleWithCA = false;
      routerBottleneckNotice = `Your current router (${routerSpec.model}) only supports ${routerSpec.caSupport} (Cat 4), so it cannot utilize the faster ${siteCaConfig} carrier aggregation deployed in this sector.`;
    }
  }

  // CA Score = CA Configuration / 3
  const caScore = effectiveCaNumeric / 3;

  // 3. Confidence Score:
  // Confidence Score = 0.5 (Throughput Score) + 0.5 (CA Score)
  const confidenceScore = 0.5 * throughputScore + 0.5 * caScore;
  const confidencePercentage = Math.round(confidenceScore * 10000) / 100; // e.g. 77.25

  // 4. Level classification from Figure 4.3 / Thesis Class Diagram:
  // LOW: < 40%
  // MEDIUM: 40% - 70%
  // HIGH: > 70%
  let level: ConfidenceLevel = 'MEDIUM';
  if (confidencePercentage < 40) {
    level = 'LOW';
  } else if (confidencePercentage > 70) {
    level = 'HIGH';
  }

  return {
    bbhThroughput,
    maxBbhReference: maxBbh,
    throughputScore: Math.round(throughputScore * 1000) / 1000,
    caConfig: siteCaConfig,
    caScore: Math.round(caScore * 1000) / 1000,
    confidenceScore: Math.round(confidenceScore * 10000) / 10000,
    confidencePercentage,
    level,
    routerCompatibleWithCA,
    routerBottleneckNotice
  };
}

export function getLevelColor(level: ConfidenceLevel) {
  switch (level) {
    case 'HIGH':
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-teal-600',
        ring: 'ring-emerald-400',
        label: 'High Stability & Confidence'
      };
    case 'MEDIUM':
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-500',
        gradient: 'from-amber-500 to-yellow-600',
        ring: 'ring-amber-400',
        label: 'Moderate Stability'
      };
    case 'LOW':
      return {
        text: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badgeBg: 'bg-rose-500',
        gradient: 'from-rose-500 to-red-600',
        ring: 'ring-rose-400',
        label: 'Low Stability (< 40%) - Upgrade Recommended'
      };
  }
}
