import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formPredictionSchema, type FormPrediction, type InsertPrediction, QUESTIONS } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle2, Trophy, AlertCircle, Loader2, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PlayerIdDialog } from "@/components/player-id-dialog";
import { RulesDialog } from "@/components/rules-dialog";
import { SubmissionSuccessDialog } from "@/components/submission-success-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import bannerImage from "@assets/Sign-Up_Sport_June_2025_September-970x250-Stack_Digital_1763998273969.webp";
import logoImage from "@assets/superbahis-logo_1763999127745.png";

interface PredictionFormProps {
  userName: string;
  setUserName: (name: string) => void;
  onSubmitSuccess: () => void;
  onViewLeaderboard: () => void;
}

const STORAGE_KEY = "derby-predictions-draft";

export function PredictionForm({ userName, setUserName, onSubmitSuccess, onViewLeaderboard }: PredictionFormProps) {
  const { toast } = useToast();
  const [showPlayerIdDialog, setShowPlayerIdDialog] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [tempUserName, setTempUserName] = useState(userName);
  
  // Load saved progress from localStorage
  const getSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load saved progress", e);
    }
    return {};
  };

  const form = useForm<FormPrediction>({
    resolver: zodResolver(formPredictionSchema),
    defaultValues: {
      userName,
      playerId: "",
      ...getSavedProgress(),
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertPrediction) => {
      return await apiRequest("POST", "/api/predictions", data);
    },
    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEY);
      // Invalidate leaderboard cache to trigger immediate update
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      setShowPlayerIdDialog(false);
      setShowSuccessDialog(true);
    },
    onError: (error: Error) => {
      setShowPlayerIdDialog(false);
      toast({
        title: "Hata oluştu",
        description: error.message || "Tahminler gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  // Auto-save progress to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      const { userName: _userName, playerId: _playerId, ...predictions } = value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
      
      // Count answered questions
      let count = 0;
      if (value.matchResult) count++;
      if (value.totalGoals) count++;
      if (value.firstGoalTeam) count++;
      if (value.firstGoalTime) count++;
      if (value.halfTimeResult) count++;
      if (value.totalCards) count++;
      if (value.varDecision) count++;
      if (value.totalCorners) count++;
      if (value.redCard) count++;
      if (value.topShooter) count++;
      if (value.firstYellowCard) count++;
      if (value.firstGoalScorer) count++;
      
      setAnsweredCount(count);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = async () => {
    const isValid = await form.trigger();
    
    if (!isValid) {
      const errors = form.formState.errors;
      const firstErrorField = Object.keys(errors)[0];
      
      toast({
        title: "Eksik bilgiler var",
        description: "Lütfen tüm soruları cevaplayın.",
        variant: "destructive",
      });
      
      const element = document.getElementById(`question-${firstErrorField}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    
    setShowPlayerIdDialog(true);
  };

  const handlePlayerIdSubmit = (dialogUserName: string, playerId: string) => {
    const formData = form.getValues();
    const submitData: InsertPrediction = {
      ...formData,
      userName: dialogUserName,
      playerId,
      matchResult: formData.matchResult!,
      totalGoals: formData.totalGoals!,
      firstGoalTeam: formData.firstGoalTeam!,
      firstGoalTime: formData.firstGoalTime!,
      halfTimeResult: formData.halfTimeResult!,
      totalCards: formData.totalCards!,
      varDecision: formData.varDecision!,
      totalCorners: formData.totalCorners!,
      redCard: formData.redCard!,
      topShooter: formData.topShooter!,
      firstYellowCard: formData.firstYellowCard!,
      firstGoalScorer: formData.firstGoalScorer!,
    };
    submitMutation.mutate(submitData);
  };

  const progressPercentage = (answeredCount / 12) * 100;
  const hasUserName = userName.trim() !== "";

  const handleStartGame = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <>
          {/* Top Navigation Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRulesDialog(true)}
                  data-testid="button-kurallar"
                >
                  Kurallar ve Katılım Şartları
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-superbahis-uye-ol"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">Superbahis'e Üye Ol</a>
                </Button>
              </div>
            </div>
          </div>

          {/* 1rem gap between top nav and banner */}
          <div className="fixed top-12 left-0 right-0 h-4 z-30 bg-background"></div>

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

          {/* Background behind banner and header */}
          <div className="fixed top-0 left-0 right-0 h-[280px] md:h-[320px] z-10 bg-background"></div>

          {/* Header with progress - positioned below banner with 1rem gap */}
          <div className="sticky top-[201px] md:top-[241px] z-40 bg-background border-b-2 border-accent">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">İlerleme</span>
                  <Badge className="bg-accent hover:bg-accent/90 text-sm">{answeredCount}/12</Badge>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-accent/20" data-testid="progress-bar" />
              </div>
            </div>
          </div>

          {/* Form content - adjusted for fixed banner and sticky header */}
          <div className="max-w-2xl mx-auto px-4 py-8 pt-[256px] md:pt-[296px]">
            {/* Title and Description Section */}
            <div className="mb-8 relative text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src={logoImage} 
                    alt="Superbahis Logo" 
                    className="max-w-[250px] h-auto"
                    data-testid="logo-image"
                  />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 uppercase">
                  DERBY ÖZEL <br />
                  TAHMİN YARIŞMASI
                </h1>
                <div className="space-y-3 text-sm md:text-base text-foreground">
                  <p>
                    Katılım şartı: Son 7 gün içinde minimum 1.000 TL yatırım yapmış kullanıcılar katılabilir.
                  </p>
                  <p>
                    Etkinliğe katılmak için Süperbahis üyesi olmanız gerekmektedir.
                  </p>
                  <p>
                    <a href="https://tinyurl.com/wrvu447a" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold" style={{ color: "#009DFF" }}>
                      Üye değilseniz buradan kayıt olabilirsiniz.
                    </a>
                  </p>
                  <div className="pt-2 space-y-1 text-muted-foreground text-xs md:text-sm">
                    <p className="font-semibold">Ödüller:</p>
                    <p>1.: 50.000 TL / 2.: 20.000 TL / 3.: 15.000 TL / 4.: 5.000 TL / 5.–10.: Kişi başı 1.000 TL / 11.–20.: Kişi başı 500 TL</p>
                  </div>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                {QUESTIONS.map((question) => (
                  <Card
                    key={question.id}
                    id={`question-${question.field}`}
                    className="border-card-border"
                    data-testid={`card-question-${question.id}`}
                  >
                    <CardHeader className="space-y-1 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-accent/20 text-accent border border-accent font-semibold text-xs">
                              {question.id}/12
                            </Badge>
                            {form.watch(question.field) && (
                              <CheckCircle2 className="w-4 h-4 text-accent" data-testid={`check-${question.field}`} />
                            )}
                          </div>
                          <CardTitle className="text-lg md:text-xl font-bold leading-tight">
                            {question.question}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name={question.field}
                        render={({ field }) => (
                          <FormItem>
                            {question.type === "select" ? (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value as string || ""}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid={`select-${question.field}`}>
                                    <SelectValue placeholder="Oyuncu seçin" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {question.options.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                      data-testid={`option-${question.field}-${option.value}`}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value as string || ""}
                                  className="grid gap-3"
                                >
                                  {question.options.map((option) => (
                                    <div key={option.value}>
                                      <RadioGroupItem
                                        value={option.value}
                                        id={`${question.field}-${option.value}`}
                                        className="peer sr-only"
                                        data-testid={`radio-${question.field}-${option.value}`}
                                      />
                                      <Label
                                        htmlFor={`${question.field}-${option.value}`}
                                        data-testid={`label-${question.field}-${option.value}`}
                                        className="flex items-center justify-center rounded-md border-2 border-muted bg-card px-4 py-3 hover-elevate active-elevate-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all min-h-12"
                                      >
                                        <span className="font-medium text-base">
                                          {option.label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}


                {/* Submit section */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Tahminleri Gönder
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tüm soruları cevapladınız mı? Tahminlerinizi göndermek için Oyuncu ID'nize ihtiyacımız var.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      onClick={handleFormSubmit}
                      className="w-full text-base font-semibold"
                      size="lg"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-predictions"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        "Tahminleri Gönder"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
      </>

      <PlayerIdDialog
        open={showPlayerIdDialog}
        onOpenChange={setShowPlayerIdDialog}
        onSubmit={handlePlayerIdSubmit}
        isSubmitting={submitMutation.isPending}
      />
      <RulesDialog 
        open={showRulesDialog}
        onOpenChange={setShowRulesDialog}
      />
      <SubmissionSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
}
