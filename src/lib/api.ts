// Lokaler API-Client (ersetzt @/lib/api)
import { useMutation, useQuery } from "@tanstack/react-query"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

// Hilfsfunktion für API-Calls
async function fetchApi(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}

// Case erstellen
export function useCreateCase() {
  return useMutation({
    mutationFn: async ({ data }: { data: { entryModule: string } }) => {
      return fetchApi("/api/cases", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  })
}

// Antwort speichern
export function useSaveAnswer() {
  return useMutation({
    mutationFn: async ({ caseCode, data }: { 
      caseCode: string
      data: { module: string; questionKey: string; answerValue: string }
    }) => {
      return fetchApi(`/api/cases/${caseCode}/answers`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  })
}

// Antworten laden
export function useGetAnswers(caseCode: string | null) {
  return useQuery({
    queryKey: ["answers", caseCode],
    queryFn: async () => {
      if (!caseCode) return []
      return fetchApi(`/api/cases/${caseCode}/answers`)
    },
    enabled: !!caseCode,
  })
}

// Fall laden
export function useGetCase(caseCode: string | null) {
  return useQuery({
    queryKey: ["case", caseCode],
    queryFn: async () => {
      if (!caseCode) return null
      // Note: This endpoint might need to be created
      return fetchApi(`/api/cases/${caseCode}`)
    },
    enabled: !!caseCode,
  })
}

// Score speichern
export function useSaveScore() {
  return useMutation({
    mutationFn: async ({ caseCode, data }: { 
      caseCode: string
      data: { module: string; rawPoints: number; weightedPoints: number }
    }) => {
      return fetchApi(`/api/cases/${caseCode}/scores`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  })
}

// Scores laden
export function useGetScores(caseCode: string | null) {
  return useQuery({
    queryKey: ["scores", caseCode],
    queryFn: async () => {
      if (!caseCode) return []
      return fetchApi(`/api/cases/${caseCode}/scores`)
    },
    enabled: !!caseCode,
  })
}

// Tagebucheintrag erstellen
export function useCreateDiaryEntry() {
  return useMutation({
    mutationFn: async ({ caseCode, content, date, mood }: {
      caseCode: string
      content: string
      date?: string
      mood?: string
    }) => {
      return fetchApi("/api/diary", {
        method: "POST",
        body: JSON.stringify({ caseCode, content, date, mood }),
      })
    },
  })
}

// Tagebucheinträge laden
export function useGetDiaryEntries(caseCode: string | null) {
  return useQuery({
    queryKey: ["diary", caseCode],
    queryFn: async () => {
      if (!caseCode) return []
      return fetchApi(`/api/diary?caseCode=${caseCode}`)
    },
    enabled: !!caseCode,
  })
}

// Export-Daten laden
export function useGetExportData(caseCode: string | null) {
  return useQuery({
    queryKey: ["export", caseCode],
    queryFn: async () => {
      if (!caseCode) return null
      const [answers, scores] = await Promise.all([
        fetchApi(`/api/cases/${caseCode}/answers`),
        fetchApi(`/api/cases/${caseCode}/scores`),
      ])
      return { answers, scores, caseCode }
    },
    enabled: !!caseCode,
  })
}

// Feedback erstellen
export function useCreateFeedback() {
  return useMutation({
    mutationFn: async ({ caseCode, seite, feedbackText, eingabeTyp }: {
      caseCode?: string
      seite: string
      feedbackText: string
      eingabeTyp?: string
    }) => {
      return fetchApi("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ caseCode, seite, feedbackText, eingabeTyp }),
      })
    },
  })
}

// Feedback laden (Admin)
export function useListFeedback(status?: string) {
  return useQuery({
    queryKey: ["feedback", status],
    queryFn: async () => {
      const url = status ? `/api/feedback?status=${status}` : "/api/feedback"
      return fetchApi(url)
    },
  })
}

// Feedback-Status aktualisieren
export function useUpdateFeedbackStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return fetchApi("/api/feedback", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      })
    },
  })
}

// Übersichts-Statistiken
export function useGetOverviewStats() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      // Mock-Daten für den Anfang
      return {
        totalCases: 0,
        totalFeedback: 0,
        pendingFeedback: 0,
      }
    },
  })
}
