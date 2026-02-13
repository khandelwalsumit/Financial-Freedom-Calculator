'use client';

import { useState } from 'react';
import { BaseConfig, ScenarioConfig, SimulationResult } from '@/types/financial';
import { DEFAULT_BASE_CONFIG, DEFAULT_SCENARIOS } from '@/lib/default-inputs';
import { runMultiScenarioSimulation } from '@/lib/simulation-engine';
import { BaseConfigSummary } from '@/components/BaseConfigSummary';
import { BaseConfigModal } from '@/components/BaseConfigModal';
import { ScenarioCard } from '@/components/ScenarioCard';
import { MultiScenarioComparison } from '@/components/MultiScenarioComparison';
import { WarningsDisplay } from '@/components/WarningsDisplay';
import { MonthlyBreakdownTable } from '@/components/MonthlyBreakdownTable';
import { Calculator, Plus, BookOpen, Save, Upload } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [baseConfig, setBaseConfig] = useState<BaseConfig>(DEFAULT_BASE_CONFIG);
  const [scenarios, setScenarios] = useState<ScenarioConfig[]>(DEFAULT_SCENARIOS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showBaseConfigModal, setShowBaseConfigModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const simulationResult = runMultiScenarioSimulation(baseConfig, scenarios);
      setResult(simulationResult);
      setIsCalculating(false);
    }, 100);
  };

  const addScenario = () => {
    const newScenario: ScenarioConfig = {
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`,
      extraEmiPayment: 0,
      extraEmiSource: 'none',
      transfers: [],
      reinvestEquityPercent: 60,
      reinvestDebtPercent: 30,
      reinvestCashPercent: 10,
    };
    setScenarios([...scenarios, newScenario]);
  };

  const updateScenario = (index: number, updated: ScenarioConfig) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = updated;
    setScenarios(newScenarios);
  };

  const deleteScenario = (index: number) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter((_, i) => i !== index));
    }
  };

  const duplicateScenario = (index: number) => {
    const original = scenarios[index];
    const duplicate: ScenarioConfig = {
      ...original,
      id: `scenario-${Date.now()}`,
      name: `${original.name} (Copy)`,
      transfers: original.transfers.map(t => ({ ...t, id: `${Date.now()}-${t.id}` })),
    };
    setScenarios([...scenarios, duplicate]);
  };

  const handleSave = () => {
    const data = JSON.stringify({ baseConfig, scenarios }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-calc-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const loaded = JSON.parse(e.target?.result as string);
            if (loaded.baseConfig) setBaseConfig(loaded.baseConfig);
            if (loaded.scenarios) setScenarios(loaded.scenarios);
          } catch (err) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1 text-gray-100">Financial Freedom Calculator</h1>
              <p className="text-gray-400 text-sm">Multi-scenario simulation with The Switch 🎯</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/methodology"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition text-sm font-medium border border-gray-700"
              >
                <BookOpen className="w-4 h-4" />
                Methodology
              </Link>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition text-sm font-medium border border-gray-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleLoad}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition text-sm font-medium border border-gray-700"
              >
                <Upload className="w-4 h-4" />
                Load
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Base Configuration Summary */}
        <BaseConfigSummary
          config={baseConfig}
          onEdit={() => setShowBaseConfigModal(true)}
        />

        {/* Scenarios Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">📋 Scenarios ({scenarios.length})</h2>
            <button
              onClick={addScenario}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Scenario
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {scenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                baseConfig={baseConfig}
                onChange={(updated) => updateScenario(index, updated)}
                onDelete={() => deleteScenario(index)}
                onDuplicate={() => duplicateScenario(index)}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Forecast Months</label>
              <input
                type="number"
                value={baseConfig.forecastMonths}
                onChange={(e) => setBaseConfig({ ...baseConfig, forecastMonths: Number(e.target.value) })}
                className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating || scenarios.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50 shadow-lg h-[58px]"
            >
              <Calculator className="w-5 h-5" />
              {isCalculating ? 'Calculating...' : `Compare ${scenarios.length} Scenario${scenarios.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && result.scenarios.length > 0 && (
          <div className="space-y-6">
            {/* Warnings */}
            {result.warnings.length > 0 && (
              <WarningsDisplay warnings={result.warnings} />
            )}

            {/* Comparison */}
            <MultiScenarioComparison
              result={result}
              isHomeLoan={baseConfig.loanType === 'home'}
              taxSlab={baseConfig.taxSlab}
            />

            {/* Monthly Breakdown Tables for Each Scenario */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📊 Monthly Breakdown by Scenario</h2>
              {result.scenarios.map((scenario) => (
                <MonthlyBreakdownTable key={scenario.scenarioId} scenario={scenario} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Base Config Modal */}
      {showBaseConfigModal && (
        <BaseConfigModal
          config={baseConfig}
          onSave={setBaseConfig}
          onClose={() => setShowBaseConfigModal(false)}
        />
      )}

      {/* Footer */}

    </main>
  );
}
