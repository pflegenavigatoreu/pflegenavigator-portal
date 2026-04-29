'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModuleData {
  score: number;
  answers: Record<string, number>;
}

interface StoreState {
  caseCode: string | null;
  currentModule: number;
  modules: {
    1: ModuleData;
    2: ModuleData;
    3: ModuleData;
    4: ModuleData;
    5: ModuleData;
    6: ModuleData;
  };
  setCaseCode: (code: string) => void;
  setModuleData: (module: number, data: ModuleData) => void;
  clearStore: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      caseCode: null,
      currentModule: 1,
      modules: {
        1: { score: 0, answers: {} },
        2: { score: 0, answers: {} },
        3: { score: 0, answers: {} },
        4: { score: 0, answers: {} },
        5: { score: 0, answers: {} },
        6: { score: 0, answers: {} },
      },
      setCaseCode: (code) => set({ caseCode: code }),
      setModuleData: (module, data) =>
        set((state) => ({
          modules: {
            ...state.modules,
            [module]: data,
          },
        })),
      clearStore: () =>
        set({
          caseCode: null,
          currentModule: 1,
          modules: {
            1: { score: 0, answers: {} },
            2: { score: 0, answers: {} },
            3: { score: 0, answers: {} },
            4: { score: 0, answers: {} },
            5: { score: 0, answers: {} },
            6: { score: 0, answers: {} },
          },
        }),
    }),
    {
      name: 'pflegenavigator-storage',
    }
  )
);
