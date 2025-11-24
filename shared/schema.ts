import { z } from "zod";

// Derby Prediction Schema
export const predictionSchema = z.object({
  // User Information
  userName: z.string().min(1, "İsim gerekli"),
  playerId: z.string().min(1, "Oyuncu ID gerekli"),
  
  // Question 1: Derbinin sonucu ne olur?
  matchResult: z.enum(["fenerbahce", "draw", "galatasaray"], {
    required_error: "Maç sonucu seçmelisiniz"
  }),
  
  // Question 2: Derbide toplam kaç gol olur?
  totalGoals: z.enum(["0-2", "3-4", "5+"], {
    required_error: "Toplam gol sayısı seçmelisiniz"
  }),
  
  // Question 3: İlk golü hangi takım atar?
  firstGoalTeam: z.enum(["fenerbahce", "galatasaray", "noGoal"], {
    required_error: "İlk gol takımını seçmelisiniz"
  }),
  
  // Question 4: İlk gol hangi dakikada gelir?
  firstGoalTime: z.enum(["0-15", "16-30", "31-45", "46-60", "61-75", "76-90", "noGoal"], {
    required_error: "İlk gol dakikasını seçmelisiniz"
  }),
  
  // Question 5: İlk yarı sonucu ne olur?
  halfTimeResult: z.enum(["fenerbahce", "draw", "galatasaray"], {
    required_error: "İlk yarı sonucunu seçmelisiniz"
  }),
  
  // Question 6: Derbide kaç sarı/kırmızı kart çıkar?
  totalCards: z.enum(["0-3", "4-6", "6-9", "10+"], {
    required_error: "Kart sayısını seçmelisiniz"
  }),
  
  // Question 7: Hakem VAR'a gider mi?
  varDecision: z.enum(["yes", "no"], {
    required_error: "VAR kararını seçmelisiniz"
  }),
  
  // Question 8: Derbide kaç korner olur?
  totalCorners: z.enum(["0-7", "8-11", "12+"], {
    required_error: "Korner sayısını seçmelisiniz"
  }),
  
  // Question 9: Derbide kırmızı kart çıkar mı?
  redCard: z.enum(["yes", "no"], {
    required_error: "Kırmızı kart seçimini yapmalısınız"
  }),
  
  // Question 10: Derbide en çok isabetli şut çeken oyuncu kim olur?
  topShooter: z.string().min(1, "Oyuncu seçmelisiniz"),
  
  // Question 11: İlk oyuncu değişikliğini hangi takım yapar?
  firstSubstitution: z.enum(["fenerbahce", "galatasaray"], {
    required_error: "İlk değişiklik takımını seçmelisiniz"
  }),
  
  // Question 12: Derbide penaltı olur mu?
  penalty: z.enum(["yes", "no"], {
    required_error: "Penaltı seçimini yapmalısınız"
  }),
  
  // Metadata
  submittedAt: z.date().optional(),
});

export type Prediction = z.infer<typeof predictionSchema>;

export const insertPredictionSchema = predictionSchema.omit({ submittedAt: true });
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

// Form validation schema (playerId and userName optional for form validation, required for submission)
export const formPredictionSchema = insertPredictionSchema.extend({
  playerId: z.string().optional(),
  userName: z.string().optional(),
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
  "Victor Osimhen",
  "John Duran",
  "Barış Alper Yılmaz",
  "Leroy Sane",
  "Marco Asencio",
  "Kerem Aktürkoğlu",
  "İlkay Gündoğan",
  "Nene",
  "En-Nesyri",
  "Mauro Icardi",
  "Lucas Torreira",
  "Fred",
  "Diğer",
];

// Questions configuration
export const QUESTIONS = [
  {
    id: 1,
    question: "Derbinin sonucu ne olur?",
    field: "matchResult" as const,
    type: "radio" as const,
    options: [
      { value: "fenerbahce", label: "Fenerbahçe kazanır" },
      { value: "draw", label: "Berabere biter" },
      { value: "galatasaray", label: "Galatasaray kazanır" },
    ],
  },
  {
    id: 2,
    question: "Derbide toplam kaç gol olur?",
    field: "totalGoals" as const,
    type: "radio" as const,
    options: [
      { value: "0-2", label: "0-2" },
      { value: "3-4", label: "3-4" },
      { value: "5+", label: "5+" },
    ],
  },
  {
    id: 3,
    question: "İlk golü hangi takım atar?",
    field: "firstGoalTeam" as const,
    type: "radio" as const,
    options: [
      { value: "fenerbahce", label: "Fenerbahçe" },
      { value: "galatasaray", label: "Galatasaray" },
      { value: "noGoal", label: "Gol olmaz" },
    ],
  },
  {
    id: 4,
    question: "İlk gol hangi dakikada gelir?",
    field: "firstGoalTime" as const,
    type: "radio" as const,
    options: [
      { value: "0-15", label: "0-15" },
      { value: "16-30", label: "16-30" },
      { value: "31-45", label: "31-45" },
      { value: "46-60", label: "46-60" },
      { value: "61-75", label: "61-75" },
      { value: "76-90", label: "76-90" },
      { value: "noGoal", label: "Gol olmaz" },
    ],
  },
  {
    id: 5,
    question: "İlk yarı sonucu ne olur?",
    field: "halfTimeResult" as const,
    type: "radio" as const,
    options: [
      { value: "fenerbahce", label: "Fenerbahçe" },
      { value: "draw", label: "Berabere" },
      { value: "galatasaray", label: "Galatasaray" },
    ],
  },
  {
    id: 6,
    question: "Derbide kaç sarı/kırmızı kart çıkar?",
    field: "totalCards" as const,
    type: "radio" as const,
    options: [
      { value: "0-3", label: "0-3" },
      { value: "4-6", label: "4-6" },
      { value: "6-9", label: "6-9" },
      { value: "10+", label: "10+" },
    ],
  },
  {
    id: 7,
    question: "Hakem VAR'a gider mi?",
    field: "varDecision" as const,
    type: "radio" as const,
    options: [
      { value: "yes", label: "Evet" },
      { value: "no", label: "Hayır" },
    ],
  },
  {
    id: 8,
    question: "Derbide kaç korner olur?",
    field: "totalCorners" as const,
    type: "radio" as const,
    options: [
      { value: "0-7", label: "0-7" },
      { value: "8-11", label: "8-11" },
      { value: "12+", label: "12+" },
    ],
  },
  {
    id: 9,
    question: "Derbide kırmızı kart çıkar mı?",
    field: "redCard" as const,
    type: "radio" as const,
    options: [
      { value: "yes", label: "Evet" },
      { value: "no", label: "Hayır" },
    ],
  },
  {
    id: 10,
    question: "Derbide en çok isabetli şut çeken oyuncu kim olur?",
    field: "topShooter" as const,
    type: "select" as const,
    options: PLAYER_OPTIONS.map(player => ({ value: player, label: player })),
  },
  {
    id: 11,
    question: "İlk oyuncu değişikliğini hangi takım yapar?",
    field: "firstSubstitution" as const,
    type: "radio" as const,
    options: [
      { value: "fenerbahce", label: "Fenerbahçe" },
      { value: "galatasaray", label: "Galatasaray" },
    ],
  },
  {
    id: 12,
    question: "Derbide penaltı olur mu?",
    field: "penalty" as const,
    type: "radio" as const,
    options: [
      { value: "yes", label: "Evet" },
      { value: "no", label: "Hayır" },
    ],
  },
] as const;
