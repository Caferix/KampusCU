(function () {
    'use strict';

    // Filtre + arama
    document.addEventListener('DOMContentLoaded', function () {
        var sekmeler = document.querySelectorAll('.sekme');
        var liste = document.getElementById('etkinlikListesi');
        var bosDurum = document.getElementById('bosDurum');
        var ozet = document.getElementById('etkinlikOzet');
        var aramaInput = document.getElementById('etkinlikArama');

        var aktifFiltre = 'tumu';
        var aktifArama = '';

        if (!liste || !bosDurum || !ozet || !aramaInput) return;

        var ayHarita = {
            'Ocak': 1, 'Şubat': 2, 'Mart': 3, 'Nisan': 4,
            'Mayıs': 5, 'Haziran': 6, 'Temmuz': 7, 'Ağustos': 8,
            'Eylül': 9, 'Ekim': 10, 'Kasım': 11, 'Aralık': 12
        };

        function tarihDegeri(kart) {
            var gun = parseInt(kart.querySelector('.etkinlik-gun').textContent, 10) || 0;
            var ayMetin = kart.querySelector('.etkinlik-ay').textContent.trim();
            var ay = ayHarita[ayMetin] || 0;
            return ay * 100 + gun;
        }

        var tumKartlar = Array.prototype.slice.call(
            liste.querySelectorAll('.etkinlik-kart')
        );
        tumKartlar.sort(function (a, b) {
            var dA = a.getAttribute('data-durum');
            var dB = b.getAttribute('data-durum');
            if (dA !== dB) {
                return dA === 'yaklasan' ? -1 : 1;
            }
            return tarihDegeri(a) - tarihDegeri(b);
        });
        tumKartlar.forEach(function (kart) { liste.appendChild(kart); });

        var kartlar = tumKartlar;

        function uygula() {
            var gorunen = 0;
            kartlar.forEach(function (kart) {
                var durum = kart.getAttribute('data-durum');
                var baslik = kart.querySelector('.kart-baslik').textContent.toLowerCase();
                var aciklama = kart.querySelector('.kart-metin').textContent.toLowerCase();

                var filtreUyar = (aktifFiltre === 'tumu' || durum === aktifFiltre);
                var aramaUyar = (aktifArama === '' || baslik.includes(aktifArama) || aciklama.includes(aktifArama));

                if (filtreUyar && aramaUyar) {
                    kart.style.display = '';
                    gorunen++;
                } else {
                    kart.style.display = 'none';
                }
            });

            if (gorunen === 0) {
                bosDurum.style.display = '';
                liste.style.display = 'none';
                ozet.textContent = 'Sonuç bulunamadı.';
            } else {
                bosDurum.style.display = 'none';
                liste.style.display = '';
                ozet.textContent = 'Toplam ' + gorunen + ' etkinlik gösteriliyor.';
            }
        }

        sekmeler.forEach(function (sekme) {
            sekme.addEventListener('click', function () {
                sekmeler.forEach(function (s) { s.classList.remove('aktif'); });
                sekme.classList.add('aktif');
                aktifFiltre = sekme.getAttribute('data-filtre');
                uygula();
            });
        });

        aramaInput.addEventListener('input', function () {
            aktifArama = aramaInput.value.trim().toLowerCase();
            uygula();
        });
    });
})();
