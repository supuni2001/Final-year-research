import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Router, ArrowLeft } from 'lucide-react';

interface ConnectionQuestionProps {
  onSelectOption: (hasConnection: boolean) => void;
  onBack: () => void;
}

export const ConnectionQuestion: React.FC<ConnectionQuestionProps> = ({
  onSelectOption,
  onBack
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* Top Nav */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
          id="btn-back-welcome"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">
          Broadband Status
        </h2>
        <p className="text-sm font-semibold text-slate-600 text-center mt-2 px-2">
          Is a broadband connection available?
        </p>
      </div>

      {/* Decision Buttons (Flowchart 5.1.1) */}
      <div className="my-auto space-y-4 max-w-xs mx-auto w-full py-4">
        {/* Yes Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectOption(true)}
          className="w-full p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 hover:border-indigo-600 text-left transition-all flex items-center gap-4 group shadow-xs"
          id="btn-choice-yes"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 block group-hover:text-indigo-600">
              Yes
            </span>
            <span className="text-xs text-slate-500 block">
              I have an existing router & connection
            </span>
          </div>
        </motion.button>

        {/* No Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectOption(false)}
          className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-indigo-600 text-left transition-all flex items-center gap-4 group shadow-xs"
          id="btn-choice-no"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-800/20 group-hover:scale-105 transition-transform">
            <Router className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 block group-hover:text-indigo-600">
              No
            </span>
            <span className="text-xs text-slate-500 block">
              I want to purchase a new connection
            </span>
          </div>
        </motion.button>
      </div>

      <div className="text-center pb-4 text-[11px] text-slate-400">
        Choose your current situation to proceed
      </div>
    </div>
  );
};
