# DEBUGGING.md

## Standart Hata Ayiklama Sureci

1. Hatayi tekrar uret.
2. Beklenen sonuc ve gercek sonucu ayri yaz.
3. Tarayici Console sekmesindeki hatalari kaydet.
4. Degisiklik JavaScript ile ilgiliyse `node --check script.js` calistir.
5. LocalStorage degerlerini kontrol et.
6. Hata input ile ilgiliyse mouse, tap ve swipe yollarini ayri ayri dene.
7. Hata dil ile ilgiliyse `tr` ve `en` dillerinde ayni akisi test et.
8. Hata ses/muzik ile ilgiliyse kullanici etkilesimi sonrasi test et; autoplay kisitlarini hesaba kat.

## Log Toplama

### Console

- Tarayicida Developer Tools ac.
- Console sekmesindeki hata ve uyari mesajlarini kopyala.
- Hatanin oldugu ekran ve gorev adini not et.

### Terminal

```bash
node --check script.js
```

Bu komut sadece soz dizimi hatalarini yakalar; oyun davranisi icin tarayici testi gerekir.

### Network

- Proje `file://` ile aciliyorsa Network loglari sinirli olabilir.
- Audio sorunu varsa `assets/audio/Coin_Slot_Dreams.mp3` dosyasinin yuklenip yuklenmedigini kontrol et.
- Yerel statik sunucu kullaniliyorsa 404 durumlarini Network sekmesinden kontrol et.

### LocalStorage

Kontrol edilecek anahtarlar:

- `threeSecondsHighScore`
- `threeSecondsSoundEnabled`
- `threeSecondsMusicEnabled`
- `threeSecondsVibrationEnabled`
- `threeSecondsLanguage`

## Hata Bildirimi Prompt Sablonu

```text
Sorun:

Beklenen sonuc:

Gercek sonuc:

Tekrar uretme adimlari:
1.
2.
3.

Dil:
Tarayici:
Cihaz / ekran boyutu:
Console hatalari:
LocalStorage ilgili degerleri:
Son degistirilen dosyalar:
```

## Beklenen / Gercek / Adim Formati

```text
Beklenen:
Oyuncu sola swipe yapinca gorev dogru sayilir ve skor artar.

Gercek:
Swipe algilanmiyor ve sure bitince oyun bitiyor.

Tekrar uretme:
1. Oyunu baslat.
2. Swipe gorevi gelene kadar oyna.
3. Oyun alaninda sola kaydir.
```

## Projeye Ozel Sik Hata Turleri

- Swipe listener temizlenmedigi icin eski gorev inputunun yeni gorevi etkilemesi.
- `inputLocked` dogru zamanda acilip kapanmadigi icin ayni cevap iki kez islenmesi.
- Timer temizlenmedigi icin sure bitimiyle yeni gorevin cakismasi.
- Dil degisiminden sonra gorev metni veya renk/sekil isimlerinin eski dilde kalmasi.
- Yanlis yazilmis kelime gorevinde dil havuzunun karismasi.
- Ucgen sekil stilinde parent arka planinin sekil parcasi gibi gorunmesi.
- Audio autoplay kisitlari nedeniyle muzik veya sesin ilk tiklamadan once baslamamasi.
- LocalStorage'da beklenmeyen deger kaldigi icin ayarlarin farkli acilmasi.

## Degisiklik Sonrasi Minimum Manuel Test

1. Ana menuden oyunu baslat.
2. Bir tiklama gorevinde dogru ve yanlis secimi test et.
3. Bir swipe gorevinde dogru ve yanlis yonu test et.
4. Ayarlardan dil degistir ve menu/gorev metinlerini kontrol et.
5. Ses, muzik ve titresim ayarlarini ac/kapat.
6. Oyun bitti ekraninda skor, rekor, max combo ve seviye degerlerini kontrol et.
