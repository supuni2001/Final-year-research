import React from 'react';
import { motion } from 'motion/react';
import { EvaluationResult } from '../types';
import { ArrowLeft, Cpu, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface ConfidenceResultProps {
  result: EvaluationResult;
  onBack: () => void;
  onViewRouterSpecs: () => void;
  onViewRecommendations: () => void;
}

export const ConfidenceResult: React.FC<ConfidenceResultProps> = ({
  result,
  onBack,
  onViewRouterSpecs,
  onViewRecommendations
}) => {
  const { calculation, provider, city, router } = result;
  const scorePercent = calculation.confidencePercentage;
  const isLessThan40 = scorePercent < 40;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Top Bar */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          id="btn-back-inputs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Inputs</span>
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">
          Confidence Score
        </h2>
      </div>

      {/* Main Content matching Figure 1.2 in Thesis */}
      <div className="my-auto space-y-4 max-w-xs mx-auto w-full py-2">
        {/* Detail Box exactly as formatted in Figure 1.2 */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 shadow-2xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">IMEI Number</span>
            <span className="font-mono font-bold text-slate-800 text-xs truncate block">
              {router.sampleImei || '863261024589123'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Location</span>
            <span className="font-bold text-slate-800 text-xs block">
              Colombo - {city}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Network Provider</span>
            <span className="font-bold text-indigo-600 text-xs block">
              {provider}
            </span>
          </div>
        </div>

        {/* Circular Confidence Score (as in Figure 1.2) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-2"
        >
          <div className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center border-4 shadow-md transition-all ${
            isLessThan40 
              ? 'border-rose-500 bg-rose-50/50 text-rose-600' 
              : scorePercent >= 70
              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600'
              : 'border-amber-500 bg-amber-50/50 text-amber-600'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Confidence Score
            </span>
            <span className="text-3xl font-black tracking-tight my-0.5">
              {Math.round(scorePercent)}%
            </span>
            <span className="text-[10px] font-extrabold uppercase">
              {calculation.level} Stability
            </span>
          </div>

          {/* Simple explanation if < 40% (Flowchart Figure 5.1.1) */}
          {isLessThan40 ? (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium leading-snug flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Confidence score is less than 40%. A router with Carrier Aggregation is recommended for your area.</span>
            </div>
          ) : (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium leading-snug flex items-center gap-2 text-left">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Network stability is acceptable. You can check router specifications or view alternative recommendations.</span>
            </div>
          )}
        </motion.div>

        {/* Primary Action Buttons from Figure 1.2 & Flowchart 5.1.1 */}
        <div className="space-y-2 pt-1">
          {/* Button 1: Router Specifications */}
          <button
            type="button"
            onClick={onViewRouterSpecs}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
            id="btn-router-specifications"
          >
            <Cpu className="w-4 h-4 text-slate-600" />
            <span>Router specifications</span>
          </button>

          {/* Button 2: Router Recommendation */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onViewRecommendations}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
              isLessThan40
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
            id="btn-router-recommendation"
          >
            <span>Router Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
