// Einfache In-Memory-Datenbank für den Anfang
// Später durch Supabase ersetzen

export interface Case {
  id: string
  caseCode: string
  entryModule: string
  createdAt: Date
  answers: Answer[]
  scores: Score[]
}

export interface Answer {
  id: string
  caseCode: string
  module: string
  questionKey: string
  answerValue: string
  createdAt: Date
}

export interface Score {
  id: string
  caseCode: string
  module: string
  rawPoints: number
  weightedPoints: number
  createdAt: Date
}

// In-Memory Speicher
const cases = new Map<string, Case>()
const answers = new Map<string, Answer[]>()

// Fallcode-Generator
function generateCaseCode(): string {
  const a = Math.floor(1000 + Math.random() * 9000)
  const b = Math.floor(1000 + Math.random() * 9000)
  return `PF-${a}-${b}`
}

export const db = {
  // Cases
  createCase: (entryModule: string): Case => {
    const id = crypto.randomUUID()
    const caseCode = generateCaseCode()
    const newCase: Case = {
      id,
      caseCode,
      entryModule,
      createdAt: new Date(),
      answers: [],
      scores: []
    }
    cases.set(caseCode, newCase)
    answers.set(caseCode, [])
    return newCase
  },

  getCase: (caseCode: string): Case | null => {
    return cases.get(caseCode) || null
  },

  // Answers
  saveAnswer: (caseCode: string, module: string, questionKey: string, answerValue: string): Answer => {
    const newAnswer: Answer = {
      id: crypto.randomUUID(),
      caseCode,
      module,
      questionKey,
      answerValue,
      createdAt: new Date()
    }
    
    const caseAnswers = answers.get(caseCode) || []
    caseAnswers.push(newAnswer)
    answers.set(caseCode, caseAnswers)
    
    // Aktualisiere auch das Case-Objekt
    const caseData = cases.get(caseCode)
    if (caseData) {
      caseData.answers = caseAnswers
    }
    
    return newAnswer
  },

  getAnswers: (caseCode: string): Answer[] => {
    return answers.get(caseCode) || []
  },

  // Scores
  saveScore: (caseCode: string, module: string, rawPoints: number, weightedPoints: number): Score => {
    const newScore: Score = {
      id: crypto.randomUUID(),
      caseCode,
      module,
      rawPoints,
      weightedPoints,
      createdAt: new Date()
    }
    
    const caseData = cases.get(caseCode)
    if (caseData) {
      caseData.scores.push(newScore)
    }
    
    return newScore
  },

  getScores: (caseCode: string): Score[] => {
    const caseData = cases.get(caseCode)
    return caseData?.scores || []
  }
}
