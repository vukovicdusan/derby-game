import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPredictionSchema } from "@shared/schema";
import { initializeFirebase } from "./firebase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Firebase on server start
  try {
    initializeFirebase();
  } catch (error) {
    console.error("❌ Failed to initialize Firebase:", error);
    throw error;
  }

  // Submit predictions
  app.post("/api/predictions", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertPredictionSchema.parse(req.body);

      // Check if player ID is valid (optional validation)
      const isValid = await storage.isPlayerIdValid(validatedData.playerId);
      if (!isValid) {
        return res.status(400).json({
          error: "Geçersiz Oyuncu ID. Lütfen doğru ID'yi girin.",
        });
      }

      // Create prediction
      const predictionId = await storage.createPrediction(validatedData);

      res.json({
        success: true,
        predictionId,
        message: "Tahminleriniz başarıyla kaydedildi!",
      });
    } catch (error: any) {
      console.error("Error creating prediction:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Geçersiz veri formatı",
          details: error.errors,
        });
      }

      res.status(500).json({
        error: "Tahminler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const leaderboard = await storage.getLeaderboard(limit);

      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({
        error: "Lider tablosu yüklenirken bir hata oluştu.",
      });
    }
  });

  // Get predictions by player ID
  app.get("/api/predictions/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const predictions = await storage.getPredictionsByPlayerId(playerId);

      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({
        error: "Tahminler yüklenirken bir hata oluştu.",
      });
    }
  });

  // Admin: Get current match answers
  app.get("/api/admin/answers", async (req, res) => {
    try {
      const answers = await storage.getMatchAnswers();
      res.json({ answers: answers || null });
    } catch (error: any) {
      console.error("Error getting answers:", error);
      res.status(500).json({
        error: "Cevaplar alınırken bir hata oluştu.",
      });
    }
  });

  // Admin: Set correct match answers
  app.post("/api/admin/answers", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"] as string;
      const expectedToken = process.env.ADMIN_TOKEN;

      // Basic token validation (optional, skip if not set)
      if (expectedToken && adminToken !== expectedToken) {
        return res.status(401).json({
          error: "Unauthorized. Invalid admin token.",
        });
      }

      const answers = req.body;
      
      // Validate that all required fields are present
      const requiredFields = [
        "matchResult",
        "totalGoals",
        "firstGoalTeam",
        "firstGoalTime",
        "halfTimeResult",
        "totalCards",
        "varDecision",
        "totalCorners",
        "redCard",
        "topShooter",
        "firstYellowCard",
        "firstGoalScorer",
      ];

      const missingFields = requiredFields.filter(field => !(field in answers));
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Eksik alanlar: ${missingFields.join(", ")}`,
        });
      }

      // Save answers to Firestore
      await storage.setMatchAnswers(answers);

      res.json({
        success: true,
        message: "Doğru cevaplar başarıyla kaydedildi! Lider tablosu otomatik olarak güncellenecektir.",
      });
    } catch (error: any) {
      console.error("Error setting answers:", error);
      res.status(500).json({
        error: "Cevaplar kaydedilirken bir hata oluştu.",
      });
    }
  });

  // Admin: Recalculate all scores based on correct answers
  app.post("/api/admin/recalculate-scores", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"] as string;
      const expectedToken = process.env.ADMIN_TOKEN;

      // Basic token validation (optional, skip if not set)
      if (expectedToken && adminToken !== expectedToken) {
        return res.status(401).json({
          error: "Unauthorized. Invalid admin token.",
        });
      }

      const updatedCount = await storage.recalculateAllScores();

      res.json({
        success: true,
        message: `${updatedCount} tahmin başarıyla yeniden puanlandırıldı!`,
        updatedCount,
      });
    } catch (error: any) {
      console.error("Error recalculating scores:", error);
      res.status(500).json({
        error: "Puanlar hesaplanırken bir hata oluştu.",
      });
    }
  });

  // Admin: Reset match answers
  app.post("/api/admin/reset-answers", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"] as string;
      const expectedToken = process.env.ADMIN_TOKEN;

      // Basic token validation (optional, skip if not set)
      if (expectedToken && adminToken !== expectedToken) {
        return res.status(401).json({
          error: "Unauthorized. Invalid admin token.",
        });
      }

      await storage.resetMatchAnswers();

      res.json({
        success: true,
        message: "Doğru cevaplar başarıyla sıfırlandı!",
      });
    } catch (error: any) {
      console.error("Error resetting answers:", error);
      res.status(500).json({
        error: "Cevaplar sıfırlanırken bir hata oluştu.",
      });
    }
  });

  // Admin: Get all applicants
  app.get("/api/admin/applicants", async (req, res) => {
    try {
      const adminToken = req.headers["x-admin-token"] as string;
      const expectedToken = process.env.ADMIN_TOKEN;

      // Basic token validation (optional, skip if not set)
      if (expectedToken && adminToken !== expectedToken) {
        return res.status(401).json({
          error: "Unauthorized. Invalid admin token.",
        });
      }

      const applicants = await storage.getAllPredictions();

      res.json({
        success: true,
        count: applicants.length,
        applicants,
      });
    } catch (error: any) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({
        error: "Katılımcılar yüklenirken bir hata oluştu.",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      firebase: "connected",
      timestamp: new Date().toISOString(),
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
