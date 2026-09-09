import { CitySummary, SectorRecord, NetworkProvider } from '../types';

export const MAX_BBH_THROUGHPUT = 33.0; // The theoretical & empirical max BBH in Colombo district as defined in the thesis (page 21-22)

export const COLOMBO_CITIES_SUMMARY: CitySummary[] = [
  { city: 'Kotte', avgThroughput: 24.94, caConfig: '3CC', lat: 6.8910, lon: 79.9048, sectorsCount: 78, topProvider: 'Dialog' },
  { city: 'Colombo 03 (Colpetty)', avgThroughput: 22.19, caConfig: '3CC', lat: 6.9210, lon: 79.8475, sectorsCount: 64, topProvider: 'Dialog' },
  { city: 'Mount Lavinia', avgThroughput: 21.78, caConfig: '3CC', lat: 6.8384, lon: 79.8655, sectorsCount: 72, topProvider: 'Mobitel' },
  { city: 'Dehiwala', avgThroughput: 21.72, caConfig: '3CC', lat: 6.8504, lon: 79.8713, sectorsCount: 94, topProvider: 'Dialog' },
  { city: 'Nugegoda', avgThroughput: 21.14, caConfig: '3CC', lat: 6.8649, lon: 79.8997, sectorsCount: 88, topProvider: 'SLT-Mobitel' },
  { city: 'Colombo 01 (Fort)', avgThroughput: 21.05, caConfig: '3CC', lat: 6.9343, lon: 79.8507, sectorsCount: 65, topProvider: 'Mobitel' },
  { city: 'Boralesgamuwa', avgThroughput: 20.75, caConfig: '3CC', lat: 6.8420, lon: 79.9015, sectorsCount: 54, topProvider: 'Dialog' },
  { city: 'Piliyandala', avgThroughput: 20.27, caConfig: '3CC', lat: 6.8018, lon: 79.9227, sectorsCount: 68, topProvider: 'SLT-Mobitel' },
  { city: 'Ratmalana', avgThroughput: 19.92, caConfig: '3CC', lat: 6.8207, lon: 79.8797, sectorsCount: 62, topProvider: 'Dialog' },
  { city: 'Pannipitiya', avgThroughput: 19.75, caConfig: '3CC', lat: 6.8438, lon: 79.9482, sectorsCount: 56, topProvider: 'Mobitel' },
  { city: 'Avissawella', avgThroughput: 19.71, caConfig: '3CC', lat: 6.9563, lon: 80.2135, sectorsCount: 46, topProvider: 'Hutch' },
  { city: 'Battaramulla', avgThroughput: 19.61, caConfig: '3CC', lat: 6.9096, lon: 79.9247, sectorsCount: 82, topProvider: 'Dialog' },
  { city: 'Kesbewa', avgThroughput: 19.19, caConfig: '2CC', lat: 6.7904, lon: 79.9530, sectorsCount: 48, topProvider: 'SLT-Mobitel' },
  { city: 'Kaduwela', avgThroughput: 19.07, caConfig: '2CC', lat: 6.9333, lon: 79.9833, sectorsCount: 58, topProvider: 'Dialog' },
  { city: 'Rajagiriya', avgThroughput: 18.80, caConfig: '3CC', lat: 6.9080, lon: 79.8970, sectorsCount: 70, topProvider: 'Mobitel' },
  { city: 'Padukka', avgThroughput: 18.80, caConfig: '2CC', lat: 6.8464, lon: 80.1031, sectorsCount: 38, topProvider: 'Hutch' },
  { city: 'Homagama', avgThroughput: 18.49, caConfig: '3CC', lat: 6.8499, lon: 79.9962, sectorsCount: 66, topProvider: 'Dialog' },
  { city: 'Malabe', avgThroughput: 18.16, caConfig: '2CC', lat: 6.9042, lon: 79.9547, sectorsCount: 74, topProvider: 'SLT-Mobitel' },
  { city: 'Colombo 06 (Kirulapona)', avgThroughput: 18.14, caConfig: '3CC', lat: 6.8827, lon: 79.8692, sectorsCount: 60, topProvider: 'Dialog' },
  { city: 'Kottawa', avgThroughput: 18.07, caConfig: '2CC', lat: 6.8413, lon: 79.9654, sectorsCount: 52, topProvider: 'Mobitel' },
  { city: 'Maharagama', avgThroughput: 17.89, caConfig: '2CC', lat: 6.8480, lon: 79.9267, sectorsCount: 68, topProvider: 'SLT-Mobitel' },
  { city: 'Moratuwa', avgThroughput: 16.81, caConfig: '2CC', lat: 6.7730, lon: 79.8816, sectorsCount: 84, topProvider: 'Dialog' },
  { city: 'Kolonnawa', avgThroughput: 17.50, caConfig: '2CC', lat: 6.9282, lon: 79.8897, sectorsCount: 42, topProvider: 'Hutch' },
  { city: 'Hanwella', avgThroughput: 15.60, caConfig: '1CC', lat: 6.8970, lon: 80.0830, sectorsCount: 30, topProvider: 'Dialog' },
];

// Realistic sample records from the secondary dataset of 1,681 records (as previewed in Figure 3.2 of the thesis)
export const SAMPLE_SECTORS: SectorRecord[] = [
  { sectorName: 'Avissawella-1_1', sectorId: 'COL002_1', siteName: 'Avissawella-1', siteId: 'COL002', lat: 6.956322, lon: 80.213559, caConfig: '2CC', caConfigLabel: '2CC available', bbhAvgThroughput: 18.00, city: 'Avissawella', provider: 'Dialog' },
  { sectorName: 'Avissawella-1_2', sectorId: 'COL002_2', siteName: 'Avissawella-1', siteId: 'COL002', lat: 6.956322, lon: 80.213559, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 20.67, city: 'Avissawella', provider: 'Dialog' },
  { sectorName: 'Avissawella-1_3', sectorId: 'COL002_3', siteName: 'Avissawella-1', siteId: 'COL002', lat: 6.956322, lon: 80.213559, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 18.92, city: 'Avissawella', provider: 'Mobitel' },
  { sectorName: 'Battaramulla-1_1', sectorId: 'COL005_1', siteName: 'Battaramulla-1', siteId: 'COL005', lat: 6.909661, lon: 79.924778, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 18.07, city: 'Battaramulla', provider: 'Dialog' },
  { sectorName: 'Battaramulla-1_2', sectorId: 'COL005_2', siteName: 'Battaramulla-1', siteId: 'COL005', lat: 6.909661, lon: 79.924778, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 21.31, city: 'Battaramulla', provider: 'Dialog' },
  { sectorName: 'Battaramulla-1_3', sectorId: 'COL005_3', siteName: 'Battaramulla-1', siteId: 'COL005', lat: 6.909661, lon: 79.924778, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 19.44, city: 'Battaramulla', provider: 'SLT-Mobitel' },
  { sectorName: 'Dehiwala-1_1', sectorId: 'COL007_1', siteName: 'Dehiwala-1', siteId: 'COL007', lat: 6.850461, lon: 79.871328, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 19.63, city: 'Dehiwala', provider: 'Dialog' },
  { sectorName: 'Dehiwala-1_2', sectorId: 'COL007_2', siteName: 'Dehiwala-1', siteId: 'COL007', lat: 6.850461, lon: 79.871328, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 20.43, city: 'Dehiwala', provider: 'Dialog' },
  { sectorName: 'Dehiwala-1_3', sectorId: 'COL007_3', siteName: 'Dehiwala-1', siteId: 'COL007', lat: 6.850461, lon: 79.871328, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 20.33, city: 'Dehiwala', provider: 'Mobitel' },
  { sectorName: 'Col1_FortStation-1_1', sectorId: 'COL009_1', siteName: 'Col1_FortStation-1', siteId: 'COL009', lat: 6.934387, lon: 79.850705, caConfig: '2CC', caConfigLabel: '2CC available', bbhAvgThroughput: 18.88, city: 'Colombo 01 (Fort)', provider: 'Dialog' },
  { sectorName: 'Col1_FortStation-1_2', sectorId: 'COL009_2', siteName: 'Col1_FortStation-1', siteId: 'COL009', lat: 6.934387, lon: 79.850705, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 19.53, city: 'Colombo 01 (Fort)', provider: 'Mobitel' },
  { sectorName: 'Col1_FortStation-1_3', sectorId: 'COL009_3', siteName: 'Col1_FortStation-1', siteId: 'COL009', lat: 6.934387, lon: 79.850705, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 21.60, city: 'Colombo 01 (Fort)', provider: 'Mobitel' },
  { sectorName: 'Col3_RamadaHotel-1_1', sectorId: 'COL010_1', siteName: 'Col3_RamadaHotel-1', siteId: 'COL010', lat: 6.921065, lon: 79.847567, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 22.19, city: 'Colombo 03 (Colpetty)', provider: 'Dialog' },
  { sectorName: 'Col3_RamadaHotel-1_2', sectorId: 'COL010_2', siteName: 'Col3_RamadaHotel-1', siteId: 'COL010', lat: 6.921065, lon: 79.847567, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 19.09, city: 'Colombo 03 (Colpetty)', provider: 'Mobitel' },
  { sectorName: 'Col3_RamadaHotel-1_3', sectorId: 'COL010_3', siteName: 'Col3_RamadaHotel-1', siteId: 'COL010', lat: 6.921065, lon: 79.847567, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 21.75, city: 'Colombo 03 (Colpetty)', provider: 'SLT-Mobitel' },
  { sectorName: 'Homagama-1_1', sectorId: 'COL012_1', siteName: 'Homagama-1', siteId: 'COL012', lat: 6.849938, lon: 79.996283, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 19.27, city: 'Homagama', provider: 'Dialog' },
  { sectorName: 'Homagama-1_2', sectorId: 'COL012_2', siteName: 'Homagama-1', siteId: 'COL012', lat: 6.849938, lon: 79.996283, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 18.15, city: 'Homagama', provider: 'Mobitel' },
  { sectorName: 'Homagama-1_3', sectorId: 'COL012_3', siteName: 'Homagama-1', siteId: 'COL012', lat: 6.849938, lon: 79.996283, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 20.17, city: 'Homagama', provider: 'SLT-Mobitel' },
  { sectorName: 'Col6_Kirulapona-3_1', sectorId: 'COL013_1', siteName: 'Col6_Kirulapona-3', siteId: 'COL013', lat: 6.882751, lon: 79.869277, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 16.78, city: 'Colombo 06 (Kirulapona)', provider: 'Dialog' },
  { sectorName: 'Col6_Kirulapona-3_2', sectorId: 'COL013_2', siteName: 'Col6_Kirulapona-3', siteId: 'COL013', lat: 6.882751, lon: 79.869277, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 18.14, city: 'Colombo 06 (Kirulapona)', provider: 'Mobitel' },
  { sectorName: 'Col6_Kirulapona-3_3', sectorId: 'COL013_3', siteName: 'Col6_Kirulapona-3', siteId: 'COL013', lat: 6.882751, lon: 79.869277, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 18.62, city: 'Colombo 06 (Kirulapona)', provider: 'Hutch' },
  { sectorName: 'Kotte-Center-1_1', sectorId: 'COL018_1', siteName: 'Kotte-Center-1', siteId: 'COL018', lat: 6.891012, lon: 79.904821, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 25.10, city: 'Kotte', provider: 'Dialog' },
  { sectorName: 'Kotte-Center-1_2', sectorId: 'COL018_2', siteName: 'Kotte-Center-1', siteId: 'COL018', lat: 6.891012, lon: 79.904821, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 24.78, city: 'Kotte', provider: 'Mobitel' },
  { sectorName: 'MountLavinia-Coast-1_1', sectorId: 'COL022_1', siteName: 'MountLavinia-Coast-1', siteId: 'COL022', lat: 6.838421, lon: 79.865512, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 22.40, city: 'Mount Lavinia', provider: 'Dialog' },
  { sectorName: 'Moratuwa-Station-1_1', sectorId: 'COL030_1', siteName: 'Moratuwa-Station-1', siteId: 'COL030', lat: 6.773014, lon: 79.881643, caConfig: '2CC', caConfigLabel: '2CC available', bbhAvgThroughput: 16.40, city: 'Moratuwa', provider: 'Dialog' },
  { sectorName: 'Nugegoda-Junction-1_1', sectorId: 'COL035_1', siteName: 'Nugegoda-Junction-1', siteId: 'COL035', lat: 6.864923, lon: 79.899732, caConfig: '3CC', caConfigLabel: '3CC available', bbhAvgThroughput: 21.80, city: 'Nugegoda', provider: 'SLT-Mobitel' },
  { sectorName: 'Maharagama-Clock-1_1', sectorId: 'COL041_1', siteName: 'Maharagama-Clock-1', siteId: 'COL041', lat: 6.848011, lon: 79.926723, caConfig: '2CC', caConfigLabel: '2CC available', bbhAvgThroughput: 17.50, city: 'Maharagama', provider: 'Hutch' },
  { sectorName: 'Hanwella-Town-1_1', sectorId: 'COL060_1', siteName: 'Hanwella-Town-1', siteId: 'COL060', lat: 6.897011, lon: 80.083042, caConfig: '1CC', caConfigLabel: '1CC available', bbhAvgThroughput: 12.30, city: 'Hanwella', provider: 'Dialog' }
];

export const PROVIDERS_LIST: { id: NetworkProvider; name: string; color: string; desc: string }[] = [
  { id: 'Dialog', name: 'Dialog Axiata', color: 'emerald', desc: 'Largest 4G/LTE-A 3CC coverage in Colombo' },
  { id: 'Mobitel', name: 'Mobitel', color: 'blue', desc: 'National mobile network with extensive 2CC/3CC bands' },
  { id: 'SLT-Mobitel', name: 'SLT-Mobitel Fixed 4G', color: 'indigo', desc: 'Fixed wireless broadband specialized for home routers' },
  { id: 'Hutch', name: 'Hutchison Telecom', color: 'amber', desc: 'High-value data packages with expanding 2CC/3CC sites' }
];
