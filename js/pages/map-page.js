(function () {
    'use strict';

    window.haritaOdakla = function haritaOdakla(enlem, boylam) {
        const iframe = document.getElementById('kampusHarita');
        if (!iframe) return;

        const yeniUrl = `https://www.google.com/maps?q=${enlem},${boylam}&hl=tr&z=17&output=embed`;
        iframe.src = yeniUrl;

        if (window.innerWidth < 992) {
            iframe.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.filtrele = function filtrele(kategori, buton) {
        document.querySelectorAll('.sekme').forEach(s => s.classList.remove('aktif'));
        buton.classList.add('aktif');

        const kartlar = document.querySelectorAll('.mekan-listesi .kart');
        kartlar.forEach(kart => {
            if (kategori === 'tumu' || kart.classList.contains(kategori)) {
                kart.style.display = 'block';
            } else {
                kart.style.display = 'none';
            }
        });
    };
})();
