import { type InsertPrediction, type LeaderboardEntry } from "@shared/schema";
import { getFirestore, admin } from "./firebase";
import { randomUUID } from "crypto";

export interface IStorage {
  // Predictions
  createPrediction(prediction: InsertPrediction): Promise<string>;
  getPredictionsByPlayerId(playerId: string): Promise<any[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntry(entry: LeaderboardEntry): Promise<void>;
  
  // Player validation
  isPlayerIdValid(playerId: string): Promise<boolean>;
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

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const snapshot = await this.db
      .collection("leaderboard")
      .orderBy("score", "desc")
      .orderBy("submittedAt", "asc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
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

    if (actualResultsDoc.exists) {
      const actualResults = actualResultsDoc.data();
      
      // Calculate score based on correct predictions
      // Each correct answer = 10 points
      const fields = [
        "matchResult",
        "totalGoals",
        "firstGoalTeam",
        "firstGoalTime",
        "halfTimeResult",
        "totalCorners",
        "varDecision",
        "redCard",
        "topShooter",
        "manOfMatch",
        "firstSubstitution",
        "totalCards",
      ];

      if (actualResults) {
        fields.forEach((field) => {
          if (prediction[field] && actualResults[field] && prediction[field] === actualResults[field]) {
            score += 10;
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
}

export const storage = new FirestoreStorage();
