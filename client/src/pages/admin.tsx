import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download } from "lucide-react";

// Fixed credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "derby2024";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

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
    setApplicants([]);
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchApplicants();
    }
  }, [isLoggedIn]);

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

    // Prepare CSV headers and data
    const headers = [
      "Ad Soyadı",
      "Oyuncu ID",
      "Gönderim Tarihi",
      "Maç Sonucu",
      "Toplam Gol",
      "İlk Golü Kimin",
      "İlk Gol Zamanı",
      "İlk Yarı Sonucu",
      "Toplam Köşe",
      "VAR Kararı",
      "Kırmızı Kart",
      "En Çok Şut",
      "Maçın Adamı",
      "İlk Oyuncu Değişikliği",
      "Toplam Kart",
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
      app.totalCorners || "",
      app.varDecision || "",
      app.redCard || "",
      app.topShooter || "",
      app.manOfMatch || "",
      app.firstSubstitution || "",
      app.totalCards || "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    // Download
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
      
      // Clear the form
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
                            applicant.totalCorners,
                            applicant.varDecision,
                            applicant.redCard,
                            applicant.topShooter,
                            applicant.manOfMatch,
                            applicant.firstSubstitution,
                            applicant.totalCards,
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
