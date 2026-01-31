/**
 * AxiomTrak Dashboard Module
 * Framework: Zero Uncertainty / Advocacy & Editing
 */

export function initDashboard() {
    console.log('Dashboard initialized');

    // --- 1. Проверка авторизации (Security Check) ---
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // --- 2. Элементы DOM ---
    const logoutBtn = document.getElementById('logoutBtn');
    const addCompanyBtn = document.getElementById('addCompanyBtn');
    const companyModal = document.getElementById('companyModal');
    const closeModal = document.getElementById('closeModal');
    const companyForm = document.getElementById('companyForm');
    const generateButton = document.getElementById('generateButton');
    
    // Элементы статуса в модальном окне
    const companyError = document.getElementById('companyError');
    const companySuccess = document.getElementById('companySuccess');
    const saveCompanyButton = document.getElementById('saveCompanyBtn');

    // --- 3. Логика Logout ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
        });
    }

    // --- 4. Управление модальным окном ---
    if (addCompanyBtn && companyModal) {
        addCompanyBtn.addEventListener('click', () => {
            companyModal.classList.remove('hidden');
            companyError.classList.add('hidden');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            companyModal.classList.add('hidden');
        });
    }

    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === companyModal) {
            companyModal.classList.add('hidden');
        }
    });

    // --- 5. Сохранение данных компании (API Integration) ---
    if (companyForm) {
        companyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            companyError.classList.add('hidden');
            companySuccess.classList.add('hidden');
            saveCompanyButton.disabled = true;
            saveCompanyButton.textContent = 'Saving...';

            const companyData = {
                name: document.getElementById('companyName').value,
                reg_number: document.getElementById('regNumber').value
            };

            try {
                const response = await fetch('https://api.axiomtrak.com/api/v1/companies/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(companyData)
                });

                if (response.ok) {
                    companySuccess.classList.remove('hidden');
                    
                    // Активируем кнопку генерации отчета после успеха
                    if (generateButton) generateButton.disabled = false;
                    
                    // Закрываем модалку через паузу, чтобы пользователь увидел успех
                    setTimeout(() => {
                        companyModal.classList.add('hidden');
                        companyForm.reset();
                        companySuccess.classList.add('hidden');
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to save company details');
                }
            } catch (error) {
                console.error('Company API Error:', error);
                companyError.textContent = `Error: ${error.message}`;
                companyError.classList.remove('hidden');
            } finally {
                saveCompanyButton.disabled = false;
                saveCompanyButton.textContent = 'Save Company Details';
            }
        });
    }

    // --- 6. Генерация отчета (Advocacy Logic) ---
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            console.log('Generating Zero Uncertainty Report...');
            // Здесь будет логика вызова PDF-генератора или перехода к отчету
            alert('Report generation started. This feature is being finalized.');
        });
    }
}
