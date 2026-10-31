// Konfigurasi Klien Supabase
const SUPABASE_URL = 'https://mznqtwyaxhmolempmyvo.supabase.co';
const SUPABASE_ANON_KEY = 'MASUKKAN_ANON_KEY_ANDA_DI_SINI'; // Ganti dengan anon key Supabase Anda

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    const regPasswordInput = document.getElementById('reg-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    // 1. Toggle Password Visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    button.classList.add('active');
                } else {
                    passwordInput.type = 'password';
                    button.classList.remove('active');
                }
            }
        });
    });

    // 2. Password Strength Checker
    if (regPasswordInput && strengthBar && strengthText) {
        regPasswordInput.addEventListener('input', () => {
            const value = regPasswordInput.value;
            let strength = 0;

            if (value.length >= 8) strength++;
            if (/[A-Z]/.test(value)) strength++;
            if (/[0-9]/.test(value)) strength++;
            if (/[^A-Za-z0-9]/.test(value)) strength++;

            strengthBar.className = 'strength-bar';
            if (value.length === 0) {
                strengthBar.style.width = '0%';
                strengthText.textContent = 'Masukkan kata sandi';
            } else if (strength <= 1) {
                strengthBar.style.width = '25%';
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Lemah';
            } else if (strength === 2 || strength === 3) {
                strengthBar.style.width = '65%';
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Sedang';
            } else {
                strengthBar.style.width = '100%';
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Kuat';
            }
        });
    }

    // 3. Handle Registration (Supabase Auth)
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('reg-name');
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!name || !email || !password) {
                alert('Semua kolom pada sistem GnB harus diisi!');
                return;
            }

            try {
                const { data, error } = await sb.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { full_name: name }
                    }
                });

                if (error) throw error;

                alert('Registrasi akun GnB berhasil! Silakan masuk menggunakan akun baru Anda.');
                registerForm.reset();
                if (strengthBar) strengthBar.style.width = '0%';
                if (strengthText) strengthText.textContent = '';
                
                // Beralih otomatis kembali ke form login
                document.getElementById('register-section').style.display = 'none';
                document.getElementById('login-section').style.display = 'block';

            } catch (error) {
                alert('Gagal mendaftar ke GnB: ' + error.message);
            }
        });
    }

    // 4. Handle Login (Supabase Auth)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) {
                alert('Email dan password GnB harus diisi!');
                return;
            }

            try {
                const { data, error } = await sb.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                alert('Login Berhasil! Selamat datang di GnB.');
                window.location.href = 'dashboard.html';

            } catch (error) {
                alert('Gagal masuk ke GnB: ' + error.message);
            }
        });
    }
});
