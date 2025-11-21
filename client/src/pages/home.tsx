import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { PredictionForm } from "@/components/prediction-form";
import { Leaderboard } from "@/components/leaderboard";

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeView, setActiveView] = useState<"welcome" | "form" | "leaderboard">("welcome");

  const handleStartGame = (name: string) => {
    setUserName(name);
    setActiveView("form");
  };

  const handleSubmitSuccess = () => {
    setHasSubmitted(true);
    setActiveView("leaderboard");
  };

  const handleViewLeaderboard = () => {
    setActiveView("leaderboard");
  };

  const handleBackToForm = () => {
    setActiveView("form");
  };

  const handleBackToWelcome = () => {
    setActiveView("welcome");
    setUserName("");
    setHasSubmitted(false);
  };

  const handleViewLeaderboardFromWelcome = () => {
    setActiveView("leaderboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {activeView === "welcome" && (
        <WelcomeScreen 
          onStart={handleStartGame} 
          onViewLeaderboard={handleViewLeaderboardFromWelcome}
        />
      )}
      
      {activeView === "form" && (
        <PredictionForm
          userName={userName}
          onSubmitSuccess={handleSubmitSuccess}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}
      
      {activeView === "leaderboard" && (
        <Leaderboard
          hasSubmitted={hasSubmitted}
          userName={userName}
          onBackToForm={handleBackToForm}
        />
      )}
    </div>
  );
}
