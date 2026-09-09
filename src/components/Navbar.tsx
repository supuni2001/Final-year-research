import React from 'react';
import { Smartphone, Monitor, Database, BookOpen, RotateCcw, Radio } from 'lucide-react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenMethodology: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  setScreen,
  isMobileFrame,
  setIsMobileFrame,
  onOpenMethodology,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-brand"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                NetConfidence <span className="text-indigo-600 font-extrabold">CA</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                Colombo
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Carrier Aggregation & Router Recommendation Decision Support
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Frame Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200 text-xs font-medium text-slate-600">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                isMobileFrame 
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold' 
                  : 'hover:text-slate-900'
              }`}
              title="Mobile Prototype View (Figma Size)"
              id="view-mobile-toggle"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                !isMobileFrame 
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold' 
                  : 'hover:text-slate-900'
              }`}
              title="Wide Responsive View"
              id="view-desktop-toggle"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Responsive</span>
            </button>
          </div>

          {/* Dataset Explorer Button */}
          <button
            onClick={() => setScreen('dataset_explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'dataset_explorer'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="View 1,681 Colombo Secondary Network Records"
            id="nav-dataset-btn"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Dataset (1,681 Records)</span>
            <span className="sm:hidden">Data</span>
          </button>

          {/* Methodology Info */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
            title="Research Thesis Overview & Formulas"
            id="nav-thesis-btn"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thesis & Formula</span>
          </button>

          {/* Reset button */}
          {currentScreen !== 'welcome' && (
            <button
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Restart Flow"
              id="nav-restart-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
