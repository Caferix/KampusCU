/* Seed ilanlar + anasayfa listesi */
(function () {
    const LOCAL_STORAGE_KEY = "kampuscu_kullanici_ilanlari";

    const kategoriAdlari = {
        satis: "Satılık",
        kiralik: "Kiralık",
        "ev-arkadas": "Ev Arkadaşı",
        "is-arkadas": "Çalışma Arkadaşı",
        kayip: "Kayıp",
    };

    const seedIlanlar = [
        {
            id: "seed-1",
            baslik: "Algoritma ve Veri Yapıları Kitabı",
            kategori: "satis",
            fiyat: "250 ₺",
            konum: "Mühendislik Fakültesi",
            tarih: "Bugün eklendi",
            aciklama: "Bilgisayar mühendisliği derslerinde kullanılabilecek temiz durumda kaynak kitap.",
        },
        {
            id: "seed-2",
            baslik: "Kampüse Yakın Kiralık Oda",
            kategori: "kiralik",
            fiyat: "3.500 ₺ / ay",
            konum: "Kampüs çevresi",
            tarih: "Bugün eklendi",
            aciklama: "Kampüse yürüme mesafesinde, öğrenciler için uygun, eşyalı kiralık oda.",
        },
        {
            id: "seed-3",
            baslik: "Kampüse Yakın Eve Arkadaş",
            kategori: "ev-arkadas",
            fiyat: "4.000 ₺ / ay",
            konum: "Kampüs çevresi",
            tarih: "1 gün önce eklendi",
            aciklama: "Üniversiteye ulaşımı kolay, düzenli ve sakin bir ev için ev arkadaşı aranmaktadır.",
        },
        {
            id: "seed-4",
            baslik: "Siyah Sırt Çantası Kayboldu",
            kategori: "kayip",
            fiyat: "Ödül var",
            konum: "Merkezi Yemekhane",
            tarih: "2 gün önce eklendi",
            aciklama: "Merkezi yemekhane yakınında siyah renkli sırt çantası kaybolmuştur.",
        },
        {
            id: "seed-5",
            baslik: "Algoritma Çalışma Grubu",
            kategori: "is-arkadas",
            fiyat: "Ücretsiz",
            konum: "Merkez Kütüphane",
            tarih: "3 gün önce eklendi",
            aciklama: "Vize öncesi algoritma analizi çalışmak için çalışma arkadaşı aranmaktadır.",
        },
        {
            id: "seed-6",
            baslik: "Kablosuz Mouse",
            kategori: "satis",
            fiyat: "180 ₺",
            konum: "Merkez Kampüs",
            tarih: "4 gün önce eklendi",
            aciklama: "Az kullanılmış, ders ve günlük kullanım için uygun kablosuz mouse satılıktır.",
        },
        {
            id: "seed-7",
            baslik: "Lacivert Mont Bulundu",
            kategori: "kayip",
            kategoriAdi: "Buluntu",
            fiyat: "Buluntu",
            konum: "Fen Fakültesi",
            tarih: "5 gün önce eklendi",
            aciklama: "Fen Fakültesi girişinde unutulan lacivert mont sahibine teslim edilmek üzere bekletilmektedir.",
        },
    ];

    function guvenliMetin(metin) {
        return String(metin)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function ilanGorselMetniOlustur(baslik, kategori) {
        const kucukBaslik = String(baslik || "").toLocaleLowerCase("tr-TR");

        if (kucukBaslik.includes("masa")) return "Masa";
        if (kucukBaslik.includes("kitap")) return "Kitap";
        if (kucukBaslik.includes("mouse")) return "Mouse";
        if (kucukBaslik.includes("oda")) return "Oda";
        if (kucukBaslik.includes("ev")) return "Ev";
        if (kucukBaslik.includes("çanta") || kucukBaslik.includes("canta")) return "Çanta";
        if (kucukBaslik.includes("mont")) return "Mont";
        if (kucukBaslik.includes("not")) return "Not";

        return kategoriAdlari[kategori] || "İlan";
    }

    function kayitliIlanlariGetir() {
        try {
            const veriler = localStorage.getItem(LOCAL_STORAGE_KEY);
            return veriler ? JSON.parse(veriler) : [];
        } catch {
            return [];
        }
    }

    function createHomeIlanKarti(ilan) {
        const kategori = ilan.kategori;
        const kategoriAdi = ilan.kategoriAdi || kategoriAdlari[kategori] || "İlan";
        const gorselMetni = ilanGorselMetniOlustur(ilan.baslik, kategori);

        const kart = document.createElement("div");
        kart.className = "kart tiklanabilir home-ilan-kart";
        kart.dataset.kategori = kategori;

        kart.innerHTML = `
            <div class="kart-resim-alani" aria-hidden="true">${guvenliMetin(gorselMetni)}</div>
            <span class="etiket ${guvenliMetin(kategori)}">${guvenliMetin(kategoriAdi)}</span>
            <h3 class="kart-baslik">${guvenliMetin(ilan.baslik)}</h3>
            <p class="kart-metin">${guvenliMetin(ilan.aciklama)}</p>
            <div class="kart-alt">
                <span class="fiyat-etiketi">${guvenliMetin(ilan.fiyat)}</span>
                <div class="kart-kullanici">
                    <span class="kart-kullanici-zaman">${guvenliMetin(ilan.tarih || "")}</span>
                </div>
            </div>
        `;

        kart.addEventListener("click", function () {
            const kategoriParam = encodeURIComponent(kategori);
            window.location.href = `pages/ads.html?kategori=${kategoriParam}`;
        });

        return kart;
    }

    function renderHomeSonIlanlar() {
        const container = document.getElementById("ilanListesi");
        if (!container) return;

        const yukleniyor = document.getElementById("ilanYukleniyor");
        const bosDurum = document.getElementById("ilanBosDurum");

        if (yukleniyor) yukleniyor.style.display = "flex";
        container.innerHTML = "";

        const kayitli = kayitliIlanlariGetir();
        const tumIlanlar = [...kayitli, ...seedIlanlar];
        const gosterilecek = tumIlanlar.slice(0, 4);

        gosterilecek.forEach((ilan) => {
            container.appendChild(createHomeIlanKarti(ilan));
        });

        if (yukleniyor) yukleniyor.style.display = "none";

        // Kategori sekmeleri
        const sekmeler = document.querySelectorAll("#ilanSekmeler .sekme");
        function uygulaFiltre() {
            const aktif = document.querySelector("#ilanSekmeler .sekme.aktif");
            const kategori = aktif ? aktif.dataset.kategori : "hepsi";

            let gorunen = 0;
            container.querySelectorAll(".kart").forEach((kart) => {
                const uygun = kategori === "hepsi" || kart.dataset.kategori === kategori;
                kart.style.display = uygun ? "" : "none";
                if (uygun) gorunen++;
            });

            if (bosDurum) bosDurum.style.display = gorunen === 0 ? "block" : "none";
        }

        sekmeler.forEach((sekme) => {
            sekme.addEventListener("click", function () {
                sekmeler.forEach((s) => s.classList.remove("aktif"));
                sekme.classList.add("aktif");
                uygulaFiltre();
            });
        });

        uygulaFiltre();
    }

    // Dışarıdan erişim
    window.KampuscuSeedIlanlar = seedIlanlar;
    window.KampuscuIlanlar = {
        LOCAL_STORAGE_KEY,
        seedIlanlar,
        kategoriAdlari,
        guvenliMetin,
        ilanGorselMetniOlustur,
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderHomeSonIlanlar);
    } else {
        renderHomeSonIlanlar();
    }
})();
