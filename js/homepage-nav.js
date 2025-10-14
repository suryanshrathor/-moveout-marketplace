// HOMEPAGE NAVIGATION WITH ENHANCED SEARCH FUNCTIONALITY
// Enhanced search and navigation for index.html

document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage navigation loaded');
    initializeHomepageNavigation();
});

function initializeHomepageNavigation() {
    setupHeaderSearch();
    setupAdvancedSearch();
    setupSearchSuggestions();
    setupFilterHandlers();
    setupNavigationEffects();
    setupUserInterface();
    loadInitialItems();
}

// Enhanced header search functionality
function setupHeaderSearch() {
    const searchInput = document.getElementById('headerSearchInput');
    const searchBtn = document.getElementById('headerSearchBtn');
    
    if (searchInput && searchBtn) {
        // Search button click
        searchBtn.addEventListener('click', performHeaderSearch);
        
        // Enter key search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performHeaderSearch();
            }
        });
        
        // Real-time search suggestions
        searchInput.addEventListener('input', debounce(showSearchSuggestions, 300));
        
        // Clear suggestions when input loses focus
        searchInput.addEventListener('blur', function() {
            setTimeout(() => hideSuggestions(), 200);
        });
        
        // Focus effects
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
}

// Perform header search
function performHeaderSearch() {
    const searchInput = document.getElementById('headerSearchInput');
    const categoryFilter = document.getElementById('headerCategoryFilter');
    const locationFilter = document.getElementById('headerLocationFilter');
    const conditionFilter = document.getElementById('headerConditionFilter');
    
    const searchParams = {
        query: searchInput.value.trim(),
        category: categoryFilter.value,
        location: locationFilter.value,
        condition: conditionFilter.value
    };
    
    console.log('Performing search:', searchParams);
    
    // Show loading state
    const searchBtn = document.getElementById('headerSearchBtn');
    const originalContent = searchBtn.innerHTML;
    searchBtn.innerHTML = '⏳';
    searchBtn.classList.add('search-loading');
    
    // Simulate search (replace with actual search logic)
    setTimeout(() => {
        executeSearch(searchParams);
        
        // Reset button
        searchBtn.innerHTML = originalContent;
        searchBtn.classList.remove('search-loading');
        
        // Hide suggestions
        hideSuggestions();
        
        // Show search results notification
        showSearchNotification(searchParams);
    }, 1000);
}

// Execute search with parameters
function executeSearch(params) {
    const items = getStoredItems();
    let filteredItems = items;
    
    // Filter by search query
    if (params.query) {
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(params.query.toLowerCase()) ||
            item.description.toLowerCase().includes(params.query.toLowerCase())
        );
    }
    
    // Filter by category
    if (params.category) {
        filteredItems = filteredItems.filter(item => item.category === params.category);
    }
    
    // Filter by location
    if (params.location) {
        filteredItems = filteredItems.filter(item => item.location === params.location);
    }
    
    // Filter by condition
    if (params.condition) {
        filteredItems = filteredItems.filter(item => item.condition === params.condition);
    }
    
    // Display results
    displaySearchResults(filteredItems, params);
    
    // Scroll to results
    const itemsSection = document.querySelector('.featured-items');
    if (itemsSection) {
        itemsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show search suggestions
function showSearchSuggestions() {
    const searchInput = document.getElementById('headerSearchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query || query.length < 2) {
        hideSuggestions();
        return;
    }
    
    const suggestions = generateSearchSuggestions(query);
    
    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}', '${suggestion.type}')">
                <div>${highlightMatch(suggestion.text, query)}</div>
                <div class="suggestion-category">${suggestion.category}</div>
            </div>
        `).join('');
        
        suggestionsContainer.classList.add('active');
    } else {
        hideSuggestions();
    }
}

// Generate search suggestions
function generateSearchSuggestions(query) {
    const items = getStoredItems();
    const suggestions = [];
    
    // Popular searches
    const popularSearches = [
        'laptop', 'furniture', 'books', 'phone', 'chair', 'table', 'microwave', 'clothes'
    ];
    
    // Add popular search suggestions
    popularSearches.forEach(term => {
        if (term.includes(query) && suggestions.length < 8) {
            suggestions.push({
                text: term,
                type: 'popular',
                category: '🔥 Popular'
            });
        }
    });
    
    // Add item-based suggestions
    const itemSuggestions = new Set();
    items.forEach(item => {
        if (suggestions.length >= 8) return;
        
        // Title matches
        if (item.title.toLowerCase().includes(query)) {
            const words = item.title.split(' ');
            words.forEach(word => {
                if (word.toLowerCase().includes(query) && !itemSuggestions.has(word.toLowerCase())) {
                    itemSuggestions.add(word.toLowerCase());
                    suggestions.push({
                        text: word,
                        type: 'item',
                        category: `📦 in ${item.category}`
                    });
                }
            });
        }
    });
    
    // Add category suggestions
    const categories = ['Electronics', 'Furniture', 'Appliances', 'Books', 'Clothing', 'Sports'];
    categories.forEach(category => {
        if (category.toLowerCase().includes(query) && suggestions.length < 8) {
            suggestions.push({
                text: category,
                type: 'category',
                category: '🏷️ Category'
            });
        }
    });
    
    return suggestions;
}

// Select a search suggestion
function selectSuggestion(text, type) {
    const searchInput = document.getElementById('headerSearchInput');
    searchInput.value = text;
    
    // If it's a category, also update the category filter
    if (type === 'category') {
        const categoryFilter = document.getElementById('headerCategoryFilter');
        categoryFilter.value = text;
    }
    
    hideSuggestions();
    performHeaderSearch();
}

// Highlight matching text in suggestions
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #3b82f6; color: white; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// Hide search suggestions
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
}

// Setup advanced search functionality
function setupAdvancedSearch() {
    const advancedToggle = document.getElementById('advancedSearchToggle');
    const advancedPanel = document.getElementById('advancedSearchPanel');
    const applyBtn = document.getElementById('applyAdvancedFilters');
    const clearBtn = document.getElementById('clearAdvancedFilters');
    
    if (advancedToggle && advancedPanel) {
        advancedToggle.addEventListener('click', function() {
            advancedPanel.classList.toggle('active');
            
            // Update button text
            const isOpen = advancedPanel.classList.contains('active');
            advancedToggle.innerHTML = isOpen ? '✕ Close' : '⚙️ Advanced';
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyAdvancedFilters);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAdvancedFilters);
    }
}

// Apply advanced filters
function applyAdvancedFilters() {
    const searchInput = document.getElementById('headerSearchInput');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const datePosted = document.getElementById('datePosted');
    const sortBy = document.getElementById('sortBy');
    const negotiableOnly = document.getElementById('negotiableOnly');
    
    const advancedParams = {
        query: searchInput.value.trim(),
        category: document.getElementById('headerCategoryFilter').value,
        location: document.getElementById('headerLocationFilter').value,
        condition: document.getElementById('headerConditionFilter').value,
        minPrice: minPrice.value ? parseFloat(minPrice.value) : null,
        maxPrice: maxPrice.value ? parseFloat(maxPrice.value) : null,
        datePosted: datePosted.value,
        sortBy: sortBy.value,
        negotiableOnly: negotiableOnly.value === 'yes'
    };
    
    console.log('Applying advanced filters:', advancedParams);
    executeAdvancedSearch(advancedParams);
    
    // Close advanced panel
    const advancedPanel = document.getElementById('advancedSearchPanel');
    const advancedToggle = document.getElementById('advancedSearchToggle');
    advancedPanel.classList.remove('active');
    advancedToggle.innerHTML = '⚙️ Advanced';
    
    showToast('Advanced filters applied', 'success');
}

// Execute advanced search
function executeAdvancedSearch(params) {
    let items = getStoredItems();
    
    // Apply all filters from basic search
    items = executeBasicFilters(items, params);
    
    // Apply price filters
    if (params.minPrice !== null) {
        items = items.filter(item => item.price >= params.minPrice);
    }
    
    if (params.maxPrice !== null) {
        items = items.filter(item => item.price <= params.maxPrice);
    }
    
    // Apply date filter
    if (params.datePosted) {
        const daysAgo = parseInt(params.datePosted);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        
        items = items.filter(item => {
            const itemDate = new Date(item.postedDate || Date.now());
            return itemDate >= cutoffDate;
        });
    }
    
    // Apply negotiable filter
    if (params.negotiableOnly) {
        items = items.filter(item => item.negotiable);
    }
    
    // Apply sorting
    items = sortItems(items, params.sortBy);
    
    displaySearchResults(items, params);
}

// Clear advanced filters
function clearAdvancedFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('datePosted').value = '';
    document.getElementById('sortBy').value = 'newest';
    document.getElementById('negotiableOnly').value = '';
    
    showToast('Advanced filters cleared', 'info');
}

// Setup filter change handlers
function setupFilterHandlers() {
    const filters = ['headerCategoryFilter', 'headerLocationFilter', 'headerConditionFilter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', function() {
                // Auto-search when filters change
                if (document.getElementById('headerSearchInput').value.trim() || this.value) {
                    setTimeout(performHeaderSearch, 300);
                }
            });
        }
    });
}

// Setup navigation effects
function setupNavigationEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            // Optional: Hide header on scroll down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Setup user interface elements
function setupUserInterface() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const postItemBtn = document.getElementById('postItemBtn');
    
    if (currentUser) {
        // User logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) {
            registerBtn.textContent = `👤 Hi, ${currentUser.firstName}`;
            registerBtn.onclick = showUserMenu;
        }
    } else {
        // User not logged in
        if (registerBtn) registerBtn.textContent = 'Sign Up';
        if (loginBtn) loginBtn.onclick = () => window.location.href = 'login.html';
        if (registerBtn) registerBtn.onclick = () => window.location.href = 'register.html';
    }
    
    if (postItemBtn) {
        postItemBtn.onclick = () => {
            if (currentUser) {
                window.location.href = 'post-item.html';
            } else {
                showToast('Please login to post an item', 'info');
                setTimeout(() => window.location.href = 'login.html', 1500);
            }
        };
    }
    
    // Setup category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

// Filter by category
function filterByCategory(category) {
    const categoryFilter = document.getElementById('headerCategoryFilter');
    categoryFilter.value = category;
    performHeaderSearch();
}

// Show search notification
function showSearchNotification(params) {
    let message = '';
    const hasFilters = params.query || params.category || params.location || params.condition;
    
    if (hasFilters) {
        message = 'Search results updated';
        if (params.query) message += ` for "${params.query}"`;
        if (params.category) message += ` in ${params.category}`;
        if (params.location) message += ` near ${params.location}`;
    } else {
        message = 'Showing all items';
    }
    
    showToast(message, 'info');
}

// Display search results
function displaySearchResults(items, params) {
    const itemsGrid = document.getElementById('itemsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!itemsGrid) return;
    
    if (items.length === 0) {
        itemsGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try adjusting your search criteria or browse all categories</p>
                <button class="btn btn--primary" onclick="clearAllFilters()">Show All Items</button>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else {
        // Display items (show first 12)
        const itemsToShow = items.slice(0, 12);
        itemsGrid.innerHTML = itemsToShow.map(item => createItemHTML(item)).join('');
        
        // Update load more button
        if (loadMoreBtn) {
            if (items.length > 12) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = `Load More (${items.length - 12} remaining)`;
                loadMoreBtn.onclick = () => loadMoreItems(items, 12);
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('headerSearchInput').value = '';
    document.getElementById('headerCategoryFilter').value = '';
    document.getElementById('headerLocationFilter').value = '';
    document.getElementById('headerConditionFilter').value = '';
    clearAdvancedFilters();
    
    // Load all items
    const allItems = getStoredItems();
    displaySearchResults(allItems, {});
    
    showToast('All filters cleared', 'success');
}

// Load initial items
function loadInitialItems() {
    const items = getStoredItems();
    const sortedItems = sortItems(items, 'newest');
    displaySearchResults(sortedItems, {});
}

// Utility functions
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function getStoredItems() {
    return JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
}

function executeBasicFilters(items, params) {
    let filtered = [...items];
    
    if (params.query) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(params.query.toLowerCase()) ||
            item.description.toLowerCase().includes(params.query.toLowerCase())
        );
    }
    
    if (params.category) {
        filtered = filtered.filter(item => item.category === params.category);
    }
    
    if (params.location) {
        filtered = filtered.filter(item => item.location === params.location);
    }
    
    if (params.condition) {
        filtered = filtered.filter(item => item.condition === params.condition);
    }
    
    return filtered;
}

function sortItems(items, sortBy) {
    const sortedItems = [...items];
    
    switch (sortBy) {
        case 'price-low':
            return sortedItems.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedItems.sort((a, b) => b.price - a.price);
        case 'newest':
        default:
            return sortedItems.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    }
}

function createItemHTML(item) {
    return `
        <div class="item-card" data-item-id="${item.id}">
            <div class="item-image">
                ${item.image || '📦'}
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-price">¥${item.price.toLocaleString()}${item.negotiable ? ' (Negotiable)' : ''}</div>
                <div class="item-details">
                    <span>📍 ${item.location}</span>
                    <span>${item.condition}</span>
                </div>
                <p class="item-description">${item.description.substring(0, 100)}...</p>
                <div class="item-actions">
                    <button class="whatsapp-btn" onclick="contactSeller('${item.phone}', '${item.title}')">
                        💬 WhatsApp
                    </button>
                    <button class="btn btn--outline btn--small" onclick="viewItem(${item.id})">View Details</button>
                </div>
            </div>
        </div>
    `;
}

function contactSeller(phone, itemTitle) {
    const message = encodeURIComponent(`Hi! I'm interested in your item: ${itemTitle}`);
    const whatsappURL = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(whatsappURL, '_blank');
}

function viewItem(itemId) {
    window.location.href = `item-details.html?id=${itemId}`;
}

function showUserMenu() {
    // Implementation similar to other pages
    console.log('Show user menu');
}

function showToast(message, type = 'info', duration = 3000) {
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
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Debounce function for search suggestions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add search keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('headerSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search and close panels
    if (e.key === 'Escape') {
        hideSuggestions();
        const advancedPanel = document.getElementById('advancedSearchPanel');
        if (advancedPanel) {
            advancedPanel.classList.remove('active');
            document.getElementById('advancedSearchToggle').innerHTML = '⚙️ Advanced';
        }
    }
});

console.log('Homepage navigation with enhanced search loaded successfully');