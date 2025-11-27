import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck } from "lucide-react";

interface PlayerIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userName: string, playerId: string) => void;
  isSubmitting: boolean;
}

export function PlayerIdDialog({ open, onOpenChange, onSubmit, isSubmitting }: PlayerIdDialogProps) {
  const [userName, setUserName] = useState("");
  const [playerId, setPlayerId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && playerId.trim()) {
      onSubmit(userName.trim(), playerId.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl text-left">Oyuncu ID Gerekli</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2 text-left">
            Lütfen Süperbahis hesabınızdaki Oyuncu ID'nizi aşağıya girin.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-base font-medium">
                Liderboard Görünen İsminiz (Nickname)
              </Label>
              <Input
                id="userName"
                data-testid="input-username-dialog"
                type="text"
                placeholder="Lider tablosunda bu isim görünecektir."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-base"
                required
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerId" className="text-base font-medium">
                Süperbahis Oyuncu ID'niz
              </Label>
              <Input
                id="playerId"
                data-testid="input-player-id"
                type="number"
                placeholder="Örn: 1283746"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="text-base"
                required
                disabled={isSubmitting}
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                ID sadece rakamlardan oluşur. Hesabınıza giriş yaptıktan sonra Profil &gt; Hesap Bilgileri bölümünde bulabilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-start gap-4 pt-4">
            <Button
              type="submit"
              disabled={!userName.trim() || !playerId.trim() || isSubmitting}
              data-testid="button-confirm-player-id"
              className="bg-[#009DFF] hover:bg-[#0080CC] w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Etkinliğe Katıl"
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-left">
              Süperbahis hesabınız yoksa{" "}
              <a 
                href="https://tinyurl.com/wrvu447a" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold" 
                style={{ color: "#009DFF" }}
              >
                buradan üye olabilirsiniz.
              </a>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
