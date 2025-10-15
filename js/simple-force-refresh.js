// SIMPLE FORCE REFRESH NAVIGATION - Add this to each page
// Add to homepage.js, about.js, contact.js, help.js

// Method 1: Simple Link Override (Recommended)
function forceRefreshOnNavigation() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Get all navigation links
        const navLinks = document.querySelectorAll('a[href$=".html"]');
        
        navLinks.forEach(link => {
            const originalHref = link.getAttribute('href');
            
            // Skip external links
            if (originalHref.startsWith('http')) return;
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add visual feedback
                this.style.opacity = '0.6';
                
                // Force reload with cache busting
                setTimeout(() => {
                    window.location.href = originalHref + '?t=' + Date.now();
                }, 100);
            });
        });
    }, 500);
}

// Method 2: Override Navigation Functions
function overrideNavigationFunctions() {
    // Home
    window.goToHome = () => {
        window.location.href = 'index.html?t=' + Date.now();
    };
    
    // About  
    window.goToAbout = () => {
        window.location.href = 'about.html?t=' + Date.now();
    };
    
    // Contact
    window.goToContact = () => {
        window.location.href = 'contact.html?t=' + Date.now();
    };
    
    // Help
    window.goToHelp = () => {
        window.location.href = 'help.html?t=' + Date.now();
    };
    
    // Post Item
    window.goToPostItem = () => {
        window.location.href = 'post-item.html?t=' + Date.now();
    };
    
    // My Items
    window.goToMyItems = () => {
        window.location.href = 'my-items.html?t=' + Date.now();
    };
}

// Method 3: Fix User Menu Navigation
function fixUserMenuNavigation() {
    // Override the showUserMenu function to use refresh navigation
    const originalShowUserMenu = window.showUserMenu;
    
    window.showUserMenu = function() {
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
            min-width: 180px;
            overflow: hidden;
        `;
        
        const currentUser = getCurrentUser();
        
        menu.innerHTML = `
            <div class="user-menu-item" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
                🏠 Homepage
            </div>
            <div class="user-menu-item" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
                📦 Post Item
            </div>
            <div class="user-menu-item" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
                📋 My Items
            </div>
            <div class="user-menu-item" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
                👤 Profile
            </div>
            <div class="user-menu-item logout" style="padding: 0.75rem 1rem; cursor: pointer; color: #ef4444;">
                🚪 Logout
            </div>
        `;
        
        // Add click handlers with forced refresh
        const menuItems = menu.querySelectorAll('.user-menu-item');
        menuItems[0].onclick = () => goToHome();
        menuItems[1].onclick = () => goToPostItem();
        menuItems[2].onclick = () => goToMyItems();
        menuItems[3].onclick = () => goToProfile();
        menuItems[4].onclick = () => logout();
        
        // Add hover effects
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => item.style.background = '#f3f4f6');
            item.addEventListener('mouseleave', () => item.style.background = 'transparent');
        });
        
        document.body.appendChild(menu);
        
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !document.getElementById('registerBtn').contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    };
}

// Method 4: Header Button Navigation
function fixHeaderButtonNavigation() {
    setTimeout(() => {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.onclick = () => {
                window.location.href = 'login.html?t=' + Date.now();
            };
        }
        
        // Register button (when not logged in)
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn && registerBtn.textContent === 'Sign Up') {
            registerBtn.onclick = () => {
                window.location.href = 'register.html?t=' + Date.now();
            };
        }
        
        // Post Item button
        const postItemBtn = document.getElementById('postItemBtn');
        if (postItemBtn) {
            postItemBtn.onclick = () => {
                if (isLoggedIn()) {
                    window.location.href = 'post-item.html?t=' + Date.now();
                } else {
                    window.location.href = 'login.html?t=' + Date.now();
                }
            };
        }
    }, 1000);
}

// Method 5: Disable Browser Cache
function disableBrowserCache() {
    // Add cache control meta tags
    const head = document.head;
    
    const metaTags = [
        { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { httpEquiv: 'Pragma', content: 'no-cache' },
        { httpEquiv: 'Expires', content: '0' }
    ];
    
    metaTags.forEach(tagData => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', tagData.httpEquiv);
        meta.setAttribute('content', tagData.content);
        head.appendChild(meta);
    });
}

// Method 6: Force Refresh on Page Load (if from cache)
function forceRefreshFromCache() {
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('Page loaded from cache, forcing refresh');
            window.location.reload(true);
        }
    });
}

// Initialize all refresh methods
function initForceRefresh() {
    console.log('Initializing force refresh navigation');
    
    // Apply all methods
    forceRefreshOnNavigation();
    overrideNavigationFunctions();
    fixUserMenuNavigation();
    fixHeaderButtonNavigation();
    disableBrowserCache();
    forceRefreshFromCache();
    
    console.log('Force refresh navigation initialized');
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForceRefresh);
} else {
    initForceRefresh();
}

// Test function
window.testNavigation = function() {
    console.log('Testing navigation...');
    setTimeout(() => {
        console.log('Navigating to about page...');
        goToAbout();
    }, 2000);
};

console.log('✅ Force refresh navigation loaded - Pages will now refresh on navigation');