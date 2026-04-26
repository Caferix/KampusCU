# Kampüs — Stil Rehberi

Ekip üyeleri bu rehberi referans alarak çalışır.
Burada tanımlı olmayan bir şeye ihtiyaç duyarsan önce ekip liderine danış.

---

## Dosya Yapısı

```
css/
├── variables.css    ← DOKUNULMAZ
├── base.css         ← DOKUNULMAZ
├── layout.css       ← DOKUNULMAZ
├── components.css   ← Sadece ekip lideri ekler
├── ilanlar.css      ← Sayfana özel, sen yazarsın
├── etkinlikler.css  ← Sayfana özel, sen yazarsın
└── ...

js/
├── firebase-config.js
├── auth.js
├── ui.js
├── ilanlar.js
└── ...
```

**Kural:** Sabit renk, boyut veya boşluk değeri yazmak yasak.
`variables.css`'deki değişkenleri kullan.

---

## Renk Kullanımı

| Amaç | Değişken |
|---|---|
| Buton, link, vurgu | `var(--ana-renk)` |
| Buton hover | `var(--ana-renk-hover)` |
| Başlık metni | `var(--koyu-renk)` |
| Gövde metni | `var(--metin-renk)` |
| İkincil metin | `var(--metin-soluk)` |
| Sayfa arka planı | `var(--arkaplan)` |
| Kart arka planı | `var(--kutu-arkaplan)` |
| Çizgiler | `var(--kenarlik-renk)` |

---

## Boşluk Kullanımı

`margin`, `padding`, `gap` için her zaman scale'i kullan:

```css
/* DOĞRU */
margin-bottom: var(--space-md);
gap: var(--space-lg);

/* YANLIŞ */
margin-bottom: 16px;
gap: 24px;
```

| Değişken | Boyut | Ne zaman |
|---|---|---|
| `--space-xs` | 4px | İkon-yazı arası |
| `--space-sm` | 8px | Küçük iç boşluk |
| `--space-md` | 16px | Standart boşluk |
| `--space-lg` | 24px | Bölümler arası |
| `--space-xl` | 40px | Büyük bölüm arası |
| `--space-2xl` | 64px | Sayfa bölümleri |

---

## HTML Bileşen Standartları

### Kart
```html
<div class="kart tiklanabilir">
    <div class="kart-resim-alani">
        <img src="..." alt="...">
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

### Buton
```html
<button class="buton">Ana Buton</button>
<button class="buton ikincil">İkincil</button>
<button class="buton tehlike kucuk">Sil</button>
<button class="buton tam">Tam Genişlik</button>
```

### Form Alanı
```html
<div class="form-alani">
    <label for="baslik">Başlık</label>
    <input type="text" id="baslik" placeholder="Ürün adını gir">
</div>

<!-- Hata durumu -->
<div class="form-alani hata">
    <label for="email">E-posta</label>
    <input type="email" id="email">
    <span class="hata-mesaj">Geçerli bir e-posta gir</span>
</div>
```

### Etiket (Badge)
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

### Sekme
```html
<div class="sekme-grubu">
    <button class="sekme aktif">Tümü</button>
    <button class="sekme">Satılık</button>
    <button class="sekme">Kiralık</button>
</div>
```

### Modal
```html
<div class="modal-arkaplan" id="modalId">
    <div class="modal-kutu">
        <button class="modal-kapat" onclick="modalKapat('modalId')">✕</button>
        <h2>Modal Başlığı</h2>
        <!-- içerik -->
    </div>
</div>
```

### Boş Durum
```html
<div class="bos-durum">
    <div class="bos-durum-ikon">📭</div>
    <p>Henüz ilan bulunmuyor</p>
</div>
```

### Yükleniyor
```html
<div class="yukleniyor">
    <div class="spinner"></div>
</div>
```

---

## Izgara Seçimi

```html
<!-- İlanlar, etkinlikler — 3'lü kart -->
<div class="izgara-3"> ... </div>

<!-- Duyurular — 2'li -->
<div class="izgara-2"> ... </div>

<!-- İçerik + kenar çubuğu -->
<div class="duzey-kenar">
    <div>Ana içerik</div>
    <aside>Kenar çubuğu</aside>
</div>
```

---

## Yeni Sayfaya Başlarken

1. `sablon.html`'i kopyala, yeniden adlandır
2. `<title>` ve `sayfa-basligi`'nı güncelle
3. Sayfaya özel CSS linki ekle (`css/[sayfa].css`)
4. Sayfaya özel JS linki ekle (`js/[sayfa].js`)
5. Nav linklerinde aktif sayfana `class="aktif"` ekle