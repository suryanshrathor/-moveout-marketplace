// CORRECTED NAVIGATION JAVASCRIPT
// Add this to your about.js or create a separate nav.js file

// Enhanced navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    setupCorrectedNavigation();
});

function setupCorrectedNavigation() {
    setupScrollEffect();
    setupMobileMenu();
    setupActiveNavigation();
    setupUserMenuEnhanced();
}

// Add scroll effect to header
function setupScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            // Hide/show header on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Create mobile menu button if it doesn't exist
    let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenuBtn) {
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
        
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(mobileMenuBtn);
        }
    }
    
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            const isOpen = nav.classList.contains('nav--open');
            
            mobileMenuBtn.innerHTML = isOpen ? '✕' : '☰';
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });
        
        // Close mobile menu when clicking nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('nav--open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Setup active navigation highlighting
function setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Map of page names to nav links
    const pageMap = {
        'index.html': 'Home',
        'about.html': 'About',
        'contact.html': 'Contact',
        'help.html': 'Help'
    };
    
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        const href = link.getAttribute('href');
        
        // Remove existing active class
        link.classList.remove('active');
        
        // Add active class to current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            pageMap[currentPage] === linkText) {
            link.classList.add('active');
        }
    });
}

// Enhanced user menu functionality
function setupUserMenuEnhanced() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (currentUser) {
        // User is logged in - update header
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        if (registerBtn) {
            registerBtn.textContent = `Hi, ${currentUser.firstName}`;
            registerBtn.className = 'btn btn--secondary';
            registerBtn.onclick = () => showEnhancedUserMenu();
            
            // Add user avatar if available
            if (currentUser.avatar) {
                const avatar = document.createElement('div');
                avatar.style.cssText = `
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: url(${currentUser.avatar}) center/cover;
                    margin-right: 0.5rem;
                `;
                registerBtn.insertBefore(avatar, registerBtn.firstChild);
            } else {
                // Add default avatar emoji
                registerBtn.innerHTML = `👤 Hi, ${currentUser.firstName}`;
            }
        }
    } else {
        // User not logged in - setup login/register buttons
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

// Enhanced user menu dropdown
function showEnhancedUserMenu() {
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const currentUser = getCurrentUser();
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    
    const menuItems = [
        { icon: '🏠', label: 'Homepage', action: () => window.location.href = 'index.html' },
        { icon: '📦', label: 'Post Item', action: () => window.location.href = 'post-item.html' },
        { icon: '📋', label: 'My Items', action: () => window.location.href = 'my-items.html' },
        { icon: '👤', label: 'Profile', action: () => window.location.href = 'profile.html' },
        // { icon: '⚙️', label: 'Settings', action: () => window.location.href = 'settings.html' },
        { type: 'divider' },
        { icon: '❓', label: 'Help & Support', action: () => window.location.href = 'help.html' },
        { icon: '💬', label: 'WhatsApp Support', action: () => contactWhatsAppSupport() },
        { type: 'divider' },
        { icon: '🚪', label: 'Logout', action: () => logout(), className: 'logout' }
    ];
    
    menu.innerHTML = menuItems.map(item => {
        if (item.type === 'divider') {
            return '<div class="user-menu-divider"></div>';
        }
        
        return `
            <div class="user-menu-item ${item.className || ''}" data-action="${menuItems.indexOf(item)}">
                ${item.icon} ${item.label}
            </div>
        `;
    }).join('');
    
    // Add event listeners
    menu.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.user-menu-item');
        if (menuItem && menuItem.dataset.action) {
            const actionIndex = parseInt(menuItem.dataset.action);
            const item = menuItems[actionIndex];
            if (item && item.action) {
                item.action();
            }
        }
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeEnhancedUserMenu, { once: true });
    }, 100);
}

function closeEnhancedUserMenu(e) {
    const menu = document.querySelector('.user-menu');
    const registerBtn = document.getElementById('registerBtn');
    
    if (menu && !menu.contains(e.target) && !registerBtn.contains(e.target)) {
        menu.remove();
    } else if (menu) {
        // Re-add listener if menu is still open
        setTimeout(() => {
            document.addEventListener('click', closeEnhancedUserMenu, { once: true });
        }, 100);
    }
}

// WhatsApp support function
function contactWhatsAppSupport() {
    const message = encodeURIComponent(`Hi! I need help with MoveOut Market.

I'm contacting support from the About page.

Thank you!`);
    
    const whatsappURL = `https://web.whatsapp.com/send?phone=810987654321&text=${message}`;
    window.open(whatsappURL, '_blank');
    
    showToast('Opening WhatsApp support...', 'success');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        
        // Show logout message
        showToast('Logged out successfully', 'success');
        
        // Refresh page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
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
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Utility functions
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key to close user menu
    if (e.key === 'Escape') {
        const menu = document.querySelector('.user-menu');
        if (menu) {
            menu.remove();
        }
    }
    
    // Alt + H for homepage
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
    
    // Alt + A for about
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        window.location.href = 'about.html';
    }
});

// Add CSS animations if not already present
if (!document.getElementById('navAnimations')) {
    const style = document.createElement('style');
    style.id = 'navAnimations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .header {
            transition: transform 0.3s ease, background 0.3s ease;
        }
        
        .nav-link {
            position: relative;
            overflow: hidden;
        }
        
        .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.5s;
        }
        
        .nav-link:hover::before {
            left: 100%;
        }
    `;
    document.head.appendChild(style);
}

console.log('Enhanced navigation loaded successfully');