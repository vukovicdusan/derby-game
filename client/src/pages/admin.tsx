import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Fixed credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "derby2024";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [answers, setAnswers] = useState({
    matchResult: "",
    totalGoals: "",
    firstGoalTeam: "",
    firstGoalTime: "",
    halfTimeResult: "",
    totalCorners: "",
    varDecision: "",
    redCard: "",
    topShooter: "",
    manOfMatch: "",
    firstSubstitution: "",
    totalCards: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      toast({
        title: "Giriş Başarılı",
        description: "Admin paneline hoş geldiniz!",
      });
    } else {
      toast({
        title: "Hata",
        description: "Geçersiz kullanıcı adı veya şifre",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAnswers({
      matchResult: "",
      totalGoals: "",
      firstGoalTeam: "",
      firstGoalTime: "",
      halfTimeResult: "",
      totalCorners: "",
      varDecision: "",
      redCard: "",
      topShooter: "",
      manOfMatch: "",
      firstSubstitution: "",
      totalCards: "",
    });
  };

  const handleAnswerChange = (field: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitAnswers = async () => {
    // Validate all fields are filled
    const allFilled = Object.values(answers).every(v => v !== "");
    if (!allFilled) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurunuz",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save answers
      await apiRequest("POST", "/api/admin/answers", answers);
      
      // Recalculate scores
      await apiRequest("POST", "/api/admin/recalculate-scores", {});

      toast({
        title: "Başarılı",
        description: "Doğru cevaplar kaydedildi ve puanlar yeniden hesaplandı!",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Cevaplar kaydedilirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Paneli</CardTitle>
            <CardDescription>Doğru cevapları girmek için giriş yapınız</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Kullanıcı adını girin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifreyi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-login">
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const playerOptions = [
    "Oyuncu 1", "Oyuncu 2", "Oyuncu 3", "Oyuncu 4", "Oyuncu 5",
    "Oyuncu 6", "Oyuncu 7", "Oyuncu 8", "Oyuncu 9", "Oyuncu 10",
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Paneli</h1>
            <p className="text-muted-foreground">Doğru maç cevaplarını girin ve puanları güncelleyin</p>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            Çıkış Yap
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maç Cevapları</CardTitle>
            <CardDescription>Tüm 12 soruya cevap verin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Match Result */}
              <div className="space-y-2">
                <Label htmlFor="matchResult">1. Maç Sonucu</Label>
                <Select value={answers.matchResult} onValueChange={(v) => handleAnswerChange("matchResult", v)}>
                  <SelectTrigger id="matchResult" data-testid="select-matchResult">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Ev sahibi</SelectItem>
                    <SelectItem value="away">Deplasman</SelectItem>
                    <SelectItem value="draw">Berabere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Goals */}
              <div className="space-y-2">
                <Label htmlFor="totalGoals">2. Toplam Gol</Label>
                <Select value={answers.totalGoals} onValueChange={(v) => handleAnswerChange("totalGoals", v)}>
                  <SelectTrigger id="totalGoals" data-testid="select-totalGoals">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0–2</SelectItem>
                    <SelectItem value="3-4">3–4</SelectItem>
                    <SelectItem value="5+">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* First Goal Team */}
              <div className="space-y-2">
                <Label htmlFor="firstGoalTeam">3. İlk Golü Kimin Atacağı</Label>
                <Select value={answers.firstGoalTeam} onValueChange={(v) => handleAnswerChange("firstGoalTeam", v)}>
                  <SelectTrigger id="firstGoalTeam" data-testid="select-firstGoalTeam">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Ev sahibi</SelectItem>
                    <SelectItem value="away">Deplasman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* First Goal Time */}
              <div className="space-y-2">
                <Label htmlFor="firstGoalTime">4. İlk Gol Zamanı</Label>
                <Select value={answers.firstGoalTime} onValueChange={(v) => handleAnswerChange("firstGoalTime", v)}>
                  <SelectTrigger id="firstGoalTime" data-testid="select-firstGoalTime">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-15">0–15 dakika</SelectItem>
                    <SelectItem value="16-30">16–30 dakika</SelectItem>
                    <SelectItem value="31-45">31–45 dakika</SelectItem>
                    <SelectItem value="46-60">46–60 dakika</SelectItem>
                    <SelectItem value="61-75">61–75 dakika</SelectItem>
                    <SelectItem value="76-90">76–90 dakika</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Half Time Result */}
              <div className="space-y-2">
                <Label htmlFor="halfTimeResult">5. İlk Yarı Sonucu</Label>
                <Select value={answers.halfTimeResult} onValueChange={(v) => handleAnswerChange("halfTimeResult", v)}>
                  <SelectTrigger id="halfTimeResult" data-testid="select-halfTimeResult">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Ev sahibi</SelectItem>
                    <SelectItem value="away">Deplasman</SelectItem>
                    <SelectItem value="draw">Berabere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Corners */}
              <div className="space-y-2">
                <Label htmlFor="totalCorners">6. Toplam Köşe Vuruşu</Label>
                <Select value={answers.totalCorners} onValueChange={(v) => handleAnswerChange("totalCorners", v)}>
                  <SelectTrigger id="totalCorners" data-testid="select-totalCorners">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-4">0–4</SelectItem>
                    <SelectItem value="5-8">5–8</SelectItem>
                    <SelectItem value="9-12">9–12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* VAR Decision */}
              <div className="space-y-2">
                <Label htmlFor="varDecision">7. VAR kararı olur mu?</Label>
                <Select value={answers.varDecision} onValueChange={(v) => handleAnswerChange("varDecision", v)}>
                  <SelectTrigger id="varDecision" data-testid="select-varDecision">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Evet</SelectItem>
                    <SelectItem value="no">Hayır</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Red Card */}
              <div className="space-y-2">
                <Label htmlFor="redCard">8. Kırmızı kart çıkar mı?</Label>
                <Select value={answers.redCard} onValueChange={(v) => handleAnswerChange("redCard", v)}>
                  <SelectTrigger id="redCard" data-testid="select-redCard">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Evet</SelectItem>
                    <SelectItem value="no">Hayır</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Top Shooter */}
              <div className="space-y-2">
                <Label htmlFor="topShooter">9. En çok şut çeken oyuncu kim olur?</Label>
                <Select value={answers.topShooter} onValueChange={(v) => handleAnswerChange("topShooter", v)}>
                  <SelectTrigger id="topShooter" data-testid="select-topShooter">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {playerOptions.map(player => (
                      <SelectItem key={player} value={player}>{player}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Man of Match */}
              <div className="space-y-2">
                <Label htmlFor="manOfMatch">10. Maçın adamı kim seçilir?</Label>
                <Select value={answers.manOfMatch} onValueChange={(v) => handleAnswerChange("manOfMatch", v)}>
                  <SelectTrigger id="manOfMatch" data-testid="select-manOfMatch">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {playerOptions.map(player => (
                      <SelectItem key={player} value={player}>{player}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* First Substitution */}
              <div className="space-y-2">
                <Label htmlFor="firstSubstitution">11. İlk oyuncu değişikliğini hangi takım yapar?</Label>
                <Select value={answers.firstSubstitution} onValueChange={(v) => handleAnswerChange("firstSubstitution", v)}>
                  <SelectTrigger id="firstSubstitution" data-testid="select-firstSubstitution">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Ev sahibi</SelectItem>
                    <SelectItem value="away">Deplasman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Cards */}
              <div className="space-y-2">
                <Label htmlFor="totalCards">12. Derbide toplam kart sayısı kaç olur?</Label>
                <Select value={answers.totalCards} onValueChange={(v) => handleAnswerChange("totalCards", v)}>
                  <SelectTrigger id="totalCards" data-testid="select-totalCards">
                    <SelectValue placeholder="Seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0–2</SelectItem>
                    <SelectItem value="3-5">3–5</SelectItem>
                    <SelectItem value="6+">6+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubmitAnswers} 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-submit-answers"
              >
                {isLoading ? "Kaydediliyor..." : "Cevapları Kaydet ve Puanları Hesapla"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
