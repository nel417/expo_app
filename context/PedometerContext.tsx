import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

interface PedometerContextType {
  isPedometerAvailable: string;
  currentStepCount: number;
  achievedMilestones: Set<number>;
}

const PedometerContext = createContext<PedometerContextType | undefined>(undefined);

export function PedometerProvider({ children }: { children: React.ReactNode }) {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [achievedMilestones] = useState(new Set<number>());

  useEffect(() => {
    let subscription: Pedometer.Subscription | undefined;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        subscription = await Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => subscription?.remove();
  }, []);

  return (
    <PedometerContext.Provider 
      value={{ 
        isPedometerAvailable, 
        currentStepCount,
        achievedMilestones,
      }}
    >
      {children}
    </PedometerContext.Provider>
  );
}

export function usePedometer() {
  const context = useContext(PedometerContext);
  if (context === undefined) {
    throw new Error('usePedometer must be used within a PedometerProvider');
  }
  return context;
} 