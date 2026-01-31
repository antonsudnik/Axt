// Константы API (замените на ваш реальный URL, если он другой)
const API_URL = 'http://localhost:8000'; // Или ваш продакшн URL

export function initRegister() {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Сброс сообщений
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
            // Регистрация
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email: email, password: password })
            });

            if (response.ok) {
                successMessage.classList.remove('hidden');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else if (response.status === 409) {
                showError(errorMessage, 'Email already registered.');
            } else {
                const error = await response.json();
                showError(errorMessage, error.detail || 'Registration error');
            }
        } catch (error) {
            console.error(error);
            showError(errorMessage, 'Could not connect to server');
        } finally {
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
            const response = await fetch(`${API_URL}/auth/token`, { // Проверьте этот эндпоинт в вашем API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Если ваш API требует form-data, нужно изменить
                body: JSON.stringify({ email: email, password: password }) 
                // Внимание: часто OAuth2 требует form-urlencoded, если не заработает — скажите мне.
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt_token', data.access_token);
                window.location.href = 'dashboard.html';
            } else {
                showError(errorMessage, 'Invalid email or password');
            }
        } catch (error) {
            console.error(error);
            showError(errorMessage, 'Connection error');
        } finally {
            resetBtn(loginButton, originalBtnText);
        }
    });
}

function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
}

function resetBtn(btn, text) {
    btn.disabled = false;
    btn.innerHTML = text;
}
