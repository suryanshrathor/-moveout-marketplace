// About Page JavaScript

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('About page loaded');
    initializeAboutPage();
});

function initializeAboutPage() {
    updateHeaderButtons();
    animateStatsOnScroll();
    setupTeamInteractions();
    setupTimelineAnimations();
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

// Show user dropdown menu
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
        <div class="user-menu-item" onclick="window.location.href='index.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">🏠 Homepage</div>
        <div class="user-menu-item" onclick="window.location.href='post-item.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">📦 Post Item</div>
        <div class="user-menu-item" onclick="window.location.href='my-items.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">📋 My Items</div>
        <div class="user-menu-item" onclick="window.location.href='profile.html'" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">👤 Profile</div>
        <div class="user-menu-item logout" onclick="logout()" style="padding: 0.75rem 1rem; cursor: pointer; color: #ef4444; transition: background 0.2s;">🚪 Logout</div>
    `;
    
    // Add hover effects
    const menuItems = menu.querySelectorAll('.user-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f3f4f6';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
        });
    });
    
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

// Animate stats numbers when they come into view
function animateStatsOnScroll() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateStatNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    
    if (number > 0) {
        let current = 0;
        const increment = Math.ceil(number / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString() + suffix;
        }, 40);
    }
}

// Setup team member interactions
function setupTeamInteractions() {
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Setup timeline animations
function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// Smooth scroll to sections (for any internal links)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add some interactive effects to cards
document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero-about');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add stagger animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Add hover sound effect (optional - can be removed)
    const interactiveElements = document.querySelectorAll('.mv-card, .feature-card, .team-card, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Small scale effect
            element.style.transition = 'all 0.3s ease';
        });
    });
});

// Toast notification function (if needed)
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
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

// Add CSS for animations if not already present
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
    
    .mv-card:hover,
    .feature-card:hover,
    .team-card:hover {
        cursor: default;
    }
`;
document.head.appendChild(style);

// Utility functions
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}