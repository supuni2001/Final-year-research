import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, CheckCircle2, Award, FileText, Layers, Calculator, Database } from 'lucide-react';

interface ThesisGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThesisGuideModal: React.FC<ThesisGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
          id="modal-thesis-guide"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            id="btn-close-thesis-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                NSBM Research Thesis Alignment
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Step-by-Step Development Framework & Model
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto pr-2">
            {/* 8 Stages from Chapter 5.1 of the Thesis */}
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5 text-sm">
                <Layers className="w-4 h-4 text-indigo-600" />
                The 8 Core Development Steps (Thesis Section 5.1)
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 leading-relaxed font-medium">
                <li><strong>Stage 1 - Data Preparation:</strong> Ingestion of the 1,681 sector records with Sector Name, Lat/Lon, Site ID, CA Configuration (1CC, 2CC, 3CC), and BBH Average Throughput.</li>
                <li><strong>Stage 2 - Location-Based Association:</strong> User selects city or GPS detects coordinates, linking the user with nearby sector baselines.</li>
                <li><strong>Stage 3 - Throughput Score Calculation:</strong> Normalization against the benchmark Colombo maximum (33.0 Mbps): <code className="bg-white px-1 py-0.5 rounded text-indigo-700">Throughput Score = Respective Throughput / 33.0</code>.</li>
                <li><strong>Stage 4 & 5 - Carrier Aggregation (CA) Score:</strong> CA configuration evaluation: <code className="bg-white px-1 py-0.5 rounded text-indigo-700">CA Score = CA Configuration / 3</code> (3CC = 1.0, 2CC = 0.67, 1CC = 0.33), bounded by router hardware limit.</li>
                <li><strong>Stage 6 - Confidence Score Synthesis:</strong> Equal weighting 50% Throughput + 50% CA: <code className="bg-white px-1 py-0.5 rounded text-indigo-700">Confidence Score = 0.5 × Throughput Score + 0.5 × CA Score</code>.</li>
                <li><strong>Stage 7 - Stability Classification:</strong> Categorized into <strong>LOW (&lt; 40%)</strong>, <strong>MEDIUM (40% - 70%)</strong>, and <strong>HIGH (&gt; 70%)</strong>.</li>
                <li><strong>Stage 8 - Router Recommendation Engine:</strong> If score is &lt; 40% (or for new users without broadband), matching high-performing 2CC/3CC routers and top operators to resolve congestion.</li>
                <li><strong>Stage 9 - Mobile UI/UX Delivery:</strong> Presenting results intuitively via clear gauges, router spec extraction, and actionable purchasing guidance.</li>
              </ol>
            </div>

            {/* Research Questions & Objectives */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Thesis Objectives (RO1 - RO4)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">RO1: CA Stability Factors</span>
                  Identifying how location & CA levels affect busy-hour stability.
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">RO2: Confidence Scoring</span>
                  Developing an objective, understandable metric (0-100%).
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">RO3: Network Visibility</span>
                  Testing how performance visibility reduces customer complaints.
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">RO4: Router Recommendation</span>
                  Measuring customer satisfaction improvement with matched CA hardware.
                </div>
              </div>
            </div>

            {/* DSRM & Stratified Sampling */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-[11px] space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Methodology & Population</span>
              <p>
                • <strong>Paradigm:</strong> Pragmatism | <strong>Approach:</strong> Deductive | <strong>Strategy:</strong> Design Science Research (DSR).
              </p>
              <p>
                • <strong>Target Sample:</strong> ~370 stratified broadband respondents across Colombo residential and corporate segments (SLT, Dialog, Mobitel, Hutch).
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
              id="btn-close-thesis-modal-footer"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
