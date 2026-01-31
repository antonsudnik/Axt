/**
 * Auth Module for AxiomTrak
 * Fixes: Production URL & Correct Endpoints
 */

// ВАЖНО: Указываем адрес вашего реального сервера с версией API
const API_URL = 'https://api.axiomtrak.com/api/v1';

export function initRegister() {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        registerButton.disabled = true;
        const originalBtnText = registerButton.innerHTML;
        registerButton.innerHTML = 'Creating Account...';

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showError(errorMessage, 'Passwords do not match');
            resetBtn(registerButton, originalBtnText);
            return;
        }

        try {
            // Исправлено: путь теперь корректно собирается как .../api/v1/auth/register
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email: email, password: password })
            });

            if (response.ok) {
                // Если API возвращает JSON при успехе, можно его прочитать, но не обязательно
                showSuccess(successMessage, 'Account created! Redirecting...');
                setTimeout(() => window.location.href = '/login', 2000); // Чистый URL /login
            } else if (response.status === 409) {
                showError(errorMessage, 'Email already registered.');
            } else {
                const error = await response.json();
                showError(errorMessage, error.detail || 'Registration error');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            showError(errorMessage, 'Connection error. Check your internet or API status.');
        } finally {
            // Кнопку разблокируем только если нет успеха (чтобы не нажали дважды при редиректе)
            if (successMessage.classList.contains('hidden')) {
                resetBtn(registerButton, originalBtnText);
            }
        }
    });
}

export function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.classList.add('hidden');
        loginButton.disabled = true;
        const originalBtnText = loginButton.innerHTML;
        loginButton.innerHTML = 'Logging in...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // ИСПРАВЛЕНО: Возвращен эндпоинт /auth/login (как было в старом HTML)
            // Если ваш бэкенд точно требует /auth/token, замените login на token
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt_token', data.access_token);
                // Перенаправление на дашборд (чистый URL)
                window.location.href = '/dashboard'; 
            } else {
                // Пытаемся прочитать ошибку, если сервер её прислал
                try {
                    const errorData = await response.json();
                    showError(errorMessage, errorData.detail || 'Invalid email or password');
                } catch {
                    showError(errorMessage, 'Invalid email or password');
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            showError(errorMessage, 'Connection error. Server may be unreachable.');
        } finally {
            resetBtn(loginButton, originalBtnText);
        }
    });
}

function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
}

function showSuccess(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
}

function resetBtn(btn, text) {
    btn.disabled = false;
    btn.innerHTML = text;
}
