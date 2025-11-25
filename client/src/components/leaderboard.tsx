import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type LeaderboardEntry } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, ArrowLeft, RefreshCw, Users, List } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ThemeToggle } from "@/components/theme-toggle";
import { RulesDialog } from "@/components/rules-dialog";
import bannerImage from "@assets/Sign-Up_Sport_June_2025_September-970x250-Stack_Digital_1763998273969.webp";
import logoImage from "@assets/superbahis-logo_1763999127745.png";

interface LeaderboardProps {
  hasSubmitted: boolean;
  userName: string;
  onBackToForm: () => void;
}

export function Leaderboard({ hasSubmitted, userName, onBackToForm }: LeaderboardProps) {
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const { data: leaderboard, isLoading, refetch, isRefetching } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank <= 3) return "secondary";
    return "outline";
  };

  const maskName = (name: string) => {
    const words = name.split(" ");
    return words.map(word => {
      if (word.length <= 3) return word;
      return word.substring(0, 3) + "*".repeat(word.length - 3);
    }).join(" ");
  };

  const handleBack = () => {
    onBackToForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Top Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRulesDialog(true)}
              data-testid="button-kurallar-leaderboard"
              className="h-9 w-9"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90"
              data-testid="button-superbahis-uye-ol"
            >
              <a href="#">Superbahis'e Üye Ol</a>
            </Button>
          </div>
        </div>
      </div>

      {/* 1rem gap between top nav and banner */}
      <div className="fixed top-12 left-0 right-0 h-4 z-30 bg-background"></div>

      {/* Background behind banner and header */}
      <div className="fixed top-0 left-0 right-0 h-[280px] md:h-[320px] z-10 bg-background"></div>

      {/* Fixed Banner - centered with max width, positioned below top nav and gap */}
      <div className="fixed top-16 left-0 right-0 z-20 flex justify-center">
        <div className="w-full max-w-[700px]">
          <img 
            src={bannerImage} 
            alt="Sports Bonus Banner" 
            className="w-full h-auto object-cover"
            data-testid="banner-image"
          />
        </div>
      </div>

      {/* Header with progress - positioned below banner with 1rem gap */}
      <div className="sticky top-[201px] md:top-[241px] z-20 bg-background border-b-2 border-accent">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              data-testid="button-back-to-form"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-accent" />
              {userName ? "Tahminlere Dön" : "Geri Dön"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              data-testid="button-refresh-leaderboard"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-[256px] md:pt-[296px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Superbahis Logo" 
              className="max-w-[250px] h-auto"
              data-testid="logo-image"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 uppercase">
            Süperbahis – 12 Soruluk Maç Tahmin Etkinliği (100.000 TL Ödüllü)
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            En yüksek skorlara sahip tahmin ustalarımız
          </p>
        </div>

        {hasSubmitted && (
          <Card className="mb-6 border-accent/40 bg-accent/10 border-l-4 border-l-accent">
            <CardContent className="pt-6">
              <p className="text-center text-base text-foreground">
                Tahminleriniz başarıyla gönderildi! Skorunuz hesaplandığında burada görünecektir.
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Henüz tahmin yok
              </h3>
              <p className="text-muted-foreground">
                İlk tahmin yapan siz olun ve lider tablosunda yerinizi alın!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Sıralama
              </CardTitle>
              <CardDescription>
                Toplam {leaderboard.length} katılımcı
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userName === userName;
                
                return (
                  <div
                    key={entry.id}
                    data-testid={`leaderboard-entry-${rank}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      isCurrentUser
                        ? "border-primary bg-primary/5"
                        : "border-border hover-elevate"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted flex-shrink-0">
                      {getRankIcon(rank) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground truncate">
                          {maskName(entry.userName)}
                        </p>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            Siz
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          {entry.totalCorrect}/12 doğru
                        </span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(entry.submittedAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={getRankBadgeVariant(rank)}
                        className="text-base font-bold px-3 py-1"
                        data-testid={`score-${rank}`}
                      >
                        {entry.score}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        puan
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Lider tablosu otomatik olarak her 30 saniyede bir güncellenir
        </p>
      </div>
      <RulesDialog 
        open={showRulesDialog}
        onOpenChange={setShowRulesDialog}
      />
    </div>
  );
}
