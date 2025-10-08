// Global variables
let currentUserItems = [];
let filteredItems = [];
let currentPage = 1;
let itemsPerPage = 6;
let editingItemId = null;
let cachedAllItems = null;
let cachedUserItems = null;

// Initialize the My Items page
document.addEventListener('DOMContentLoaded', function() {
    console.log('My Items page loaded');
    loadWhatsAppStyles(); // Load WhatsApp button styles
    initializeMyItemsPage();
});

// Toast Notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error('Toast container not found');
        showErrorMessage('Cannot show notification: container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('toast--removing');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// Redirect showSuccessMessage and showErrorMessage to showToast
function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

// Load WhatsApp styles
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

    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    }

    .toast--success { background: #10b981; color: white; }
    .toast--error { background: #ef4444; color: white; }
    .toast--warning { background: #f59e0b; color: white; }
    .toast--info { background: #3b82f6; color: white; }
    .toast--removing { animation: slideOutRight 0.3s ease; }
    .toast-content { display: flex; align-items: center; gap: 8px; }
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        margin-left: 10px;
    }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
}

// WHATSAPP INTEGRATION FUNCTIONS
function shareItemOnWhatsApp(itemId) {
    const item = getItemById(itemId);
    if (!item) {
        showToast('Item not found for sharing', 'error');
        return;
    }
    
    const message = `Check out my item on MoveOut Market:

*${item.title}*
Price: ₹${item.price.toLocaleString()}
Condition: ${item.condition}
Location: ${item.location}

${item.description}

Interested? Contact me for details!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    showWhatsAppToast();
}

function showWhatsAppToast() {
    const toast = document.createElement('div');
    toast.className = 'whatsapp-toast';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">💬</span>
            <span>Opening WhatsApp to share...</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function copyItemLink(itemId) {
    const itemUrl = `${window.location.origin}/index.html#item-${itemId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(itemUrl).then(() => {
            showToast('Link copied to clipboard! Share it anywhere.', 'success');
        }).catch(() => {
            fallbackCopyText(itemUrl);
        });
    } else {
        fallbackCopyText(itemUrl);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Link copied!', 'success');
    } catch (err) {
        showToast('Could not copy link. Please copy manually: ' + text, 'error');
    }
    document.body.removeChild(textArea);
}

function getItemById(itemId) {
    return currentUserItems.find(item => String(item.id) === String(itemId));
}

// END WHATSAPP INTEGRATION

function initializeMyItemsPage() {
    if (!isLoggedIn()) {
        showToast('Please login to access your items', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    setupEventListeners();
    loadUserItems();
    updateHeaderForUser();
    updateStats();
}

function setupEventListeners() {
    const backBtn = document.getElementById('backToHomeBtn');
    if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'index.html');
    
    const postItemBtn = document.getElementById('postItemBtn');
    if (postItemBtn) postItemBtn.addEventListener('click', goToPostItem);
    
    const postNewItemBtn = document.getElementById('postNewItemBtn');
    if (postNewItemBtn) postNewItemBtn.addEventListener('click', goToPostItem);
    
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) userMenuBtn.addEventListener('click', showUserMenu);
    
    const itemSearch = document.getElementById('itemSearch');
    if (itemSearch) itemSearch.addEventListener('input', debounce(filterItems, 300));
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', filterItems);
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);
    
    const viewMode = document.getElementById('viewMode');
    if (viewMode) viewMode.addEventListener('change', changeViewMode);
    
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    if (bulkActionsBtn) bulkActionsBtn.addEventListener('click', showBulkActions);
}

function updateHeaderForUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) userMenuBtn.textContent = `Hi, ${currentUser.firstName}`;
    }
}

async function loadUserItems() {
    console.log('Loading user items...');
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No current user found');
        showErrorMessage('Please log in to view your items');
        return;
    }
    console.log('Current user ID:', currentUser.id);
    
    let allItems = [];
    try {
        if (cachedAllItems) {
            console.log('Using cached items');
            allItems = cachedAllItems;
        } else {
            const response = await jsonBinService.getAllItems();
            console.log('Raw JSONBin response:', JSON.stringify(response, null, 2));
            allItems = Array.isArray(response) ? response : response?.record?.items || [];
            if (!Array.isArray(allItems)) {
                console.error('JSONBin response is not an array:', allItems);
                allItems = [];
            }
            cachedAllItems = allItems;
            localStorage.setItem('marketplaceItems', JSON.stringify(allItems));
        }
    } catch (error) {
        console.error('Error fetching items from JSONBin:', error);
        showToast('Failed to load items from cloud storage', 'error');
        allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    }
    
    if (cachedUserItems && cachedUserItems.length > 0) {
        console.log('Using cached user items');
        currentUserItems = cachedUserItems;
    } else {
        currentUserItems = allItems.filter(item => String(item.sellerId) === String(currentUser.id));
        cachedUserItems = currentUserItems;
    }
    console.log(`Found ${currentUserItems.length} user items`, currentUserItems);
    
    currentUserItems = currentUserItems.map(item => ({
        ...item,
        views: item.views || Math.floor(Math.random() * 50) + 10,
        inquiries: item.inquiries || Math.floor(Math.random() * 10),
        status: item.status || 'available',
        lastUpdated: item.lastUpdated || item.postedDate
    }));
    
    filteredItems = [...currentUserItems];
    renderItems();
    updateStats();
    return currentUserItems;
}

function updateStats() {
    const totalItems = currentUserItems.length;
    const activeItems = currentUserItems.filter(item => item.status === 'available').length;
    const soldItems = currentUserItems.filter(item => item.status === 'sold').length;
    const totalViews = currentUserItems.reduce((sum, item) => sum + (item.views || 0), 0);
    
    const totalItemsCount = document.getElementById('totalItemsCount');
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    const activeItemsCount = document.getElementById('activeItemsCount');
    if (activeItemsCount) activeItemsCount.textContent = activeItems;
    
    const soldItemsCount = document.getElementById('soldItemsCount');
    if (soldItemsCount) soldItemsCount.textContent = soldItems;
    
    const totalViewsCount = document.getElementById('totalViewsCount');
    if (totalViewsCount) totalViewsCount.textContent = totalViews;
}

function renderItems() {
    const container = document.getElementById('myItemsGrid');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!container || !emptyState || !paginationContainer) {
        console.error('Required DOM elements missing');
        showToast('Page structure error. Please refresh.', 'error');
        return;
    }
    
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    container.style.display = 'grid';
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    pageItems.forEach(item => {
        const itemCard = createMyItemCard(item);
        container.appendChild(itemCard);
    });
    
    updatePagination(totalPages);
}

function createMyItemCard(item) {
    const card = document.createElement('div');
    card.className = 'my-item-card';
    card.dataset.itemId = item.id;
    
    let imageDisplay;
    if (item.images && item.images.length > 0 && item.images[0].data) {
        const imageCount = item.images.length > 1 ? 
            `<div class="image-count-badge">${item.images.length} photos</div>` : '';
        imageDisplay = `
            <div class="item-image-container">
                <img src="${item.images[0].data}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/150?text=${item.category}'">
                ${imageCount}
            </div>`;
    } else {
        imageDisplay = `<div class="item-image-container"><img src="https://via.placeholder.com/150?text=${item.category}" alt="${item.title}"></div>`;
    }
    
    const statusBadge = getStatusBadge(item.status);
    const timeAgo = getTimeAgo(item.postedDate);
    
    card.innerHTML = `
        <div class="item-selection">
            <input type="checkbox" class="item-checkbox" value="${item.id}">
        </div>
        <div class="item-image-section">
            ${imageDisplay}
            ${statusBadge}
        </div>
        <div class="item-details-section">
            <div class="item-header">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-price">₹${item.price.toLocaleString()}</div>
            </div>
            <div class="item-meta">
                <span class="item-location">📍 ${item.location}</span>
                <span class="item-condition">${item.condition}</span>
                <span class="item-time">${timeAgo}</span>
            </div>
            <div class="item-stats">
                <span class="stat-item">👁️ ${item.views} views</span>
                <span class="stat-item">💬 ${item.inquiries} inquiries</span>
            </div>
            <div class="item-whatsapp-section" style="margin: 12px 0; padding: 8px; background: #f0f9ff; border-radius: 6px;">
                <p style="font-size: 0.75rem; color: #0ea5e9; margin: 0 0 6px 0;">Share with potential buyers:</p>
                <div style="display: flex; gap: 8px;">
                    <button class="whatsapp-share-btn" onclick="shareItemOnWhatsApp('${item.id}')" title="Share on WhatsApp">
                        💬 WhatsApp
                    </button>
                    <button class="btn btn--outline btn--small" onclick="copyItemLink('${item.id}')" title="Copy link to share">
                        📋 Copy Link
                    </button>
                </div>
            </div>
        </div>
        <div class="item-actions-section">
            <div class="item-actions">
                <button class="action-btn edit-btn" onclick="editItem('${item.id}')" title="Edit Item">
                    ✏️
                </button>
                <button class="action-btn status-btn" onclick="toggleStatus('${item.id}')" title="Change Status">
                    ${item.status === 'available' ? '✅' : item.status === 'sold' ? '💰' : '👁️'}
                </button>
                <button class="action-btn duplicate-btn" onclick="duplicateItem('${item.id}')" title="Duplicate Item">
                    📋
                </button>
                <button class="action-btn delete-btn" onclick="deleteItem('${item.id}')" title="Delete Item">
                    🗑️
                </button>
            </div>
            <div class="item-quick-actions">
                <button class="btn btn--small btn--outline" onclick="viewItem('${item.id}')">
                    View Details
                </button>
                <button class="btn btn--small btn--primary" onclick="boostItem('${item.id}')">
                    🚀 Boost
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function getStatusBadge(status) {
    const badges = {
        'available': '<div class="status-badge status-available">Available</div>',
        'sold': '<div class="status-badge status-sold">Sold</div>',
        'hidden': '<div class="status-badge status-hidden">Hidden</div>'
    };
    return badges[status] || badges['available'];
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

function filterItems() {
    const search = document.getElementById('itemSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    filteredItems = currentUserItems.filter(item => {
        const matchesSearch = !search || 
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search);
        
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    currentPage = 1;
    renderItems();
}

function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    
    if (prevPageBtn && !prevPageBtn.onclick) {
        prevPageBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderItems();
            }
        };
    }
    
    if (nextPageBtn && !nextPageBtn.onclick) {
        nextPageBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderItems();
            }
        };
    }
}

function editItem(itemId) {
    console.log('Editing item:', itemId);
    const item = currentUserItems.find(item => String(item.id) === String(itemId));
    if (!item) {
        showToast('Item not found locally', 'error');
        return;
    }
    
    editingItemId = itemId;
    showEditModal(item);
}

function showEditModal(item) {
    const modal = document.getElementById('editItemModal');
    if (!modal) {
        console.error('Edit modal not found');
        showToast('Cannot edit item: modal not found', 'error');
        return;
    }
    
    const form = document.getElementById('editItemForm');
    if (!form) {
        console.error('Edit form not found');
        showToast('Cannot edit item: form not found', 'error');
        return;
    }
    
    form.innerHTML = `
        <div class="form-group">
            <label for="editTitle">Title *</label>
            <input type="text" id="editTitle" value="${item.title}" class="form-control" required maxlength="100">
            <span class="char-counter">0/100</span>
        </div>
        <div class="form-group">
            <label for="editDescription">Description *</label>
            <textarea id="editDescription" class="form-control" rows="4" required maxlength="150">${item.description}</textarea>
            <span class="char-counter">0/150</span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="editPrice">Price (₹) *</label>
                <input type="number" id="editPrice" value="${item.price}" class="form-control" required min="1">
            </div>
            <div class="form-group">
                <label for="editCondition">Condition *</label>
                <select id="editCondition" class="form-control" required>
                    <option value="New" ${item.condition === 'New' ? 'selected' : ''}>New</option>
                    <option value="Like New" ${item.condition === 'Like New' ? 'selected' : ''}>Like New</option>
                    <option value="Excellent" ${item.condition === 'Excellent' ? 'selected' : ''}>Excellent</option>
                    <option value="Good" ${item.condition === 'Good' ? 'selected' : ''}>Good</option>
                    <option value="Fair" ${item.condition === 'Fair' ? 'selected' : ''}>Fair</option>
                    <option value="Poor" ${item.condition === 'Poor' ? 'selected' : ''}>Poor</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="editCategory">Category *</label>
                <select id="editCategory" class="form-control" required>
                    <option value="Electronics" ${item.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
                    <option value="Furniture" ${item.category === 'Furniture' ? 'selected' : ''}>Furniture</option>
                    <option value="Appliances" ${item.category === 'Appliances' ? 'selected' : ''}>Appliances</option>
                    <option value="Books" ${item.category === 'Books' ? 'selected' : ''}>Books</option>
                    <option value="Clothing" ${item.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
                    <option value="Sports" ${item.category === 'Sports' ? 'selected' : ''}>Sports</option>
                    <option value="Other" ${item.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editLocation">Location *</label>
                <select id="editLocation" class="form-control" required>
                    <option value="Bangalore" ${item.location === 'Bangalore' ? 'selected' : ''}>Bangalore</option>
                    <option value="Mumbai" ${item.location === 'Mumbai' ? 'selected' : ''}>Mumbai</option>
                    <option value="Delhi" ${item.location === 'Delhi' ? 'selected' : ''}>Delhi</option>
                    <option value="Pune" ${item.location === 'Pune' ? 'selected' : ''}>Pune</option>
                    <option value="Chennai" ${item.location === 'Chennai' ? 'selected' : ''}>Chennai</</option>
                    <option value="Hyderabad" ${item.location === 'Hyderabad' ? 'selected' : ''}>Hyderabad</option>
                    <option value="Kolkata" ${item.location === 'Kolkata' ? 'selected' : ''}>Kolkata</option>
                    <option value="Gurgaon" ${item.location === 'Gurgaon' ? 'selected' : ''}>Gurgaon</option>
                    <option value="Noida" ${item.location === 'Noida' ? 'selected' : ''}>Noida</option>
                    <option value="Ahmedabad" ${item.location === 'Ahmedabad' ? 'selected' : ''}>Ahmedabad</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="editStatus">Status</label>
            <select id="editStatus" class="form-control">
                <option value="available" ${item.status === 'available' ? 'selected' : ''}>Available</option>
                <option value="sold" ${item.status === 'sold' ? 'selected' : ''}>Sold</option>
                <option value="hidden" ${item.status === 'hidden' ? 'selected' : ''}>Hidden</option>
            </select>
        </div>
        <div class="form-group checkbox-group">
            <input type="checkbox" id="editNegotiable" ${item.negotiable ? 'checked' : ''}>
            <label for="editNegotiable">Price is negotiable</label>
        </div>
    `;
    
    setupEditCharCounters();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function setupEditCharCounters() {
    const titleInput = document.getElementById('editTitle');
    const descInput = document.getElementById('editDescription');
    
    if (titleInput) {
        const counter = titleInput.parentElement.querySelector('.char-counter');
        if (counter) {
            updateCharCounter(titleInput, counter);
            titleInput.addEventListener('input', () => updateCharCounter(titleInput, counter));
        }
    }
    
    if (descInput) {
        const counter = descInput.parentElement.querySelector('.char-counter');
        if (counter) {
            updateCharCounter(descInput, counter);
            descInput.addEventListener('input', () => updateCharCounter(descInput, counter));
        }
    }
}

function updateCharCounter(input, counter) {
    if (!counter) return;
    const current = input.value.length;
    const max = input.getAttribute('maxlength');
    counter.textContent = `${current}/${max}`;
}

async function saveItemChanges() {
    if (!editingItemId) {
        showToast('No item selected for editing', 'error');
        return;
    }
    
    // Get form values
    const title = document.getElementById('editTitle')?.value.trim();
    const description = document.getElementById('editDescription')?.value.trim();
    const category = document.getElementById('editCategory')?.value;
    const condition = document.getElementById('editCondition')?.value;
    const price = parseFloat(document.getElementById('editPrice')?.value);
    const negotiable = document.getElementById('editNegotiable')?.checked;
    const location = document.getElementById('editLocation')?.value;
    const status = document.getElementById('editStatus')?.value;
    
    // Validate
    if (!title || !description || !category || !condition || isNaN(price) || !location) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
        if (!items.length) {
            console.log('No cached items, fetching from JSONBin...');
            const allItems = await jsonBinService.getAllItems();
            items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
            console.log('Fetched JSONBin response:', allItems);
        }
        if (!Array.isArray(items)) {
            console.error('JSONBin items is not an array:', items);
            showToast('Invalid item data from cloud storage', 'error');
            return;
        }
        console.log('Items from JSONBin:', items);
        console.log('Searching for item ID:', editingItemId);
        const itemIndex = items.findIndex(item => String(item.id) === String(editingItemId));
        console.log('Item index found:', itemIndex);
        if (itemIndex === -1) {
            showToast('Item not found in cloud storage', 'error');
            return;
        }
        
        // Update item
        items[itemIndex] = {
            ...items[itemIndex],
            title,
            description,
            category,
            condition,
            price,
            negotiable,
            location,
            status,
            lastUpdated: new Date().toISOString()
        };
        
        // Save updated items to JSONBin
        if (items.length === 0) {
            console.warn('Attempted to save empty items array to JSONBin');
            showToast('Cannot save empty item list', 'error');
            return;
        }
        await jsonBinService.saveAllItems(items);
        cachedAllItems = items; // Update cache
        cachedUserItems = items.filter(item => String(item.sellerId) === String(getCurrentUser().id));
        currentUserItems = [...cachedUserItems]; // Update global
        filteredItems = [...currentUserItems]; // Update filtered items
        
        closeEditModal();
        renderItems();
        updateStats();
        showToast('Item updated successfully!', 'success');
        addNotification('Item updated', `Your item "${title}" has been updated`, 'post');
    } catch (error) {
        console.error('Error updating item:', error);
        showToast('Failed to update item', 'error');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editItemModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        editingItemId = null;
    }
}

async function toggleStatus(itemId) {
    try {
        let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
        if (!items.length) {
            console.log('No cached items, fetching from JSONBin...');
            const allItems = await jsonBinService.getAllItems();
            items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
            console.log('Fetched JSONBin response:', allItems);
        }
        if (!Array.isArray(items)) {
            console.error('JSONBin items is not an array:', items);
            showToast('Invalid item data from cloud storage', 'error');
            return;
        }
        console.log('Items from JSONBin:', items);
        console.log('Searching for item ID:', itemId);
        const itemIndex = items.findIndex(item => String(item.id) === String(itemId));
        console.log('Item index found:', itemIndex);
        if (itemIndex === -1) {
            showToast('Item not found in cloud storage', 'error');
            return;
        }
        
        // Toggle status
        items[itemIndex].status = items[itemIndex].status === 'sold' ? 'available' : 'sold';
        items[itemIndex].lastUpdated = new Date().toISOString();
        
        // Save updated items to JSONBin
        if (items.length === 0) {
            console.warn('Attempted to save empty items array to JSONBin');
            showToast('Cannot save empty item list', 'error');
            return;
        }
        await jsonBinService.saveAllItems(items);
        cachedAllItems = items; // Update cache
        cachedUserItems = items.filter(item => String(item.sellerId) === String(getCurrentUser().id));
        currentUserItems = [...cachedUserItems]; // Update global
        filteredItems = [...currentUserItems]; // Update filtered items
        
        renderItems();
        updateStats();
        showToast(`Item marked as ${items[itemIndex].status}!`, 'success');
        addNotification('Item status changed', `Your item "${items[itemIndex].title}" is now ${items[itemIndex].status}`, 'post');
    } catch (error) {
        console.error('Error toggling item status:', error);
        showToast('Failed to update item status', 'error');
    }
}

async function updateItemStatus(itemId, newStatus) {
    try {
        let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
        if (!items.length) {
            console.log('No cached items, fetching from JSONBin...');
            const allItems = await jsonBinService.getAllItems();
            items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
            console.log('Fetched JSONBin response:', allItems);
        }
        if (!Array.isArray(items)) {
            console.error('JSONBin items is not an array:', items);
            showToast('Invalid item data from cloud storage', 'error');
            return;
        }
        console.log('Items from JSONBin:', items);
        console.log('Searching for item ID:', itemId);
        const itemIndex = items.findIndex(item => String(item.id) === String(itemId));
        console.log('Item index found:', itemIndex);
        if (itemIndex === -1) {
            showToast('Item not found in cloud storage', 'error');
            return;
        }
        
        // Update status
        items[itemIndex].status = newStatus;
        items[itemIndex].lastUpdated = new Date().toISOString();
        
        // Save updated items to JSONBin
        if (items.length === 0) {
            console.warn('Attempted to save empty items array to JSONBin');
            showToast('Cannot save empty item list', 'error');
            return;
        }
        await jsonBinService.saveAllItems(items);
        cachedAllItems = items; // Update cache
        cachedUserItems = items.filter(item => String(item.sellerId) === String(getCurrentUser().id));
        currentUserItems = [...cachedUserItems]; // Update global
        filteredItems = [...currentUserItems]; // Update filtered items
        
        renderItems();
        updateStats();
        
        const statusText = newStatus === 'available' ? 'Available' : 
                          newStatus === 'sold' ? 'Sold' : 'Hidden';
        showToast(`Item marked as ${statusText}`, 'success');
        addNotification('Item status changed', `Your item "${items[itemIndex].title}" is now ${statusText}`, 'post');
    } catch (error) {
        console.error('Error updating item status:', error);
        showToast('Failed to update item status', 'error');
    }
}

async function duplicateItem(itemId) {
    console.log('Duplicating item:', itemId);
    const item = currentUserItems.find(item => String(item.id) === String(itemId));
    if (!item) {
        showToast('Item not found locally', 'error');
        return;
    }
    
    const newItem = {
        ...item,
        id: Date.now().toString(),
        title: item.title.includes('(Copy)') ? `${item.title} (Copy)` : `${item.title} (Copy)`,
        postedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'available',
        views: 0,
        inquiries: 0
    };
    
    try {
        let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
        if (!items.length) {
            console.log('No cached items, fetching from JSONBin...');
            const allItems = await jsonBinService.getAllItems();
            items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
            console.log('Fetched JSONBin response:', allItems);
        }
        if (!Array.isArray(items)) {
            console.error('JSONBin items is not an array:', items);
            showToast('Invalid item data from cloud storage', 'error');
            return;
        }
        console.log('Current items before duplicate:', items);
        items.push(newItem);
        console.log('Items after adding duplicate:', items);
        
        await jsonBinService.saveAllItems(items);
        cachedAllItems = [...items]; // Update cache with fresh copy
        cachedUserItems = items.filter(item => String(item.sellerId) === String(getCurrentUser().id));
        currentUserItems = [...cachedUserItems]; // Update global with fresh copy
        filteredItems = [...currentUserItems]; // Update filtered items
        
        renderItems();
        updateStats();
        showToast('Item duplicated successfully!', 'success');
        addNotification('Item duplicated', `Your item "${newItem.title}" has been created`, 'post');
    } catch (error) {
        console.error('Error duplicating item:', error);
        showToast('Failed to duplicate item', 'error');
    }
}

async function deleteItem(itemId) {
    console.log('Attempting to delete item:', itemId);
    const item = currentUserItems.find(item => String(item.id) === String(itemId));
    if (!item) {
        console.error('Item not found locally:', itemId);
        showToast('Item not found locally', 'error');
        return;
    }
    
    showConfirmModal('🗑️', 'Confirm Delete', `Are you sure you want to delete "${item.title}"?`, async () => {
        try {
            let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
            if (!items.length) {
                console.log('No cached items, fetching from JSONBin...');
                const allItems = await jsonBinService.getAllItems();
                items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
                console.log('Fetched JSONBin response:', allItems);
            }
            if (!Array.isArray(items)) {
                console.error('JSONBin items is not an array:', items);
                showToast('Invalid item data from cloud storage', 'error');
                return;
            }
            console.log('Items from JSONBin:', items);
            console.log('Searching for item ID:', itemId);
            const itemIndex = items.findIndex(item => String(item.id) === String(itemId));
            console.log('Item index found:', itemIndex);
            if (itemIndex === -1) {
                console.error('Item not found in cloud storage:', itemId);
                showToast('Item not found in cloud storage', 'error');
                return;
            }
            
            const updatedItems = items.filter(item => String(item.id) !== String(itemId));
            console.log('Items after deletion:', updatedItems);
            
            // Save updated items to JSONBin
            await jsonBinService.saveAllItems(updatedItems);
            cachedAllItems = [...updatedItems]; // Update cache with fresh copy
            cachedUserItems = updatedItems.filter(item => String(item.sellerId) === String(getCurrentUser().id));
            currentUserItems = [...cachedUserItems]; // Update global with fresh copy
            filteredItems = [...currentUserItems]; // Update filtered items
            
            closeConfirmModal();
            renderItems();
            updateStats();
            showToast(`Item "${item.title}" deleted successfully!`, 'success');
            addNotification('Item deleted', `Your item "${item.title}" has been deleted`, 'post');
        } catch (error) {
            console.error('Error deleting item:', error);
            showToast('Failed to delete item', 'error');
        }
    });
}

function viewItem(itemId) {
  window.location.href = `index.html#featured-items`;
}




async function boostItem(itemId) {
    try {
        let items = cachedAllItems && cachedAllItems.length > 0 ? cachedAllItems : [];
        if (!items.length) {
            console.log('No cached items, fetching from JSONBin...');
            const allItems = await jsonBinService.getAllItems();
            items = Array.isArray(allItems?.record?.items) ? allItems.record.items : [];
            console.log('Fetched JSONBin response:', allItems);
        }
        if (!Array.isArray(items)) {
            console.error('JSONBin items is not an array:', items);
            showToast('Invalid item data from cloud storage', 'error');
            return;
        }
        console.log('Items from JSONBin:', items);
        console.log('Searching for item ID:', itemId);
        const itemIndex = items.findIndex(item => String(item.id) === String(itemId));
        console.log('Item index found:', itemIndex);
        if (itemIndex === -1) {
            showToast('Item not found in cloud storage', 'error');
            return;
        }
        
        // Boost views
        items[itemIndex].views = (items[itemIndex].views || 0) + Math.floor(Math.random() * 20) + 10;
        items[itemIndex].lastUpdated = new Date().toISOString();
        
        // Save updated items to JSONBin
        if (items.length === 0) {
            console.warn('Attempted to save empty items array to JSONBin');
            showToast('Cannot save empty item list', 'error');
            return;
        }
        await jsonBinService.saveAllItems(items);
        cachedAllItems = [...items]; // Update cache with fresh copy
        cachedUserItems = items.filter(item => String(item.sellerId) === String(getCurrentUser().id));
        currentUserItems = [...cachedUserItems]; // Update global
        filteredItems = [...currentUserItems]; // Update filtered items
        
        renderItems();
        updateStats();
        showToast('Item boosted! More people will see it now.', 'success');
        addNotification('Item boosted', `Your item "${items[itemIndex].title}" has been boosted`, 'post');
    } catch (error) {
        console.error('Error boosting item:', error);
        showToast('Failed to boost item', 'error');
    }
}

function goToPostItem() {
    window.location.href = 'post-item.html';
}

function showUserMenu() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-item" onclick="goToPostItem()">📦 Post Item</div>
        <div class="user-menu-item" onclick="window.location.href='index.html'">🏠 Homepage</div>
        <div class="user-menu-item" onclick="goToProfile()">👤 Profile</div>
        <div class="user-menu-divider"></div>
        <div class="user-menu-item logout" onclick="logout()">🚪 Logout</div>
    `;
    
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        const rect = userMenuBtn.getBoundingClientRect();
        menu.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 10}px;
            right: 1rem;
            z-index: 1000;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 150px;
        `;
        document.body.appendChild(menu);
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !userMenuBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
}

function changeViewMode() {
    const viewMode = document.getElementById('viewMode')?.value;
    const grid = document.getElementById('myItemsGrid');
    if (!grid || !viewMode) return;
    
    if (viewMode === 'list') {
        grid.classList.add('list-view');
        grid.classList.remove('grid-view');
    } else {
        grid.classList.add('grid-view');
        grid.classList.remove('list-view');
    }
}

function showBulkActions() {
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedIds.length === 0) {
        showToast('Please select items first', 'error');
        return;
    }
    
    showToast(`Bulk actions for ${selectedIds.length} items - Coming soon!`, 'info');
}

function showConfirmModal(icon, title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) {
        console.error('Confirm modal not found');
        showToast('Cannot perform action: modal not found', 'error');
        return;
    }
    
    const confirmIcon = document.getElementById('confirmIcon');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (confirmIcon) confirmIcon.textContent = icon;
    if (confirmTitle) confirmTitle.textContent = title;
    if (confirmMessage) confirmMessage.textContent = message;
    if (confirmBtn) confirmBtn.onclick = onConfirm;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

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

function goToProfile() {
    window.location.href = 'profile.html';
}

function logout() {
    showConfirmModal('🚪', 'Confirm Logout', 'Are you sure you want to logout?', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        window.location.href = 'index.html';
    });
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
    if (notifications.length > 50) notifications.splice(50);
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}