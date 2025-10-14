// Common JavaScript Functions for About, Contact, and Help pages

// Initialize common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    setupCommonFunctionality();
});

function setupCommonFunctionality() {
    setupHeaderInteractions();
    setupNavigation();
    setupScrollEffects();
    setupFooterLinks();
}

// Header interactions
function setupHeaderInteractions() {
    // Mobile menu toggle if needed
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Add scroll effect to header
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        }
    });
}

// Navigation active state
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll effects
function setupScrollEffects() {
    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `all 0.8s ease ${index * 0.1}s`;
        observer.observe(section);
    });
}

// Footer links
function setupFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal anchors
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && mobileMenuBtn) {
        nav.classList.toggle('nav--open');
        mobileMenuBtn.classList.toggle('menu-btn--open');
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.onclick = scrollToTop;
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
        scrollBtn.style.background = '#1d4ed8';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
        scrollBtn.style.background = '#3b82f6';
    });
}

// Initialize scroll to top button
setTimeout(addScrollToTopButton, 1000);

// Page loading animation
function showPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">📦 MoveOut Market</div>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeOut 0.5s ease 2s forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .loader-content {
            text-align: center;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        .loader-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: #3b82f6;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; visibility: visible; }
            100% { opacity: 0; visibility: hidden; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Remove loader after animation
    setTimeout(() => {
        if (loader.parentNode) {
            loader.remove();
        }
    }, 2500);
}

// Show loading animation
// showPageLoader(); // Uncomment to enable page loader

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        document.title = '💼 Come back - MoveOut Market';
    } else {
        // Page is visible
        const pageTitles = {
            'about.html': 'About Us - MoveOut Market',
            'contact.html': 'Contact Us - MoveOut Market',
            'help.html': 'Help & Support - MoveOut Market'
        };
        
        const currentPage = window.location.pathname.split('/').pop();
        document.title = pageTitles[currentPage] || 'MoveOut Market';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search (on help page)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const searchInput = document.getElementById('helpSearch');
        if (searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    }
    
    // Escape key to close modals/dropdowns
    if (e.key === 'Escape') {
        // Close user menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.remove();
        }
        
        // Close any modals
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.remove();
        });
        
        // Clear search results
        if (typeof clearSearchResults === 'function') {
            clearSearchResults();
        }
    }
});

// Add performance optimization
function optimizePagePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Prefetch important pages
    const importantPages = ['index.html', 'post-item.html', 'login.html'];
    importantPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
setTimeout(optimizePagePerformance, 3000);

// Add error boundary for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('Page error:', e.error);
    
    // Show user-friendly error message
    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fef2f2;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border: 1px solid #fecaca;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 10000;
        max-width: 90%;
    `;
    errorToast.textContent = 'Something went wrong. Please refresh the page.';
    
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
        errorToast.remove();
    }, 5000);
});

// Analytics and tracking (placeholder)
function trackPageView() {
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    console.log('Page view:', pageData);
    
    // Here you would send data to your analytics service
    // Example: analytics.track('page_view', pageData);
}

// Track page view
setTimeout(trackPageView, 1000);

// Add accessibility improvements
function improveAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.textContent = 'Skip to main content';
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('main') || 
                       document.querySelector('.container') || 
                       document.body;
    
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // Improve focus visibility
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        *:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(focusStyle);
}

// Initialize accessibility improvements
setTimeout(improveAccessibility, 500);

// Export common utility functions for other scripts
window.commonUtils = {
    showToast: function(message, type = 'info', duration = 3000) {
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
    },
    
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    },
    
    getCurrentUser: function() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

console.log('Common utilities loaded successfully');