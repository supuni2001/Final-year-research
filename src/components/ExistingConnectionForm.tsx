import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CitySummary, NetworkProvider, RouterSpec } from '../types';
import { COLOMBO_CITIES_SUMMARY, PROVIDERS_LIST } from '../data/colomboDataset';
import { findRouterByImei } from '../data/routers';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ExistingConnectionFormProps {
  onBack: () => void;
  onSubmit: (data: {
    provider: NetworkProvider;
    city: string;
    router: RouterSpec;
    imei: string;
  }) => void;
  cities?: CitySummary[];
}

export const ExistingConnectionForm: React.FC<ExistingConnectionFormProps> = ({
  onBack,
  onSubmit,
  cities = COLOMBO_CITIES_SUMMARY
}) => {
  // Default values matching Figure 1.2 in thesis rich picture
  const [imei, setImei] = useState<string>('863261024589123');
  const [location, setLocation] = useState<string>('Colombo - Dehiwala');
  const [provider, setProvider] = useState<NetworkProvider>('Dialog');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei.trim()) {
      alert('Please enter an IMEI number');
      return;
    }

    // Extract city name (strip "Colombo - " prefix if present)
    const cityName = location.replace(/^Colombo\s*-\s*/i, '').trim();
    const router = findRouterByImei(imei);

    onSubmit({
      provider,
      city: cityName,
      router,
      imei
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Top Header */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
          id="btn-back-to-question"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">
          Network Details
        </h2>
        <p className="text-xs text-slate-500 text-center mt-1">
          Enter your router and location information
        </p>
      </div>

      {/* Form matching Figure 1.2 in thesis screenshot */}
      <form onSubmit={handleSubmit} className="my-auto space-y-4 max-w-xs mx-auto w-full py-2">
        {/* Field 1: IMEI Number */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            IMEI Number
          </label>
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            placeholder="e.g. 863261024589123"
            maxLength={18}
            className="w-full text-sm font-medium py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white text-slate-900 transition-all shadow-2xs"
            id="input-imei"
            required
          />
        </div>

        {/* Field 2: Current Location */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Current Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white text-slate-900 shadow-2xs"
            id="select-location"
          >
            {cities.map((c) => (
              <option key={c.city} value={`Colombo - ${c.city}`}>
                Colombo - {c.city}
              </option>
            ))}
          </select>
        </div>

        {/* Field 3: Network Provider */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Network Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as NetworkProvider)}
            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white text-slate-900 shadow-2xs"
            id="select-provider"
          >
            {PROVIDERS_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            id="btn-check-confidence"
          >
            <span>Check Confidence</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
