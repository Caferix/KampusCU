(function () {
    'use strict';

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        // Toast
        window.addEventListener('load', () => {
            setTimeout(() => {
                const kapsayici = document.getElementById('toastKapsayici');
                if (!kapsayici) return;

                const toast = document.createElement('div');
                toast.className = 'toast bilgi';
                toast.textContent = "👋 Kampüs'e hoş geldin!";
                kapsayici.appendChild(toast);
                setTimeout(() => toast.remove(), 3500);
            }, 800);
        });

        // Arama önerileri
        (function () {
            const form = document.getElementById('genelAramaForm');
            const input = document.getElementById('genelAramaInput');
            const oneriler = document.getElementById('genelAramaOneriler');
            const durum = document.getElementById('genelAramaDurum');

            if (!form || !input || !oneriler) return;

            function norm(str) {
                return (str || '').trim().toLocaleLowerCase('tr-TR');
            }

            function uniqueByHref(list) {
                const seen = new Set();
                return list.filter(item => {
                    if (!item || !item.href) return false;
                    if (seen.has(item.href)) return false;
                    seen.add(item.href);
                    return true;
                });
            }

            const sabitIndex = [
                { baslik: 'İlanlar', aciklama: 'Sayfa', href: 'pages/ads.html' },
                { baslik: 'Etkinlikler', aciklama: 'Sayfa', href: 'pages/events.html' },
                { baslik: 'Duyurular', aciklama: 'Sayfa', href: 'pages/announcements.html' },
                { baslik: 'Mekanlar', aciklama: 'Sayfa', href: 'pages/map.html' },
                { baslik: 'Hakkımızda', aciklama: 'Sayfa', href: 'pages/about.html' },
                { baslik: 'İletişim', aciklama: 'Sayfa', href: 'pages/about.html#iletisim' },
                { baslik: 'Profil', aciklama: 'Sayfa', href: 'pages/profile.html' },
            ];

            function hizliErisimIndexi() {
                const items = [];
                document.querySelectorAll('.hizli-erisim .hizli-kart').forEach(a => {
                    const baslik = a.querySelector('.hizli-kart-ad')?.textContent || a.textContent;
                    const aciklama = a.querySelector('.hizli-kart-aciklama')?.textContent || 'Kısayol';
                    const href = a.getAttribute('href');
                    if (href) items.push({ baslik: baslik.trim(), aciklama: aciklama.trim(), href });
                });
                return items;
            }

            function ilanAraLinki(q) {
                const temiz = (q || '').trim();
                if (!temiz) return null;
                return {
                    baslik: `"${temiz}" ara`,
                    aciklama: 'İlanlarda',
                    href: `pages/ads.html?q=${encodeURIComponent(temiz)}`
                };
            }

            function eslestir(q) {
                const qn = norm(q);
                if (!qn) return [];

                const havuz = uniqueByHref([
                    ...hizliErisimIndexi(),
                    ...sabitIndex,
                ]);

                const filtreli = havuz
                    .map(item => {
                        const metin = norm(item.baslik + ' ' + (item.aciklama || ''));
                        const skor = metin.includes(qn) ? 2 : 0;
                        return { ...item, skor };
                    })
                    .filter(x => x.skor > 0)
                    .sort((a, b) => b.skor - a.skor || a.baslik.localeCompare(b.baslik, 'tr'))
                    .slice(0, 6);

                const araLinki = ilanAraLinki(q);
                if (araLinki) {
                    return uniqueByHref([araLinki, ...filtreli]);
                }
                return filtreli;
            }

            function kapat() {
                oneriler.hidden = true;
                oneriler.innerHTML = '';
                if (durum) {
                    durum.hidden = true;
                    durum.textContent = '';
                }
            }

            function ac(list) {
                if (!list || list.length === 0) {
                    oneriler.hidden = true;
                    oneriler.innerHTML = '';
                    if (durum) {
                        durum.hidden = false;
                        durum.textContent = 'Sonuç bulunamadı.';
                    }
                    return;
                }

                oneriler.hidden = false;
                oneriler.innerHTML = list.map((item) => {
                    const aciklama = item.aciklama ? `<small>${item.aciklama}</small>` : '';
                    return `
                        <a class="arama-oneri" role="option" href="${item.href}">
                            <span>${item.baslik}</span>
                            ${aciklama}
                        </a>
                    `;
                }).join('');

                if (durum) {
                    durum.hidden = false;
                    durum.textContent = `${list.length} sonuç.`;
                }
            }

            function guncelle() {
                const q = input.value || '';
                const list = eslestir(q);
                if (!q.trim()) {
                    kapat();
                    return;
                }
                ac(list);
            }

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const ilk = oneriler.querySelector('.arama-oneri');
                if (ilk && !oneriler.hidden) {
                    window.location.href = ilk.getAttribute('href');
                    return;
                }
                const q = (input.value || '').trim();
                if (q) window.location.href = `pages/ads.html?q=${encodeURIComponent(q)}`;
            });

            input.addEventListener('input', guncelle);
            input.addEventListener('focus', guncelle);

            document.addEventListener('click', (e) => {
                const kapsayici = document.querySelector('.nav-arama-kapsayici');
                if (!kapsayici) return;
                if (!kapsayici.contains(e.target)) kapat();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') kapat();
            });
        })();
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    kampanyalariYukle();
});

async function kampanyalariYukle() {
    const liste = document.getElementById("kampanyaListesi");
    const yukleniyor = document.getElementById("kampanyaYukleniyor");
    const bosDurum = document.getElementById("kampanyaBosDurum");

    if (!liste) return;

    yukleniyor.style.display = "flex";
    bosDurum.style.display = "none";

    try {
        const tumDuyurular = await window.duyurulariGetir?.();

        if (!tumDuyurular) throw new Error("Veri alınamadı");

        const filtreli = tumDuyurular
            .filter(d => d.kategori === "kampanya" || d.kategori === "indirim")
            .slice(0, 3);

        liste.innerHTML = "";

        if (filtreli.length === 0) {
            bosDurum.style.display = "block";
            return;
        }

        filtreli.forEach(duyuru => {
            liste.appendChild(kampanyaKartiOlustur(duyuru));
        });

    } catch (err) {
        console.error("Kampanyalar yüklenemedi:", err);
        bosDurum.style.display = "block";
    } finally {
        yukleniyor.style.display = "none";
    }
}

function kampanyaKartiOlustur(duyuru) {
    const div = document.createElement("div");
    div.className = "kart tiklanabilir duyuru-kart";

    const kategoriClass = duyuru.kategori === "indirim"
        ? "etiket indirim"
        : "etiket kampanya";

    div.innerHTML = `
        <div class="duyuru-kart-ust">
            <span class="${kategoriClass}">
                ${duyuru.kategori === "indirim" ? "İndirim" : "Kampanya"}
            </span>
            <time class="duyuru-tarih">
                ${formatTarih(duyuru.tarih)}
            </time>
        </div>

        <h3 class="kart-baslik">${duyuru.baslik}</h3>

        <p class="kart-metin">
            ${kisaltMetin(duyuru.ozet, 80)}
        </p>
    `;

    div.addEventListener("click", () => {
        if (typeof duyuruDetayGoster === "function") {
            duyuruDetayGoster(duyuru);
        }
    });

    return div;
}

function kisaltMetin(metin, max = 100) {
    if (!metin) return "";
    return metin.length > max
        ? metin.substring(0, max) + "..."
        : metin;
}

function formatTarih(tarih) {
    if (!tarih) return "";

    const d = new Date(tarih);
    return d.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short"
    });
}
