// Help Page JavaScript

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Help page loaded');
    initializeHelpPage();
});

function initializeHelpPage() {
    updateHeaderButtons();
    setupHelpSearch();
    setupFAQToggle();
    setupCategoryNavigation();
    loadWhatsAppStyles();
    highlightFromHash();
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

// Setup help search functionality
function setupHelpSearch() {
    const searchInput = document.getElementById('helpSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performHelpSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performHelpSearch();
            }
        });
        
        // Real-time search suggestions
        searchInput.addEventListener('input', showSearchSuggestions);
    }
}

// Perform help search
function performHelpSearch() {
    const searchInput = document.getElementById('helpSearch');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        clearSearchResults();
        return;
    }
    
    const results = searchHelpContent(query);
    displaySearchResults(results, query);
}

// Search through help content
function searchHelpContent(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    const results = [];
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
            const category = item.closest('.faq-category').querySelector('h2').textContent;
            results.push({
                question: item.querySelector('.faq-question').textContent,
                answer: answer.substring(0, 200) + '...',
                category: category,
                element: item,
                relevance: question.includes(query) ? 2 : 1
            });
        }
    });
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, 5); // Show top 5 results
}

// Display search results
function displaySearchResults(results, query) {
    // Remove existing results
    clearSearchResults();
    
    if (results.length === 0) {
        showNoResults(query);
        return;
    }
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results active';
    resultsContainer.innerHTML = `
        <div class="container">
            <h3>Search Results for "${query}" (${results.length} found)</h3>
            <div class="search-results-list">
                ${results.map(result => `
                    <div class="search-result-item" onclick="scrollToFAQ('${result.question}')">
                        <div class="search-result-title">${highlightQuery(result.question, query)}</div>
                        <div class="search-result-snippet">${highlightQuery(result.answer, query)}</div>
                        <div class="search-result-category">${result.category}</div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn--outline" onclick="clearSearchResults()" style="margin: 1rem auto; display: block;">Clear Search</button>
        </div>
    `;
    
    const heroSection = document.querySelector('.hero-help');
    heroSection.insertAdjacentElement('afterend', resultsContainer);
}

// Highlight search query in text
function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #fef3c7; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// Show no results message
function showNoResults(query) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results active';
    resultsContainer.innerHTML = `
        <div class="container">
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>No results found for "${query}"</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">Try different keywords or browse our help categories below.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="search-tag" onclick="searchTopic('posting items')">Posting Items</button>
                    <button class="search-tag" onclick="searchTopic('safety')">Safety</button>
                    <button class="search-tag" onclick="searchTopic('payments')">Payments</button>
                    <button class="search-tag" onclick="searchTopic('account')">Account</button>
                </div>
                <button class="btn btn--outline" onclick="clearSearchResults()" style="margin-top: 1rem;">Clear Search</button>
            </div>
        </div>
    `;
    
    const heroSection = document.querySelector('.hero-help');
    heroSection.insertAdjacentElement('afterend', resultsContainer);
}

// Clear search results
function clearSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.remove();
    }
    
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Search for specific topics
function searchTopic(topic) {
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        searchInput.value = topic;
        performHelpSearch();
    }
}

// Show search suggestions
function showSearchSuggestions(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    const suggestions = [
        'posting items', 'safety tips', 'payments', 'account settings',
        'edit listing', 'delete account', 'whatsapp', 'images upload',
        'contact seller', 'pricing', 'categories', 'troubleshooting'
    ].filter(s => s.includes(query));
    
    if (suggestions.length > 0) {
        showSuggestionList(suggestions.slice(0, 5));
    } else {
        hideSuggestions();
    }
}

// Setup FAQ toggle functionality
function setupFAQToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
    });
}

// Toggle FAQ item
function toggleFAQ(questionElement) {
    const answer = questionElement.nextElementSibling;
    const toggle = questionElement.querySelector('.faq-toggle');
    
    // Close other open FAQs in the same category
    const category = questionElement.closest('.faq-category');
    const otherQuestions = category.querySelectorAll('.faq-question');
    otherQuestions.forEach(otherQ => {
        if (otherQ !== questionElement && otherQ.classList.contains('active')) {
            const otherAnswer = otherQ.nextElementSibling;
            const otherToggle = otherQ.querySelector('.faq-toggle');
            
            otherQ.classList.remove('active');
            otherAnswer.classList.remove('active');
            otherToggle.textContent = '+';
        }
    });
    
    // Toggle current FAQ
    if (questionElement.classList.contains('active')) {
        questionElement.classList.remove('active');
        answer.classList.remove('active');
        toggle.textContent = '+';
    } else {
        questionElement.classList.add('active');
        answer.classList.add('active');
        toggle.textContent = '−';
    }
}

// Setup category navigation
function setupCategoryNavigation() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            scrollToSection(category);
        });
    });
}

// Scroll to specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight section briefly
        section.style.background = 'rgba(59, 130, 246, 0.05)';
        setTimeout(() => {
            section.style.background = '';
        }, 2000);
    }
}

// Scroll to specific FAQ
function scrollToFAQ(questionText) {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const targetQuestion = Array.from(faqQuestions).find(q => 
        q.textContent.trim().includes(questionText.trim())
    );
    
    if (targetQuestion) {
        // Clear search results
        clearSearchResults();
        
        // Scroll to FAQ
        targetQuestion.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Open the FAQ
        setTimeout(() => {
            if (!targetQuestion.classList.contains('active')) {
                toggleFAQ(targetQuestion);
            }
            
            // Highlight briefly
            const faqItem = targetQuestion.closest('.faq-item');
            faqItem.style.background = 'rgba(16, 185, 129, 0.1)';
            faqItem.style.border = '2px solid #10b981';
            
            setTimeout(() => {
                faqItem.style.background = '';
                faqItem.style.border = '1px solid #e5e7eb';
            }, 3000);
        }, 500);
    }
}

// Highlight section from URL hash
function highlightFromHash() {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
            scrollToSection(sectionId);
        }, 500);
    }
}

// WhatsApp Support Integration
function contactWhatsAppSupport() {
    const message = encodeURIComponent(`Hi! I need help with MoveOut Market.

I couldn't find the answer I was looking for in the help center. Could you please assist me?

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
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .suggestion-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.2s;
        }
        
        .suggestion-item:hover {
            background: #f8fafc;
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
        
        .search-result-category {
            font-size: 0.75rem;
            color: #10b981;
            margin-top: 0.25rem;
            font-weight: 500;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
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
    
    // Add hover effects
    const menuItems = menu.querySelectorAll('.user-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.background = '#f3f4f6');
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');
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
        localStorage.removeUser('rememberLogin');
        window.location.reload();
    }
}

// Toast notification
function showToast(message, type = 'info', duration = 3000) {
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

// Add keyboard navigation for FAQs
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        clearSearchResults();
    }
});

// Scroll progress indicator for long FAQ sections
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: #10b981;
        z-index: 1001;
        transition: width 0.2s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Initialize scroll progress on load
setTimeout(addScrollProgress, 1000);

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