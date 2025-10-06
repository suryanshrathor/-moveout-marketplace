// Complete My Items Dashboard JavaScript with WhatsApp Integration - js/my-items.js
import { dbService } from './database-service.js';


// Global variables
let currentUserItems = [];
let filteredItems = [];
let currentPage = 1;
let itemsPerPage = 6;
let editingItemId = null;

// Initialize the My Items page
document.addEventListener('DOMContentLoaded', function() {
    console.log('My Items page loaded');
    loadWhatsAppStyles(); // Load WhatsApp button styles
    initializeMyItemsPage();
});

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
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
}

// WHATSAPP INTEGRATION FUNCTIONS

// Quick WhatsApp share for items
function shareItemOnWhatsApp(itemId) {
    const item = getItemById(itemId);
    if (!item) return;
    
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

// Copy item link for sharing
function copyItemLink(itemId) {
    const itemUrl = `${window.location.origin}/index.html#item-${itemId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(itemUrl).then(() => {
            showSuccessMessage('Link copied to clipboard! Share it anywhere.');
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
        showSuccessMessage('Link copied!');
    } catch (err) {
        alert('Could not copy link. Please copy manually: ' + text);
    }
    document.body.removeChild(textArea);
}

// Utility function for WhatsApp integration
function getItemById(itemId) {
    return currentUserItems.find(item => item.id == itemId);
}

// END WHATSAPP INTEGRATION

function initializeMyItemsPage() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to access your items');
        window.location.href = 'login.html';
        return;
    }
    
    setupEventListeners();
    loadUserItems();
    updateHeaderForUser();
    updateStats();
}

function setupEventListeners() {
    // Header actions
    document.getElementById('backToHomeBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    document.getElementById('postItemBtn').addEventListener('click', goToPostItem);
    document.getElementById('postNewItemBtn').addEventListener('click', goToPostItem);
    document.getElementById('userMenuBtn').addEventListener('click', showUserMenu);
    
    // Search and filters
    document.getElementById('itemSearch').addEventListener('input', debounce(filterItems, 300));
    document.getElementById('statusFilter').addEventListener('change', filterItems);
    document.getElementById('categoryFilter').addEventListener('change', filterItems);
    document.getElementById('viewMode').addEventListener('change', changeViewMode);
    
    // Bulk actions
    document.getElementById('bulkActionsBtn').addEventListener('click', showBulkActions);
}

function updateHeaderForUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('userMenuBtn').textContent = `Hi, ${currentUser.firstName}`;
    }
}

// Replace loadUserItems function
async function loadUserItems() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    console.log('Loading user items from Firebase...');
    
    // Load from Firebase
    const firebaseItems = await dbService.getUserItems(currentUser.id);
    
    // Load from localStorage as backup
    const localItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]')
        .filter(item => item.sellerId === currentUser.id);
    
    // Merge and deduplicate
    const mergedItems = [...firebaseItems, ...localItems];
    currentUserItems = mergedItems.filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id)
    );
    
    console.log(`Found ${currentUserItems.length} user items`);
    
    filteredItems = [...currentUserItems];
    renderItemsGrid();
    updateStats();
}


function updateStats() {
    const totalItems = currentUserItems.length;
    const activeItems = currentUserItems.filter(item => item.status === 'available').length;
    const soldItems = currentUserItems.filter(item => item.status === 'sold').length;
    const totalViews = currentUserItems.reduce((sum, item) => sum + (item.views || 0), 0);
    
    document.getElementById('totalItemsCount').textContent = totalItems;
    document.getElementById('activeItemsCount').textContent = activeItems;
    document.getElementById('soldItemsCount').textContent = soldItems;
    document.getElementById('totalViewsCount').textContent = totalViews;
}

function renderItems() {
    const container = document.getElementById('myItemsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    container.style.display = 'grid';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, endIndex);
    
    // Render items
    container.innerHTML = '';
    pageItems.forEach(item => {
        const itemCard = createMyItemCard(item);
        container.appendChild(itemCard);
    });
    
    // Update pagination
    updatePagination(totalPages);
}

function createMyItemCard(item) {
    const card = document.createElement('div');
    card.className = 'my-item-card';
    card.dataset.itemId = item.id;
    
    // Determine image display
    let imageDisplay;
    if (item.images && item.images.length > 0) {
        const imageCount = item.images.length > 1 ? 
            `<div class="image-count-badge">${item.images.length} photos</div>` : '';
        imageDisplay = `
            <div class="item-image-container">
                <img src="${item.images[0].data}" alt="${item.title}">
                ${imageCount}
            </div>`;
    } else {
        imageDisplay = `<div class="item-emoji-image">${item.image}</div>`;
    }
    
    // Status badge
    const statusBadge = getStatusBadge(item.status);
    
    // Time since posted
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
            
            <!-- WhatsApp Quick Share Section -->
            <div class="item-whatsapp-section" style="margin: 12px 0; padding: 8px; background: #323434; border-radius: 6px;">
                <p style="font-size: 0.75rem; color: #fbf9f9ff; margin: 0 0 6px 0;">Share with potential buyers:</p>
                <div style="display: flex; gap: 8px;">
                    <button class="whatsapp-share-btn" onclick="shareItemOnWhatsApp(${item.id})" title="Share on WhatsApp">
                        💬 WhatsApp
                    </button>
                    <button class="btn btn--outline btn--small" onclick="copyItemLink(${item.id})" title="Copy link to share">
                        📋 Copy Link
                    </button>
                </div>
            </div>
        </div>
        <div class="item-actions-section">
            <div class="item-actions">
                <button class="action-btn edit-btn" onclick="editItem(${item.id})" title="Edit Item">
                    ✏️
                </button>
                <button class="action-btn status-btn" onclick="toggleStatus(${item.id})" title="Change Status">
                    ${item.status === 'available' ? '✅' : item.status === 'sold' ? '💰' : '👁️'}
                </button>
                <button class="action-btn duplicate-btn" onclick="duplicateItem(${item.id})" title="Duplicate Item">
                    📋
                </button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})" title="Delete Item">
                    🗑️
                </button>
            </div>
            <div class="item-quick-actions">
                <button class="btn btn--small btn--outline" onclick="viewItem(${item.id})">
                    View Details
                </button>
                <button class="btn btn--small btn--primary" onclick="boostItem(${item.id})">
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
    const search = document.getElementById('itemSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    filteredItems = currentUserItems.filter(item => {
        const matchesSearch = !search || 
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search);
        
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    currentPage = 1; // Reset to first page
    renderItems();
}

function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
    
    // Add click events if not already added
    if (!document.getElementById('prevPageBtn').onclick) {
        document.getElementById('prevPageBtn').onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderItems();
            }
        };
        
        document.getElementById('nextPageBtn').onclick = () => {
            const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderItems();
            }
        };
    }
}

// Item Actions
function editItem(itemId) {
    console.log('Editing item:', itemId);
    const item = currentUserItems.find(item => item.id === itemId);
    if (!item) return;
    
    editingItemId = itemId;
    showEditModal(item);
}

function showEditModal(item) {
    const modal = document.getElementById('editItemModal');
    const form = document.getElementById('editItemForm');
    
    // Populate edit form
    form.innerHTML = `
        <div class="form-group">
            <label for="editTitle">Title *</label>
            <input type="text" id="editTitle" value="${item.title}" class="form-control" required maxlength="100">
            <span class="char-counter">0/100</span>
        </div>
        
        <div class="form-group">
            <label for="editDescription">Description *</label>
            <textarea id="editDescription" class="form-control" rows="4" required maxlength="500">${item.description}</textarea>
            <span class="char-counter">0/500</span>
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
                    <option value="Chennai" ${item.location === 'Chennai' ? 'selected' : ''}>Chennai</option>
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
    
    // Setup character counters
    setupEditCharCounters();
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function setupEditCharCounters() {
    const titleInput = document.getElementById('editTitle');
    const descInput = document.getElementById('editDescription');
    
    if (titleInput) {
        const counter = titleInput.parentElement.querySelector('.char-counter');
        updateCharCounter(titleInput, counter);
        titleInput.addEventListener('input', () => updateCharCounter(titleInput, counter));
    }
    
    if (descInput) {
        const counter = descInput.parentElement.querySelector('.char-counter');
        updateCharCounter(descInput, counter);
        descInput.addEventListener('input', () => updateCharCounter(descInput, counter));
    }
}

function updateCharCounter(input, counter) {
    if (!counter) return;
    const current = input.value.length;
    const max = input.getAttribute('maxlength');
    counter.textContent = `${current}/${max}`;
}

function saveItemChanges() {
    if (!editingItemId) return;
    
    // Get form values
    const updatedData = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        price: parseFloat(document.getElementById('editPrice').value),
        condition: document.getElementById('editCondition').value,
        category: document.getElementById('editCategory').value,
        location: document.getElementById('editLocation').value,
        status: document.getElementById('editStatus').value,
        negotiable: document.getElementById('editNegotiable').checked,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Validate
    if (!updatedData.title || !updatedData.description || !updatedData.price) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Update in localStorage
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const itemIndex = allItems.findIndex(item => item.id === editingItemId);
    
    if (itemIndex !== -1) {
        allItems[itemIndex] = { ...allItems[itemIndex], ...updatedData };
        localStorage.setItem('marketplaceItems', JSON.stringify(allItems));
        
        // Update local arrays
        const localIndex = currentUserItems.findIndex(item => item.id === editingItemId);
        if (localIndex !== -1) {
            currentUserItems[localIndex] = { ...currentUserItems[localIndex], ...updatedData };
        }
        
        closeEditModal();
        filterItems(); // Refresh display
        updateStats();
        
        showSuccessMessage('Item updated successfully!');
        
        // Add notification for profile system
        addNotification('Item updated', `Your item "${updatedData.title}" has been updated`, 'post');
    }
}

function closeEditModal() {
    document.getElementById('editItemModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    editingItemId = null;
}

function toggleStatus(itemId) {
    const item = currentUserItems.find(item => item.id === itemId);
    if (!item) return;
    
    const newStatus = item.status === 'available' ? 'sold' : 'available';
    updateItemStatus(itemId, newStatus);
}

// Update updateItemStatus function
async function updateItemStatus(itemId, newStatus) {
    const result = await dbService.updateItem(itemId, { status: newStatus });
    
    if (result.success) {
        // Update localStorage
        const localItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
        const itemIndex = localItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            localItems[itemIndex].status = newStatus;
            localStorage.setItem('marketplaceItems', JSON.stringify(localItems));
        }
        
        // Update current arrays
        const updateArrays = (items) => {
            const itemIndex = items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                items[itemIndex].status = newStatus;
            }
        };
        
        updateArrays(currentUserItems);
        updateArrays(filteredItems);
        
        renderItemsGrid();
        updateStats();
        
        showToast(`Item marked as ${newStatus}!`, 'success');
    } else {
        showToast('Failed to update item status. Please try again.', 'error');
    }
}

function duplicateItem(itemId) {
    const item = currentUserItems.find(item => item.id === itemId);
    if (!item) return;
    
    const newItem = {
        ...item,
        id: Date.now(),
        title: item.title + ' (Copy)',
        postedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        views: 0,
        inquiries: 0
    };
    
    // Add to localStorage
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    allItems.unshift(newItem);
    localStorage.setItem('marketplaceItems', JSON.stringify(allItems));
    
    // Reload items
    loadUserItems();
    showSuccessMessage('Item duplicated successfully!');
    
    // Add notification for profile system
    addNotification('Item duplicated', `Your item "${item.title}" has been duplicated`, 'post');
}

// Update deleteItem function
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    // Delete from Firebase
    const result = await dbService.deleteItem(itemId);
    
    if (result.success) {
        // Also remove from localStorage
        const localItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
        const updatedItems = localItems.filter(item => item.id !== itemId);
        localStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
        
        // Remove from current arrays
        currentUserItems = currentUserItems.filter(item => item.id !== itemId);
        filteredItems = filteredItems.filter(item => item.id !== itemId);
        
        // Re-render
        renderItemsGrid();
        updateStats();
        
        showToast('Item deleted successfully!', 'success');
    } else {
        showToast('Failed to delete item. Please try again.', 'error');
    }
}


function viewItem(itemId) {
    // Open item in homepage modal
    window.open(`index.html#item-${itemId}`, '_blank');
}

function boostItem(itemId) {
    const item = currentUserItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Mock boost functionality
    item.views = (item.views || 0) + Math.floor(Math.random() * 20) + 10;
    item.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Update in storage
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const itemIndex = allItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        allItems[itemIndex] = item;
        localStorage.setItem('marketplaceItems', JSON.stringify(allItems));
    }
    
    renderItems();
    updateStats();
    showSuccessMessage('Item boosted! More people will see it now.');
    
    // Add notification for profile system
    addNotification('Item boosted', `Your item "${item.title}" has been boosted`, 'post');
}

// Navigation functions
function goToPostItem() {
    window.location.href = 'post-item.html';
}

function showUserMenu() {
    // Implement user menu similar to homepage
    const currentUser = getCurrentUser();
    if (currentUser) {
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
        
        // Position menu
        const rect = document.getElementById('userMenuBtn').getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.right = '1rem';
        menu.style.zIndex = '1000';
        
        document.body.appendChild(menu);
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !document.getElementById('userMenuBtn').contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
}

function changeViewMode() {
    const viewMode = document.getElementById('viewMode').value;
    const grid = document.getElementById('myItemsGrid');
    
    if (viewMode === 'list') {
        grid.classList.add('list-view');
        grid.classList.remove('grid-view');
    } else {
        grid.classList.add('grid-view');
        grid.classList.remove('list-view');
    }
}

// Helper functions
function showBulkActions() {
    // Get selected items
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        alert('Please select items first');
        return;
    }
    
    // Show bulk actions menu
    alert(`Bulk actions for ${selectedIds.length} items - Coming soon!`);
}

function showConfirmModal(icon, title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmIcon').textContent = icon;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    document.getElementById('confirmBtn').onclick = onConfirm;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showSuccessMessage(message) {
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
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        window.location.href = 'index.html';
    }
}

// Notification function for profile integration
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

// Utility functions
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}