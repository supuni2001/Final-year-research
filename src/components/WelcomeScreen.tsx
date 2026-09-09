import React from 'react';
import { motion } from 'motion/react';
import { Wifi, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center bg-white">
      {/* Top Header */}
      <div className="pt-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
          <Wifi className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Broadband Confidence
        </h1>
        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">
          Router & CA Stability Advisor
        </p>
        <p className="text-xs text-slate-500 mt-3 px-4 leading-relaxed">
          Evaluate Carrier Aggregation stability and get smart router recommendations for Colombo District.
        </p>
      </div>

      {/* Center Prototype Preview Visual */}
      <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner max-w-xs mx-auto w-full text-left space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pb-2 border-b border-slate-200">
          <span>Colombo Decision Support</span>
          <span className="text-indigo-600">4G / LTE-A</span>
        </div>
        <div className="text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>• Device Identification:</span>
            <strong className="text-slate-700">IMEI Lookup</strong>
          </div>
          <div className="flex justify-between">
            <span>• CA Analysis:</span>
            <strong className="text-slate-700">1CC / 2CC / 3CC</strong>
          </div>
          <div className="flex justify-between">
            <span>• Performance Metric:</span>
            <strong className="text-slate-700">BBH Peak Throughput</strong>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Validated on 1,681 Colombo Sectors</span>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
          id="btn-get-start"
        >
          <span>Get Start</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <p className="text-[10px] text-slate-400 mt-2">
          MIS Research Thesis Prototype • NSBM Green University
        </p>
      </div>
    </div>
  );
};
