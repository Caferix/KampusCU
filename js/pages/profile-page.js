(function () {
    'use strict';

    // Profil: giriş yapan kullanıcı varsa onu göster
    (function () {
        const STORAGE_USERS = 'kampuscu_auth_users_v1';
        const STORAGE_SESSION = 'kampuscu_auth_session_v1';

        function safeParse(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        }

        function initialsFromText(value) {
            const text = String(value || '').trim();
            if (!text) return 'Ü';
            const parts = text.split(/\s+/).filter(Boolean);
            const first = parts[0]?.[0] || '';
            const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
            return (first + last).toLocaleUpperCase('tr-TR');
        }

        function setText(id, value) {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = String(value || '');
        }

        function initProfil() {
            const session = safeParse(STORAGE_SESSION);
            const durum = document.getElementById('profilDurumMetni');
            const avatarEl = document.getElementById('profilAvatar');
            const cikisBtn = document.getElementById('profilCikisBtn');

            if (!session || !session.email) {
                if (durum) durum.textContent = 'Bu profili görmek için giriş yap.';
                if (cikisBtn) cikisBtn.style.display = 'none';
                return;
            }

            const users = safeParse(STORAGE_USERS) || [];
            const user = Array.isArray(users)
                ? users.find(u => String(u?.email || '').toLocaleLowerCase('tr-TR') === String(session.email).toLocaleLowerCase('tr-TR'))
                : null;

            const name = user?.name || session.name || '';
            const email = user?.email || session.email || '';

            if (name) setText('profil-ozet-baslik', name);
            if (email) setText('profilEmail', email);
            if (avatarEl) avatarEl.textContent = initialsFromText(name || email);
            if (durum) durum.textContent = 'Giriş yapıldı.';

            if (cikisBtn) {
                cikisBtn.style.display = '';
                cikisBtn.addEventListener('click', () => {
                    if (typeof window.kampuscuAuthLogout === 'function') {
                        window.kampuscuAuthLogout();
                    } else {
                        localStorage.removeItem(STORAGE_SESSION);
                    }
                    window.location.href = 'auth.html';
                }, { once: true });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProfil);
        } else {
            initProfil();
        }
    })();

    const LOCAL_STORAGE_KEY = "kampuscu_kullanici_ilanlari";
    const profilIlanListesi = document.querySelector("#profil-ilan-listesi");
    const aktifIlanSayisi = document.querySelector("#aktif-ilan-sayisi");

    if (!profilIlanListesi || !aktifIlanSayisi) return;

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

    function kayitliIlanlariGetir() {
        const veriler = localStorage.getItem(LOCAL_STORAGE_KEY);
        return veriler ? JSON.parse(veriler) : [];
    }

    function kayitliIlanlariKaydet(ilanlar) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ilanlar));
    }

    function profilIlanKartiOlustur(ilan) {
        const kategoriAdi = kategoriAdlari[ilan.kategori] || "İlan";

        const ilanKart = document.createElement("article");
        ilanKart.className = "kart profil-ilan-karti";
        ilanKart.dataset.id = ilan.id;

        ilanKart.innerHTML = `
                <div>
                    <span class="etiket ${guvenliMetin(ilan.kategori)}">${guvenliMetin(kategoriAdi)}</span>
                    <h3 class="kart-baslik">${guvenliMetin(ilan.baslik)}</h3>
                    <p class="kart-metin">${guvenliMetin(ilan.aciklama)}</p>

                    <div class="profil-ilan-bilgileri">
                        <span>Durum: Yayında</span>
                        <span>Fiyat: ${guvenliMetin(ilan.fiyat)}</span>
                        <span>Konum: ${guvenliMetin(ilan.konum)}</span>
                    </div>
                </div>

                <div class="profil-ilan-aksiyonlari">
                    <a href="ads.html" class="buton ikincil kucuk">İlanı Gör</a>
                    <button type="button" class="buton tehlike kucuk kullanici-ilan-sil">İlanı Sil</button>
                </div>
            `;

        return ilanKart;
    }

    function profilIlanlariniYukle() {
        const kayitliIlanlar = kayitliIlanlariGetir();

        kayitliIlanlar.forEach(function (ilan) {
            profilIlanListesi.prepend(profilIlanKartiOlustur(ilan));
        });

        aktifIlanSayisi.textContent = 2 + kayitliIlanlar.length;
    }

    profilIlanListesi.addEventListener("click", function (event) {
        const silButonu = event.target.closest(".kullanici-ilan-sil");

        if (!silButonu) {
            return;
        }

        const ilanKarti = silButonu.closest(".profil-ilan-karti");
        const ilanId = ilanKarti.dataset.id;

        const kalanIlanlar = kayitliIlanlariGetir().filter(function (ilan) {
            return ilan.id !== ilanId;
        });

        kayitliIlanlariKaydet(kalanIlanlar);
        ilanKarti.remove();

        aktifIlanSayisi.textContent = 2 + kalanIlanlar.length;
    });

    profilIlanlariniYukle();
})();
