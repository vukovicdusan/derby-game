import { useQuery } from "@tanstack/react-query";
import { type LeaderboardEntry } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, ArrowLeft, RefreshCw, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ThemeToggle } from "@/components/theme-toggle";

interface LeaderboardProps {
  hasSubmitted: boolean;
  userName: string;
  onBackToForm: () => void;
  onBackToWelcome: () => void;
}

export function Leaderboard({ hasSubmitted, userName, onBackToForm, onBackToWelcome }: LeaderboardProps) {
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

  const handleBack = () => {
    if (!userName) {
      onBackToWelcome();
    } else {
      onBackToForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              data-testid="button-back-to-form"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {userName ? "Tahminlere Dön" : "Geri Dön"}
            </Button>
            <div className="flex items-center gap-2">
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
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Lider Tablosu
          </h1>
          <p className="text-lg text-muted-foreground">
            En yüksek skorlara sahip tahmin ustalarımız
          </p>
        </div>

        {hasSubmitted && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-center text-base">
                🎉 Tahminleriniz başarıyla gönderildi! Skorunuz hesaplandığında burada görünecektir.
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
                          {entry.userName}
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
    </div>
  );
}
