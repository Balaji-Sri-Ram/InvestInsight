import React, { useEffect, useState } from 'react';
import { Spinner } from './Spinner';

const STEPS = [
  "Checking cache...",
  "Gathering financial and qualitative data...",
  "AI analyzing data...",
  "Generating report...",
  "Saving to database...",
  "Done"
];

export const LoadingOverlay = ({ currentMessage }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (currentMessage) {
      const stepIndex = STEPS.findIndex(s => s === currentMessage || currentMessage.includes(s.split(' ')[0]));
      if (stepIndex !== -1) {
        setActiveStepIndex(stepIndex);
        setCompletedSteps(prev => {
          const newSteps = [...prev];
          for (let i = 0; i < stepIndex; i++) {
            if (!newSteps.includes(i)) newSteps.push(i);
          }
          return newSteps;
        });
      }
    }
  }, [currentMessage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-[var(--color-background)]/60 animate-in fade-in duration-300">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        
        {/* Main Spinner */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)] opacity-30"></div>
          <Spinner size="lg" className="border-t-[var(--color-primary)] border-r-[var(--color-primary)] w-16 h-16 border-4" />
        </div>

        <h3 className="text-xl font-semibold text-[var(--color-heading)] mb-6 text-center">
          Analyzing Company...
        </h3>

        {/* Steps */}
        <div className="w-full flex flex-col gap-4">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index) || (index < activeStepIndex);
            const isActive = index === activeStepIndex;
            const isPending = !isCompleted && !isActive;

            return (
              <div 
                key={step} 
                className={`flex items-center gap-3 transition-all duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' 
                    : isActive 
                      ? 'border-[var(--color-primary)] bg-transparent' 
                      : 'border-[var(--color-border)] bg-transparent'
                }`}>
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                  ) : null}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-[var(--color-heading)]' : 'text-[var(--color-secondary)]'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
