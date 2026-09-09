import React from 'react';
import { motion } from 'motion/react';
import { Wifi, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center bg-white">
      {/* Top / Center Branding */}
      <div className="my-auto pt-8">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/30">
          <Wifi className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          WifiWiz
        </h1>
        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1.5">
          Broadband & Router Advisor
        </p>
      </div>

      {/* Bottom Button */}
      <div className="pb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
          id="btn-get-start"
        >
          <span>Get Start</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};
