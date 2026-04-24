# 🎓 KampüsCÜ — Proje README

> Sivas Cumhuriyet Üniversitesi öğrencilerine yönelik kampüs içi iletişim ve etkileşim platformu.  
> İlan ver, etkinlik keşfet, duyuruları takip et.

---

## 📋 İçindekiler

1. [Proje Hakkında](#proje-hakkında)
2. [Teknoloji Stack'i](#teknoloji-stacki)
3. [Dosya Yapısı](#dosya-yapısı)
4. [Kurulum](#kurulum)
5. [CSS Sistemi — Ekip İçin Kritik](#css-sistemi--ekip-için-kritik)
6. [Sayfalar ve Sorumluluklar](#sayfalar-ve-sorumluluklar)
7. [Yeni Sayfaya Nasıl Başlanır](#yeni-sayfaya-nasıl-başlanır)
8. [Git Çalışma Kuralları](#git-çalışma-kuralları)
9. [Değerlendirme Kriterleri](#değerlendirme-kriterleri)

---

## Proje Hakkında

**Misyon:** Kampüs öğrencilerinin birbirleriyle ve üniversiteyle kolayca iletişim kurabilmesi.

**Hedef Kitle:** Sivas Cumhuriyet Üniversitesi öğrencileri.

**Temel Özellikler:**
- İlan bölümü: al-sat, ev arkadaşı, çalışma arkadaşı, kayıp-buluntu
- Etkinlikler: kulüp etkinlikleri, kampüs ve şehir etkinlikleri
- Duyurular: akademik, kampanya, indirim, genel
- Mekanlar: kampüs haritası ve mekan rehberi
- Kullanıcı profili: Öğrenci maili ile giriş, kendi ilanlarını yönetme

---

## Teknoloji Stack'i

| Katman | Teknoloji | Neden? |
|---|---|---|
| Yapı | HTML5 | Ders kapsamı |
| Stil | CSS3 (saf, framework yok) | Ders kapsamı |
| Mantık | Vanilla JavaScript | Ders kapsamı |

> **Not:** React, Tailwind, Bootstrap gibi kütüphaneler kullanılmıyor.  
> Tüm stil sistemi elle yazıldı — 
> Proje şu an tamamen frontend. `js/` klasöründeki dosyalar ileride backend eklenirse kullanılmak üzere yapıda yer alıyor, şimdilik dokunman gerekmiyor.

---

## Dosya Yapısı

```
kampus/
│
├── index.html              ← Ana sayfa (hazır)
├── ads.html                ← İlanlar sayfası
├── events.html             ← Etkinlikler sayfası
├── announcements.html      ← Duyurular sayfası
├── map.html                ← Mekanlar sayfası
├── about.html              ← Hakkımızda sayfası
├── profile.html            ← Kullanıcı profili
│
├── sablon.html             ← Yeni sayfa başlangıç şablonu (dokunma)
├── STILGUIDE.md            ← Bileşen kullanım rehberi (oku)
├── README.md               ← Bu dosya
│
├── css/
│   ├── variables.css       ← 🔴 DOKUNULMAZ — Tüm değişkenler
│   ├── base.css            ← 🔴 DOKUNULMAZ — Reset ve global stiller
│   ├── layout.css          ← 🔴 DOKUNULMAZ — Navbar, footer, grid
│   ├── components.css      ← 🟡 Sadece gerekli durumlarda ekleme veya değişiklik yapılabilir
│   ├── index.css           ← Ana sayfaya özel 
│   ├── ads.css             ← İlanlar sayfasına özel 
│   ├── events.css          ← Etkinlikler sayfasına özel
│   ├── announcements.css   ← Duyurular sayfasına özel
│   ├── map.css             ← Mekanlar sayfasına özel
│   ├── about.css           ← Hakkımızda sayfasına özel
│   └── profile.css         ← Profil sayfasına özel
│
├── js/
│   ├── firebase-config.js  ← İleride backend için (şimdilik dokunma)
│   ├── auth.js             ← İleride backend için (şimdilik dokunma)
│   ├── ui.js               ← İleride backend için (şimdilik dokunma)
│   ├── ilanlar.js          ← İleride backend için (şimdilik dokunma)
│   ├── etkinlikler.js      ← İleride backend için (şimdilik dokunma)
│   ├── duyurular.js        ← İleride backend için (şimdilik dokunma)
│   └── profil.js           ← İleride backend için (şimdilik dokunma)
│
└── assets/
    └── images/
```

---

## Kurulum

### 1. Repoyu klonla

```bash
git clone https://github.com/Caferix/KampusCU.git
cd KampusCU
```

### 2. Canlı önizleme için

Dosyaları doğrudan tarayıcıda açabilirsin.  
Daha iyi geliştirme deneyimi için VS Code'da **Live Server** eklentisini kur:

- VS Code → Extensions → "Live Server" → Install
- `index.html` üzerinde sağ tık → "Open with Live Server"

---

## CSS Sistemi — Sayfalar Arası Uyum İçin Kritik

Bu projenin en önemli kuralı: **Hiçbir yerde sabit renk, boyut veya boşluk değeri yazılmaz.**

### ❌ Yanlış
```css
color: #A93226;
margin-bottom: 16px;
font-size: 14px;
```

### ✅ Doğru
```css
color: var(--ana-renk);
margin-bottom: var(--space-md);
font-size: var(--text-sm);
```

---

### Hangi Dosyaya Ne Yazılır?

| Dosya | Ne İçerir | Kim Yazar |
|---|---|---|
| `variables.css` | Renkler, boşluklar, fontlar | 🔴 Kimse değiştirmez |
| `base.css` | Reset, h1-h3, a, img | 🔴 Kimse değiştirmez |
| `layout.css` | Navbar, footer, grid sistemi | 🔴 Kimse değiştirmez |
| `components.css` | Kart, buton, modal, toast... | 🟡 Gerekirse karar verilir |
| `[sayfa].css` | O sayfaya özel stiller | 🟢 O sayfanın sahibi yazar |

---

### Mevcut Değişkenler

**Renkler:**
```css
var(--ana-renk)         /* #A93226 — SCÜ kırmızısı */
var(--ana-renk-hover)   /* #8B1A10 — hover tonu */
var(--koyu-renk)        /* #2C3E50 — başlıklar, footer */
var(--metin-renk)       /* #333333 — gövde metni */
var(--metin-soluk)      /* #6B7280 — ikincil metin */
var(--arkaplan)         /* #F8F9FA — sayfa arka planı */
var(--kutu-arkaplan)    /* #FFFFFF — kart arka planı */
var(--kenarlik-renk)    /* #E1E8ED — çizgiler, input */
var(--basari)           /* #16A34A */
var(--hata)             /* #DC2626 */
var(--uyari)            /* #D97706 */
var(--bilgi)            /* #2563EB */
```

**Tipografi:**
```css
var(--text-xs)    /* 12px */
var(--text-sm)    /* 14px */
var(--text-base)  /* 16px */
var(--text-lg)    /* 18px */
var(--text-xl)    /* 22px */
var(--text-2xl)   /* 28px */
```

**Boşluklar:**
```css
var(--space-xs)   /* 4px */
var(--space-sm)   /* 8px */
var(--space-md)   /* 16px */
var(--space-lg)   /* 24px */
var(--space-xl)   /* 40px */
var(--space-2xl)  /* 64px */
```

---

### Hazır Bileşenler (`components.css`)

Bunları HTML'de kullanmak için sadece class ismini yaz, CSS yazmana gerek yok.

**Kart:**
```html
<div class="kart tiklanabilir">
    <div class="kart-resim-alani">
        <img src="..." alt="Açıklama">
    </div>
    <span class="etiket satis">Satılık</span>
    <h3 class="kart-baslik">Başlık</h3>
    <p class="kart-metin">Açıklama metni</p>
    <div class="kart-alt">
        <span class="fiyat-etiketi">250 ₺</span>
        <button class="buton kucuk">İncele</button>
    </div>
</div>
```

**Buton varyantları:**
```html
<button class="buton">Ana Buton</button>
<button class="buton ikincil">İkincil</button>
<button class="buton tehlike">Sil</button>
<button class="buton kucuk">Küçük</button>
<button class="buton tam">Tam Genişlik</button>
```

**Etiket renkleri:**
```html
<span class="etiket satis">Satılık</span>
<span class="etiket kiralik">Kiralık</span>
<span class="etiket ev-arkadas">Ev Arkadaşı</span>
<span class="etiket is-arkadas">Çalışma Arkadaşı</span>
<span class="etiket kayip">Kayıp</span>
<span class="etiket etkinlik">Etkinlik</span>
<span class="etiket duyuru">Duyuru</span>
<span class="etiket indirim">İndirim</span>
```

**Sekme filtresi:**
```html
<div class="sekme-grubu">
    <button class="sekme aktif">Tümü</button>
    <button class="sekme">Kategori 1</button>
    <button class="sekme">Kategori 2</button>
</div>
```

**Izgara sistemi:**
```html
<div class="izgara-3">...</div>   <!-- 3'lü kart grid -->
<div class="izgara-2">...</div>   <!-- 2'li grid -->
<div class="duzey-kenar">         <!-- İçerik + kenar çubuğu -->
    <main>...</main>
    <aside>...</aside>
</div>
```

**Boş durum ve yükleniyor:**
```html
<div class="yukleniyor"><div class="spinner"></div></div>

<div class="bos-durum">
    <div class="bos-durum-ikon">📭</div>
    <p>Henüz içerik yok.</p>
</div>
```

> Tüm bileşenler için: **`STILGUIDE.md`** dosyasına bak.

---

## Sayfalar ve Sorumluluklar

| Sayfa | Dosyalar | Sorumlu |
|---|---|---|
| Ana Sayfa | `index.html` + `css/index.css` | Kişi A |
| İlanlar | `ads.html` + `css/ads.css` | Kişi A |
| Etkinlikler | `events.html` + `css/events.css` | Kişi B |
| Duyurular | `announcements.html` + `css/announcements.css` | Kişi B |
| Mekanlar | `map.html` + `css/map.css` | Kişi C |
| Hakkımızda | `about.html` + `css/about.css` | Kişi C |
| Profil | `profile.html` + `css/profile.css` | Kişi A |

---

### Her Sayfada Olması Gerekenler

**İlanlar (`ads.html`):**
- Arama çubuğu (`.arama-kutusu`)
- Kategori sekmeleri (`.sekme-grubu`)
- İlan ızgarası (`.izgara-3` + `.kart`)
- "İlan Ver" butonu → modal açar (veriler statik / localStorage)
- İlan ekleme formu (modal içinde)
- Boş durum bileşeni

**Etkinlikler (`events.html`):**
- Yaklaşan / Geçmiş filtresi
- Etkinlik kartları (tarih, saat, konum, kulüp)
- Liste veya ızgara görünümü

**Duyurular (`announcements.html`):**
- Kategori filtresi: Genel / Akademik / İndirim / Kampanya
- Duyuru kartları (`.izgara-2`)
- Tıklanınca detay (modal veya accordion)

**Mekanlar (`map.html`):**
- Google Maps embed (`<iframe>` yeterli, JS gerekmez)
- Yan tarafta mekan listesi: kütüphane, kafeterya, fakülteler
- `.duzey-kenar` grid yapısını kullan

**Hakkımızda (`about.html`):**
- Projenin amacı ve misyonu
- Ekip tanıtımı: isim, rol, avatar (`.avatar`)
- İletişim bilgisi

**Profil (`profile.html`):**
- Kullanıcı bilgileri (avatar, isim)
- "Benim ilanlarım" listesi (statik örnek verilerle)
- İlan silme butonu (`.buton.tehlike`)

---

## Yeni Sayfaya Nasıl Başlanır

### Adım 1 — Şablonu kopyala
```bash
cp sablon.html ads.html
```

### Adım 2 — Başlıkları güncelle
```html
<title>İlanlar — KampüsCU</title>

<div class="sayfa-basligi">
    <h1>İlanlar</h1>
    <p>Kampüsteki tüm ilanları buradan takip edebilirsin.</p>
</div>
```

### Adım 3 — CSS bağlantısını ekle
```html
<!-- Sayfana özel CSS -->
<link rel="stylesheet" href="css/ads.css">
```

### Adım 4 — Aktif navbar linkini işaretle
```html
<li><a href="ads.html" class="aktif">İlanlar</a></li>
```

### Adım 5 — Sayfa CSS dosyasını oluştur
```bash
touch css/ads.css
```

İlk satırı şöyle yaz:
```css
/* ads.css — Sadece ilanlar sayfasına özel stiller */
/* components.css veya layout.css'de olan bir şeyi BURAYA YAZMA */
```

---

## Git Çalışma Kuralları

### Branch Yapısı

```
main          ← Sadece çalışan, test edilmiş kod
develop           ← Aktif geliştirme
feature/ads   ← İlanlar sayfası geliştirmesi
feature/events← Etkinlikler sayfası
```

### Çalışma Akışı

```bash
# 1. Her zaman dev'den başla
git checkout develop
git pull

# 2. Kendi branch'ini oluştur
git checkout -b feature/ads

# 3. Çalış, kaydet
git add .
git commit -m "feat: ilan listeleme ve filtreleme eklendi"

# 4. Develop'a merge et
git checkout dev
git merge feature/ads
git push
```

### Commit Mesajı Formatı

```
feat: yeni özellik eklendiğinde
fix: hata düzeltildiğinde
style: sadece görsel değişiklik
docs: dokümantasyon güncellemesi
```

### ⚠️ Dikkat

- Doğrudan `main`'e push **yapma**
- `css/variables.css`, `css/base.css`, `css/layout.css` dosyalarına dokunmadan önce **ekip liderine sor**
- `components.css`'e yeni bileşen eklemek istersen **önce ekip arkadaşlarınla konuş**, aksi halde çakışma olur

---

## Değerlendirme Kriterleri

Proje bu 6 kategoride değerlendiriliyor:

| Kategori | Ağırlık | Dikkat Edilecekler |
|---|---|---|
| Görsel Tasarım | %15 | Renk uyumu, tipografi, hiyerarşi |
| Kullanılabilirlik | %20 | 3 tıklama kuralı, menü netliği, form sadeliği |
| Kullanıcı Deneyimi | %20 | Hover efektleri, toast bildirimleri, akış |
| Performans | %15 | Sayfa hızı, lazy loading, temiz kod |
| Responsive & Erişilebilirlik | %15 | Mobil uyum, alt text, kontrast |
| İçerik & SEO | %15 | H1-H6 hiyerarşisi, meta etiketler, link metinleri |

### Her Sayfada Kontrol Listesi

Sayfanı tamamlamadan önce şunları kontrol et:

- [ ] `<title>` anlamlı dolduruldu mu? (`İlanlar — Kampüs`)
- [ ] `<meta name="description">` var mı?
- [ ] Tüm `<img>` etiketlerinde `alt` metni var mı?
- [ ] H1 sadece bir tane mi?
- [ ] Link metinleri anlamlı mı? ("Tıklayın" değil, "İlanı Gör")
- [ ] `<b>` yerine `<strong>`, `<i>` yerine `<em>` kullanıldı mı?
- [ ] Mobilde görünüm kontrol edildi mi? (tarayıcıda F12 → mobil görünüm)
- [ ] Sabit renk/boyut değeri kullanılmadı mı? (CSS değişkenleri)
- [ ] Navbar'da aktif sayfa işaretli mi? (`class="aktif"`)
- [ ] Yükleniyor ve boş durum bileşenleri eklendi mi?

---

NOT: Sayfa tasarım sürecinde ve tasarım sonunda Lighthouse skoru alınarak sayfa test edilmelidir. %90 üstü skor hedeflenmelidir.

## Sık Sorulan Sorular

**S: Sayfama özel bir bileşene ihtiyacım var, `components.css`'e ekleyebilir miyim?**  
C: Önce ekip liderine sor. Eğer sadece senin sayfanda kullanılacaksa `[sayfa].css`'ine ekle.

**S: Bir şeyin nasıl yapılacağını bilmiyorum, ne yapayım?**  
C: Önce `STILGUIDE.md`'ye bak. Orada yoksa `index.html`'e bak, orada mutlaka örneği vardır.

**S: İlan/etkinlik verileri nereden gelecek?**  
C: Şu an statik — HTML içine elle yazıyoruz. Sekme filtresi gibi etkileşimler basit JS ile yapılabilir. Veri yönetimi ileride eklenecek, şimdi tasarıma odaklan.

**S: Görseller nereye konulacak?**  
C: `assets/images/` klasörüne. Dosya adını küçük harf ve tire ile yaz: `kampus-giris.jpg`

---

*Bu README, proje geliştikçe güncellenir. Değişiklik yapmadan önce ekip liderine haber ver.*
