import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CitySummary } from '../types';
import { COLOMBO_CITIES_SUMMARY } from '../data/colomboDataset';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';

interface NewConnectionFormProps {
  onBack: () => void;
  onSubmit: (city: string) => void;
  cities?: CitySummary[];
}

export const NewConnectionForm: React.FC<NewConnectionFormProps> = ({
  onBack,
  onSubmit,
  cities = COLOMBO_CITIES_SUMMARY
}) => {
  const [location, setLocation] = useState<string>('Colombo - Dehiwala');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cityName = location.replace(/^Colombo\s*-\s*/i, '').trim();
    onSubmit(cityName);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Top Header */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
          id="btn-back-from-no"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">
          New Connection
        </h2>
        <p className="text-xs text-slate-500 text-center mt-1">
          Insert your location to get router recommendations
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="my-auto space-y-4 max-w-xs mx-auto w-full py-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            Insert the Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white text-slate-900 shadow-2xs"
            id="select-new-location"
          >
            {cities.map((c) => (
              <option key={c.city} value={`Colombo - ${c.city}`}>
                Colombo - {c.city}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            id="btn-submit-new-location"
          >
            <span>Router Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
