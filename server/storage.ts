import { type InsertPrediction, type LeaderboardEntry } from "@shared/schema";
import { getFirestore, admin } from "./firebase";
import { randomUUID } from "crypto";

export interface IStorage {
  // Predictions
  createPrediction(prediction: InsertPrediction): Promise<string>;
  getPredictionsByPlayerId(playerId: string): Promise<any[]>;
  getAllPredictions(): Promise<any[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntry(entry: LeaderboardEntry): Promise<void>;
  
  // Player validation
  isPlayerIdValid(playerId: string): Promise<boolean>;
  
  // Admin
  setMatchAnswers(answers: any): Promise<void>;
  recalculateAllScores(): Promise<number>;
  resetMatchAnswers(): Promise<void>;
}

export class FirestoreStorage implements IStorage {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  async createPrediction(prediction: InsertPrediction): Promise<string> {
    const predictionId = randomUUID();
    const timestamp = admin.firestore.Timestamp.now();

    const predictionData = {
      id: predictionId,
      ...prediction,
      submittedAt: timestamp,
      createdAt: timestamp,
    };

    await this.db.collection("predictions").doc(predictionId).set(predictionData);

    // Calculate score and update leaderboard
    await this.updateLeaderboardForPrediction(predictionData);

    return predictionId;
  }

  async getPredictionsByPlayerId(playerId: string): Promise<any[]> {
    const snapshot = await this.db
      .collection("predictions")
      .where("playerId", "==", playerId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async getAllPredictions(): Promise<any[]> {
    const snapshot = await this.db
      .collection("predictions")
      .orderBy("submittedAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        submittedAt: data.submittedAt instanceof admin.firestore.Timestamp
          ? data.submittedAt.toDate()
          : data.submittedAt,
      };
    });
  }

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const snapshot = await this.db
      .collection("leaderboard")
      .orderBy("score", "desc")
      .limit(limit)
      .get();

    // Sort by submittedAt in memory if needed (for tie-breaking)
    const entries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        userName: data.userName,
        playerId: data.playerId,
        score: data.score,
        totalCorrect: data.totalCorrect,
        submittedAt: data.submittedAt.toDate(),
      } as LeaderboardEntry;
    });

    // Secondary sort by submission time (earliest first) for tied scores
    return entries.sort((a, b) => {
      if (a.score === b.score) {
        return a.submittedAt.getTime() - b.submittedAt.getTime();
      }
      return 0; // Primary sort (by score DESC) already done by orderBy
    });
  }

  async updateLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
    const timestamp = entry.submittedAt instanceof Date 
      ? admin.firestore.Timestamp.fromDate(entry.submittedAt)
      : entry.submittedAt;

    await this.db.collection("leaderboard").doc(entry.id).set({
      id: entry.id,
      userName: entry.userName,
      playerId: entry.playerId,
      score: entry.score,
      totalCorrect: entry.totalCorrect,
      submittedAt: timestamp,
    });
  }

  async isPlayerIdValid(playerId: string): Promise<boolean> {
    // For now, accept all player IDs
    // In a real implementation, you would check against a players collection:
    // const playerDoc = await this.db.collection("players").doc(playerId).get();
    // return playerDoc.exists;
    return true;
  }

  private async updateLeaderboardForPrediction(prediction: any): Promise<void> {
    // Get actual results from Firestore (if set by admin)
    const actualResultsDoc = await this.db.collection("matchResults").doc("current").get();
    
    let score = 0;
    let totalCorrect = 0;

    // Point values for each question (variable points)
    const questionPoints: Record<string, number> = {
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

    if (actualResultsDoc.exists) {
      const actualResults = actualResultsDoc.data();
      
      // Calculate score based on correct predictions with variable points
      const fields = Object.keys(questionPoints);

      if (actualResults) {
        fields.forEach((field) => {
          if (prediction[field] && actualResults[field] && prediction[field] === actualResults[field]) {
            score += questionPoints[field];
            totalCorrect += 1;
          }
        });
      }
    }

    // Create leaderboard entry with Firestore timestamp
    const submittedAt = prediction.submittedAt instanceof admin.firestore.Timestamp
      ? prediction.submittedAt.toDate()
      : new Date();

    const leaderboardEntry: LeaderboardEntry = {
      id: prediction.id,
      userName: prediction.userName,
      playerId: prediction.playerId,
      score,
      totalCorrect,
      submittedAt,
    };

    await this.updateLeaderboardEntry(leaderboardEntry);
  }

  async setMatchAnswers(answers: any): Promise<void> {
    // Save correct answers to Firestore
    await this.db.collection("matchResults").doc("current").set(answers);
    
    console.log("✅ Match answers saved successfully");
  }

  async recalculateAllScores(): Promise<number> {
    // Get all predictions
    const predictionsSnapshot = await this.db.collection("predictions").get();
    
    if (predictionsSnapshot.empty) {
      console.log("No predictions to recalculate");
      return 0;
    }

    // Get correct answers
    const answersDoc = await this.db.collection("matchResults").doc("current").get();
    
    if (!answersDoc.exists) {
      console.log("No correct answers found");
      return 0;
    }

    const correctAnswers = answersDoc.data() || {};
    
    // Point values for each question (variable points)
    const questionPoints: Record<string, number> = {
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
    
    const fields = Object.keys(questionPoints);

    let updatedCount = 0;

    // Recalculate scores for each prediction
    for (const doc of predictionsSnapshot.docs) {
      const prediction = doc.data();
      let score = 0;
      let totalCorrect = 0;

      // Compare each field with variable points
      fields.forEach((field) => {
        if (prediction[field] && correctAnswers[field] && prediction[field] === correctAnswers[field]) {
          score += questionPoints[field];
          totalCorrect += 1;
        }
      });

      // Update leaderboard entry
      const submittedAt = prediction.submittedAt instanceof admin.firestore.Timestamp
        ? prediction.submittedAt.toDate()
        : new Date();

      const leaderboardEntry: LeaderboardEntry = {
        id: prediction.id,
        userName: prediction.userName,
        playerId: prediction.playerId,
        score,
        totalCorrect,
        submittedAt,
      };

      await this.updateLeaderboardEntry(leaderboardEntry);
      updatedCount++;
    }

    console.log(`✅ Recalculated scores for ${updatedCount} predictions`);
    return updatedCount;
  }

  async resetMatchAnswers(): Promise<void> {
    // Delete match answers from Firestore
    await this.db.collection("matchResults").doc("current").delete();
    
    // Reset all leaderboard scores to 0
    const leaderboardSnapshot = await this.db.collection("leaderboard").get();
    
    for (const doc of leaderboardSnapshot.docs) {
      await doc.ref.update({
        score: 0,
        totalCorrect: 0,
      });
    }
    
    console.log("✅ Match answers reset successfully and leaderboard cleared");
  }
}

export const storage = new FirestoreStorage();
