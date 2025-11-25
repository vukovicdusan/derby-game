import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RulesDialog({ open, onOpenChange }: RulesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Kurallar ve Katılım Şartları</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h2 className="font-bold text-base mb-2">Toplam 100.000 TL Ödüllü Derby Özel Tahmin Yarışması!</h2>
            </div>

            <div>
              <h3 className="font-bold mb-2">Etkinlik Kuralları</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Etkinliğe katılmak için oyuncuların Süperbahis hesabına ait geçerli Oyuncu ID'sini forma doğru şekilde girmesi zorunludur. Yanlış veya başka bir kullanıcıya ait ID girilmesi durumunda katılım geçersiz sayılır.</li>
                <li>Katılım Şartı: Kullanıcının son 7 gün içinde minimum 1.000 TL yatırım yapmış olması gerekmektedir. Bu şartı sağlamayan kullanıcıların katılımları değerlendirmeye alınmaz.</li>
                <li>Her kullanıcı etkinliğe yalnızca 1 kez katılabilir. Birden fazla form gönderen kullanıcıların tüm formları geçersiz sayılır.</li>
                <li>Etkinlik saat 20:00'da sona erecektir.</li>
                <li>Etkinlik kapsamında sorulan 12 maç tahminini cevaplamanız gerekmektedir. Yanıtlar etkinlik süresi bittikten sonra değiştirilemez.</li>
                <li>Leaderboard (Sıralama Tablosu) etkinlik sona erdikten ertesi gün yayınlanacaktır.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Ödül Dağılımı (Toplam 100.000 TL):</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Liderboard Pozisyonu 1: 50.000 TL</li>
                <li>Liderboard Pozisyonu 2: 20.000 TL</li>
                <li>Liderboard Pozisyonu 3: 15.000 TL</li>
                <li>Liderboard Pozisyonu 4: 5.000 TL</li>
                <li>Liderboard Pozisyonu 5–10: Kişi başı 1.000 TL</li>
                <li>Liderboard Pozisyonu 11–20: Kişi başı 500 TL</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Ek Koşullar</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Ödüller, kazanan kullanıcıların Süperbahis hesaplarına etkinlik bitiminden 1 gün sonra yüklenecektir.</li>
                <li>ID'si geçersiz olan, yanlış bilgi veren veya yatırım şartını sağlayamayan kullanıcılar ödül hakkı kazanamaz.</li>
                <li>Bonus değil, ödül nakittir.</li>
                <li>Bonus engeli bulunan kullanıcılar kampanyadan yararlanamaz.</li>
                <li>Süperbahis, kampanyaya dair tüm haklarını saklı tutar; gerekli gördüğü durumlarda etkinliği değiştirme, durdurma veya sonlandırma hakkına sahiptir.</li>
                <li>Kampanyaya katılan tüm kullanıcılar bu koşulları okumuş ve kabul etmiş sayılır.</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
