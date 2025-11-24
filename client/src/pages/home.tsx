import { useState } from "react";
import { PredictionForm } from "@/components/prediction-form";
import { Leaderboard } from "@/components/leaderboard";

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeView, setActiveView] = useState<"form" | "leaderboard">("form");

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

  return (
    <div className="min-h-screen bg-background">
      {activeView === "form" && (
        <PredictionForm
          userName={userName}
          setUserName={setUserName}
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
