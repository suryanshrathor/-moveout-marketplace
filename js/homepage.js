// COMPLETE UPDATED homepage.js with WhatsApp Integration
// Replace your entire js/homepage.js file with this

// Sample data for demonstration
const sampleItems = [
    {
        id: 1,
        title: "MacBook Pro 13-inch M1",
        description: "Excellent condition MacBook Pro with M1 chip. Used for 1 year, comes with original charger and box. Perfect for students or professionals. No scratches or dents.",
        price: 85000,
        category: "Electronics",
        location: "Bangalore",
        condition: "Like New",
        seller: "Raj Kumar",
        phone: "+91-9876543210",
        postedDate: "2024-10-01",
        image: "💻",
        sellerId: 999 // Sample seller ID
    },
    {
        id: 2,
        title: "Study Table with Chair",
        description: "Wooden study table with matching chair. Great for students. Has drawer storage and cable management. Moving out of hostel, need to sell urgently.",
        price: 3500,
        category: "Furniture",
        location: "Pune",
        condition: "Good",
        seller: "Priya Sharma",
        phone: "+91-8765432109",
        postedDate: "2024-09-30",
        image: "🪑",
        sellerId: 998
    },
    {
        id: 3,
        title: "Samsung 24-inch Monitor",
        description: "Full HD Samsung monitor in excellent condition. Perfect for work from home setup or gaming. Comes with all cables and original stand.",
        price: 12000,
        category: "Electronics",
        location: "Mumbai",
        condition: "Excellent",
        seller: "Amit Patel",
        phone: "+91-7654321098",
        postedDate: "2024-09-29",
        image: "🖥️",
        sellerId: 997
    },
    {
        id: 4,
        title: "Microwave Oven - LG 20L",
        description: "Barely used LG microwave oven. Bought 6 months ago, relocating to different city. Works perfectly, all functions tested. Great for bachelors.",
        price: 6500,
        category: "Appliances",
        location: "Delhi",
        condition: "Like New",
        seller: "Neha Singh",
        phone: "+91-6543210987",
        postedDate: "2024-09-28",
        image: "🔥",
        sellerId: 996
    },
    {
        id: 5,
        title: "Engineering Textbooks Set",
        description: "Complete set of Computer Science engineering books for all 4 years. Includes programming, algorithms, database, and networking books. Great condition.",
        price: 4000,
        category: "Books",
        location: "Chennai",
        condition: "Good",
        seller: "Karthik Reddy",
        phone: "+91-5432109876",
        postedDate: "2024-09-27",
        image: "📚",
        sellerId: 995
    },
    {
        id: 6,
        title: "Office Chair - Ergonomic",
        description: "Comfortable ergonomic office chair with adjustable height and lumbar support. Used for 1 year, very comfortable for long working hours.",
        price: 8000,
        category: "Furniture",
        location: "Hyderabad",
        condition: "Good",
        seller: "Sanjay Kumar",
        phone: "+91-4321098765",
        postedDate: "2024-09-26",
        image: "🪑",
        sellerId: 994
    },
    {
        id: 7,
        title: "iPhone 12 128GB",
        description: "iPhone 12 in great condition. Battery health 87%. Comes with original box, charger, and tempered glass protection since day 1.",
        price: 45000,
        category: "Electronics",
        location: "Gurgaon",
        condition: "Good",
        seller: "Ankita Gupta",
        phone: "+91-3210987654",
        postedDate: "2024-09-25",
        image: "📱",
        sellerId: 993
    },
    {
        id: 8,
        title: "Double Bed with Mattress",
        description: "Queen size double bed with comfortable mattress. Wooden frame, very sturdy. Mattress is 1 year old, excellent condition. Must sell before moving.",
        price: 15000,
        category: "Furniture",
        location: "Kolkata",
        condition: "Good",
        seller: "Rohit Banerjee",
        phone: "+91-2109876543",
        postedDate: "2024-09-24",
        image: "🛏️",
        sellerId: 992
    },
    {
        id: 9,
        title: "Gaming Setup - Mouse + Keyboard",
        description: "Logitech gaming mouse and mechanical keyboard combo. RGB lighting, excellent for gaming and typing. Used for 8 months, works perfectly.",
        price: 5500,
        category: "Electronics",
        location: "Bangalore",
        condition: "Like New",
        seller: "Vishal Agarwal",
        phone: "+91-1098765432",
        postedDate: "2024-09-23",
        image: "🎮",
        sellerId: 991
    },
    {
        id: 10,
        title: "Refrigerator 165L Single Door",
        description: "Whirlpool single door refrigerator, 165L capacity. Perfect for small families or bachelors. Excellent cooling, low power consumption.",
        price: 12000,
        category: "Appliances",
        location: "Pune",
        condition: "Good",
        seller: "Meera Joshi",
        phone: "+91-0987654321",
        postedDate: "2024-09-22",
        image: "🧊",
        sellerId: 990
    }
];

let currentItems = [];
let displayedItems = [];
let itemsPerPage = 6;
let currentPage = 0;

// Image gallery variables
let currentModalImages = [];
let currentImageIndex = 0;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const conditionFilter = document.getElementById('conditionFilter');
const sortSelect = document.getElementById('sortSelect');
const itemsGrid = document.getElementById('itemsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categoryCards = document.querySelectorAll('.category-card');
const postItemBtn = document.getElementById('postItemBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadWhatsAppStyles(); // Load WhatsApp button styles
    loadAllItems(); // Load both sample and user items
    setupEventListeners();
    setupFooterFilters();
    updateHeaderForUser(); // Update header based on login status
});

// NEW: Load WhatsApp styles
function loadWhatsAppStyles() {
    const whatsappStyles = `
    .whatsapp-btn {
        background: #25d366;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        text-decoration: none;
        justify-content: center;
    }

    .whatsapp-btn:hover {
        background: #128c7e;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        color: white;
        text-decoration: none;
    }

    .whatsapp-share-btn {
        background: transparent;
        color: #25d366;
        border: 2px solid #25d366;
        padding: 6px 12px;
        border-radius: 16px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .whatsapp-share-btn:hover {
        background: #25d366;
        color: white;
    }

    .whatsapp-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #25d366;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
}

// WHATSAPP INTEGRATION FUNCTIONS

// Main WhatsApp contact function
function contactSellerWhatsApp(itemId) {
    const item = getItemById(itemId);
    if (!item) {
        alert('Item not found');
        return;
    }
    
    // Get seller info
    const seller = getUserById(item.sellerId) || {
        firstName: item.seller ? item.seller.split(' ')[0] : 'Seller',
        phone: item.phone
    };
    
    if (!seller.phone && !item.phone) {
        alert('Seller contact information not available');
        return;
    }
    
    // Create WhatsApp message
    const message = createWhatsAppMessage(item, seller);
    const phoneNumber = formatPhoneNumber(seller.phone || item.phone);
    
    // Open WhatsApp
    openWhatsApp(phoneNumber, message);
}

function createWhatsAppMessage(item, seller) {
    const message = `Hi ${seller.firstName}! 

I'm interested in your item: *${item.title}*

Price: ₹${item.price.toLocaleString()}
Posted: ${getTimeAgo(item.postedDate)}

${item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}

Is this item still available?`;
    
    return message;
}

function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove any non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Add country code for India if not present
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    } else if (cleanPhone.startsWith('0')) {
        cleanPhone = '91' + cleanPhone.substring(1);
    }
    
    return cleanPhone;
}

function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappURL;
    if (isMobile) {
        // For mobile devices, use whatsapp:// protocol
        whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    } else {
        // For desktop, use WhatsApp Web
        whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    }
    
    // Try to open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show confirmation to user
    showWhatsAppToast();
}

function showWhatsAppToast() {
    const toast = document.createElement('div');
    toast.className = 'whatsapp-toast';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">💬</span>
            <span>Opening WhatsApp chat...</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Quick WhatsApp share for items
function shareItemOnWhatsApp(itemId) {
    const item = getItemById(itemId);
    if (!item) return;
    
    const message = `Check out this item on MoveOut Market:

*${item.title}*
Price: ₹${item.price.toLocaleString()}
Condition: ${item.condition}
Location: ${item.location}

${item.description}

Interested? Contact me!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Utility functions for WhatsApp integration
function getItemById(itemId) {
    return currentItems.find(item => item.id == itemId);
}

function getUserById(userId) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return users.find(user => user.id == userId);
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// END WHATSAPP INTEGRATION

// Load items from both sample data and localStorage
function loadAllItems() {
    // Get user-posted items from localStorage
    const userItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    
    // Combine with sample items
    currentItems = [...userItems, ...sampleItems];
    
    // Sort by date (newest first)
    currentItems.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    loadItems();
}

// Update header based on user login status
function updateHeaderForUser() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // User is logged in - show different buttons
        loginBtn.style.display = 'none';
        registerBtn.textContent = `Hi, ${currentUser.firstName}`;
        registerBtn.className = 'btn btn--secondary';
        registerBtn.onclick = () => showUserMenu();
        
        // Enable post item button
        postItemBtn.style.opacity = '1';
        postItemBtn.style.cursor = 'pointer';
    } else {
        // User is not logged in - show original buttons
        loginBtn.style.display = 'inline-flex';
        registerBtn.textContent = 'Sign Up';
        registerBtn.className = 'btn btn--secondary';
        registerBtn.onclick = () => window.location.href = 'register.html';
        
        // Disable post item button visually
        postItemBtn.style.opacity = '0.6';
        postItemBtn.style.cursor = 'not-allowed';
    }
}

// Show user menu dropdown
function showUserMenu() {
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const currentUser = getCurrentUser();
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-item" onclick="goToPostItem()">📦 Post Item</div>
        <div class="user-menu-item" onclick="goToMyItems()">📋 My Items</div>
        <div class="user-menu-item" onclick="goToProfile()">👤 Profile</div>
        <div class="user-menu-divider"></div>
        <div class="user-menu-item logout" onclick="logout()">🚪 Logout</div>
    `;
    
    // Position menu
    const rect = registerBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '1rem';
    menu.style.zIndex = '1000';
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu);
    }, 100);
}

function closeUserMenu(e) {
    const menu = document.querySelector('.user-menu');
    if (menu && !menu.contains(e.target) && !registerBtn.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeUserMenu);
    }
}

// User menu actions
function goToPostItem() {
    window.location.href = 'post-item.html';
}

function goToMyItems() {
    window.location.href = 'my-items.html';
}

function goToProfile() {
    window.location.href = 'profile.html';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        location.reload(); // Refresh to update header
    }
}

// Setup event listeners with auto-scroll functionality
function setupEventListeners() {
    // Search functionality with auto-scroll
    searchBtn.addEventListener('click', () => {
        performSearch();
        scrollToResults();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
            scrollToResults();
        }
    });
    
    // Filter functionality with auto-scroll
    categoryFilter.addEventListener('change', () => {
        applyFilters();
        if (categoryFilter.value) {
            scrollToResults();
            showHeaderFilterNotification(`Filtered by ${categoryFilter.value}`);
        }
    });
    
    locationFilter.addEventListener('change', () => {
        applyFilters();
        if (locationFilter.value) {
            scrollToResults();
            showHeaderFilterNotification(`Filtered by ${locationFilter.value}`);
        }
    });
    
    conditionFilter.addEventListener('change', () => {
        applyFilters();
        if (conditionFilter.value) {
            scrollToResults();
            showHeaderFilterNotification(`Filtered by ${conditionFilter.value} condition`);
        }
    });
    
    // Sort functionality with auto-scroll
    sortSelect.addEventListener('change', () => {
        applySorting();
        if (sortSelect.value !== 'newest') {
            scrollToResults();
            showHeaderFilterNotification(`Sorted by ${getSortDisplayName(sortSelect.value)}`);
        }
    });
    
    // Load more items (no scroll needed)
    loadMoreBtn.addEventListener('click', loadMoreItems);
    
    // Category cards in hero section
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            categoryFilter.value = category;
            applyFilters();
            scrollToResults();
            showHeaderFilterNotification(`Showing ${category} items`);
        });
    });
    
    // Post item functionality
    postItemBtn.addEventListener('click', () => {
        if (isLoggedIn()) {
            window.location.href = 'post-item.html';
        } else {
            alert('Please login to post an item');
            window.location.href = 'login.html';
        }
    });
    
    loginBtn.addEventListener('click', () => window.location.href = 'login.html');
    
    registerBtn.addEventListener('click', () => {
        if (!isLoggedIn()) {
            window.location.href = 'register.html';
        }
    });
}

// Auto-scroll to results section
function scrollToResults() {
    setTimeout(() => {
        document.querySelector('.featured-items').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Show notifications for header filters
function showHeaderFilterNotification(message) {
    const existingNotification = document.querySelector('.header-filter-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'header-filter-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
        z-index: 1001;
        font-size: 0.875rem;
        font-weight: 600;
        border: 1px solid #059669;
        animation: slideInDown 0.4s ease;
        white-space: nowrap;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }
    }, 2500);
}

// Get display name for sort options
function getSortDisplayName(sortValue) {
    switch(sortValue) {
        case 'newest': return 'Newest First';
        case 'price-low': return 'Price: Low to High';
        case 'price-high': return 'Price: High to Low';
        default: return sortValue;
    }
}

// Setup footer category filters
function setupFooterFilters() {
    setTimeout(() => {
        const footerLinks = document.querySelectorAll('.footer-section a');
        footerLinks.forEach((link) => {
            const linkText = link.textContent.trim().toLowerCase();
            let category = '';
            
            switch(linkText) {
                case 'electronics': category = 'Electronics'; break;
                case 'furniture': category = 'Furniture'; break;
                case 'appliances': category = 'Appliances'; break;
                case 'books': category = 'Books'; break;
                case 'home': category = 'clear'; break;
            }
            
            if (category) {
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (category === 'clear') {
                        clearAllFilters();
                    } else {
                        filterByCategory(category);
                    }
                    scrollToResults();
                });
            }
        });
    }, 500);
}

// Filter by specific category (used by footer)
function filterByCategory(category) {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = category;
    if (locationFilter) locationFilter.value = '';
    if (conditionFilter) conditionFilter.value = '';
    
    applyFilters();
    
    const filteredCount = currentItems.length;
    showFilterNotification(`Showing ${filteredCount} ${category} items`);
}

// Clear all filters
function clearAllFilters() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (locationFilter) locationFilter.value = '';
    if (conditionFilter) conditionFilter.value = '';
    
    loadAllItems(); // Reload all items
    
    const totalCount = currentItems.length;
    showFilterNotification(`Showing all ${totalCount} items`);
}

function addNotification(title, message, type = 'general') {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
}

function showSuccessToast(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
        z-index: 1001;
        font-size: 0.875rem;
        font-weight: 600;
        animation: slideInRight 0.4s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Show filter notification (for footer filters)
function showFilterNotification(message) {
    const existingNotification = document.querySelector('.filter-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'filter-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 2rem;
        background: #2563eb;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
        z-index: 1001;
        font-size: 0.875rem;
        font-weight: 600;
        border: 1px solid #1d4ed8;
        animation: slideInRight 0.4s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }
    }, 3000);
}

// Load and display items
function loadItems() {
    currentPage = 0;
    displayedItems = [];
    loadMoreItems();
}

function loadMoreItems() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = currentItems.slice(startIndex, endIndex);
    
    displayedItems = [...displayedItems, ...newItems];
    renderItems(displayedItems);
    
    currentPage++;
    
    // Hide load more button if no more items
    if (endIndex >= currentItems.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function renderItems(items) {
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try different search terms or clear the filters</p>
                <button class="btn btn--primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const card = createItemCard(item);
        itemsGrid.appendChild(card);
    });
}

// UPDATED: createItemCard function with WhatsApp buttons
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    // Add special styling for user's own items
    const currentUser = getCurrentUser();
    const isOwnItem = currentUser && item.sellerId === currentUser.id;
    
    // Determine what image to display with count badge
    let itemImageDisplay;
    if (item.images && item.images.length > 0) {
        // Show actual uploaded image with count badge
        const imageCountBadge = item.images.length > 1 ? 
            `<div class="image-count-badge">${item.images.length} photos</div>` : '';
        
        itemImageDisplay = `
            <div style="position: relative;">
                <img src="${item.images[0].data}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 0.5rem 0.5rem 0 0;">
                ${imageCountBadge}
            </div>`;
    } else {
        // Show emoji icon as before
        itemImageDisplay = `<div class="item-image">${item.image}</div>`;
    }
    
    card.innerHTML = `
        ${itemImageDisplay}
        <div class="item-content">
            ${isOwnItem ? '<div class="own-item-badge">Your Item</div>' : ''}
            <h3 class="item-title">${item.title}</h3>
            <div class="item-price">₹${item.price.toLocaleString()}</div>
            <div class="item-details">
                <span class="item-location">📍 ${item.location}</span>
                <span class="item-condition">${item.condition}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-actions">
                <button class="btn btn--primary" onclick="viewItem(${item.id})">View Details</button>
                ${!isOwnItem ? 
                    `<button class="whatsapp-btn" onclick="contactSellerWhatsApp(${item.id})">
                        💬 WhatsApp
                    </button>` : 
                    `<button class="whatsapp-share-btn" onclick="shareItemOnWhatsApp(${item.id})">
                        📤 Share
                    </button>`
                }
            </div>
        </div>
    `;
    return card;
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        loadAllItems();
        return;
    }
    
    const userItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const allItems = [...userItems, ...sampleItems];
    
    currentItems = allItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.seller.toLowerCase().includes(searchTerm)
    );
    
    loadItems();
}

// Filter functionality
function applyFilters() {
    const userItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    let allItems = [...userItems, ...sampleItems];
    
    const category = categoryFilter.value;
    const location = locationFilter.value;
    const condition = conditionFilter.value;
    
    if (category) {
        allItems = allItems.filter(item => item.category === category);
    }
    
    if (location) {
        allItems = allItems.filter(item => item.location === location);
    }
    
    if (condition) {
        allItems = allItems.filter(item => item.condition === condition);
    }
    
    currentItems = allItems;
    applySorting();
    loadItems();
}

// Sort functionality
function applySorting() {
    const sortValue = sortSelect.value;
    
    switch(sortValue) {
        case 'price-low':
            currentItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentItems.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
        default:
            currentItems.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            break;
    }
}

// UPDATED: showItemDetails function with WhatsApp integration
function showItemDetails(item) {
    // Create image gallery HTML
    let imageGalleryHTML = '';
    
    if (item.images && item.images.length > 0) {
        // Store images for navigation
        currentModalImages = item.images;
        currentImageIndex = 0;
        
        // Multiple images - create carousel
        if (item.images.length > 1) {
            imageGalleryHTML = `
                <div class="image-gallery">
                    <div class="main-image-container">
                        <img id="mainModalImage" src="${item.images[0].data}" alt="${item.title}" style="width: 100%; height: 300px; object-fit: contain; border-radius: 0.5rem;">
                        <div class="image-nav">
                            <button class="nav-btn prev-btn" onclick="prevModalImage()">❮</button>
                            <button class="nav-btn next-btn" onclick="nextModalImage()">❯</button>
                        </div>
                        <div class="image-counter">
                            <span id="modalImageCounter">1 / ${item.images.length}</span>
                        </div>
                    </div>
                    <div class="thumbnail-gallery">
                        ${item.images.map((img, index) => 
                            `<img class="thumbnail ${index === 0 ? 'active' : ''}" 
                                 src="${img.data}" 
                                 onclick="showModalImage(${index})" 
                                 style="width: 60px; height: 60px; object-fit: contain; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem; border: ${index === 0 ? '2px solid #2563eb' : '1px solid #e5e7eb'};">`
                        ).join('')}
                    </div>
                </div>
            `;
        } else {
            // Single image
            currentModalImages = item.images;
            imageGalleryHTML = `<img src="${item.images[0].data}" alt="${item.title}" style="width: 100%; height: 300px; object-fit: contain; border-radius: 0.5rem;">`;
        }
    } else {
        // Emoji fallback
        currentModalImages = [];
        imageGalleryHTML = `<div class="item-image-large">${item.image}</div>`;
    }

    const currentUser = getCurrentUser();
    const isOwnItem = currentUser && item.sellerId === currentUser.id;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${item.title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${imageGalleryHTML}
                <div class="item-details-full">
                    <div class="price-large">₹${item.price.toLocaleString()}</div>
                    <div class="item-meta">
                        <span><strong>Category:</strong> ${item.category}</span>
                        <span><strong>Condition:</strong> ${item.condition}</span>
                        <span><strong>Location:</strong> ${item.location}</span>
                        <span><strong>Posted:</strong> ${formatDate(item.postedDate)}</span>
                    </div>
                    <div class="description-full">
                        <h4>Description</h4>
                        <p>${item.description}</p>
                    </div>
                    <div class="seller-info">
                        <h4>Seller Information</h4>
                        <p><strong>Name:</strong> ${item.seller}</p>
                        <p><strong>Phone:</strong> ${item.phone || 'Contact via WhatsApp'}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${!isOwnItem ? 
                    `<button class="whatsapp-btn whatsapp-btn-large" onclick="contactSellerWhatsApp(${item.id})">
                        💬 WhatsApp Seller
                    </button>
                    <button class="whatsapp-share-btn" onclick="shareItemOnWhatsApp(${item.id})" style="padding: 12px 24px;">
                        📤 Share Item
                    </button>` :
                    `<button class="whatsapp-share-btn" onclick="shareItemOnWhatsApp(${item.id})" style="padding: 12px 24px;">
                        📤 Share Your Item
                    </button>`
                }
                <button class="btn btn--outline" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Image navigation functions
function showModalImage(index) {
    if (!currentModalImages || currentModalImages.length === 0) {
        return;
    }
    
    currentImageIndex = index;
    const mainImage = document.getElementById('mainModalImage');
    const imageCounter = document.getElementById('modalImageCounter');
    
    if (mainImage) {
        mainImage.src = currentModalImages[index].data;
    }
    
    if (imageCounter) {
        imageCounter.textContent = `${index + 1} / ${currentModalImages.length}`;
    }
    
    // Update thumbnail borders
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.style.border = '2px solid #2563eb';
            thumb.classList.add('active');
        } else {
            thumb.style.border = '1px solid #e5e7eb';
            thumb.classList.remove('active');
        }
    });
}

function nextModalImage() {
    if (!currentModalImages || currentModalImages.length === 0) {
        return;
    }
    
    currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
    showModalImage(currentImageIndex);
}

function prevModalImage() {
    if (!currentModalImages || currentModalImages.length === 0) {
        return;
    }
    
    currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
    showModalImage(currentImageIndex);
}

// View item function
function viewItem(itemId) {
    const item = currentItems.find(item => item.id === itemId);
    if (item) {
        showItemDetails(item);
    }
}

// closeModal to reset image variables
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        
        // Reset image gallery variables
        currentModalImages = [];
        currentImageIndex = 0;
    }
}

// LEGACY: Contact seller function (kept for backward compatibility)
function contactSeller(phone) {
    const message = encodeURIComponent('Hi! I am interested in the item you posted on MoveOut Market. Is it still available?');
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    showWhatsAppToast();
}

// Date formatting helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Utility functions
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}