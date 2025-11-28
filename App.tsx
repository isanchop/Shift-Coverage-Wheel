import React, { useMemo } from 'react';
import ShiftCoverageIndicator from './components/ShiftCoverageIndicator';
import { sanitizeGradientId } from './constants';
import { AfternoonIcon, MorningIcon, NightIcon } from './components/Icons';
import { ShiftUser, ShiftType } from './types';

// Helper to generate consistent mock users
const generateMockUsers = (count: number): ShiftUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i}`,
    name: `User ${i + 1}`,
    // Using deterministic seeds for consistent avatars
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=worker_${i + 50}&backgroundColor=b6e3f4`,
  }));
};

const SHIFT_MAPPING: Record<ShiftType, { label: string; Icon: any }> = {
  morning: { label: 'Morning', Icon: MorningIcon },
  afternoon: { label: 'Afternoon', Icon: AfternoonIcon },
  night: { label: 'Night', Icon: NightIcon },
};

// Test cases requested: 1/1, 0/1, 0/2, 1/2, 2/2, 3/4, 2/5, 5/5, 7/8, 1/8, 8/8
const EXAMPLES: { assigned: number; total: number; shift: ShiftType }[] = [
  { assigned: 1, total: 1, shift: 'morning' },
  { assigned: 0, total: 1, shift: 'morning' },
  { assigned: 0, total: 2, shift: 'afternoon' },
  { assigned: 1, total: 2, shift: 'afternoon' },
  { assigned: 2, total: 2, shift: 'afternoon' },
  { assigned: 3, total: 4, shift: 'night' },
  { assigned: 2, total: 5, shift: 'night' },
  { assigned: 5, total: 5, shift: 'night' },
  { assigned: 7, total: 8, shift: 'morning' },
  { assigned: 1, total: 8, shift: 'morning' },
  { assigned: 8, total: 8, shift: 'morning' },
];

const ExampleCard: React.FC<{ assigned: number; total: number; shift: ShiftType }> = ({ assigned, total, shift }) => {
  const users = useMemo(() => generateMockUsers(assigned), [assigned]);
  const config = SHIFT_MAPPING[shift];
  const coverage = total > 0 ? Math.min(100, Math.round((assigned / total) * 100)) : 0;
  const isInteractive = assigned > 0 && assigned < 9;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      {/* Increased padding from p-2 to p-6 to allow avatars to orbit outside without hitting card edges */}
      <div className="mb-8 relative p-6"> 
        <ShiftCoverageIndicator
          coverageValue={coverage}
          assignedUsers={users}
          requiredUnits={total}
          Icon={config.Icon}
          iconLabel={config.label}
          normalizedShiftCode={shift}
          gradientId={sanitizeGradientId('demo', shift, assigned.toString(), total.toString())}
          size={70} 
          radius={30}
          strokeWidth={8}
          badgeSize={24}
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-700 text-sm">
          {assigned} / {total}
        </p>
        <p className="text-xs text-slate-500 capitalize">{shift} Shift</p>
        <p className="text-xs text-slate-400 mt-1">
          {isInteractive ? 'Hover to see team' : 'Standard View'}
        </p>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Shift Coverage Visualizer
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Hover over the indicators to reveal the team.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span>&le; 8 users triggers interactive mode</span>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {EXAMPLES.map((ex, i) => (
            <ExampleCard 
              key={i} 
              assigned={ex.assigned} 
              total={ex.total} 
              shift={ex.shift} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}