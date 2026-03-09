## Kurulum ve Çalıştırma

Node.js (v18+) kurulu olması gerekiyor.

Terminalde sırayla:

npm install
npm run dev

Tarayıcıda http://localhost:5173 adresini aç.
Açılan ekranda CSV dosyasını yükle.

## Teknik Tercihler

**Vite + React**
Hızlı geliştirme ortamı, sıfır konfigürasyon ile çalışıyor.

**Tailwind CSS**
Utility-first yaklaşımı ile tutarlı ve hızlı stil yazımı sağladı.

**PapaParse**
CSV parse için stabil ve yaygın kütüphane. Hatalı satırları uyarı vererek atlıyor.

**Recharts**
React ile uyumlu, hafif grafik kütüphanesi. Responsive container desteği var.

**Dosya organizasyonu**
components / hooks / utils / constants / locales olarak ayrıldı.
Her dosya tek bir sorumluluğa sahip.

**Performans**
InsightCard memo ile sarmalandı. Filtre değişimlerinde sadece gereken kartlar yeniden render ediliyor.

## Zaman Kısıtlamasından Dolayı Eksik Kalanlar

- TypeScript desteği
- Çoklu survey karşılaştırma modu
- Dışa aktarma (PDF / Excel export)
- Unit testler
- Mobil uyumluluk

