# PROGRESS.md

## Faz 0: Mevcut Durum Tespiti

- [x] Proje vanilla HTML/CSS/JavaScript yapisinda incelendi.
- [x] Ana oyun dosyalari belirlendi: `index.html`, `style.css`, `script.js`.
- [x] Harici dependency veya build sistemi olmadigi tespit edildi.
- [x] Arka plan muzik dosyasi yolu belirlendi: `assets/audio/Coin_Slot_Dreams.mp3`.
- [x] Temel dogrulama komutu belirlendi: `node --check script.js`.

## Faz 1: MVP ve Temel Islevler

- [x] Ana menu, oyun, ayarlar, nasil oynanir ve oyun bitti ekranlari mevcut.
- [x] Mini gorev sistemi mevcut.
- [x] Skor, en yuksek skor ve zamanlayici mevcut.
- [x] Mouse/tap input sistemi mevcut.
- [x] Swipe input sistemi mevcut.
- [ ] Her gorev icin kisa manuel test senaryosu yaz.
- [ ] Kritik oyun akisi icin manuel test checklist'ini README veya DEBUGGING dosyasina bagla.

## Faz 2: Oyun Deneyimi Iyilestirme

- [x] Combo sistemi mevcut.
- [x] Bonus puan sistemi mevcut.
- [x] Seviye gostergesi mevcut.
- [x] Motivasyon mesajlari mevcut.
- [x] Arka plan muzigi ve muzik ayari mevcut.
- [ ] Oyun bitti ekranindaki istatistiklerin farkli skor seviyelerinde dogrulamasini yap.
- [ ] Mobil ekranlarda uzun metin ve buyuk skor degerlerini kontrol et.

## Faz 3: Dil ve Icerik Kalitesi

- [x] Turkce ve Ingilizce i18n destegi mevcut.
- [x] Dil secimi localStorage ile saklaniyor.
- [x] Ilk giriste tarayici diline gore varsayilan dil secimi mevcut.
- [ ] Tum gorev basliklarini TR/EN dilinde tek tek manuel kontrol et.
- [ ] Renk, sekil ve yon isimlerini metinden bagimsiz degerlerle dogrula.

## Faz 4: Guvenlik

- [x] Ilk guvenlik raporu olusturuldu.
- [ ] `innerHTML` kullanimlarini kontrollu kaynaklarla sinirli tutmaya devam et.
- [ ] LocalStorage degerleri icin bozuk veri senaryolarini test et.
- [ ] Yayina alinacaksa temel HTTP guvenlik basliklari icin hosting notu ekle.

## Faz 5: Optimizasyon ve Bakim

- [x] Ilk optimizasyon raporu olusturuldu.
- [ ] Swipe mantigindaki tekrar eden kodu kucuk ve risksiz bir yardimciya tasimayi degerlendir.
- [ ] Gorev listesi buyumeye devam ederse gorev verilerini daha okunabilir bloklara ayir.
- [ ] Manuel testleri daha tekrar edilebilir hale getirmek icin debug yardimcilari planla.

## Faz 6: Degisiklik Yonetimi

- [ ] Her sprint veya bug fix icin once kisa plan yaz.
- [ ] Degisikligi tek amacli ve kucuk commit/parca olarak tut.
- [ ] Degisiklik sonrasi dogrulama komutlarini calistir.
- [ ] Kullaniciya hangi dosyalarin degistigini ve neyin test edildigini bildir.
