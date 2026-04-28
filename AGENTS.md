# AGENTS.md

## Proje Ozeti

3 Saniye, tarayicida calisan vanilla HTML/CSS/JavaScript tabanli bir refleks ve dikkat oyunudur. Oyuncu kisa mini gorevleri sinirli sure icinde tamamlar; skor, combo, seviye, dil, ses, muzik ve titresim ayarlari tarayici tarafinda yonetilir.

## Teknoloji Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API
- Web Audio API
- Vibration API
- Harici framework, npm, package.json veya build sistemi yok

## Onemli Dosya ve Klasorler

- `index.html`: Ekran yapilari ve temel UI isaretlemesi
- `style.css`: Responsive tasarim, animasyonlar, sekiller ve oyun UI stilleri
- `script.js`: Oyun dongusu, gorev sistemi, i18n, ayarlar, ses/muzik ve input mantigi
- `assets/audio/Coin_Slot_Dreams.mp3`: Arka plan muzigi
- `README.md`: Kullanici odakli proje dokumantasyonu
- `LICENSE`: MIT lisansi
- `.gitignore`: Yerel ve uretilmis dosya dislamalari

## Calistirma

Kurulum gerekmez.

```text
index.html dosyasini tarayicida ac
```

Alternatif olarak yerel statik sunucu kullanilabilir, ancak proje bunun icin ek arac gerektirmez.

## Test / Build / Lint

- Build komutu yok.
- Lint komutu yok.
- Otomatik test komutu yok.
- JavaScript soz dizimi kontrolu:

```bash
node --check script.js
```

## Kodlama Kurallari

- Framework, package manager veya build sistemi ekleme.
- Mevcut vanilla JavaScript yapisini koru.
- Buyuk refactor yerine kucuk ve izole degisiklikler yap.
- Gorev dogrulamalarinda gorunen metne bagimli mantik kurma; mumkunse id, code veya `data-correct` kullan.
- Yeni UI metinleri eklendiginde `tr` ve `en` cevirilerini birlikte ekle.
- Timer, swipe ve input lock akisini degistirirken eski listener ve timer temizligini dogrula.
- Ses efekti ve arka plan muzigi ayarlarini birbirinden ayri tut.
- Ucgen stilinde `clip-path` davranisini bozma.

## Yapilmamasi Gerekenler

- `package.json`, npm dependency veya framework ekleme.
- Oyun gorev sistemini bastan yazma.
- Calisan swipe gorevlerini, combo sistemini, i18n akisini veya localStorage anahtarlarini gereksiz degistirme.
- README disinda dokumantasyon guncellerken kullaniciya yonelik oyun davranisini degistirme.
- Gereksiz global degisken veya DOM overlay ekleme.

## Degisiklik Sonrasi Dogrulama

1. `node --check script.js` calistir.
2. `index.html` dosyasini tarayicida ac.
3. Ana menu, ayarlar, nasil oynanir, oyun ve oyun bitti ekranlarini kontrol et.
4. En az bir tiklama gorevi ve bir swipe gorevi dene.
5. Dil degisiminin aninda yansidigini ve sayfa yenilemede korundugunu kontrol et.
6. Ses, muzik ve titresim ayarlarinin birbirini bozmadigini kontrol et.
7. Mobil genislikte tasma veya tiklanamayan oge olmadigini kontrol et.

## AI Agent Calisma Kurallari

- Once ilgili dosyalari oku, sonra planla, sonra kucuk degisiklik yap.
- Emin olmadigin bilgiyi varsayim olarak isaretle.
- Her degisiklikten sonra nasil dogrulanacagini belirt.
- Mevcut kullanici degisikliklerini geri alma.
- Sadece istenen kapsamdaki dosyalara dokun.
