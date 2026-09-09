import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RouterSpec } from '../types';
import { X, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

interface RouterModalProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterSpec;
  city: string;
}

export const RouterModal: React.FC<RouterModalProps> = ({
  isOpen,
  onClose,
  router,
  city
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl border border-slate-200 relative"
          id="modal-router-specs"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            id="btn-close-specs"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Router Specifications
              </h3>
              <p className="text-[11px] text-slate-500">
                {router.brand} {router.model}
              </p>
            </div>
          </div>

          {/* Key Specs */}
          <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <strong className="text-slate-800">{router.category}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Carrier Aggregation:</span>
              <strong className={router.caSupport === '1CC' ? 'text-amber-600' : 'text-emerald-600'}>
                {router.caSupport} ({router.caSupport === '1CC' ? 'Single Carrier' : 'Multi-Carrier'})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peak Downlink:</span>
              <strong className="text-slate-800">{router.maxTheoreticalSpeed} Mbps</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Open Market Price:</span>
              <strong className="text-slate-800">{router.priceRangeLKR}</strong>
            </div>
          </div>

          {/* Supported Bands */}
          <div className="mt-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Supported Frequency Bands:
            </span>
            <div className="flex flex-wrap gap-1">
              {router.supportedBands.map((band, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {band}
                </span>
              ))}
            </div>
          </div>

          {/* Area Compatibility Advice */}
          <div className="mt-3 p-2.5 rounded-xl bg-indigo-50 text-indigo-900 text-[11px] leading-snug">
            {router.caSupport === '1CC' ? (
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Base stations in {city} support Carrier Aggregation, but this router only supports a single band (1CC).</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>This router supports multi-band Carrier Aggregation, matching Colombo base stations.</span>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
