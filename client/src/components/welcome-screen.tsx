import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Info } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Derby Tahmin Oyunu
          </h1>
          <p className="text-lg text-muted-foreground">
            12 soruyla maç sonucunu tahmin edin
          </p>
        </div>

        <Card className="border-card-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">Hoş Geldiniz!</CardTitle>
            <CardDescription className="text-base">
              Tahminlerinizi yapmak için adınızı girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-base font-medium">
                  Adınız
                </Label>
                <Input
                  id="userName"
                  data-testid="input-username"
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base"
                  required
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                data-testid="button-start-game"
                className="w-full text-base font-semibold"
                size="lg"
                disabled={!name.trim()}
              >
                Tahminlere Başla
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Info className="flex-shrink-0 w-5 h-5 text-primary mt-0.5" />
                <p className="leading-relaxed">
                  Tüm soruları cevapladıktan sonra tahminlerinizi göndermek için <strong className="text-foreground">Oyuncu ID'niz</strong> gerekecektir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Tüm tahminler Firestore veritabanında güvenle saklanır
        </p>
      </div>
    </div>
  );
}
