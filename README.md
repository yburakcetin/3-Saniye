# 3 Saniye

Reflekslerini test et! Her turda sana bir mini görev verilir ve tamamlamak için **3 saniyen** vardır. Doğru yaparsan +1 puan kazanır. Hata yaparsan veya süre dolarsa oyun biter.

## Nasıl Oynanır?

1. **Başla** butonuna tıkla.
2. Ekranda beliren mini görevi oku.
3. Görevi süren dolmadan tamamla.
4. Her doğru cevap +1 puan kazandırır.
5. Her 10 puanda süre kısalır, oyun hızlanır.
6. Yanlış cevap veya süre dolması = oyun biter.

## Özellikler

- **10 farklı mini görev:** Renk eşleştirme, sayı karşılaştırma, kelime bulma, şekil yakalama, kaydırma ve daha fazlası
- **Artan zorluk:** Skor yükseldikçe süre azalır
- **Mobil uyumlu:** Dokunmatik ekran ve mouse desteği
- **En yüksek skor:** LocalStorage ile kalıcı olarak saklanır
- **Ses efektleri:** Web Audio API ile basit geri bildirim sesleri
- **Akıcı animasyonlar:** Doğru/yanlış geri bildirim, süre çubuğu, sarsılma efekti

## Kullanılan Teknolojiler

- HTML5
- CSS3 (Flexbox, Animasyonlar, Responsive Tasarım)
- Vanilla JavaScript (ES6+)
- Web Audio API
- LocalStorage API

## Kurulum ve Çalıştırma

Herhangi bir kurulum gerekmez.

1. Depoyu klonla veya ZIP olarak indir:
   ```bash
   git clone https://github.com/kullanici-adi/3-saniye.git
   ```
2. `index.html` dosyasını tarayıcında aç.
3. Oynamaya başla!

> **Not:** Oyun tamamen istemci tarafında çalışır, sunucu gerektirmez.

## Dosya Yapısı

```
3-saniye/
├── index.html    # Ana HTML yapısı ve ekranlar
├── style.css     # Responsive tasarım, animasyonlar, tema
├── script.js     # Oyun mantığı, GameManager, mini görevler
├── README.md     # Proje dokümantasyonu
└── .gitignore    # Git için yoksayılacak dosyalar
```

## Gelecekte Eklenebilecek Özellikler

- [ ] Yeni mini görev türleri
- [ ] Skor tablosu (global liderlik tablosu)
- [ ] Karanlık/aydınlık tema seçeneği
- [ ] Özelleştirilebilir süre ayarları
- [ ] Başarımlar (achievement) sistemi
- [ ] Daha fazla ses efekti ve müzik
- [ ] PWA desteği (çevrimdışı oynanabilirlik)
- [ ] Çoklu dil desteği

## Ekran Görüntüleri

> Ekran görüntüleri buraya eklenecek.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
