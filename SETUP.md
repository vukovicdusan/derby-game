# Derby Tahmin Oyunu - Kurulum Rehberi

## 🎯 Genel Bakış
Bu uygulama, 12 Türk futbolu tahmin sorusuna sahip bir derbi tahmin oyunudur. Firestore veritabanı entegrasyonu, Oyuncu ID doğrulaması ve gerçek zamanlı lider tablosu içerir.

## 🔧 Firebase/Firestore Kurulumu

### Adım 1: Firestore API'yi Etkinleştirin (Zorunlu)

Uygulamanın çalışması için Firebase projenizde Firestore API'yi etkinleştirmelisiniz:

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Projenizi seçin (veya yeni bir proje oluşturun)
3. Sol menüden **"Build" > "Firestore Database"** seçeneğine tıklayın
4. **"Create database"** butonuna tıklayın
5. Güvenlik kuralları için **"Start in production mode"** seçin
6. Konum olarak en yakın bölgeyi seçin (örn: `europe-west3` Türkiye için)
7. **"Enable"** butonuna tıklayın

### Adım 2: Firebase Kimlik Bilgilerini Alın

1. Firebase Console'da projenizin **Settings** (Ayarlar) > **Service accounts** bölümüne gidin
2. **"Generate new private key"** butonuna tıklayın
3. İndirilen JSON dosyasını açın ve aşağıdaki bilgileri bulun:
   - `project_id`
   - `private_key`
   - `client_email`

### Adım 3: Replit Secrets'ı Ayarlayın

Replit'te sol panelden **Secrets** (Tools > Secrets) açın ve aşağıdaki değişkenleri ekleyin:

| Secret Adı | Değer |
|-----------|-------|
| `FIREBASE_PROJECT_ID` | JSON dosyanızdaki `project_id` değeri |
| `FIREBASE_PRIVATE_KEY` | JSON dosyanızdaki `private_key` değeri (tırnak işaretleri dahil) |
| `FIREBASE_CLIENT_EMAIL` | JSON dosyanızdaki `client_email` değeri |
| `SESSION_SECRET` | Rastgele bir string (örn: `my-super-secret-key-123`) |

**Önemli:** `FIREBASE_PRIVATE_KEY` değerini kopyalarken, başındaki ve sonundaki tırnak işaretlerini (`"`) ve `\n` karakterlerini aynen kopyalayın.

### Adım 4: Uygulamayı Yeniden Başlatın

1. Secrets'ları kaydettikten sonra uygulamayı yeniden başlatın
2. Konsolu kontrol ederek "✅ Firebase initialized successfully" mesajını görün
3. Artık uygulamanız Firestore ile çalışmaya hazır!

## 📊 Firestore Koleksiyonları

Uygulama otomatik olarak şu koleksiyonları oluşturur:

### `predictions` Koleksiyonu
Kullanıcıların tahminlerini saklar:
```javascript
{
  id: "uuid",
  userName: "Ahmet Yılmaz",
  playerId: "PLAYER123456",
  matchResult: "home",
  totalGoals: "2-3",
  // ... 12 tahmin sorusu
  submittedAt: Timestamp,
  createdAt: Timestamp
}
```

### `leaderboard` Koleksiyonu
Skor tablosunu saklar:
```javascript
{
  id: "uuid",
  userName: "Ahmet Yılmaz",
  playerId: "PLAYER123456",
  score: 80,
  totalCorrect: 8,
  submittedAt: Timestamp
}
```

### `matchResults` Koleksiyonu (Opsiyonel)
Gerçek maç sonuçlarını saklar (skor hesaplama için):
```javascript
{
  id: "current",
  matchResult: "home",
  totalGoals: "2-3",
  // ... gerçek sonuçlar
}
```

## 🎮 Kullanım

### Kullanıcı Akışı
1. **Hoş Geldiniz Ekranı**: İsim girin ve "Tahminlere Başla" butonuna tıklayın
2. **Tahmin Formu**: 12 soruyu cevaplayın (ilerleme otomatik kaydedilir)
3. **Oyuncu ID**: Tüm soruları cevapladıktan sonra Oyuncu ID'nizi girin
4. **Lider Tablosu**: Tahminleriniz gönderildikten sonra sıralamanızı görün

### Admin: Gerçek Sonuçları Ayarlama

Maç bittikten sonra skorları hesaplamak için Firestore'da `matchResults/current` dokümanını oluşturun:

1. Firebase Console > Firestore Database'e gidin
2. `matchResults` koleksiyonunu oluşturun
3. `current` ID'li bir doküman ekleyin
4. Gerçek sonuçları girin (prediction field'ları ile aynı formatı kullanın)

Örnek:
```javascript
{
  matchResult: "home",
  totalGoals: "2-3",
  firstGoalTeam: "teamA",
  firstGoalTime: "16-30",
  // ... tüm 12 alanı doldurun
}
```

Sonuçlar ayarlandığında, yeni tahminler otomatik olarak puanlanır (her doğru cevap 10 puan).

## 🛠 Geliştirme

### Proje Yapısı
```
├── client/src/
│   ├── components/
│   │   ├── welcome-screen.tsx       # İsim giriş ekranı
│   │   ├── prediction-form.tsx      # 12 tahmin sorusu
│   │   ├── player-id-dialog.tsx     # Oyuncu ID doğrulama
│   │   ├── leaderboard.tsx          # Sıralama tablosu
│   │   └── theme-toggle.tsx         # Açık/koyu mod
│   └── App.tsx                      # Ana uygulama
├── server/
│   ├── firebase.ts                  # Firebase Admin SDK
│   ├── storage.ts                   # Firestore işlemleri
│   └── routes.ts                    # API endpoint'leri
└── shared/
    └── schema.ts                    # Veri modelleri
```

### API Endpoint'leri
- `POST /api/predictions` - Tahmin gönder
- `GET /api/leaderboard` - Lider tablosunu getir
- `POST /api/players/validate` - Oyuncu ID doğrula (şu an her ID geçerli)

### Tema ve Tasarım
- Yeşil spor teması
- Açık/koyu mod desteği
- Mobil öncelikli responsive tasarım
- Inter fontu
- Türkçe dil desteği

## 🚀 Yayınlama

Uygulamanız hazır olduğunda, Replit'in "Publish" (Yayınla) özelliğini kullanarak canlıya alabilirsiniz. Publish etmeden önce:

1. Firestore API'nin etkinleştirildiğinden emin olun
2. Tüm Secrets'ların doğru ayarlandığından emin olun
3. Uygulamayı test edin (tahmin gönder, lider tablosunu görüntüle)
4. Güvenlik kurallarını production için güncelleyin (Firebase Console > Firestore > Rules)

## 📝 Notlar

- Her kullanıcı sadece kendi Oyuncu ID'si ile bir tahmin gönderebilir
- Tahminler localStorage'da otomatik kaydedilir (tarayıcı kapansa bile korunur)
- Lider tablosu otomatik olarak her 30 saniyede bir güncellenir
- Tema tercihi localStorage'da saklanır

## 🔒 Güvenlik

Production ortamında Firestore güvenlik kurallarını güncelleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Predictions: Sadece kendi tahminini görebilir
    match /predictions/{predictionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Leaderboard: Herkes okuyabilir
    match /leaderboard/{entryId} {
      allow read: if true;
      allow write: if false; // Sadece server tarafından yazılır
    }
    
    // Match results: Sadece admin okuyabilir/yazabilir
    match /matchResults/{resultId} {
      allow read: if true;
      allow write: if false; // Manuel olarak admin tarafından ayarlanır
    }
  }
}
```

## 🆘 Sorun Giderme

### "Cloud Firestore API has not been used" Hatası
**Çözüm:** Adım 1'i takip ederek Firestore API'yi etkinleştirin.

### "Firebase Admin SDK initialization failed" Hatası
**Çözüm:** Secrets'ları kontrol edin ve doğru değerleri girdiğinizden emin olun.

### Tahminler Kaydedilmiyor
**Çözüm:** 
1. Browser console'da hata mesajlarını kontrol edin
2. Server logs'ları kontrol edin
3. Firestore API'nin etkin olduğundan emin olun

### Skorlar Hesaplanmıyor
**Çözüm:** `matchResults/current` dokümanını oluşturup gerçek sonuçları girin.

---

**Başarılar dileriz! 🏆⚽**
