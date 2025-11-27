import { useState, useMemo } from "react";
import { PredictionForm } from "@/components/prediction-form";
import { Leaderboard } from "@/components/leaderboard";

const COMPETITION_END_DATE = new Date("2024-12-01T17:00:00.000Z");

function isCompetitionEnded(): boolean {
  return new Date() >= COMPETITION_END_DATE;
}

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeView, setActiveView] = useState<"form" | "leaderboard">("form");
  
  const competitionEnded = useMemo(() => isCompetitionEnded(), []);

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

  if (competitionEnded) {
    return (
      <div className="min-h-screen bg-background">
        <Leaderboard
          hasSubmitted={true}
          userName=""
          onBackToForm={() => {}}
          competitionEnded={true}
        />
      </div>
    );
  }

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
