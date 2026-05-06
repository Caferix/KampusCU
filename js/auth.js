(function () {
    'use strict';

    const STORAGE_USERS = 'kampuscu_auth_users_v1';
    const STORAGE_SESSION = 'kampuscu_auth_session_v1';
    const POST_AUTH_REDIRECT_KEY = 'kampuscu_post_auth_redirect_v1';

    // Öğrenci e-postası kontrolü
    const ALLOWED_EMAIL_SUFFIX = 'cumhuriyet.edu.tr';

    function $(id) {
        return document.getElementById(id);
    }

    function safeToast(message, type) {
        if (typeof window.toast === 'function') {
            window.toast(message, type);
            return;
        }
        // Yedek
        alert(String(message || ''));
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLocaleLowerCase('tr-TR');
    }

    function isStudentEmail(email) {
        const normalized = normalizeEmail(email);
        return normalized.includes('@') && normalized.endsWith(ALLOWED_EMAIL_SUFFIX);
    }

    function initialsFromName(name) {
        const parts = String(name || '')
            .trim()
            .split(/\s+/)
            .filter(Boolean);
        if (parts.length === 0) return 'Ü';
        const first = parts[0][0] || '';
        const last = (parts.length > 1 ? parts[parts.length - 1][0] : '') || '';
        return (first + last).toLocaleUpperCase('tr-TR');
    }

    function getUsers() {
        try {
            const raw = localStorage.getItem(STORAGE_USERS);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function setUsers(users) {
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users || []));
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(STORAGE_SESSION);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setSession(session) {
        localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
    }

    function clearSession() {
        localStorage.removeItem(STORAGE_SESSION);
    }

    function logout() {
        clearSession();
        safeToast('Çıkış yapıldı.', 'bilgi');
        renderNavUser();
    }

    async function sha256(text) {
        const msgUint8 = new TextEncoder().encode(String(text || ''));
        if (!crypto?.subtle?.digest) {
            return String(text || '');
        }
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function findUserByEmail(users, email) {
        const e = normalizeEmail(email);
        return users.find(u => normalizeEmail(u.email) === e) || null;
    }

    function isAuthPage() {
        return /\/pages\/auth\.html$/.test(window.location.pathname) || /\/auth\.html$/.test(window.location.pathname);
    }

    function hrefToPages(pathInPages) {
        const inPages = /\/pages\//.test(window.location.pathname);
        if (inPages) return pathInPages;
        return `pages/${pathInPages}`;
    }

    function redirectAfterAuth() {
        if (isAuthPage()) {
            try {
                const next = sessionStorage.getItem(POST_AUTH_REDIRECT_KEY);
                if (next) {
                    sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY);
                    window.location.href = hrefToPages(next);
                    return;
                }
            } catch {
                // boş ver
            }
            window.location.href = hrefToPages('profile.html');
            return;
        }
        // Önce geri dönmeyi dene; yoksa ana sayfaya.
        const ref = document.referrer;
        const sameOrigin = ref && ref.startsWith(window.location.origin);
        if (sameOrigin) {
            window.location.href = ref;
            return;
        }
        window.location.href = /\/pages\//.test(window.location.pathname) ? '../index.html' : 'index.html';
    }

    function closeLoginModalIfOpen() {
        const modal = $('girisModal');
        if (!modal) return;
        modal.classList.remove('acik');
    }

    async function handleRegister(formEmail, formPassword, formName) {
        const email = normalizeEmail(formEmail);
        const password = String(formPassword || '');
        const name = String(formName || '').trim();

        if (!name) {
            safeToast('Ad Soyad zorunlu.', 'uyari');
            return;
        }

        if (!isStudentEmail(email)) {
            safeToast(`Sadece öğrenci e-postası kabul edilir (…@${ALLOWED_EMAIL_SUFFIX}).`, 'uyari');
            return;
        }

        if (password.length < 6) {
            safeToast('Şifre en az 6 karakter olmalı.', 'uyari');
            return;
        }

        const users = getUsers();
        if (findUserByEmail(users, email)) {
            safeToast('Bu e-posta ile zaten kayıt var. Giriş yapmayı dene.', 'uyari');
            return;
        }

        const passwordHash = await sha256(password);
        const user = {
            id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
            name,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        setUsers(users);
        setSession({ email: user.email, name: user.name, loggedInAt: new Date().toISOString() });

        safeToast('Kayıt başarılı. Hoş geldin!', 'basarili');
        closeLoginModalIfOpen();
        renderNavUser();

        if (isAuthPage()) {
            redirectAfterAuth();
        }
    }

    async function handleLogin(formEmail, formPassword) {
        const email = normalizeEmail(formEmail);
        const password = String(formPassword || '');

        if (!isStudentEmail(email)) {
            safeToast(`Sadece öğrenci e-postası ile giriş yapılabilir (…@${ALLOWED_EMAIL_SUFFIX}).`, 'uyari');
            return;
        }

        const users = getUsers();
        const user = findUserByEmail(users, email);
        if (!user) {
            safeToast('Bu e-posta ile kayıt bulunamadı. Önce kayıt ol.', 'uyari');
            return;
        }

        const passwordHash = await sha256(password);
        if (String(user.passwordHash) !== String(passwordHash)) {
            safeToast('Şifre hatalı.', 'uyari');
            return;
        }

        setSession({ email: user.email, name: user.name, loggedInAt: new Date().toISOString() });
        safeToast('Giriş başarılı.', 'basarili');
        closeLoginModalIfOpen();
        renderNavUser();

        if (isAuthPage()) {
            redirectAfterAuth();
        }
    }

    let defaultNavHtml = null;

    function renderNavUser() {
        const nav = $('navKullanici');
        if (!nav) return;

        if (defaultNavHtml === null) {
            defaultNavHtml = nav.innerHTML;
        }

        const session = getSession();
        if (!session || !session.email) {
            if (defaultNavHtml !== null && nav.innerHTML !== defaultNavHtml) {
                nav.innerHTML = defaultNavHtml;
            }
            return;
        }

        const profileHref = hrefToPages('profile.html');
        const avatar = initialsFromName(session.name || session.email);

        nav.innerHTML = `
            <div class="nav-profil">
                <a href="${profileHref}" class="nav-profil-link" aria-label="Profilim">
                    <div class="avatar kucuk" aria-hidden="true">${avatar}</div>
                    <span class="nav-profil-yazi">Profilim</span>
                </a>
            </div>
        `;
    }

    function wireAuthForms() {
        const girisForm = $('girisForm');
        if (girisForm) {
            girisForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleLogin($('girisEmail')?.value, $('girisSifre')?.value);
            });
        }

        const kayitForm = $('kayitForm');
        if (kayitForm) {
            kayitForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleRegister($('kayitEmail')?.value, $('kayitSifre')?.value, $('adSoyad')?.value);
            });
        }

        const emailGirisBtn = $('emailGirisBtn');
        if (emailGirisBtn) {
            emailGirisBtn.addEventListener('click', async () => {
                await handleLogin($('girisEmail')?.value, $('girisSifre')?.value);
            });
        }
    }

    function wireDemoLogin() {
        const demoBtn = $('demoGirisBtn');
        if (!demoBtn) return;

        demoBtn.addEventListener('click', () => {
            const demoUser = {
                id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
                name: 'Demo Öğrenci',
                email: `demo@${ALLOWED_EMAIL_SUFFIX}`,
                passwordHash: '',
                createdAt: new Date().toISOString()
            };

            const users = getUsers();
            const existing = findUserByEmail(users, demoUser.email);
            if (!existing) {
                users.push(demoUser);
                setUsers(users);
            }

            setSession({ email: demoUser.email, name: demoUser.name, loggedInAt: new Date().toISOString() });
            safeToast('Demo hesabı ile giriş yapıldı.', 'bilgi');
            renderNavUser();

            window.location.href = hrefToPages('profile.html');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.kampuscuAuthLogout = logout;
        wireAuthForms();
        wireDemoLogin();
        renderNavUser();
    });
})();
