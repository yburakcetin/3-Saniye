# OPTIMIZATION.md

Bu rapor mevcut kodu degistirmeden performans, okunabilirlik ve bakim kolayligi acisindan ilk inceleme notlaridir.

## Bulgular

### `script.js` Cok Fazla Sorumluluk Tasiyor

- Problem: Oyun dongusu, gorevler, i18n, ses, muzik, ayarlar ve DOM baglantilari ayni dosyada.
- Etki: Yeni gorev veya ayar eklerken yan etki riski artar.
- Onerilen cozum: Buyuk refactor yapmadan, ileride sadece dogal sinirlar olustugunda kucuk bolumlere ayirma plani yap.
- Risk: Orta; acele bolme mevcut calisan oyunu bozabilir.
- Uygulama onceligi: Orta

### Swipe Mantiginda Tekrar Eden Kod Var

- Problem: Eski sola swipe gorevi ve dogru yone swipe gorevi benzer listener/cleanup mantigi kullaniyor.
- Etki: Bir swipe bug fix'i iki yerde uygulanmazsa davranis farklilasabilir.
- Onerilen cozum: Kucuk bir yardimci fonksiyonla ortak swipe lifecycle'i paylastirmayi degerlendir.
- Risk: Orta; swipe gorevleri hassas oldugu icin manuel mobil test gerekir.
- Uygulama onceligi: Orta

### Gorev Verileri ve Render Mantigi Ayni Listede Buyuyor

- Problem: Gorev sayisi arttikca `tasks` listesi daha zor taranabilir hale geliyor.
- Etki: Yeni gorev ekleme ve hata ayiklama yavaslar.
- Onerilen cozum: Buyuk refactor yapmadan gorevleri yorum bloklariyla gruplamak veya ileride veri/render ayrimini planlamak.
- Risk: Dusuk
- Uygulama onceligi: Dusuk

### Timer `setTimeout` ile Calisiyor

- Problem: Timer periyodik `setTimeout` ile guncelleniyor.
- Etki: Kisa sureli oyunda yeterli; ancak arka plan sekmesi veya dusuk performansli cihazlarda zaman hassasiyeti degisebilir.
- Onerilen cozum: Mevcut `performance.now()` tabanli hesaplama korunmali. Gerekirse gorsel akicilik icin `requestAnimationFrame` degerlendirilebilir.
- Risk: Dusuk
- Uygulama onceligi: Dusuk

### Manuel Testler Dokumante Edilmeli

- Problem: Otomatik test altyapisi yok.
- Etki: Swipe, i18n, combo ve localStorage gibi alanlarda regresyonlar manuel yakalaniyor.
- Onerilen cozum: DEBUGGING ve PROGRESS checklist'leriyle manuel testleri standartlastir; kritik akislari her degisiklikten sonra calistir.
- Risk: Dusuk
- Uygulama onceligi: Yuksek

### Uzun Metinlerde Responsive Kontrol Gerekli

- Problem: Iki dilde gorev basliklari ve buton metinleri farkli uzunlukta.
- Etki: Kucuk ekranlarda tasma veya okunabilirlik sorunu olusabilir.
- Onerilen cozum: Yeni metin eklenince mobil genislikte ekranlari kontrol et.
- Risk: Dusuk
- Uygulama onceligi: Orta
