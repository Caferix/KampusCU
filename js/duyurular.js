/* Seed duyurular + listeleme */
(function () {
    const kategoriAdlari = {
        akademik: "Akademik",
        genel: "Genel",
        kampanya: "Kampanya",
        indirim: "İndirim",
    };

    const seedDuyurular = [
        {
            id: "d-1",
            baslik: "Bahar Dönemi Final Takvimi Yayınlandı",
            kategori: "akademik",
            tarih: "05 Mayıs 2026",
            ozet: "Final sınavı tarihleri ve salon planlamaları OBS üzerinden erişime açıldı.",
            kaynak: "Öğrenci İşleri",
        },
        {
            id: "d-2",
            baslik: "Kütüphane Çalışma Saatleri Güncellendi",
            kategori: "genel",
            tarih: "02 Mayıs 2026",
            ozet: "Vize/final haftalarında kütüphane 23:00'a kadar açık olacak.",
            kaynak: "Merkez Kütüphane",
        },
        {
            id: "d-3",
            baslik: "Kampüs İçi Ulaşım Hatları Düzenlendi",
            kategori: "genel",
            tarih: "28 Nisan 2026",
            ozet: "Ring güzergâhında yeni duraklar eklendi. Güncel saatler panolarda ve web sitesinde.",
            kaynak: "SKS",
        },
        {
            id: "d-4",
            baslik: "Yaz Okulu Ön Kayıt Duyurusu",
            kategori: "akademik",
            tarih: "20 Nisan 2026",
            ozet: "Yaz okulu açılması planlanan dersler için ön talep formu duyuruldu.",
            kaynak: "Fakülte Dekanlığı",
        },
        {
            id: "d-5",
            baslik: "Kampüs Kafeterya: Öğrenci Kartına %15 İndirim",
            kategori: "indirim",
            tarih: "15 Nisan 2026",
            ozet: "Hafta içi 11:00–16:00 arası öğrenci kartı gösterene %15 indirim uygulanır.",
            kaynak: "Kafeterya",
        },
        {
            id: "d-6",
            baslik: "Üniversite Kitabevi: Ders Kitaplarında %20",
            kategori: "indirim",
            tarih: "10 Nisan 2026",
            ozet: "Dönem boyunca seçili ders kitaplarında öğrenci kimliğiyle %20 indirim.",
            kaynak: "Kitabevi",
        },
        {
            id: "d-7",
            baslik: "Kulüp Tanışma Günü — Başvurular Açıldı",
            kategori: "kampanya",
            tarih: "06 Nisan 2026",
            ozet: "Kulüpler stant açıyor. Gönüllü olmak veya katılmak için başvuru formunu doldur.",
            kaynak: "Kulüp Ofisi",
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

    function etiketSinifi(kategori) {
    if (kategori === "indirim") return "indirim";
    if (kategori === "kampanya") return "kampanya";
    return "duyuru";
}

    function duyuruHrefOlustur(duyuru) {
        // Detay yok: kategoriye göre listele
        const kategori = encodeURIComponent(duyuru.kategori || "");
        return `announcements.html?kategori=${kategori}`;
    }

    function createKenarDuyuruSatiri(duyuru) {
        const a = document.createElement("a");
        a.className = "duyuru-satir";
        a.href = `pages/${duyuruHrefOlustur(duyuru)}`;

        a.innerHTML = `
            <strong>${guvenliMetin(duyuru.baslik)}</strong>
            <time>${guvenliMetin(duyuru.tarih)}</time>
        `;

        return a;
    }

    function createDuyuruKarti(duyuru) {
        const kategori = duyuru.kategori || "genel";
        const kategoriAdi = kategoriAdlari[kategori] || "Duyuru";

        const kart = document.createElement("article");
        kart.className = "kart duyuru-kart";
        kart.dataset.kategori = kategori;

        kart.innerHTML = `
            <div class="duyuru-kart-ust">
                <span class="etiket ${guvenliMetin(etiketSinifi(kategori))}">${guvenliMetin(kategoriAdi)}</span>
                <time class="duyuru-tarih">${guvenliMetin(duyuru.tarih)}</time>
            </div>
            <h3 class="kart-baslik">${guvenliMetin(duyuru.baslik)}</h3>
            <p class="kart-metin">${guvenliMetin(duyuru.ozet || "")}</p>
            <div class="duyuru-kaynak">
                <span>${guvenliMetin(duyuru.kaynak || "")}</span>
                <button type="button" class="buton ikincil kucuk duyuru-detay-buton" data-id="${guvenliMetin(duyuru.id)}" aria-label="Duyuru detayı">Gör</button>
            </div>
        `;

        return kart;
    }

    function okuKategoriParam() {
        try {
            const url = new URL(window.location.href);
            const param = (url.searchParams.get("kategori") || "").trim();
            return param || "tumu";
        } catch {
            return "tumu";
        }
    }

    function renderKenarSonDuyurular() {
        const container = document.getElementById("sonDuyuruListesi");
        if (!container) return;

        container.innerHTML = "";
        seedDuyurular
            .slice(0, 4)
            .forEach((d) => container.appendChild(createKenarDuyuruSatiri(d)));
    }

    function renderDuyuruSayfasi() {
        const liste = document.getElementById("duyuruListesi");
        if (!liste) return;

        const bosDurum = document.getElementById("duyuruBosDurum");
        const sekmeler = document.querySelectorAll("#duyuruSekmeler .sekme");

        const detayModal = document.getElementById('duyuruDetayModal');
        const detayKategori = document.getElementById('duyuruDetayKategori');
        const detayTarih = document.getElementById('duyuruDetayTarih');
        const detayBaslik = document.getElementById('duyuruDetayBaslik');
        const detayOzet = document.getElementById('duyuruDetayOzet');
        const detayKaynak = document.getElementById('duyuruDetayKaynak');

        function detayAc(duyuru) {
            if (!detayModal || !duyuru) return;

            const kategori = duyuru.kategori || 'genel';
            const kategoriAdi = kategoriAdlari[kategori] || 'Duyuru';

            if (detayKategori) {
                detayKategori.className = `etiket ${etiketSinifi(kategori)}`;
                detayKategori.textContent = kategoriAdi;
            }
            if (detayTarih) detayTarih.textContent = duyuru.tarih || '';
            if (detayBaslik) detayBaslik.textContent = duyuru.baslik || '';
            if (detayOzet) detayOzet.textContent = duyuru.ozet || '';
            if (detayKaynak) detayKaynak.textContent = duyuru.kaynak || '';

            detayModal.classList.add('acik');
        }

        function seciliKategoriGetir() {
            const aktif = document.querySelector("#duyuruSekmeler .sekme.aktif");
            return aktif ? aktif.dataset.kategori : "tumu";
        }

        function listeyiBas(kategori) {
            liste.innerHTML = "";

            const filtreli = (kategori === "tumu")
                ? seedDuyurular
                : seedDuyurular.filter(d => (d.kategori || "genel") === kategori);

            filtreli.forEach((d) => liste.appendChild(createDuyuruKarti(d)));

            if (bosDurum) {
                bosDurum.style.display = filtreli.length === 0 ? "block" : "none";
            }
        }

        if (!liste.dataset.kampuscuBound) {
            liste.dataset.kampuscuBound = '1';
            liste.addEventListener('click', (e) => {
                const btn = e.target.closest('.duyuru-detay-buton');
                if (!btn) return;
                const id = btn.getAttribute('data-id');
                const duyuru = seedDuyurular.find(d => String(d.id) === String(id));
                detayAc(duyuru);
            });
        }

        // İlk filtre (URL)
        const ilkKategori = okuKategoriParam();
        if (sekmeler.length) {
            let bulundu = false;
            sekmeler.forEach((sekme) => {
                const uygun = sekme.dataset.kategori === ilkKategori;
                sekme.classList.toggle("aktif", uygun);
                if (uygun) bulundu = true;
            });
            if (!bulundu) {
                sekmeler.forEach((sekme) => sekme.classList.toggle("aktif", sekme.dataset.kategori === "tumu"));
            }
        }

        // Sekmeler
        sekmeler.forEach((sekme) => {
            sekme.addEventListener("click", () => {
                sekmeler.forEach((s) => s.classList.remove("aktif"));
                sekme.classList.add("aktif");

                const kategori = seciliKategoriGetir();
                listeyiBas(kategori);

                try {
                    const url = new URL(window.location.href);
                    if (kategori === "tumu") url.searchParams.delete("kategori");
                    else url.searchParams.set("kategori", kategori);
                    window.history.replaceState({}, "", url.toString());
                } catch {
                    // boş ver
                }
            });
        });

        listeyiBas(seciliKategoriGetir());
    }

    // Dışarıdan erişim
    window.KampuscuSeedDuyurular = seedDuyurular;
    window.KampuscuDuyurular = {
        seedDuyurular,
        kategoriAdlari,
        guvenliMetin,
    };

    function init() {
        renderKenarSonDuyurular();
        renderDuyuruSayfasi();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

window.duyurulariGetir = async function () {
    return window.KampuscuSeedDuyurular;
};