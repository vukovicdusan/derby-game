import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DuplicateSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DuplicateSubmissionDialog({ open, onOpenChange }: DuplicateSubmissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl text-left">Zaten Katıldınız</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2 text-left">
            "DERBİ ÖZEL TAHMİN YARIŞMASI" için cevaplarınızı zaten gönderdiniz.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-base text-foreground">
            Katıldığınız için teşekkür ederiz.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-close-duplicate-dialog"
          >
            Tamam
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
