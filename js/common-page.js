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
        // Menü
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu && !hamburger.dataset.kampuscuBound) {
            hamburger.dataset.kampuscuBound = '1';
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('acik');
            });
        }

        // Modallar
        if (typeof window.modalAc !== 'function') {
            window.modalAc = function modalAc(id) {
                document.getElementById(id)?.classList.add('acik');
            };
        }

        if (typeof window.modalKapat !== 'function') {
            window.modalKapat = function modalKapat(id) {
                document.getElementById(id)?.classList.remove('acik');
            };
        }

        document.querySelectorAll('.modal-arkaplan').forEach(modal => {
            if (modal.dataset.kampuscuBound) return;
            modal.dataset.kampuscuBound = '1';

            modal.addEventListener('click', function (e) {
                if (e.target === this) {
                    window.modalKapat(this.id);
                }
            });
        });
    });
})();
