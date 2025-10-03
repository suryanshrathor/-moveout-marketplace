// Updated auth.js - Remove Google login functionality

// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    hideGoogleLogin(); // Hide Google login buttons
});

function hideGoogleLogin() {
    // Hide Google login buttons since they're not implemented
    const googleButtons = document.querySelectorAll('.social-btn');
    googleButtons.forEach(btn => {
        if (btn.textContent.includes('Google')) {
            btn.style.display = 'none';
        }
    });
    
    // Also hide the "or" divider
    const dividers = document.querySelectorAll('.auth-divider');
    dividers.forEach(divider => {
        divider.style.display = 'none';
    });
}

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginForm(loginForm);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        setupRegisterForm(registerForm);
    }
    
    // Password toggles
    setupPasswordToggles();
}

function setupLoginForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateLoginForm(email, password)) {
            return;
        }
        
        // Simulate login process
        showLoading(form);
        
        setTimeout(() => {
            // Check credentials (in real app, this would be an API call)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            hideLoading(form);
            
            if (user) {
                // Login successful
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (remember) {
                    localStorage.setItem('rememberLogin', 'true');
                }
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // Try with demo account
                if (email === 'demo@moveout.com' && password === 'demo123') {
                    const demoUser = {
                        id: 1,
                        firstName: 'Demo',
                        lastName: 'User',
                        email: 'demo@moveout.com',
                        phone: '+91-9999999999',
                        location: 'Bangalore'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(demoUser));
                    showSuccess('Demo login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showError('emailError', 'Invalid email or password. Try demo@moveout.com / demo123');
                }
            }
        }, 1000);
    });
}

function setupRegisterForm(form) {
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            terms: formData.get('terms'),
            newsletter: formData.get('newsletter')
        };
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateRegisterForm(userData)) {
            return;
        }
        
        // Simulate registration process
        showLoading(form);
        
        setTimeout(() => {
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.email === userData.email);
            
            hideLoading(form);
            
            if (existingUser) {
                showError('regEmailError', 'An account with this email already exists');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                location: userData.location,
                password: userData.password, // In real app, this would be hashed
                newsletter: userData.newsletter,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            showRegistrationSuccess();
        }, 1500);
    });
}

function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                eyeIcon.textContent = '👁️';
            }
        });
    });
}

// Validation functions
function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm(userData) {
    let isValid = true;
    
    // First name validation
    if (!userData.firstName.trim()) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    }
    
    // Last name validation
    if (!userData.lastName.trim()) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    }
    
    // Email validation
    if (!userData.email) {
        showError('regEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(userData.email)) {
        showError('regEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!userData.phone) {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(userData.phone)) {
        showError('phoneError', 'Please enter a valid Indian phone number');
        isValid = false;
    }
    
    // Location validation
    if (!userData.location) {
        showError('locationError', 'Please select your city');
        isValid = false;
    }
    
    // Password validation
    if (!userData.password) {
        showError('regPasswordError', 'Password is required');
        isValid = false;
    } else if (!isStrongPassword(userData.password)) {
        showError('regPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
        isValid = false;
    }
    
    // Confirm password validation
    if (userData.password !== userData.confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms validation
    if (!userData.terms) {
        showError('termsError', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
    } else {
        clearError('confirmPasswordError');
    }
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = calculatePasswordStrength(password);
    
    // Update strength bar
    strengthBar.style.width = `${strength.percentage}%`;
    strengthBar.style.background = strength.color;
    
    // Update strength text
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
    
    if (score < 25) {
        return { percentage: score, color: '#ef4444', text: 'Weak' };
    } else if (score < 50) {
        return { percentage: score, color: '#f59e0b', text: 'Fair' };
    } else if (score < 75) {
        return { percentage: score, color: '#3b82f6', text: 'Good' };
    } else {
        return { percentage: score, color: '#10b981', text: 'Strong' };
    }
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Indian phone number validation
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
    return password.length >= 8 && strongRegex.test(password);
}

// UI helper functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
}

function hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = form.id === 'loginForm' ? 'Sign In' : 'Create Account';
    }
}

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showRegistrationSuccess() {
    const successMessage = document.getElementById('successMessage');
    const authCard = document.querySelector('.auth-card');
    
    if (successMessage && authCard) {
        authCard.style.display = 'none';
        successMessage.style.display = 'block';
    }
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyles);