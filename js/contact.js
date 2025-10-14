// Contact Page JavaScript

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page loaded');
    initializeContactPage();
});

function initializeContactPage() {
    updateHeaderButtons();
    setupContactForm();
    setupFormValidation();
    setupCharacterCounter();
    loadWhatsAppStyles();
}

// Update header buttons based on login status
function updateHeaderButtons() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (currentUser) {
        // User is logged in
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (registerBtn) {
            registerBtn.textContent = `Hi, ${currentUser.firstName}`;
            registerBtn.className = 'btn btn--secondary';
            registerBtn.onclick = () => showUserMenu();
        }
        
        // Pre-fill form with user data
        prefillUserData(currentUser);
    } else {
        // User is not logged in - keep original functionality
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = 'register.html';
            });
        }
    }
}

// Pre-fill form with user data if logged in
function prefillUserData(user) {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (firstName) firstName.value = user.firstName || '';
    if (lastName) lastName.value = user.lastName || '';
    if (email) email.value = user.email || '';
    if (phone) phone.value = user.phone || '';
}

// Setup contact form submission
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateContactForm()) {
        return;
    }
    
    const formData = collectFormData();
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = '⏳ Sending...';
    submitButton.disabled = true;
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
        updateCharacterCounter();
        
        // Clear any errors
        clearAllErrors();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Collect form data
function collectFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };
}

// Simulate form submission (replace with actual API)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Store locally for now (replace with API call)
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.unshift({ ...formData, id: Date.now() });
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            console.log('Form submitted:', formData);
            resolve();
        }, 2000);
    });
}

// Show success message
function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'modal-overlay';
    successModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="success-icon" style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: #10b981; margin-bottom: 1rem;">Message Sent Successfully!</h2>
            <p style="color: #666; margin-bottom: 2rem;">Thank you for contacting us. We'll get back to you within 24 hours.</p>
            <button class="btn btn--primary" onclick="closeSuccessModal()">Continue</button>
        </div>
    `;
    
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(successModal);
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Setup form validation
function setupFormValidation() {
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => clearFieldError(fieldId));
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmail);
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', validatePhone);
    }
}

// Validate individual field
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showFieldError(fieldId, 'This field is required');
                return false;
            } else if (value.length < 2) {
                showFieldError(fieldId, 'Must be at least 2 characters');
                return false;
            }
            break;
            
        case 'subject':
            if (!value) {
                showFieldError(fieldId, 'Please select a subject');
                return false;
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(fieldId, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showFieldError(fieldId, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }
    
    clearFieldError(fieldId);
    return true;
}

// Validate email
function validateEmail() {
    const emailField = document.getElementById('email');
    const email = emailField.value.trim();
    
    if (!email) {
        showFieldError('email', 'Email is required');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError('email');
    return true;
}

// Validate phone
function validatePhone() {
    const phoneField = document.getElementById('phone');
    const phone = phoneField.value.trim();
    
    if (phone && !isValidPhoneNumber(phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError('phone');
    return true;
}

// Check if phone number is valid
function isValidPhoneNumber(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// Validate entire form
function validateContactForm() {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    // Validate email
    if (!validateEmail()) {
        isValid = false;
    }
    
    // Validate phone if provided
    if (!validatePhone()) {
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#ef4444';
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#d1d5db';
    }
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
    
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.style.borderColor = '#d1d5db';
    });
}

// Setup character counter for message field
function setupCharacterCounter() {
    const messageField = document.getElementById('message');
    const messageCount = document.getElementById('messageCount');
    
    if (messageField && messageCount) {
        messageField.addEventListener('input', updateCharacterCounter);
        updateCharacterCounter(); // Initialize
    }
}

function updateCharacterCounter() {
    const messageField = document.getElementById('message');
    const messageCount = document.getElementById('messageCount');
    
    if (messageField && messageCount) {
        const currentLength = messageField.value.length;
        const maxLength = 1000;
        
        messageCount.textContent = currentLength;
        
        // Change color based on length
        if (currentLength > maxLength * 0.9) {
            messageCount.style.color = '#ef4444';
        } else if (currentLength > maxLength * 0.8) {
            messageCount.style.color = '#f59e0b';
        } else {
            messageCount.style.color = '#6b7280';
        }
    }
}

// WhatsApp Support Integration
function contactWhatsAppSupport() {
    const message = encodeURIComponent(`Hi! I need help with MoveOut Market. 

I'm contacting support regarding: [Please describe your issue]

Thank you!`);
    
    const whatsappURL = `https://web.whatsapp.com/send?phone=810987654321&text=${message}`;
    window.open(whatsappURL, '_blank');
    
    showToast('Opening WhatsApp support chat...', 'success');
}

// Load WhatsApp styles
function loadWhatsAppStyles() {
    const whatsappStyles = `
        .whatsapp-btn {
            background: #25d366;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .whatsapp-btn:hover {
            background: #128c7e;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
            color: white;
            text-decoration: none;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideInUp 0.3s ease;
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
}

// Google Maps integration
function openGoogleMaps() {
    const address = encodeURIComponent('Electronic City, Bangalore, Karnataka 560100');
    const mapsURL = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(mapsURL, '_blank');
}

// User menu functionality
function showUserMenu() {
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: fixed;
        top: 70px;
        right: 1rem;
        z-index: 1000;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        min-width: 150px;
        overflow: hidden;
    `;
    
    menu.innerHTML = `
        <div class="user-menu-item" onclick="window.location.href='index.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">🏠 Homepage</div>
        <div class="user-menu-item" onclick="window.location.href='post-item.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">📦 Post Item</div>
        <div class="user-menu-item" onclick="window.location.href='my-items.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">📋 My Items</div>
        <div class="user-menu-item" onclick="window.location.href='profile.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">👤 Profile</div>
        <div class="user-menu-item logout" onclick="logout()" style="padding: 0.75rem 1rem; cursor: pointer; color: #ef4444;">🚪 Logout</div>
    `;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu);
    }, 100);
}

function closeUserMenu(e) {
    const menu = document.querySelector('.user-menu');
    const registerBtn = document.getElementById('registerBtn');
    
    if (menu && !menu.contains(e.target) && !registerBtn.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeUserMenu);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        window.location.reload();
    }
}

// Toast notification
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Utility functions
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);