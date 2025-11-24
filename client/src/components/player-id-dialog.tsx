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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Oyuncu ID Gerekli</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2">
            Lütfen Süperbahis hesabınızda yer alan Oyuncu ID'nizi aşağıya girin.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-base font-medium">
                Ad
              </Label>
              <Input
                id="userName"
                data-testid="input-username-dialog"
                type="text"
                placeholder="Ad"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-base"
                required
                autoFocus
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                Lider tablosunda gösterilecek adınız
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerId" className="text-base font-medium">
                ID Numaranız
              </Label>
              <Input
                id="playerId"
                data-testid="input-player-id"
                type="number"
                placeholder="ID Numaranız"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="text-base"
                required
                disabled={isSubmitting}
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                ID sadece rakamlardan oluşmaktadır.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              asChild
              data-testid="button-superbahis-signup"
            >
              <a href="#">Süperbahis'e Üye Ol</a>
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={!userName.trim() || !playerId.trim() || isSubmitting}
              data-testid="button-confirm-player-id"
              className="bg-[#ff3752] hover:bg-[#ff3752]/90 border-0"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
