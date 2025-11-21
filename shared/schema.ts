import { z } from "zod";

// Derby Prediction Schema
export const predictionSchema = z.object({
  // User Information
  userName: z.string().min(1, "İsim gerekli"),
  playerId: z.string().min(1, "Oyuncu ID gerekli"),
  
  // Question 1: Maçın sonucu ne olur?
  matchResult: z.enum(["home", "draw", "away"], {
    required_error: "Maç sonucu seçmelisiniz"
  }),
  
  // Question 2: Toplam gol sayısı kaç olur?
  totalGoals: z.enum(["0-1", "2-3", "4+"], {
    required_error: "Toplam gol sayısı seçmelisiniz"
  }),
  
  // Question 3: İlk golü hangi takım atar?
  firstGoalTeam: z.enum(["teamA", "teamB", "noGoal"], {
    required_error: "İlk gol takımını seçmelisiniz"
  }),
  
  // Question 4: İlk gol hangi dakikada gelir?
  firstGoalTime: z.enum(["0-15", "16-30", "31-45", "46-60", "61-75", "76-90", "noGoal"], {
    required_error: "İlk gol dakikasını seçmelisiniz"
  }),
  
  // Question 5: Maçın ilk yarı sonucu nedir?
  halfTimeResult: z.enum(["home", "draw", "away"], {
    required_error: "İlk yarı sonucunu seçmelisiniz"
  }),
  
  // Question 6: Maçın toplam korner sayısı?
  totalCorners: z.enum(["0-7", "8-11", "12+"], {
    required_error: "Korner sayısını seçmelisiniz"
  }),
  
  // Question 7: VAR kararı olur mu?
  varDecision: z.enum(["yes", "no"], {
    required_error: "VAR kararını seçmelisiniz"
  }),
  
  // Question 8: Kırmızı kart çıkar mı?
  redCard: z.enum(["yes", "no"], {
    required_error: "Kırmızı kart seçimini yapmalısınız"
  }),
  
  // Question 9: En çok şut çeken oyuncu kim olur?
  topShooter: z.string().min(1, "Oyuncu seçmelisiniz"),
  
  // Question 10: Maçın adamı kim seçilir?
  manOfMatch: z.string().min(1, "Oyuncu seçmelisiniz"),
  
  // Question 11: İlk oyuncu değişikliğini hangi takım yapar?
  firstSubstitution: z.enum(["home", "away"], {
    required_error: "İlk değişiklik takımını seçmelisiniz"
  }),
  
  // Question 12: Derbide toplam kart sayısı kaç olur?
  totalCards: z.enum(["0-2", "3-5", "6+"], {
    required_error: "Kart sayısını seçmelisiniz"
  }),
  
  // Metadata
  submittedAt: z.date().optional(),
});

export type Prediction = z.infer<typeof predictionSchema>;

export const insertPredictionSchema = predictionSchema.omit({ submittedAt: true });
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

// Form validation schema (playerId optional for form validation, required for submission)
export const formPredictionSchema = insertPredictionSchema.extend({
  playerId: z.string().optional(),
});
export type FormPrediction = z.infer<typeof formPredictionSchema>;

// Leaderboard Entry Schema
export const leaderboardEntrySchema = z.object({
  id: z.string(),
  userName: z.string(),
  playerId: z.string(),
  score: z.number(),
  totalCorrect: z.number(),
  submittedAt: z.date(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

// Player validation schema
export const playerSchema = z.object({
  playerId: z.string(),
  isValid: z.boolean(),
});

export type Player = z.infer<typeof playerSchema>;

// Question options for UI
export const PLAYER_OPTIONS = [
  "Oyuncu 1",
  "Oyuncu 2",
  "Oyuncu 3",
  "Oyuncu 4",
  "Oyuncu 5",
  "Oyuncu 6",
];

// Questions configuration
export const QUESTIONS = [
  {
    id: 1,
    question: "Maçın sonucu ne olur?",
    field: "matchResult" as const,
    options: [
      { value: "home", label: "Ev sahibi kazanır" },
      { value: "draw", label: "Berabere" },
      { value: "away", label: "Deplasman kazanır" },
    ],
  },
  {
    id: 2,
    question: "Toplam gol sayısı kaç olur?",
    field: "totalGoals" as const,
    options: [
      { value: "0-1", label: "0–1" },
      { value: "2-3", label: "2–3" },
      { value: "4+", label: "4+" },
    ],
  },
  {
    id: 3,
    question: "İlk golü hangi takım atar?",
    field: "firstGoalTeam" as const,
    options: [
      { value: "teamA", label: "A Takımı" },
      { value: "teamB", label: "B Takımı" },
      { value: "noGoal", label: "Gol olmaz" },
    ],
  },
  {
    id: 4,
    question: "İlk gol hangi dakikada gelir?",
    field: "firstGoalTime" as const,
    options: [
      { value: "0-15", label: "0–15" },
      { value: "16-30", label: "16–30" },
      { value: "31-45", label: "31–45" },
      { value: "46-60", label: "46–60" },
      { value: "61-75", label: "61–75" },
      { value: "76-90", label: "76–90" },
      { value: "noGoal", label: "Gol olmaz" },
    ],
  },
  {
    id: 5,
    question: "Maçın ilk yarı sonucu nedir?",
    field: "halfTimeResult" as const,
    options: [
      { value: "home", label: "Ev sahibi" },
      { value: "draw", label: "Berabere" },
      { value: "away", label: "Deplasman" },
    ],
  },
  {
    id: 6,
    question: "Maçın toplam korner sayısı?",
    field: "totalCorners" as const,
    options: [
      { value: "0-7", label: "0–7" },
      { value: "8-11", label: "8–11" },
      { value: "12+", label: "12+" },
    ],
  },
  {
    id: 7,
    question: "VAR kararı olur mu?",
    field: "varDecision" as const,
    options: [
      { value: "yes", label: "Evet" },
      { value: "no", label: "Hayır" },
    ],
  },
  {
    id: 8,
    question: "Kırmızı kart çıkar mı?",
    field: "redCard" as const,
    options: [
      { value: "yes", label: "Evet" },
      { value: "no", label: "Hayır" },
    ],
  },
  {
    id: 9,
    question: "En çok şut çeken oyuncu kim olur?",
    field: "topShooter" as const,
    type: "select" as const,
    options: PLAYER_OPTIONS.map(player => ({ value: player, label: player })),
  },
  {
    id: 10,
    question: "Maçın adamı kim seçilir?",
    field: "manOfMatch" as const,
    type: "select" as const,
    options: PLAYER_OPTIONS.map(player => ({ value: player, label: player })),
  },
  {
    id: 11,
    question: "İlk oyuncu değişikliğini hangi takım yapar?",
    field: "firstSubstitution" as const,
    options: [
      { value: "home", label: "Ev sahibi" },
      { value: "away", label: "Deplasman" },
    ],
  },
  {
    id: 12,
    question: "Derbide toplam kart sayısı kaç olur?",
    field: "totalCards" as const,
    options: [
      { value: "0-2", label: "0–2" },
      { value: "3-5", label: "3–5" },
      { value: "6+", label: "6+" },
    ],
  },
] as const;
