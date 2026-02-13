'use client';

import { Warning } from '@/types/financial';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Props {
  warnings: Warning[];
}

export function WarningsDisplay({ warnings }: Props) {
  if (warnings.length === 0) return null;

  const getIcon = (severity: Warning['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      case 'low':
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (severity: Warning['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">⚠️ Warnings & Advisories</h3>
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${getColorClasses(warning.severity)} flex gap-3`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(warning.severity)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{warning.title}</h4>
            <p className="text-sm">{warning.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
