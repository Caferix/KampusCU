(function () {
    'use strict';

    function ensureToastContainer() {
        let container = document.getElementById('toastKapsayici');
        if (container) return container;

        container = document.createElement('div');
        container.className = 'toast-kapsayici';
        container.id = 'toastKapsayici';
        document.body.appendChild(container);
        return container;
    }

    window.toast = function toast(message, type) {
        const safeMessage = String(message || '').trim();
        if (!safeMessage) return;

        const container = ensureToastContainer();
        const el = document.createElement('div');
        el.className = `toast ${type || 'bilgi'}`;
        el.textContent = safeMessage;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    };
})();
