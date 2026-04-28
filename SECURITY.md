# SECURITY.md

Bu rapor mevcut kodu duzeltmeden, ilk guvenlik incelemesi olarak hazirlanmistir. Proje tamamen istemci tarafinda calisan statik bir oyundur; backend, kullanici hesabi veya uzak veri kaynagi tespit edilmedi.

## Critical

Bu seviyede bulgu tespit edilmedi.

## High

Bu seviyede bulgu tespit edilmedi.

## Medium

### LocalStorage Verilerine Guvenilmesi

- Risk seviyesi: Medium
- Etkilenen alan: `script.js`, localStorage ayarlari ve high score
- Problem: Skor, dil ve ayar degerleri localStorage icinden okunuyor. Kullanici bu degerleri tarayici geliştirici araclariyla degistirebilir.
- Nasil kotuye kullanilabilir?: Oyuncu kendi cihazinda high score degerini degistirebilir veya beklenmeyen ayar degerleriyle oyun davranisini bozabilir.
- Onerilen cozum: Bu proje yerel oyun oldugu icin skor manipülasyonu kabul edilebilir. Yine de okunan degerleri beyaz liste ve sayisal sinirlarla dogrulamaya devam et.
- Oncelik: Orta

## Low

### Kontrollu `innerHTML` Kullanimlari Gelecekte Risk Olabilir

- Risk seviyesi: Low
- Etkilenen alan: `script.js`, swipe pad render alanlari
- Problem: Mevcut `innerHTML` kullanimi statik ve kod icindeki kontrollu metinlerden geliyor. Gelecekte dis kaynakli metin eklenirse XSS riski dogabilir.
- Nasil kotuye kullanilabilir?: Eger ceviri veya gorev metinleri harici kaynaktan alinirsa kotu niyetli HTML/JS enjekte edilebilir.
- Onerilen cozum: Yeni dinamik metinlerde `textContent` kullan. `innerHTML` sadece tamamen sabit markup icin kalsin.
- Oncelik: Dusuk

### Guvenlik Basliklari Kod Tarafinda Yonetilmiyor

- Risk seviyesi: Low
- Etkilenen alan: Hosting / yayin ortami
- Problem: Statik dosyada Content Security Policy, X-Content-Type-Options gibi basliklar tanimli degil; bunlar hosting katmaninda ayarlanir.
- Nasil kotuye kullanilabilir?: Proje webde yayinlanirsa, zayif hosting ayarlari tarayici guvenlik yuzeyini genisletebilir.
- Onerilen cozum: Yayina alma asamasinda hosting tarafinda temel CSP ve guvenlik basliklari tanimla.
- Oncelik: Dusuk

## Info

### Harici Dependency Olmamasi Tedarik Zinciri Riskini Azaltiyor

- Risk seviyesi: Info
- Etkilenen alan: Tum proje
- Problem: Harici kutuphane kullanilmamasi dependency kaynakli riskleri azaltir.
- Nasil kotuye kullanilabilir?: Bu bulgu pozitif bir nottur; dogrudan kotuye kullanim yok.
- Onerilen cozum: Yeni dependency ekleme ihtiyaci dogarsa once gerekliligi ve bakim durumunu incele.
- Oncelik: Bilgilendirme

### Ses Dosyasi Yerel Asset Olarak Kullaniliyor

- Risk seviyesi: Info
- Etkilenen alan: `assets/audio/Coin_Slot_Dreams.mp3`, `script.js`
- Problem: Müzik dosyasi yerel asset olarak bekleniyor. Dosya yoksa oyun hata vermeden devam etmeli.
- Nasil kotuye kullanilabilir?: Guvenlik acigi degil; eksik veya bozuk dosya sadece muzik davranisini etkiler.
- Onerilen cozum: Mevcut hata yutma davranisini koru ve oyun akisini audio hatasina baglama.
- Oncelik: Bilgilendirme
