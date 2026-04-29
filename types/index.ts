export type ModuleScore = {
  score: number;
  maxScore: number;
};

export type CaseData = {
  id: string;
  code: string;
  module1: ModuleScore;
  module2: ModuleScore;
  module3: ModuleScore;
  module4: ModuleScore;
  module5: ModuleScore;
  module6: ModuleScore;
  totalScore: number;
  careLevel: number;
  status: 'in_progress' | 'completed' | 'appeal';
};

export type DiaryEntry = {
  id: string;
  caseId: string;
  date: string;
  content: string;
  createdAt: string;
};

export type Question = {
  id: string;
  text: string;
  options: { value: number; label: string }[];
  required?: boolean;
};
