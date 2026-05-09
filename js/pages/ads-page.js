(function () {
    'use strict';

    const STORAGE_SESSION = 'kampuscu_auth_session_v1';
    const POST_AUTH_REDIRECT_KEY = 'kampuscu_post_auth_redirect_v1';
    const LOCAL_STORAGE_KEY = "kampuscu_kullanici_ilanlari";

    const sekmeler = document.querySelectorAll(".sekme");
    const aramaInput = document.querySelector("#ilan-arama");
    const aramaButon = document.querySelector("#arama-buton");
    const ilanListesi = document.querySelector("#ilan-listesi");
    const bosDurum = document.querySelector("#filtre-bos-durum");

    if (!aramaInput || !aramaButon || !ilanListesi || !bosDurum) return;

    function safeToast(message, type) {
        if (typeof window.toast === 'function') {
            window.toast(message, type);
            return;
        }
        alert(String(message || ''));
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(STORAGE_SESSION);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function isLoggedIn() {
        const session = getSession();
        return !!(session && session.email);
    }

    function requireLogin() {
        if (isLoggedIn()) return true;
        safeToast('İlan vermek için giriş yap.', 'uyari');
        try {
            sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, 'ads.html#ilan-modal');
        } catch {
            // boş ver
        }
        window.location.href = 'auth.html';
        return false;
    }

    const ilanVerLink = document.querySelector('a[href="#ilan-modal"]');
    if (ilanVerLink) {
        ilanVerLink.addEventListener('click', (e) => {
            if (!requireLogin()) e.preventDefault();
        });
    }

    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#ilan-modal' && !isLoggedIn()) {
            window.location.hash = '';
            requireLogin();
        }
    });

    // URL'den arama/filtre al
    const aramaParam = new URLSearchParams(window.location.search).get("q");
    if (aramaParam && aramaInput) {
        aramaInput.value = aramaParam.trim();
    }

    const kategoriParam = new URLSearchParams(window.location.search).get("kategori");
    if (kategoriParam) {
        const hedefKategori = kategoriParam.trim().toLowerCase();
        const sekme = document.querySelector(`.sekme[data-filter="${hedefKategori}"]`);

        if (sekme) {
            sekmeler.forEach(function (buton) {
                buton.classList.remove("aktif");
            });
            sekme.classList.add("aktif");
        }
    }

    const ilanFormu = document.querySelector("#ilan-formu");
    const ilanBaslikInput = document.querySelector("#ilan-baslik");
    const ilanKategoriInput = document.querySelector("#ilan-kategori");
    const ilanFiyatInput = document.querySelector("#ilan-fiyat");
    const ilanKonumInput = document.querySelector("#ilan-konum");
    const ilanAciklamaInput = document.querySelector("#ilan-aciklama");

    const detayModal = document.querySelector("#detay-modal");
    const detayKapat = document.querySelector("#detay-kapat");
    const detayKategori = document.querySelector("#detay-kategori");
    const detayBaslik = document.querySelector("#detay-baslik");
    const detayAciklama = document.querySelector("#detay-aciklama");
    const detayKonum = document.querySelector("#detay-konum");
    const detayTarih = document.querySelector("#detay-tarih");
    const detayFiyat = document.querySelector("#detay-fiyat");
    const detayIletisim = document.querySelector("#detay-iletisim");

    const kategoriAdlari = {
        "satis": "Satılık",
        "kiralik": "Kiralık",
        "ev-arkadas": "Ev Arkadaşı",
        "is-arkadas": "Çalışma Arkadaşı",
        "kayip": "Kayıp"
    };

    function guvenliMetin(metin) {
        return String(metin)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function ilanGorselMetniOlustur(baslik, kategori) {
        const kucukBaslik = baslik.toLowerCase();

        if (kucukBaslik.includes("masa")) {
            return "Masa";
        }

        if (kucukBaslik.includes("kitap")) {
            return "Kitap";
        }

        if (kucukBaslik.includes("mouse")) {
            return "Mouse";
        }

        if (kucukBaslik.includes("oda")) {
            return "Oda";
        }

        if (kucukBaslik.includes("ev")) {
            return "Ev";
        }

        if (kucukBaslik.includes("çanta") || kucukBaslik.includes("canta")) {
            return "Çanta";
        }

        if (kucukBaslik.includes("mont")) {
            return "Mont";
        }

        if (kucukBaslik.includes("not")) {
            return "Not";
        }

        return kategoriAdlari[kategori] || "İlan";
    }

    function kayitliIlanlariGetir() {
        const veriler = localStorage.getItem(LOCAL_STORAGE_KEY);
        return veriler ? JSON.parse(veriler) : [];
    }

    function kayitliIlanlariKaydet(ilanlar) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ilanlar));
    }

    function aktifKategoriGetir() {
        const aktifSekme = document.querySelector(".sekme.aktif");
        return aktifSekme ? aktifSekme.dataset.filter : "tum";
    }

    function ilanlariGetir() {
        return document.querySelectorAll("#ilan-listesi .kart");
    }

    function ilanlariFiltrele() {
        const aktifKategori = aktifKategoriGetir();
        const aramaMetni = aramaInput.value.toLowerCase().trim();
        let gorunenIlanSayisi = 0;

        ilanlariGetir().forEach(function (ilan) {
            const kategoriUygun = aktifKategori === "tum" || ilan.dataset.kategori === aktifKategori;
            const metinUygun = ilan.textContent.toLowerCase().includes(aramaMetni);

            if (kategoriUygun && metinUygun) {
                ilan.style.display = "";
                gorunenIlanSayisi++;
            } else {
                ilan.style.display = "none";
            }
        });

        bosDurum.style.display = gorunenIlanSayisi === 0 ? "block" : "none";
    }

    function gorselAlaniOlustur(ilan) {
        const kategoriEmoji = {
            satis: "🛍️",
            kiralik: "🏠",
            "ev-arkadas": "🏠",
            "is-arkadas": "📚",
            kayip: "🔍",
        };

        if (ilan.gorsel) {
            const gorselYolu = "../assets/img/" + ilan.gorsel;
            const altMetni = guvenliMetin(ilan.baslik) + " görseli";
            return `<img
                src="${gorselYolu}"
                alt="${altMetni}"
                loading="lazy"
                onerror="this.parentElement.innerHTML='${kategoriEmoji[ilan.kategori] || "📦"}'"
            >`;
        }

        return kategoriEmoji[ilan.kategori] || "📦";
    }

    function ilanKartiOlustur(ilan) {
        const kategoriAdi = ilan.kategoriAdi || kategoriAdlari[ilan.kategori] || "İlan";
        const gorselMetni = ilanGorselMetniOlustur(ilan.baslik, ilan.kategori);

        const ilanKart = document.createElement("article");
        ilanKart.className = "kart tiklanabilir";
        ilanKart.dataset.kategori = ilan.kategori;
        ilanKart.dataset.baslik = ilan.baslik;
        ilanKart.dataset.kategoriAdi = kategoriAdi;
        ilanKart.dataset.fiyat = ilan.fiyat;
        ilanKart.dataset.konum = ilan.konum;
        ilanKart.dataset.tarih = ilan.tarih;
        ilanKart.dataset.aciklama = ilan.aciklama;
        ilanKart.dataset.kullaniciIlani = "true";
        ilanKart.dataset.id = ilan.id;
        ilanKart.dataset.gorsel = ilan.gorsel || "";

        ilanKart.innerHTML = `
                <div class="kart-resim-alani" aria-hidden="true">${gorselAlaniOlustur(ilan)}</div>
                <span class="etiket ${guvenliMetin(ilan.kategori)}">${guvenliMetin(kategoriAdi)}</span>
                <h3 class="kart-baslik">${guvenliMetin(ilan.baslik)}</h3>
                <p class="kart-metin">${guvenliMetin(ilan.aciklama)}</p>

                <div class="ilan-detaylari">
                    <span>${guvenliMetin(ilan.konum)}</span>
                    <span>${guvenliMetin(ilan.tarih)}</span>
                </div>

                <div class="kart-alt">
                    <span class="fiyat-etiketi">${guvenliMetin(ilan.fiyat)}</span>
                    <button type="button" class="buton kucuk detay-buton">İlanı Gör</button>
                </div>
            `;

        return ilanKart;
    }

    function seedIlanlariSayfayaYukle() {
        const seed = (window.KampuscuSeedIlanlar || []);
        seed.forEach(function (ilan) {
            ilanListesi.appendChild(ilanKartiOlustur(ilan));
        });
    }

    function kayitliIlanlariSayfayaYukle() {
        const kayitliIlanlar = kayitliIlanlariGetir();

        kayitliIlanlar.forEach(function (ilan) {
            ilanListesi.prepend(ilanKartiOlustur(ilan));
        });

        ilanlariFiltrele();
    }

    function detayModalAc(ilan) {
        const kategori = ilan.dataset.kategori;
        const kategoriAdi = ilan.dataset.kategoriAdi || kategoriAdlari[kategori] || "İlan";

        detayKategori.className = "etiket " + kategori;
        detayKategori.textContent = kategoriAdi;
        detayBaslik.textContent = ilan.dataset.baslik;
        detayAciklama.textContent = ilan.dataset.aciklama;
        detayKonum.textContent = "Konum: " + ilan.dataset.konum;
        detayTarih.textContent = ilan.dataset.tarih;
        detayFiyat.textContent = ilan.dataset.fiyat;

        /* Görsel alanını doldur */
        const gorselAlani = document.getElementById("detay-gorsel-alani");
        if (gorselAlani) {
            const gorsel = ilan.dataset.gorsel;
            if (gorsel) {
                gorselAlani.style.display = "block";
                gorselAlani.innerHTML = `<img
                    src="../assets/img/${gorsel}"
                    alt="${ilan.dataset.baslik} görseli"
                    loading="lazy"
                    onerror="this.parentElement.style.display='none'"
                >`;
            } else {
                gorselAlani.style.display = "none";
                gorselAlani.innerHTML = "";
            }
        }

        detayIletisim.textContent = "İletişime Geç";
        detayModal.classList.add("acik");
    }

    function detayModalKapat() {
        detayModal.classList.remove("acik");
    }

    sekmeler.forEach(function (sekme) {
        sekme.addEventListener("click", function () {
            sekmeler.forEach(function (buton) {
                buton.classList.remove("aktif");
            });

            sekme.classList.add("aktif");
            ilanlariFiltrele();
        });
    });

    aramaInput.addEventListener("input", ilanlariFiltrele);
    aramaButon.addEventListener("click", ilanlariFiltrele);

    ilanListesi.addEventListener("click", function (event) {
        const detayButonu = event.target.closest(".detay-buton");

        if (!detayButonu) {
            return;
        }

        const ilan = detayButonu.closest(".kart");
        detayModalAc(ilan);
    });

    detayKapat.addEventListener("click", detayModalKapat);

    detayModal.addEventListener("click", function (event) {
        if (event.target === detayModal) {
            detayModalKapat();
        }
    });

    detayIletisim.addEventListener("click", function () {
        detayIletisim.textContent = "İletişim isteği gönderildi";
    });

    ilanFormu.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!requireLogin()) {
            return;
        }

        const yeniIlan = {
            id: Date.now().toString(),
            baslik: ilanBaslikInput.value.trim(),
            kategori: ilanKategoriInput.value,
            fiyat: ilanFiyatInput.value.trim(),
            konum: ilanKonumInput.value.trim(),
            aciklama: ilanAciklamaInput.value.trim(),
            tarih: "Az önce eklendi"
        };

        if (!yeniIlan.baslik || !yeniIlan.kategori || !yeniIlan.fiyat || !yeniIlan.konum || !yeniIlan.aciklama) {
            alert("Lütfen tüm ilan alanlarını doldur.");
            return;
        }

        const kayitliIlanlar = kayitliIlanlariGetir();
        kayitliIlanlar.unshift(yeniIlan);
        kayitliIlanlariKaydet(kayitliIlanlar);

        ilanListesi.prepend(ilanKartiOlustur(yeniIlan));
        ilanFormu.reset();

        window.location.hash = "";
        ilanlariFiltrele();
    });

    seedIlanlariSayfayaYukle();
    kayitliIlanlariSayfayaYukle();
})();