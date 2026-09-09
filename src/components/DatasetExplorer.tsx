import React, { useState, useMemo } from 'react';
import { COLOMBO_CITIES_SUMMARY, SAMPLE_SECTORS, MAX_BBH_THROUGHPUT } from '../data/colomboDataset';
import { calculateConfidence } from '../utils/calculator';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Calculator, 
  ArrowLeft, 
  Table as TableIcon,
  Sliders, 
  Upload,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { SectorRecord } from '../types';

interface DatasetExplorerProps {
  onBack: () => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'cities' | 'sectors' | 'simulator' | 'custom_data'>('cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [caFilter, setCaFilter] = useState<string>('ALL');

  // Custom simulator state
  const [simThroughput, setSimThroughput] = useState<number>(21.72);
  const [simCa, setSimCa] = useState<'1CC' | '2CC' | '3CC'>('3CC');
  const [customRows, setCustomRows] = useState<SectorRecord[]>([]);
  const [csvText, setCsvText] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Filtered cities
  const filteredCities = useMemo(() => {
    return COLOMBO_CITIES_SUMMARY.filter(c => {
      const matchName = c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCa = caFilter === 'ALL' || c.caConfig === caFilter;
      return matchName && matchCa;
    });
  }, [searchQuery, caFilter]);

  // Filtered sectors
  const filteredSectors = useMemo(() => {
    return SAMPLE_SECTORS.filter(s => {
      const matchQuery = 
        s.sectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.siteName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCa = caFilter === 'ALL' || s.caConfig === caFilter;
      return matchQuery && matchCa;
    });
  }, [searchQuery, caFilter]);

  // Live simulation calculation
  const simResult = useMemo(() => {
    return calculateConfidence(simThroughput, simCa);
  }, [simThroughput, simCa]);

  // Handle CSV import
  const handleParseCsv = () => {
    if (!csvText.trim()) return;
    try {
      const lines = csvText.trim().split('\n');
      const parsed: SectorRecord[] = [];
      // Skip header if contains 'Sector' or 'Lat'
      const startIdx = lines[0].toLowerCase().includes('sector') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 7) {
          const caRaw = parts[6] || '3CC';
          const ca = caRaw.includes('3') ? '3CC' : caRaw.includes('2') ? '2CC' : '1CC';
          const bbh = parseFloat(parts[7]) || parseFloat(parts[parts.length - 1]) || 18.0;

          parsed.push({
            sectorName: parts[0] || `Sector_${i}`,
            sectorId: parts[1] || `COL_${i}`,
            siteName: parts[2] || `Site_${i}`,
            siteId: parts[5] || `SITE_${i}`,
            lat: parseFloat(parts[3]) || 6.9,
            lon: parseFloat(parts[4]) || 79.9,
            caConfig: ca,
            caConfigLabel: `${ca} available`,
            bbhAvgThroughput: bbh,
            city: parts[0].split('-')[0] || 'Colombo',
            provider: 'Dialog'
          });
        }
      }

      if (parsed.length > 0) {
        setCustomRows(parsed);
        setUploadSuccess(`Successfully parsed ${parsed.length} sector records from CSV!`);
      } else {
        alert('Could not parse records. Please check the CSV comma format.');
      }
    } catch (e: any) {
      alert('Error parsing CSV: ' + e.message);
    }
  };

  // Export Table 3.1 to CSV
  const handleExportCsv = () => {
    const header = "Major City / Area,Average BBH Avg Throughput,CA Configuration,Top Provider,Latitude,Longitude\n";
    const rows = COLOMBO_CITIES_SUMMARY.map(c => 
      `"${c.city}",${c.avgThroughput},"${c.caConfig}","${c.topProvider}",${c.lat},${c.lon}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Colombo_Broadband_Throughput_Dataset_Thesis_Table_3.1.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-2"
            id="btn-back-from-dataset"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Decision Support App</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Colombo Network Performance Dataset
            </h1>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              1,681 Records Base
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical measurements of BBH throughput, Carrier Aggregation configs (1CC, 2CC, 3CC), and geographic coordinates in Colombo District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
            id="btn-export-csv"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Table 3.1 CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold text-slate-600 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('cities')}
          className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'cities'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-900'
          }`}
          id="tab-cities"
        >
          <TableIcon className="w-4 h-4" />
          <span>Major Colombo Cities (Table 3.1)</span>
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sectors'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-900'
          }`}
          id="tab-sectors"
        >
          <Database className="w-4 h-4" />
          <span>Sector Records (Figure 3.2)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-900'
          }`}
          id="tab-simulator"
        >
          <Calculator className="w-4 h-4" />
          <span>Confidence Equation Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_data')}
          className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'custom_data'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-900'
          }`}
          id="tab-custom-data"
        >
          <Upload className="w-4 h-4" />
          <span>Import Custom Dataset</span>
        </button>
      </div>

      {/* TAB 1: Cities Summary (Table 3.1) */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city in Colombo..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">CA Filter:</span>
              <select
                value={caFilter}
                onChange={(e) => setCaFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700"
              >
                <option value="ALL">All Configurations</option>
                <option value="3CC">3CC Available</option>
                <option value="2CC">2CC Available</option>
                <option value="1CC">1CC Available</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Major City / Area</th>
                    <th className="py-3 px-4">BBH Avg Throughput (Mbps)</th>
                    <th className="py-3 px-4">Normalized Throughput Score</th>
                    <th className="py-3 px-4">CA Configuration</th>
                    <th className="py-3 px-4">Calculated Confidence Score</th>
                    <th className="py-3 px-4">Top Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCities.map((c) => {
                    const calc = calculateConfidence(c.avgThroughput, c.caConfig);
                    return (
                      <tr key={c.city} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.city}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{c.avgThroughput} Mbps</td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {c.avgThroughput} / 33 = {calc.throughputScore}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            c.caConfig === '3CC' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : c.caConfig === '2CC'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.caConfig} (Score: {calc.caScore})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`font-black text-xs px-2 py-0.5 rounded ${
                            calc.level === 'HIGH'
                              ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                              : calc.level === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {calc.confidencePercentage}% ({calc.level})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-600">{c.topProvider}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sector Records (Figure 3.2) */}
      {activeTab === 'sectors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Sample sector entries extracted from the 1,681 records dataset, showing exact physical site names, coordinates, and CA configurations.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Sector Name</th>
                    <th className="py-3 px-4">Sector ID</th>
                    <th className="py-3 px-4">Site Name</th>
                    <th className="py-3 px-4">Lat / Lon</th>
                    <th className="py-3 px-4">Site ID</th>
                    <th className="py-3 px-4">CA Config</th>
                    <th className="py-3 px-4">BBH Avg Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {filteredSectors.map((s) => (
                    <tr key={s.sectorId} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{s.sectorName}</td>
                      <td className="py-2.5 px-4 text-indigo-600">{s.sectorId}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-800">{s.siteName}</td>
                      <td className="py-2.5 px-4 text-slate-500 text-[11px]">{s.lat.toFixed(5)}, {s.lon.toFixed(5)}</td>
                      <td className="py-2.5 px-4 text-slate-600">{s.siteId}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-sans font-bold">
                          {s.caConfigLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{s.bbhAvgThroughput} Mbps</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Formula Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Adjust Simulation Parameters
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Test how custom throughput values and Carrier Aggregation levels affect the mathematical confidence score equation from Section 3.4 of the thesis.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>BBH Average Throughput:</span>
                <span className="text-indigo-600 font-mono text-sm">{simThroughput} Mbps</span>
              </div>
              <input
                type="range"
                min="5"
                max="33"
                step="0.1"
                value={simThroughput}
                onChange={(e) => setSimThroughput(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 Mbps</span>
                <span>Max Benchmark (33 Mbps)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Carrier Aggregation Configuration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1CC', '2CC', '3CC'] as const).map(ca => (
                  <button
                    key={ca}
                    onClick={() => setSimCa(ca)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      simCa === ca
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ca} ({ca === '3CC' ? '3 Carriers' : ca === '2CC' ? '2 Carriers' : 'Single'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                Simulated Mathematical Outcome
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-black text-white">{simResult.confidencePercentage}%</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  simResult.level === 'HIGH'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : simResult.level === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {simResult.level} Stability
                </span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-700">
              <div className="text-slate-400 font-sans font-bold text-[11px] mb-1">Equation Walkthrough:</div>
              <div>Throughput Score = {simThroughput} / 33 = <strong>{simResult.throughputScore}</strong></div>
              <div>CA Score = {simCa === '3CC' ? '3 / 3 = 1.0' : simCa === '2CC' ? '2 / 3 = 0.667' : '1 / 3 = 0.333'}</div>
              <div className="pt-2 border-t border-slate-700 text-white font-bold">
                Confidence = 0.5 × ({simResult.throughputScore}) + 0.5 × ({simResult.caScore}) = {simResult.confidenceScore} ({simResult.confidencePercentage}%)
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              {simResult.confidencePercentage < 40
                ? '⚠️ Critical: Score is below 40%. The system will trigger proactive router recommendations.'
                : '✅ Above 40% threshold: Connection exhibits acceptable stability.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Import Custom Dataset */}
      {activeTab === 'custom_data' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Import Your Full 1,681 Records CSV
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            You mentioned you have your own secondary data set! Paste your CSV rows below or load the sample batch to instantly run the application algorithms against your own records.
          </p>

          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste CSV here. Format: SectorName, SectorID, SiteName, Lat, Lon, SiteID, CA_Config, BBH_Throughput&#10;Example:&#10;Avissawella-1_1, COL002_1, Avissawella-1, 6.9563, 80.2135, COL002, 2CC available, 18.00"
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleParseCsv}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              id="btn-parse-csv"
            >
              Parse & Load Dataset
            </button>
            <button
              type="button"
              onClick={() => {
                setCsvText(
                  `Sector Name,Sector ID,Site Name,Lat,Lon,Site ID,CA Configuration,BBH Avg Throughput\n` +
                  `Dehiwala-Sector-A,COL007_A,Dehiwala-West,6.8504,79.8713,COL007,3CC available,21.72\n` +
                  `Kotte-Sector-B,COL018_B,Kotte-North,6.8910,79.9048,COL018,3CC available,24.94\n` +
                  `Moratuwa-Sector-C,COL030_C,Moratuwa-East,6.7730,79.8816,COL030,2CC available,16.81\n` +
                  `Colombo-Fort-Tower1,COL009_T1,Col1_Fort,6.9343,79.8507,COL009,3CC available,21.05`
                );
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Load Sample CSV Template
            </button>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {customRows.length > 0 && (
            <div className="mt-4 border rounded-xl overflow-hidden">
              <div className="bg-slate-50 p-2.5 text-xs font-bold border-b text-slate-700">
                Parsed Rows ({customRows.length}):
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {customRows.map((r, i) => (
                      <tr key={i} className="p-2">
                        <td className="p-2 font-bold">{r.sectorName}</td>
                        <td className="p-2 text-indigo-600">{r.caConfig}</td>
                        <td className="p-2">{r.bbhAvgThroughput} Mbps</td>
                        <td className="p-2 text-slate-500">{r.lat}, {r.lon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
