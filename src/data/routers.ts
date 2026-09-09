import { RouterSpec } from '../types';

export const ROUTER_CATALOG: RouterSpec[] = [
  {
    imeiPrefix: '86326102',
    sampleImei: '863261024589123',
    brand: 'Huawei',
    model: 'B310s-927',
    category: 'Cat 4 (Legacy LTE)',
    caSupport: '1CC',
    caSupportNum: 1,
    supportedBands: ['B1 (2100MHz)', 'B3 (1800MHz)', 'B8 (900MHz)', 'B40 (2300MHz)'],
    maxTheoreticalSpeed: 150,
    priceRangeLKR: 'Rs. 6,500 - 8,500',
    description: 'Entry-level single carrier LTE router widely deployed in older subscriptions. Does not support Carrier Aggregation (CA), resulting in severe speed drops during peak hours in congested Colombo sectors.',
    recommendationRating: 2,
    badge: 'No Carrier Aggregation'
  },
  {
    imeiPrefix: '86199803',
    sampleImei: '861998037124901',
    brand: 'Tozed',
    model: 'ZLT S10 / P21',
    category: 'Cat 4 (Entry LTE)',
    caSupport: '1CC',
    caSupportNum: 1,
    supportedBands: ['B3 (1800MHz)', 'B8 (900MHz)', 'B40 (2300MHz)'],
    maxTheoreticalSpeed: 150,
    priceRangeLKR: 'Rs. 7,000 - 9,000',
    description: 'Budget fixed 4G router. Single component carrier without multi-band aggregation. Susceptible to buffer-bloat and high ping during busy hours (BBH).',
    recommendationRating: 2,
    badge: 'Single Carrier'
  },
  {
    imeiPrefix: '86452802',
    sampleImei: '864528023190847',
    brand: 'ZTE',
    model: 'MF283+',
    category: 'Cat 4 (Single Band)',
    caSupport: '1CC',
    caSupportNum: 1,
    supportedBands: ['B1 (2100MHz)', 'B3 (1800MHz)', 'B7 (2600MHz)', 'B20 (800MHz)'],
    maxTheoreticalSpeed: 150,
    priceRangeLKR: 'Rs. 8,000 - 10,000',
    description: 'Standard 4G wireless CPE. Good basic signal sensitivity but locks into a single frequency channel at a time.',
    recommendationRating: 2.5,
    badge: 'Single Carrier'
  },
  {
    imeiPrefix: '86241004',
    sampleImei: '862410049103482',
    brand: 'Huawei',
    model: 'B535-232 / 4G Router 3 Pro',
    category: 'Cat 7 (2CC Carrier Aggregation)',
    caSupport: '2CC',
    caSupportNum: 2,
    supportedBands: ['B1+B3', 'B3+B7', 'B3+B8', 'B1+B8', 'B3+B20', 'B3+B40'],
    maxTheoreticalSpeed: 300,
    priceRangeLKR: 'Rs. 24,000 - 29,000',
    description: 'High-performance dual-carrier aggregator. Combines two frequency bands simultaneously, mitigating peak-hour congestion and delivering 2x higher throughput stability across suburban Colombo.',
    recommendationRating: 4.5,
    badge: 'Highly Recommended (2CC)'
  },
  {
    imeiPrefix: '86845304',
    sampleImei: '868453041902837',
    brand: 'TP-Link',
    model: 'Archer MR600 (v2/v3)',
    category: 'Cat 6 (2CC LTE-Advanced)',
    caSupport: '2CC',
    caSupportNum: 2,
    supportedBands: ['B1+B3', 'B3+B5', 'B3+B7', 'B3+B8', 'B3+B20', 'B40+B40'],
    maxTheoreticalSpeed: 300,
    priceRangeLKR: 'Rs. 26,000 - 32,000',
    description: 'Dual-band AC1200 Wi-Fi with 4G+ Cat6 carrier aggregation. Ideal for work-from-home, online meetings, and gaming in Colombo areas with 2CC/3CC base stations.',
    recommendationRating: 4.5,
    badge: 'Popular Choice (2CC)'
  },
  {
    imeiPrefix: '86049204',
    sampleImei: '860492048192734',
    brand: 'ZTE',
    model: 'MF286D (LTE-A Pro)',
    category: 'Cat 12 (3CC Carrier Aggregation)',
    caSupport: '3CC',
    caSupportNum: 3,
    supportedBands: ['B1+B3+B7', 'B1+B3+B8', 'B1+B3+B20', 'B3+B7+B20', 'B3+B40+B40'],
    maxTheoreticalSpeed: 600,
    priceRangeLKR: 'Rs. 34,000 - 42,000',
    description: 'Enterprise-grade 3-Carrier Aggregation router. Aggregates up to 3 separate frequency channels simultaneously, matching Colombo prime base stations for near-zero jitter and maximum BBH speed.',
    recommendationRating: 5,
    badge: 'Top Pick for 3CC Colombo Sites'
  },
  {
    imeiPrefix: '86518904',
    sampleImei: '865189049102845',
    brand: 'Huawei',
    model: '5G CPE Pro 2 (H122-373)',
    category: '5G & LTE Cat 19 (3CC+ Ultra)',
    caSupport: '3CC',
    caSupportNum: 3,
    supportedBands: ['5G NR Sub-6', 'LTE 3CC / 4CC CA', 'All Colombo Commercial Bands'],
    maxTheoreticalSpeed: 1600,
    priceRangeLKR: 'Rs. 68,000 - 85,000',
    description: 'Future-ready flagship modem supporting high-order carrier aggregation and 5G NSA/SA networks. Provides the highest possible network confidence score in urban Colombo.',
    recommendationRating: 5,
    badge: 'Ultra Premium Flagship'
  }
];

export function findRouterByImei(imei: string): RouterSpec {
  const cleanImei = imei.replace(/\D/g, '');
  if (cleanImei.length >= 8) {
    const prefix = cleanImei.substring(0, 8);
    const match = ROUTER_CATALOG.find(r => r.imeiPrefix === prefix);
    if (match) return match;
  }

  // Fallback heuristic based on generic prefix or default to a standard Cat 4 model if unknown
  return {
    imeiPrefix: cleanImei.substring(0, 8) || 'Unknown',
    sampleImei: cleanImei || '358901234567890',
    brand: 'Generic / Unknown Brand',
    model: 'Standard 4G Wireless Terminal',
    category: 'Cat 4 (Single Band)',
    caSupport: '1CC',
    caSupportNum: 1,
    supportedBands: ['B3 (1800MHz)', 'B8 (900MHz)'],
    maxTheoreticalSpeed: 150,
    priceRangeLKR: 'Rs. 6,000 - 10,000',
    description: 'Unidentified router profile. System defaults to single-carrier Cat 4 capability for conservative confidence assessment.',
    recommendationRating: 2.5,
    badge: 'Unregistered TAC'
  };
}
