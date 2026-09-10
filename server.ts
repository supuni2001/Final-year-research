import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Load raw sectors dataset
interface RawSector {
  sectorName: string;
  sectorId: string;
  siteName: string;
  lat: number;
  lon: number;
  siteId: string;
  caConfig: '1CC' | '2CC' | '3CC';
  caConfigLabel: string;
  bbhAvgThroughput: number;
  city: string;
  provider: 'Dialog' | 'Mobitel' | 'SLT-Mobitel' | 'Hutch';
}

let sectors: RawSector[] = [];

try {
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'colombo_sectors.json');
  if (fs.existsSync(jsonPath)) {
    sectors = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
} catch (err) {
  console.error('Error loading colombo_sectors.json:', err);
}

// Router Specs Catalog
const ROUTER_CATALOG = [
  {
    imeiPrefix: '86326102',
    sampleImei: '863261024589123',
    brand: 'Huawei',
    model: 'B310s-927',
    category: 'Cat 4 (Legacy LTE)',
    caSupport: '1CC' as const,
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
    caSupport: '1CC' as const,
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
    caSupport: '1CC' as const,
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
    caSupport: '2CC' as const,
    caSupportNum: 2,
    supportedBands: ['B1+B3', 'B3+B7', 'B3+B8', 'B1+B8', 'B3+B20', 'B3+B40'],
    maxTheoreticalSpeed: 300,
    priceRangeLKR: 'Rs. 24,000 - 29,000',
    description: 'High-performance dual-carrier aggregator. Combines two frequency bands simultaneously, mitigating peak-hour congestion and delivering 2x higher throughput stability across suburban Colombo.',
    recommendationRating: 4.5,
    badge: 'Recommended 2CC Router'
  },
  {
    imeiPrefix: '86901205',
    sampleImei: '869012054128963',
    brand: 'Huawei',
    model: 'B818-263 / 4G Router 3 Prime',
    category: 'Cat 19 (4CC / 3CC Multi-Carrier)',
    caSupport: '3CC' as const,
    caSupportNum: 3,
    supportedBands: ['B1+B3+B7', 'B1+B3+B8', 'B3+B7+B20', 'B1+B3+B40'],
    maxTheoreticalSpeed: 1600,
    priceRangeLKR: 'Rs. 45,000 - 58,000',
    description: 'Flagship enterprise-grade LTE-Advanced Pro router. Can aggregate 3 to 4 carriers simultaneously, maximizing Colombo base stations that have full 3CC available.',
    recommendationRating: 5,
    badge: 'Best 3CC Performance'
  },
  {
    imeiPrefix: '86571903',
    sampleImei: '865719038201947',
    brand: 'ZTE',
    model: 'MF286 / MF286D',
    category: 'Cat 6 / Cat 12 LTE-A',
    caSupport: '2CC' as const,
    caSupportNum: 2,
    supportedBands: ['B1+B3', 'B3+B7', 'B3+B20', 'B7+B20'],
    maxTheoreticalSpeed: 600,
    priceRangeLKR: 'Rs. 21,000 - 26,000',
    description: 'Popular high-gain dual antenna CA router. Delivers consistent low latency and smooth video conferencing under busy base-station load.',
    recommendationRating: 4,
    badge: 'Great Value CA'
  }
];

// Helper to compute city summaries dynamically from real dataset
function getCitySummaries() {
  const cityMap = new Map<string, {
    city: string;
    totalThroughput: number;
    count: number;
    caCounts: { '1CC': number; '2CC': number; '3CC': number };
    lats: number[];
    lons: number[];
    providerCounts: Record<string, number>;
  }>();

  for (const s of sectors) {
    if (!cityMap.has(s.city)) {
      cityMap.set(s.city, {
        city: s.city,
        totalThroughput: 0,
        count: 0,
        caCounts: { '1CC': 0, '2CC': 0, '3CC': 0 },
        lats: [],
        lons: [],
        providerCounts: {}
      });
    }
    const item = cityMap.get(s.city)!;
    item.totalThroughput += s.bbhAvgThroughput;
    item.count += 1;
    const caKey = s.caConfig as '1CC' | '2CC' | '3CC';
    item.caCounts[caKey] = (item.caCounts[caKey] || 0) + 1;
    item.lats.push(s.lat);
    item.lons.push(s.lon);
    item.providerCounts[s.provider] = (item.providerCounts[s.provider] || 0) + 1;
  }

  const summaries = Array.from(cityMap.values()).map(entry => {
    const avgThroughput = Math.round((entry.totalThroughput / entry.count) * 100) / 100;
    
    // Determine dominant CA config
    let dominantCa: '1CC' | '2CC' | '3CC' = '3CC';
    if (entry.caCounts['3CC'] >= entry.caCounts['2CC'] && entry.caCounts['3CC'] >= entry.caCounts['1CC']) {
      dominantCa = '3CC';
    } else if (entry.caCounts['2CC'] >= entry.caCounts['1CC']) {
      dominantCa = '2CC';
    } else {
      dominantCa = '1CC';
    }

    // Determine top provider
    let topProvider: 'Dialog' | 'Mobitel' | 'SLT-Mobitel' | 'Hutch' = 'Dialog';
    let maxProviderCount = 0;
    for (const [p, cnt] of Object.entries(entry.providerCounts)) {
      if (cnt > maxProviderCount) {
        maxProviderCount = cnt;
        topProvider = p as any;
      }
    }

    const avgLat = entry.lats.reduce((a, b) => a + b, 0) / entry.lats.length;
    const avgLon = entry.lons.reduce((a, b) => a + b, 0) / entry.lons.length;

    return {
      city: entry.city,
      avgThroughput,
      caConfig: dominantCa,
      lat: Math.round(avgLat * 10000) / 10000,
      lon: Math.round(avgLon * 10000) / 10000,
      sectorsCount: entry.count,
      topProvider
    };
  });

  return summaries.sort((a, b) => b.avgThroughput - a.avgThroughput);
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'wifiwiz',
    datasetSize: sectors.length,
    timestamp: new Date().toISOString()
  });
});

// District Overview & Stats
app.get('/api/dataset/summary', (req, res) => {
  if (sectors.length === 0) {
    return res.json({ totalSectors: 0, avgDistrictThroughput: 0, maxThroughput: 33 });
  }

  const total = sectors.reduce((sum, s) => sum + s.bbhAvgThroughput, 0);
  const avg = Math.round((total / sectors.length) * 100) / 100;
  
  const ca3cc = sectors.filter(s => s.caConfig === '3CC').length;
  const ca2cc = sectors.filter(s => s.caConfig === '2CC').length;
  const ca1cc = sectors.filter(s => s.caConfig === '1CC').length;

  res.json({
    totalSectors: sectors.length,
    avgDistrictThroughput: avg,
    maxReferenceThroughput: 33.0,
    caBreakdown: {
      ca3ccCount: ca3cc,
      ca3ccPercentage: Math.round((ca3cc / sectors.length) * 100),
      ca2ccCount: ca2cc,
      ca2ccPercentage: Math.round((ca2cc / sectors.length) * 100),
      ca1ccCount: ca1cc,
      ca1ccPercentage: Math.round((ca1cc / sectors.length) * 100)
    }
  });
});

// List all cities with real aggregated statistics
app.get('/api/locations', (req, res) => {
  const cities = getCitySummaries();
  res.json(cities);
});

// Get detailed city info and its sectors
app.get('/api/locations/:city', (req, res) => {
  const cityName = decodeURIComponent(req.params.city).toLowerCase();
  const matchedSectors = sectors.filter(s => s.city.toLowerCase() === cityName);
  
  if (matchedSectors.length === 0) {
    return res.status(404).json({ error: 'Location not found in dataset' });
  }

  const total = matchedSectors.reduce((sum, s) => sum + s.bbhAvgThroughput, 0);
  const avg = Math.round((total / matchedSectors.length) * 100) / 100;

  res.json({
    city: matchedSectors[0].city,
    sectorsCount: matchedSectors.length,
    avgThroughput: avg,
    sectors: matchedSectors
  });
});

// Router Catalog API
app.get('/api/routers', (req, res) => {
  res.json(ROUTER_CATALOG);
});

// IMEI / TAC Lookup API
app.get('/api/routers/detect', (req, res) => {
  const imei = String(req.query.imei || '').trim();
  const prefix = imei.slice(0, 8);
  const found = ROUTER_CATALOG.find(r => r.imeiPrefix === prefix);
  
  if (found) {
    res.json({ match: true, router: found });
  } else {
    res.json({ match: false, prefix });
  }
});

// Evaluate Existing Connection: Thesis mathematical formula
app.post('/api/evaluate', (req, res) => {
  const { location, isp, routerImei, routerModel, customRouter } = req.body;

  // 1. Find matching sectors in that location
  let matchedSectors = sectors.filter(s => s.city.toLowerCase() === (location || '').toLowerCase());
  if (matchedSectors.length === 0) {
    // Fallback fuzzy search
    matchedSectors = sectors.filter(s => 
      s.city.toLowerCase().includes((location || '').toLowerCase()) ||
      (location || '').toLowerCase().includes(s.city.toLowerCase())
    );
  }

  // If still empty, use general dataset
  const targetSectors = matchedSectors.length > 0 ? matchedSectors : sectors;

  // Provider filter if available
  const providerSectors = targetSectors.filter(s => s.provider === isp);
  const evalSectors = providerSectors.length > 0 ? providerSectors : targetSectors;

  // Compute average BBH throughput in this area
  const avgThroughput = evalSectors.reduce((sum, s) => sum + s.bbhAvgThroughput, 0) / evalSectors.length;
  const roundedThroughput = Math.round(avgThroughput * 100) / 100;

  // Dominant CA configuration in this location
  const caCounts = { '3CC': 0, '2CC': 0, '1CC': 0 };
  evalSectors.forEach(s => {
    caCounts[s.caConfig] += 1;
  });

  const dominantCa: '1CC' | '2CC' | '3CC' = 
    caCounts['3CC'] >= caCounts['2CC'] && caCounts['3CC'] >= caCounts['1CC'] ? '3CC' :
    caCounts['2CC'] >= caCounts['1CC'] ? '2CC' : '1CC';

  // 2. Resolve Router Spec
  let selectedRouter = ROUTER_CATALOG.find(r => r.model === routerModel);
  if (!selectedRouter && routerImei) {
    const prefix = routerImei.slice(0, 8);
    selectedRouter = ROUTER_CATALOG.find(r => r.imeiPrefix === prefix);
  }
  if (!selectedRouter && customRouter) {
    selectedRouter = customRouter;
  }
  if (!selectedRouter) {
    selectedRouter = ROUTER_CATALOG[0]; // fallback default Cat 4
  }

  // 3. Mathematical Formula from Thesis:
  // BBH Throughput normalized to max Colombo reference (33 Mbps)
  const maxBbh = 33.0;
  const throughputScore = Math.min(1.0, roundedThroughput / maxBbh);

  // CA Configuration score
  const caScore = dominantCa === '3CC' ? 1.0 : dominantCa === '2CC' ? (2 / 3) : (1 / 3);

  // Raw base confidence score
  let baseScore = (throughputScore * 0.5) + (caScore * 0.5);

  // Router Hardware factor:
  // If base station has 2CC/3CC available but router is Cat 4 (1CC), router cannot aggregate bands
  const routerIsBottleneck = selectedRouter.caSupport === '1CC' && dominantCa !== '1CC';
  if (routerIsBottleneck) {
    baseScore = baseScore * 0.78; // Degrade due to lack of multi-carrier capability
  }

  const confidencePercentage = Math.round(baseScore * 1000) / 10;
  const level: 'LOW' | 'MEDIUM' | 'HIGH' = 
    confidencePercentage >= 70 ? 'HIGH' : confidencePercentage >= 45 ? 'MEDIUM' : 'LOW';

  res.json({
    provider: isp || 'Dialog',
    city: location,
    sector: evalSectors[0],
    router: selectedRouter,
    calculation: {
      bbhThroughput: roundedThroughput,
      maxBbhReference: maxBbh,
      throughputScore: Math.round(throughputScore * 1000) / 1000,
      caConfig: dominantCa,
      caScore: Math.round(caScore * 1000) / 1000,
      confidenceScore: Math.round(baseScore * 1000) / 1000,
      confidencePercentage,
      level,
      routerCompatibleWithCA: !routerIsBottleneck,
      routerBottleneckNotice: routerIsBottleneck ? 'Router does not support Carrier Aggregation (1CC only).' : undefined
    },
    timestamp: new Date().toISOString()
  });
});

// Recommendations Endpoint for New Connections
app.post('/api/recommendations', (req, res) => {
  const { location, budget, preference } = req.body;

  // Find sectors in location
  let matchedSectors = sectors.filter(s => s.city.toLowerCase() === (location || '').toLowerCase());
  if (matchedSectors.length === 0) {
    matchedSectors = sectors.filter(s => s.city.toLowerCase().includes((location || '').toLowerCase()));
  }
  if (matchedSectors.length === 0) matchedSectors = sectors;

  // Analyze throughput by provider
  const providerStats: Record<string, { total: number; count: number }> = {};
  matchedSectors.forEach(s => {
    if (!providerStats[s.provider]) providerStats[s.provider] = { total: 0, count: 0 };
    providerStats[s.provider].total += s.bbhAvgThroughput;
    providerStats[s.provider].count += 1;
  });

  let topProvider = 'Dialog';
  let highestAvg = 0;
  for (const [p, data] of Object.entries(providerStats)) {
    const avg = data.total / data.count;
    if (avg > highestAvg) {
      highestAvg = avg;
      topProvider = p;
    }
  }

  // Determine optimal router: recommend 2CC or 3CC router
  const recommendedRouter = ROUTER_CATALOG.find(r => r.caSupport === '2CC') || ROUTER_CATALOG[3];
  const premiumRouter = ROUTER_CATALOG.find(r => r.caSupport === '3CC') || ROUTER_CATALOG[4];

  res.json({
    city: location,
    recommendedProvider: topProvider,
    avgThroughputInArea: Math.round(highestAvg * 100) / 100,
    primaryRouter: recommendedRouter,
    highPerformanceRouter: premiumRouter,
    allRouters: ROUTER_CATALOG
  });
});

// ----------------------------------------------------
// Vite Middleware / Static Serving
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`wifiwiz backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
