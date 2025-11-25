import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, Loader2 } from "lucide-react";
import { TOP_SHOOTER_OPTIONS, FIRST_YELLOW_CARD_OPTIONS, FIRST_GOAL_SCORER_OPTIONS } from "@shared/schema";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "derby2024";

const EMPTY_ANSWERS = {
  matchResult: "",
  totalGoals: "",
  firstGoalTeam: "",
  firstGoalTime: "",
  halfTimeResult: "",
  totalCards: "",
  varDecision: "",
  totalCorners: "",
  redCard: "",
  topShooter: "",
  firstYellowCard: "",
  firstGoalScorer: "",
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);

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
    setApplicants([]);
    setAnswers(EMPTY_ANSWERS);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchApplicants();
      fetchSavedAnswers();
    }
  }, [isLoggedIn]);

  const fetchSavedAnswers = async () => {
    setIsLoadingAnswers(true);
    try {
      const response = await apiRequest("GET", "/api/admin/answers");
      const data = await response.json();
      if (data.answers) {
        setAnswers({
          matchResult: data.answers.matchResult || "",
          totalGoals: data.answers.totalGoals || "",
          firstGoalTeam: data.answers.firstGoalTeam || "",
          firstGoalTime: data.answers.firstGoalTime || "",
          halfTimeResult: data.answers.halfTimeResult || "",
          totalCards: data.answers.totalCards || "",
          varDecision: data.answers.varDecision || "",
          totalCorners: data.answers.totalCorners || "",
          redCard: data.answers.redCard || "",
          topShooter: data.answers.topShooter || "",
          firstYellowCard: data.answers.firstYellowCard || "",
          firstGoalScorer: data.answers.firstGoalScorer || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching saved answers:", error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const fetchApplicants = async () => {
    setIsLoadingApplicants(true);
    try {
      const response = await apiRequest("GET", "/api/admin/applicants");
      const data = await response.json();
      if (data.applicants) {
        setApplicants(data.applicants);
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Katılımcılar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const exportToCSV = () => {
    if (applicants.length === 0) {
      toast({
        title: "Bilgi",
        description: "Dışa aktarılacak katılımcı bulunamadı",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Ad Soyadı",
      "Oyuncu ID",
      "Gönderim Tarihi",
      "Maç Sonucu",
      "Toplam Gol",
      "İlk Golü Kimin",
      "İlk Gol Zamanı",
      "İlk Yarı Sonucu",
      "Toplam Kart",
      "VAR Kararı",
      "Toplam Korner",
      "Kırmızı Kart",
      "En Çok Şut",
      "İlk Sarı Kart",
      "İlk Golü Atan",
    ];

    const rows = applicants.map((app) => [
      app.userName,
      app.playerId,
      new Date(app.submittedAt).toLocaleString("tr-TR"),
      app.matchResult || "",
      app.totalGoals || "",
      app.firstGoalTeam || "",
      app.firstGoalTime || "",
      app.halfTimeResult || "",
      app.totalCards || "",
      app.varDecision || "",
      app.totalCorners || "",
      app.redCard || "",
      app.topShooter || "",
      app.firstYellowCard || "",
      app.firstGoalScorer || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `katilimcilar_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Başarılı",
      description: `${applicants.length} katılımcı başarıyla indirildi!`,
    });
  };

  const handleResetAnswers = async () => {
    if (!confirm("Tüm doğru cevapları sıfırlamak istediğinize emin misiniz?")) {
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/admin/reset-answers", {});
      setAnswers(EMPTY_ANSWERS);

      toast({
        title: "Başarılı",
        description: "Doğru cevaplar sıfırlandı!",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Cevaplar sıfırlanırken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (field: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitAnswers = async () => {
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
      await apiRequest("POST", "/api/admin/answers", answers);
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <CardDescription>
              Tüm 12 soruya cevap verin
              {isLoadingAnswers && <span className="ml-2 text-muted-foreground">(Yükleniyor...)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnswers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Kayıtlı cevaplar yükleniyor...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Match Result - 10 pts */}
                <div className="space-y-2">
                  <Label htmlFor="matchResult">1. Derbinin sonucu ne olur? (10 puan)</Label>
                  <Select value={answers.matchResult} onValueChange={(v) => handleAnswerChange("matchResult", v)}>
                    <SelectTrigger id="matchResult" data-testid="select-matchResult">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fenerbahce">Fenerbahçe kazanır</SelectItem>
                      <SelectItem value="draw">Berabere biter</SelectItem>
                      <SelectItem value="galatasaray">Galatasaray kazanır</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Total Goals - 10 pts */}
                <div className="space-y-2">
                  <Label htmlFor="totalGoals">2. Derbide toplam kaç gol olur? (10 puan)</Label>
                  <Select value={answers.totalGoals} onValueChange={(v) => handleAnswerChange("totalGoals", v)}>
                    <SelectTrigger id="totalGoals" data-testid="select-totalGoals">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2</SelectItem>
                      <SelectItem value="3-4">3-4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. First Goal Team - 5 pts */}
                <div className="space-y-2">
                  <Label htmlFor="firstGoalTeam">3. İlk golü hangi takım atar? (5 puan)</Label>
                  <Select value={answers.firstGoalTeam} onValueChange={(v) => handleAnswerChange("firstGoalTeam", v)}>
                    <SelectTrigger id="firstGoalTeam" data-testid="select-firstGoalTeam">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fenerbahce">Fenerbahçe</SelectItem>
                      <SelectItem value="galatasaray">Galatasaray</SelectItem>
                      <SelectItem value="noGoal">Gol olmaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. First Goal Time - 15 pts */}
                <div className="space-y-2">
                  <Label htmlFor="firstGoalTime">4. İlk gol hangi dakikada gelir? (15 puan)</Label>
                  <Select value={answers.firstGoalTime} onValueChange={(v) => handleAnswerChange("firstGoalTime", v)}>
                    <SelectTrigger id="firstGoalTime" data-testid="select-firstGoalTime">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-15">0-15</SelectItem>
                      <SelectItem value="16-30">16-30</SelectItem>
                      <SelectItem value="31-45">31-45</SelectItem>
                      <SelectItem value="46-60">46-60</SelectItem>
                      <SelectItem value="61-75">61-75</SelectItem>
                      <SelectItem value="76-90">76-90</SelectItem>
                      <SelectItem value="noGoal">Gol olmaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Half Time Result - 5 pts */}
                <div className="space-y-2">
                  <Label htmlFor="halfTimeResult">5. İlk yarı sonucu ne olur? (5 puan)</Label>
                  <Select value={answers.halfTimeResult} onValueChange={(v) => handleAnswerChange("halfTimeResult", v)}>
                    <SelectTrigger id="halfTimeResult" data-testid="select-halfTimeResult">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fenerbahce">Fenerbahçe</SelectItem>
                      <SelectItem value="draw">Berabere</SelectItem>
                      <SelectItem value="galatasaray">Galatasaray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. Total Cards - 10 pts */}
                <div className="space-y-2">
                  <Label htmlFor="totalCards">6. Derbide kaç sarı/kırmızı kart çıkar? (10 puan)</Label>
                  <Select value={answers.totalCards} onValueChange={(v) => handleAnswerChange("totalCards", v)}>
                    <SelectTrigger id="totalCards" data-testid="select-totalCards">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-3">0-3</SelectItem>
                      <SelectItem value="4-6">4-6</SelectItem>
                      <SelectItem value="6-9">6-9</SelectItem>
                      <SelectItem value="10+">10+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 7. VAR Decision - 5 pts */}
                <div className="space-y-2">
                  <Label htmlFor="varDecision">7. Hakem VAR'a gider mi? (5 puan)</Label>
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

                {/* 8. Total Corners - 10 pts */}
                <div className="space-y-2">
                  <Label htmlFor="totalCorners">8. Derbide kaç korner olur? (10 puan)</Label>
                  <Select value={answers.totalCorners} onValueChange={(v) => handleAnswerChange("totalCorners", v)}>
                    <SelectTrigger id="totalCorners" data-testid="select-totalCorners">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-7">0-7</SelectItem>
                      <SelectItem value="8-11">8-11</SelectItem>
                      <SelectItem value="12+">12+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 9. Red Card - 10 pts */}
                <div className="space-y-2">
                  <Label htmlFor="redCard">9. Derbide kırmızı kart çıkar mı? (10 puan)</Label>
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

                {/* 10. Top Shooter - 25 pts */}
                <div className="space-y-2">
                  <Label htmlFor="topShooter">10. En çok isabetli şut çeken oyuncu kim olur? (25 puan)</Label>
                  <Select value={answers.topShooter} onValueChange={(v) => handleAnswerChange("topShooter", v)}>
                    <SelectTrigger id="topShooter" data-testid="select-topShooter">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TOP_SHOOTER_OPTIONS.map(player => (
                        <SelectItem key={player} value={player}>{player}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 11. First Yellow Card - 25 pts */}
                <div className="space-y-2">
                  <Label htmlFor="firstYellowCard">11. İlk sarı kartı hangi oyuncu görür? (25 puan)</Label>
                  <Select value={answers.firstYellowCard} onValueChange={(v) => handleAnswerChange("firstYellowCard", v)}>
                    <SelectTrigger id="firstYellowCard" data-testid="select-firstYellowCard">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FIRST_YELLOW_CARD_OPTIONS.map(player => (
                        <SelectItem key={player} value={player}>{player}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 12. First Goal Scorer - 20 pts */}
                <div className="space-y-2">
                  <Label htmlFor="firstGoalScorer">12. İlk golü hangi oyuncu atar? (20 puan)</Label>
                  <Select value={answers.firstGoalScorer} onValueChange={(v) => handleAnswerChange("firstGoalScorer", v)}>
                    <SelectTrigger id="firstGoalScorer" data-testid="select-firstGoalScorer">
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FIRST_GOAL_SCORER_OPTIONS.map(player => (
                        <SelectItem key={player} value={player}>{player}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmitAnswers} 
                    className="flex-1 bg-accent hover:bg-accent/90" 
                    disabled={isLoading}
                    data-testid="button-submit-answers"
                  >
                    {isLoading ? "Kaydediliyor..." : "Kaydet & Puanla"}
                  </Button>
                  <Button 
                    onClick={handleResetAnswers} 
                    variant="outline"
                    disabled={isLoading}
                    data-testid="button-reset-answers"
                  >
                    Sıfırla
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Katılımcılar Listesi</CardTitle>
              <CardDescription>{applicants.length} katılımcı kayıtlı</CardDescription>
            </div>
            <Button 
              onClick={exportToCSV} 
              variant="outline" 
              size="sm"
              disabled={isLoadingApplicants || applicants.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV Olarak İndir
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingApplicants ? (
              <div className="text-center py-8 text-muted-foreground">
                Katılımcılar yükleniyor...
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Henüz hiç katılımcı kaydı yok
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2 font-semibold">Ad Soyadı</th>
                      <th className="text-left p-2 font-semibold">Oyuncu ID</th>
                      <th className="text-left p-2 font-semibold">Gönderim Tarihi</th>
                      <th className="text-center p-2 font-semibold">Cevaplar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2">{applicant.userName}</td>
                        <td className="p-2 text-muted-foreground">{applicant.playerId}</td>
                        <td className="p-2 text-muted-foreground text-xs">
                          {new Date(applicant.submittedAt).toLocaleString("tr-TR")}
                        </td>
                        <td className="p-2 text-center text-xs">
                          {[
                            applicant.matchResult,
                            applicant.totalGoals,
                            applicant.firstGoalTeam,
                            applicant.firstGoalTime,
                            applicant.halfTimeResult,
                            applicant.totalCards,
                            applicant.varDecision,
                            applicant.totalCorners,
                            applicant.redCard,
                            applicant.topShooter,
                            applicant.firstYellowCard,
                            applicant.firstGoalScorer,
                          ].filter(Boolean).length}/12
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
