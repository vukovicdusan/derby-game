import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SubmissionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionSuccessDialog({ open, onOpenChange }: SubmissionSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col items-center text-center">
        <DialogHeader className="w-full">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <DialogTitle className="text-xl">Başarılı!</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4 w-full">
          <p className="text-base text-foreground mb-6">
            Katılımınız alınmıştır.<br />
            Teşekkür ederiz.
          </p>
          <Button
            type="button"
            asChild
            className="w-full bg-[#009DFF] hover:bg-[#0080CC]"
            data-testid="button-goto-superbahis"
          >
            <a 
              href="https://tinyurl.com/wrvu447a"
              target="_blank"
              rel="noopener noreferrer"
            >
              Süperbahis'e Git
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
