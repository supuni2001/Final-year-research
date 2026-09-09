import React from 'react';
import { motion } from 'motion/react';
import { RouterSpec, NetworkProvider } from '../types';
import { ROUTER_CATALOG } from '../data/routers';
import { COLOMBO_CITIES_SUMMARY } from '../data/colomboDataset';
import { ArrowLeft, CheckCircle2, RotateCcw, Cpu } from 'lucide-react';

interface RecommendationsViewProps {
  city: string;
  currentProvider?: NetworkProvider;
  currentRouter?: RouterSpec;
  currentScore?: number;
  onBack: () => void;
  onRestart: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  city,
  currentProvider,
  currentScore,
  onBack,
  onRestart
}) => {
  const citySummary = COLOMBO_CITIES_SUMMARY.find(c => c.city === city) || COLOMBO_CITIES_SUMMARY[0];

  // Pick the top CA routers suitable for this location (Huawei B535 for 2CC, ZTE MF286D for 3CC)
  const recommended = ROUTER_CATALOG.filter(r => r.caSupport === '2CC' || r.caSupport === '3CC').slice(0, 2);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          id="btn-back-from-recommendations"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">
          Router Recommendation
        </h2>
        <p className="text-xs text-slate-500 text-center mt-0.5">
          Based on Colombo - {city} network stability
        </p>
      </div>

      {/* Recommended Content */}
      <div className="my-auto space-y-3 max-w-xs mx-auto w-full py-2 overflow-y-auto max-h-[60vh]">
        {/* Location & Operator Match Info */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-indigo-900">Recommended Provider:</span>
            <span className="font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {currentProvider || citySummary.topProvider}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
            <span>Location CA Capability:</span>
            <strong className="text-slate-800">{citySummary.caConfig} Carrier Aggregation</strong>
          </div>
        </div>

        {/* Recommended Routers List */}
        <div className="space-y-2.5">
          {recommended.map((router, index) => (
            <motion.div
              key={router.model}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {router.brand} {router.model}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {router.category}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {router.caSupport}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 leading-snug">
                {router.caSupport === '3CC'
                  ? `Combines 3 bands to eliminate peak-hour slowdowns in ${city}.`
                  : `Combines 2 frequency bands for high throughput stability.`}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/70 font-semibold">
                <span className="text-slate-500">Price: <strong className="text-slate-800">{router.priceRangeLKR}</strong></span>
                <span className="text-indigo-600">Speed: {router.maxTheoreticalSpeed} Mbps</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          id="btn-restart-flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start Again</span>
        </button>
      </div>
    </div>
  );
};
