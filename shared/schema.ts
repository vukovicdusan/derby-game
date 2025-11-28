import { z } from "zod";

// Player options for Question 10: Top Shooter
export const TOP_SHOOTER_OPTIONS = [
  "Victor Osimhen",
  "John Duran",
  "Barış Alper Yılmaz",
  "Leroy Sane",
  "Marco Asensio",
  "Kerem Aktürkoğlu",
  "İlkay Gündoğan",
  "Dorgeles Nene",
  "En-Nesyri",
  "Mauro Icardi",
  "Lucas Torreira",
  "Fred",
  "Diğer",
  "Anderson Talisca",
];

// Player options for Question 11: First Yellow Card
export const FIRST_YELLOW_CARD_OPTIONS = [
  "Lucas Torreira",
  "Fred",
  "Milan Skriniar",
  "Davinson Sanchez",
  "Jayden Oosterwolde",
  "Abdülkerim Bardakçı",
  "Ismail Jakobs",
  "Mario Lemina",
  "Gabriel Sara",
  "İsmail Yüksek",
  "İlkay Gündoğan",
  "Kerem Aktürkoğlu",
  "Leroy Sane",
  "Jhon Duran",
  "Mauro Icardi",
  "Ederson",
  "Uğurcan Çakır",
  "Diğer",
];

// Player options for Question 12: First Goal Scorer
export const FIRST_GOAL_SCORER_OPTIONS = [
  "Victor Osimhen",
  "Youssef En-Nesyri",
  "Mauro Icardi",
  "Jhon Duran",
  "Barış Alper Yılmaz",
  "Kerem Aktürkoğlu",
  "Dorgeles Nene",
  "Leroy Sane",
  "Anderson Talisca",
  "İlkay Gündoğan",
  "Lucas Torreira",
  "Fred",
  "Mario Lemina",
  "İsmail Yüksek",
  "Gabriel Sara",
  "Marco Asensio",
  "Diğer",
];

// Derby Prediction Schema
export const predictionSchema = z.object({
  // User Information
  userName: z.string().min(1, "İsim gerekli"),
  playerId: z.string().min(1, "Oyuncu ID gerekli"),
  
  // Question 1: Derbinin sonucu ne olur? (10 points)
  matchResult: z.enum(["fenerbahce", "draw", "galatasaray"], {
    required_error: "Maç sonucu seçmelisiniz"
  }),
  
  // Question 2: Derbide toplam kaç gol olur? (10 points)
  totalGoals: z.enum(["0-2", "3-4", "5+"], {
    required_error: "Toplam gol sayısı seçmelisiniz"
  }),
  
  // Question 3: İlk golü hangi takım atar? (5 points)
  firstGoalTeam: z.enum(["fenerbahce", "galatasaray", "noGoal"], {
    required_error: "İlk gol takımını seçmelisiniz"
  }),
  
  // Question 4: İlk gol hangi dakikada gelir? (15 points)
  firstGoalTime: z.enum(["0-15", "16-30", "31-45", "46-60", "61-75", "76-90", "noGoal"], {
    required_error: "İlk gol dakikasını seçmelisiniz"
  }),
  
  // Question 5: İlk yarı sonucu ne olur? (5 points)
  halfTimeResult: z.enum(["fenerbahce", "draw", "galatasaray"], {
    required_error: "İlk yarı sonucunu seçmelisiniz"
  }),
  
  // Question 6: Derbide kaç sarı/kırmızı kart çıkar? (10 points)
  totalCards: z.enum(["0-3", "4-6", "7-9", "10+"], {
    required_error: "Kart sayısını seçmelisiniz"
  }),
  
  // Question 7: Hakem VAR'a gider mi? (5 points)
  varDecision: z.enum(["yes", "no"], {
    required_error: "VAR kararını seçmelisiniz"
  }),
  
  // Question 8: Derbide kaç korner olur? (10 points)
  totalCorners: z.enum(["0-7", "8-11", "12+"], {
    required_error: "Korner sayısını seçmelisiniz"
  }),
  
  // Question 9: Derbide kırmızı kart çıkar mı? (10 points)
  redCard: z.enum(["yes", "no"], {
    required_error: "Kırmızı kart seçimini yapmalısınız"
  }),
  
  // Question 10: Derbide en çok isabetli şut çeken oyuncu kim olur? (25 points)
  topShooter: z.string().min(1, "Oyuncu seçmelisiniz"),
  
  // Question 11: Derbide ilk sarı kartı hangi oyuncu görür? (25 points)
  firstYellowCard: z.string().min(1, "Oyuncu seçmelisiniz"),
  
  // Question 12: Derbide ilk golü hangi oyuncu atar? (20 points)
  firstGoalScorer: z.string().min(1, "Oyuncu seçmelisiniz"),
  
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

// Point values for each question
export const QUESTION_POINTS: Record<string, number> = {
  matchResult: 10,
  totalGoals: 10,
  firstGoalTeam: 5,
  firstGoalTime: 15,
  halfTimeResult: 5,
  totalCards: 10,
  varDecision: 5,
  totalCorners: 10,
  redCard: 10,
  topShooter: 25,
  firstYellowCard: 25,
  firstGoalScorer: 20,
};

// Questions configuration
export const QUESTIONS = [
  {
    id: 1,
    question: "Derbinin sonucu ne olur?",
    field: "matchResult" as const,
    type: "radio" as const,
    points: 10,
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
    points: 10,
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
    points: 5,
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
    points: 15,
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
    points: 5,
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
    points: 10,
    options: [
      { value: "0-3", label: "0-3" },
      { value: "4-6", label: "4-6" },
      { value: "7-9", label: "7-9" },
      { value: "10+", label: "10+" },
    ],
  },
  {
    id: 7,
    question: "Hakem VAR'a gider mi?",
    field: "varDecision" as const,
    type: "radio" as const,
    points: 5,
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
    points: 10,
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
    points: 10,
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
    points: 25,
    options: TOP_SHOOTER_OPTIONS.map(player => ({ value: player, label: player })),
  },
  {
    id: 11,
    question: "Derbide ilk sarı kartı hangi oyuncu görür?",
    field: "firstYellowCard" as const,
    type: "select" as const,
    points: 25,
    options: FIRST_YELLOW_CARD_OPTIONS.map(player => ({ value: player, label: player })),
  },
  {
    id: 12,
    question: "Derbide ilk golü hangi oyuncu atar?",
    field: "firstGoalScorer" as const,
    type: "select" as const,
    points: 20,
    options: FIRST_GOAL_SCORER_OPTIONS.map(player => ({ value: player, label: player })),
  },
] as const;
