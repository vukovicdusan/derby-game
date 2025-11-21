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
