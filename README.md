# 3 Saniye

> Reflekslerini test et! Her turda bir mini görev, tamamlamak için 3 saniyen var.

Tarayıcıda çalışan, HTML5/CSS3/vanilla JavaScript ile geliştirilmiş hızlı ve bağımlılık yapıcı bir refleks oyunu.

## Canlı Demo

Yakında eklenecek

## Nasıl Oynanır?

1. **Başla** butonuna tıkla.
2. Ekranda beliren görevi oku.
3. Süre dolmadan doğru işlemi yap.
4. Her doğru cevap +1 puan kazandırır.
5. Her 10 puanda süre kısalır, oyun hızlanır.
6. Yanlış cevap veya süre dolması = oyun biter.

## Kontroller

| Platform | Kontrol |
|----------|---------|
| Masaüstü | Mouse ile tıklama |
| Mobil | Dokunmatik ekranda dokunma |
| Swipe görevleri | Parmağı veya fareyi sola kaydırma |

## Özellikler

- **10 farklı mini görev** — Renk eşleştirme, sayı karşılaştırma, kelime bulma, şekil yakalama, kaydırma ve daha fazlası
- **Artan zorluk** — Skor yükseldikçe süre azalır
- **Mobil uyumlu** — Dokunmatik ekran ve mouse desteği
- **En yüksek skor** — LocalStorage ile kalıcı olarak saklanır
- **Ses efektleri** — Web Audio API ile basit geri bildirim sesleri
- **Akıcı animasyonlar** — Doğru/yanlış geri bildirim, süre çubuğu, sarsılma efekti

## Kullanılan Teknolojiler

- HTML5
- CSS3 (Flexbox, Animasyonlar, Responsive Tasarım)
- Vanilla JavaScript (ES6+)
- Web Audio API
- LocalStorage API

## Kurulum ve Çalıştırma

Herhangi bir kurulum gerekmez.

```bash
git clone https://github.com/kullanici-adi/3-saniye.git
```

`index.html` dosyasını tarayıcında aç ve oynamaya başla.

## Dosya Yapısı

```
3-saniye/
├── index.html    # Ana HTML yapısı ve ekranlar
├── style.css     # Responsive tasarım, animasyonlar, tema
├── script.js     # Oyun mantığı, GameManager, mini görevler
├── README.md     # Proje dokümantasyonu
├── LICENSE       # MIT lisansı
└── .gitignore    # Git için yoksayılacak dosyalar
```

## Geliştirme Durumu

| Sprint | Açıklama | Durum |
|--------|----------|-------|
| Sprint 1 | Kod temizliği ve oyun akışı iyileştirmeleri | Tamamlandı |

## Geliştirme Notları

- Oyun tamamen istemci tarafında çalışır.
- Herhangi bir backend gerektirmez.
- En yüksek skor `localStorage` ile tarayıcıda saklanır.
- Harici bağımlılık yoktur, framework kullanılmamıştır.

## Gelecekte Eklenebilecek Özellikler

- [ ] Yeni mini görev türleri
- [ ] Global liderlik tablosu
- [ ] Karanlık/aydınlık tema seçeneği
- [ ] Özelleştirilebilir süre ayarları
- [ ] Başarım (achievement) sistemi
- [ ] PWA desteği (çevrimdışı oynanabilirlik)
- [ ] Çoklu dil desteği

## Ekran Görüntüleri

> Ekran görüntüleri buraya eklenecek.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
