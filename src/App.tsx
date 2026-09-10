import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen, CitySummary, EvaluationResult, NetworkProvider, RouterSpec } from './types';
import { calculateConfidence } from './utils/calculator';
import { COLOMBO_CITIES_SUMMARY } from './data/colomboDataset';
import { findRouterByImei, ROUTER_CATALOG } from './data/routers';
import { fetchLocations, evaluateConnectionOnBackend } from './services/api';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConnectionQuestion } from './components/ConnectionQuestion';
import { ExistingConnectionForm } from './components/ExistingConnectionForm';
import { NewConnectionForm } from './components/NewConnectionForm';
import { ConfidenceResult } from './components/ConfidenceResult';
import { RouterModal } from './components/RouterModal';
import { RecommendationsView } from './components/RecommendationsView';
import { Wifi, Battery, Signal, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [activeCity, setActiveCity] = useState<string>('Dehiwala');
  const [activeRouter, setActiveRouter] = useState<RouterSpec>(ROUTER_CATALOG[0]);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState<boolean>(false);
  const [cities, setCities] = useState<CitySummary[]>(COLOMBO_CITIES_SUMMARY);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Load live dataset cities from backend on mount
  useEffect(() => {
    fetchLocations().then((data) => {
      if (data && data.length > 0) {
        setCities(data);
      }
    });
  }, []);

  // Flow handlers based strictly on Thesis Flowchart (Figure 5.1.1)
  const handleStart = () => {
    setCurrentScreen('connection_question');
  };

  const handleSelectConnectionOption = (hasConnection: boolean) => {
    if (hasConnection) {
      setCurrentScreen('existing_input');
    } else {
      setCurrentScreen('new_input');
    }
  };

  const handleEvaluateExisting = async (data: {
    provider: NetworkProvider;
    city: string;
    router: RouterSpec;
    imei: string;
  }) => {
    setActiveCity(data.city);
    setActiveRouter(data.router);
    setIsEvaluating(true);

    // Call backend API evaluation endpoint
    const backendResult = await evaluateConnectionOnBackend({
      location: data.city,
      isp: data.provider,
      routerModel: data.router.model,
      routerImei: data.imei
    });

    if (backendResult) {
      setEvaluationResult(backendResult);
    } else {
      // Graceful fallback to local calculation
      const cityData = cities.find(c => c.city.toLowerCase() === data.city.toLowerCase()) || cities[0];
      const throughput = cityData.avgThroughput;
      const caConfig = cityData.caConfig;
      const calc = calculateConfidence(throughput, caConfig, data.router);

      const res: EvaluationResult = {
        provider: data.provider,
        city: data.city,
        router: data.router,
        calculation: calc,
        timestamp: new Date().toISOString()
      };
      setEvaluationResult(res);
    }

    setIsEvaluating(false);
    setCurrentScreen('score_result');
  };

  const handleEvaluateNew = (cityName: string) => {
    setActiveCity(cityName);
    const cityData = cities.find(c => c.city.toLowerCase() === cityName.toLowerCase()) || cities[0];
    const topRouter = ROUTER_CATALOG.find(r => r.caSupport === cityData.caConfig) || ROUTER_CATALOG[3];
    setActiveRouter(topRouter);
    setCurrentScreen('recommendations');
  };

  const handleRestart = () => {
    setEvaluationResult(null);
    setCurrentScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-200/80 flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Mobile Prototype Phone Container */}
      <div 
        className="w-full max-w-[375px] h-[720px] max-h-[92vh] bg-white rounded-[44px] shadow-2xl shadow-slate-900/25 border-[9px] border-slate-900 flex flex-col overflow-hidden relative"
        id="prototype-phone-frame"
      >
        {/* Dynamic Island / Notch */}
        <div className="h-6 bg-slate-900 w-full flex items-center justify-center shrink-0 z-30 select-none">
          <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Mobile Status Bar (Time, Wifi, Battery) */}
        <div className="px-6 pt-1 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 shrink-0 select-none bg-white">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto relative flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {currentScreen === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <WelcomeScreen onStart={handleStart} />
              </motion.div>
            )}

            {currentScreen === 'connection_question' && (
              <motion.div
                key="connection_question"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col"
              >
                <ConnectionQuestion
                  onSelectOption={handleSelectConnectionOption}
                  onBack={() => setCurrentScreen('welcome')}
                />
              </motion.div>
            )}

            {currentScreen === 'existing_input' && (
              <motion.div
                key="existing_input"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col"
              >
                <ExistingConnectionForm
                  onBack={() => setCurrentScreen('connection_question')}
                  onSubmit={handleEvaluateExisting}
                  cities={cities}
                />
              </motion.div>
            )}

            {currentScreen === 'new_input' && (
              <motion.div
                key="new_input"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col"
              >
                <NewConnectionForm
                  onBack={() => setCurrentScreen('connection_question')}
                  onSubmit={handleEvaluateNew}
                  cities={cities}
                />
              </motion.div>
            )}

            {currentScreen === 'score_result' && evaluationResult && (
              <motion.div
                key="score_result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <ConfidenceResult
                  result={evaluationResult}
                  onBack={() => setCurrentScreen('existing_input')}
                  onViewRouterSpecs={() => setIsRouterModalOpen(true)}
                  onViewRecommendations={() => setCurrentScreen('recommendations')}
                />
              </motion.div>
            )}

            {currentScreen === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col"
              >
                <RecommendationsView
                  city={activeCity}
                  currentProvider={evaluationResult?.provider}
                  currentRouter={evaluationResult?.router}
                  currentScore={evaluationResult?.calculation.confidencePercentage}
                  onBack={() => {
                    if (evaluationResult) {
                      setCurrentScreen('score_result');
                    } else {
                      setCurrentScreen('new_input');
                    }
                  }}
                  onRestart={handleRestart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-5 bg-white w-full flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Quick Prototype Controller beneath the phone */}
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-1 hover:text-slate-900 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow-2xs border border-slate-300/80 transition-all font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Prototype</span>
        </button>
        <span className="text-[11px] text-slate-400 font-medium">
          wifiwiz Prototype
        </span>
      </div>

      {/* Router Specifications Modal */}
      <RouterModal
        isOpen={isRouterModalOpen}
        onClose={() => setIsRouterModalOpen(false)}
        router={activeRouter}
        city={activeCity}
      />
    </div>
  );
}
