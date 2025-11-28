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
          <DialogTitle className="text-xl font-bold">Kurallar & Şartlar</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h2 className="font-bold text-base mb-2">Toplam 100.000 TL Ödüllü Derbi Özel Tahmin Yarışması!</h2>
            </div>

            <div>
              <h3 className="font-bold mb-2">Etkinlik Kuralları</h3>
              <div className="space-y-3">
                <p>Etkinliğe katılmak için Süperbahis üyesi olmanız ve son 7 gün içinde minimum 1.000 TL yatırım yapmış olmanız gerekmektedir. Bu şartı sağlamayan kullanıcıların katılımları değerlendirmeye alınmaz. Aşağıdaki yöntemleri kullanarak yatırımlarınızı sorunsuz ve hızlı şekilde gerçekleştirebilirsiniz:</p>
                
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Kredi Kartı: Minimum yatırım 250 TL</li>
                  <li>QR Kod: Minimum yatırım 1.000 TL</li>
                  <li>Kripto: Limitsiz, hızlı ve güvenli yatırım imkanı</li>
                </ul>

                <p>Etkinliğe katılmak için oyuncuların Süperbahis hesabına ait geçerli Kullanıcı Numarasını forma doğru şekilde girmesi zorunludur. Yanlış veya başka bir kullanıcıya ait kullanıcı numarası girilmesi durumunda katılım geçersiz sayılır.</p>

                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="font-semibold mb-2">Kullanıcı numaranızı nasıl bulabilirsiniz? (Sadece numaralardan oluşur)</p>
                  <p className="mb-1"><strong>Masaüstü (Desktop):</strong> Ana sayfada sağ üst köşedeki kullanıcı avatar ikonuna tıklayın. Açılan sayfanın sol üst kısmında, sadece rakamlardan oluşan kullanıcı numaranızı görebilirsiniz.</p>
                  <p><strong>Mobil (Telefon):</strong> Ana sayfadan Hesabım menüsüne girin. Hesap Özetim bölümünün altında kullanıcı numaranızı görebilirsiniz.</p>
                </div>

                <ul className="space-y-2 list-disc list-inside">
                  <li>Her kullanıcı etkinliğe yalnızca 1 kez katılabilir. Birden fazla form gönderen kullanıcıların tüm formları geçersiz sayılır.</li>
                  <li>Etkinlik 1 Aralık günü saat 20:00'da sona erecektir.</li>
                  <li>Etkinlik kapsamında sorulan 12 maç tahminini cevaplamanız gerekmektedir. Yanıtlar etkinlik süresi bittikten sonra değiştirilemez.</li>
                  <li>Leaderboard (Sıralama Tablosu) etkinlik sona erdikten ertesi gün yayınlanacaktır.</li>
                </ul>
              </div>
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
              <ul className="space-y-2 list-disc list-inside">
                <li>Ödüller, kazanan kullanıcıların Süperbahis hesaplarına etkinlik bitiminden 1 gün sonra yüklenecektir.</li>
                <li>ID'si geçersiz olan, yanlış bilgi veren veya yatırım şartını sağlayamayan kullanıcılar ödül hakkı kazanamaz.</li>
                <li>Bonus değil, ödül nakittir.</li>
                <li>Bonus engeli bulunan kullanıcılar kampanyadan yararlanamaz.</li>
                <li>Süperbahis, kampanyaya dair tüm haklarını saklı tutar; gerekli gördüğü durumlarda etkinliği değiştirme, durdurma veya sonlandırma hakkına sahiptir.</li>
                <li>Kampanyaya katılan tüm kullanıcılar bu koşulları okumuş ve kabul etmiş sayılır.</li>
                <li>Fenerbahçe - Galatasaray maçının istatistikleri OPTA verilerine göre belirlenecektir.</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
