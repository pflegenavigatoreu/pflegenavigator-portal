import { useState, useEffect } from "react";
import { useCreateCase } from "@workspace/api-client-react";

const STORAGE_KEY = "pflegenavigator_case_code";

export function useCase() {
  const [caseCode, setCaseCode] = useState<string | null>(null);
  const createCase = useCreateCase();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCaseCode(stored);
    }
  }, []);

  const initializeCase = async (entryModule: string) => {
    if (caseCode) return caseCode;

    try {
      const newCase = await createCase.mutateAsync({ data: { entryModule } });
      const code = newCase.caseCode;
      localStorage.setItem(STORAGE_KEY, code);
      setCaseCode(code);
      return code;
    } catch (error) {
      console.error("Failed to create case", error);
      return null;
    }
  };

  const clearCase = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCaseCode(null);
  };

  return {
    caseCode,
    initializeCase,
    clearCase,
    isInitializing: createCase.isPending
  };
}
