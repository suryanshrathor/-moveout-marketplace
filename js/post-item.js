// Complete Updated post-item.js with WhatsApp Integration - Replace your entire file with this
import { dbService } from './database-service.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Post item script loaded!');
    initializePostItemPage();
});

function initializePostItemPage() {
    console.log('DOM loaded, initializing...');
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to post an item');
        window.location.href = 'login.html';
        return;
    }
    
    setupPostItemForm();
    setupHeaderActions();
    populateUserInfo();
    setupCharacterCounters();
    setupImageUpload();
    setupPriceSuggestions();
    setupWhatsAppFeatures(); // NEW: WhatsApp integration
}

// NEW: WhatsApp Integration Setup
function setupWhatsAppFeatures() {
    // Add WhatsApp styles
    loadWhatsAppStyles();
    
    // Add phone number validation
    const phoneField = document.getElementById('sellerPhone');
    if (phoneField) {
        phoneField.addEventListener('input', validatePhoneNumber);
        phoneField.addEventListener('blur', formatPhoneNumber);
    }
}

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

    .phone-validation {
        font-size: 0.8rem;
        margin-top: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        display: none;
    }

    .phone-validation.valid {
        background: #dcfce7;
        color: #166534;
        display: block;
    }

    .phone-validation.invalid {
        background: #fef2f2;
        color: #dc2626;
        display: block;
    }

    .whatsapp-preview {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 8px;
        padding: 12px;
        margin-top: 8px;
        font-size: 0.85rem;
    }

    .whatsapp-preview-header {
        font-weight: 600;
        color: #0ea5e9;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = whatsappStyles;
    document.head.appendChild(styleSheet);
}

// NEW: Phone number validation for WhatsApp
function validatePhoneNumber(e) {
    const phoneInput = e.target;
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    let validationEl = phoneInput.parentElement.querySelector('.phone-validation');
    
    if (!validationEl) {
        validationEl = document.createElement('div');
        validationEl.className = 'phone-validation';
        phoneInput.parentElement.appendChild(validationEl);
    }
    
    if (phoneValue.length === 0) {
        validationEl.style.display = 'none';
        return;
    }
    
    if (isValidIndianPhone(phoneValue)) {
        validationEl.className = 'phone-validation valid';
        validationEl.innerHTML = '✓ Valid Indian mobile number - WhatsApp ready!';
    } else {
        validationEl.className = 'phone-validation invalid';
        validationEl.innerHTML = '✗ Please enter a valid 10-digit Indian mobile number';
    }
}

function isValidIndianPhone(phone) {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number (10 digits starting with 6-9)
    if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
        return true;
    }
    
    // Also accept 11 digits starting with 0 (like 09876543210)
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        const mobile = cleanPhone.substring(1);
        return mobile.length === 10 && /^[6-9]/.test(mobile);
    }
    
    // Also accept 12 digits starting with 91 (like 919876543210)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        const mobile = cleanPhone.substring(2);
        return mobile.length === 10 && /^[6-9]/.test(mobile);
    }
    
    return false;
}

function formatPhoneNumber(e) {
    const phoneInput = e.target;
    let phoneValue = phoneInput.value.replace(/\D/g, '');
    
    // Auto-format to Indian format
    if (phoneValue.length === 10 && /^[6-9]/.test(phoneValue)) {
        phoneInput.value = `+91-${phoneValue}`;
    } else if (phoneValue.length === 11 && phoneValue.startsWith('0')) {
        const mobile = phoneValue.substring(1);
        phoneInput.value = `+91-${mobile}`;
    } else if (phoneValue.length === 12 && phoneValue.startsWith('91')) {
        const mobile = phoneValue.substring(2);
        phoneInput.value = `+91-${mobile}`;
    }
}

function setupPostItemForm() {
    const form = document.getElementById('postItemForm');
    const previewBtn = document.getElementById('previewBtn');
    
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        if (validateForm()) {
            submitItem();
        }
    });
    
    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Preview clicked');
            if (validateForm()) {
                showPreview();
            }
        });
    }
}

function setupHeaderActions() {
    // Back to home
    const backBtn = document.getElementById('backToHomeBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // My items
    const myItemsBtn = document.getElementById('myItemsBtn');
    if (myItemsBtn) {
        myItemsBtn.addEventListener('click', () => {
            window.location.href = 'my-items.html';
        });
    }
    
    // User menu (updated for WhatsApp integration)
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', showUserMenu);
        
        const currentUser = getCurrentUser();
        if (currentUser) {
            userMenuBtn.textContent = `Hi, ${currentUser.firstName}`;
        }
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('rememberLogin');
                window.location.href = 'index.html';
            }
        });
    }
}

// NEW: User menu with WhatsApp features
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
        <div class="user-menu-item" onclick="window.location.href='my-items.html'">📋 My Items</div>
        <div class="user-menu-item" onclick="window.location.href='index.html'">🏠 Homepage</div>
        <div class="user-menu-item" onclick="goToProfile()">👤 Profile</div>
        <div class="user-menu-divider"></div>
        <div class="user-menu-item logout" onclick="logout()">🚪 Logout</div>
    `;
    
    // Position menu
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
    }
    
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

function populateUserInfo() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const nameField = document.getElementById('sellerName');
        const phoneField = document.getElementById('sellerPhone');
        const locationField = document.getElementById('itemLocation');
        
        if (nameField) {
            nameField.value = `${currentUser.firstName} ${currentUser.lastName}`;
        }
        if (phoneField && currentUser.phone) {
            phoneField.value = currentUser.phone;
            // Trigger validation
            phoneField.dispatchEvent(new Event('input'));
        }
        if (locationField && currentUser.location) {
            locationField.value = currentUser.location;
        }
    }
}

function setupCharacterCounters() {
    // Title character counter
    const titleInput = document.getElementById('itemTitle');
    if (titleInput) {
        const titleCounter = titleInput.parentElement.querySelector('.char-counter');
        if (titleCounter) {
            titleInput.addEventListener('input', function() {
                updateCharCounter(this, titleCounter);
            });
        }
    }
    
    // Description character counter
    const descInput = document.getElementById('itemDescription');
    if (descInput) {
        const descCounter = descInput.parentElement.querySelector('.char-counter');
        if (descCounter) {
            descInput.addEventListener('input', function() {
                updateCharCounter(this, descCounter);
            });
        }
    }
}

function updateCharCounter(input, counter) {
    if (!counter) return;
    
    const current = input.value.length;
    const max = input.getAttribute('maxlength');
    counter.textContent = `${current}/${max}`;
    
    // Change color when approaching limit
    if (current > max * 0.8) {
        counter.style.color = '#f59e0b';
    } else if (current > max * 0.9) {
        counter.style.color = '#ef4444';
    } else {
        counter.style.color = '#6b7280';
    }
}

// UPDATED: Enhanced image upload to store images properly
function setupImageUpload() {
    const imageInput = document.getElementById('itemImages');
    const uploadTrigger = document.getElementById('uploadTrigger');
    const previewContainer = document.getElementById('imagePreview');
    
    // Store uploaded images globally
    window.uploadedImages = [];
    
    if (!imageInput || !uploadTrigger || !previewContainer) {
        console.error('Image upload elements not found');
        return;
    }
    
    console.log('Setting up image upload...');
    
    // Click trigger to open file dialog
    uploadTrigger.addEventListener('click', function() {
        console.log('Upload area clicked');
        imageInput.click();
    });
    
    imageInput.addEventListener('change', function(e) {
        console.log('Files selected:', e.target.files);
        const files = Array.from(e.target.files);
        
        // Validate number of images
        if (files.length > 5) {
            showError('imagesError', 'You can upload maximum 5 images');
            return;
        }
        
        // Clear previous previews and stored images
        previewContainer.innerHTML = '';
        window.uploadedImages = [];
        clearError('imagesError');
        
        if (files.length === 0) return;
        
        files.forEach((file, index) => {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('imagesError', `Image ${file.name} is too large. Maximum size is 5MB`);
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('imagesError', `${file.name} is not a valid image file`);
                return;
            }
            
            // Create preview and store image
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                // Store the image data
                window.uploadedImages.push({
                    name: file.name,
                    data: imageData,
                    size: file.size
                });
                
                // Create preview
                const previewItem = createImagePreview(imageData, index, file.name);
                previewContainer.appendChild(previewItem);
                
                console.log(`Image ${index + 1} processed and stored`);
            };
            reader.readAsDataURL(file);
        });
    });
}

function createImagePreview(src, index, fileName) {
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.innerHTML = `
        <img src="${src}" alt="Preview ${index + 1}">
        <div class="image-preview-overlay">
            <span class="image-name">${fileName}</span>
            <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `;
    return previewItem;
}

function removeImage(index) {
    const previewContainer = document.getElementById('imagePreview');
    const previewItems = previewContainer.children;
    
    if (previewItems[index]) {
        previewItems[index].remove();
        // Also remove from stored images
        if (window.uploadedImages && window.uploadedImages[index]) {
            window.uploadedImages.splice(index, 1);
        }
    }
}

function setupPriceSuggestions() {
    const priceInput = document.getElementById('itemPrice');
    const categorySelect = document.getElementById('itemCategory');
    const conditionSelect = document.getElementById('itemCondition');
    const suggestionElement = document.getElementById('priceSuggestion');
    
    if (!priceInput || !categorySelect || !conditionSelect || !suggestionElement) {
        return;
    }
    
    function updatePriceSuggestion() {
        const category = categorySelect.value;
        const condition = conditionSelect.value;
        const currentPrice = parseFloat(priceInput.value);
        
        if (category && condition && currentPrice > 0) {
            const suggestion = getPriceSuggestion(category, condition, currentPrice);
            suggestionElement.textContent = suggestion;
            suggestionElement.style.display = 'block';
        } else {
            suggestionElement.style.display = 'none';
        }
    }
    
    priceInput.addEventListener('input', updatePriceSuggestion);
    categorySelect.addEventListener('change', updatePriceSuggestion);
    conditionSelect.addEventListener('change', updatePriceSuggestion);
}

function getPriceSuggestion(category, condition, price) {
    // Simple price suggestion logic
    const categoryRanges = {
        'Electronics': { min: 1000, max: 200000 },
        'Furniture': { min: 500, max: 50000 },
        'Appliances': { min: 1000, max: 100000 },
        'Books': { min: 50, max: 5000 },
        'Clothing': { min: 100, max: 10000 },
        'Sports': { min: 200, max: 20000 }
    };
    
    const range = categoryRanges[category];
    if (!range) return '';
    
    if (price < range.min) {
        return `💡 Suggested range for ${category}: ₹${range.min.toLocaleString()} - ₹${range.max.toLocaleString()}`;
    } else if (price > range.max) {
        return `⚠️ This seems high for ${category}. Consider pricing between ₹${range.min.toLocaleString()} - ₹${range.max.toLocaleString()}`;
    } else {
        return `✅ Good pricing for ${category}!`;
    }
}

// UPDATED: Enhanced form validation with phone validation
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate title
    const title = document.getElementById('itemTitle').value.trim();
    if (!title) {
        showError('titleError', 'Item title is required');
        isValid = false;
    } else if (title.length < 5) {
        showError('titleError', 'Title must be at least 5 characters long');
        isValid = false;
    }
    
    // Validate description
    const description = document.getElementById('itemDescription').value.trim();
    if (!description) {
        showError('descriptionError', 'Description is required');
        isValid = false;
    } else if (description.length < 20) {
        showError('descriptionError', 'Description must be at least 20 characters long');
        isValid = false;
    }
    
    // Validate category
    if (!document.getElementById('itemCategory').value) {
        showError('categoryError', 'Please select a category');
        isValid = false;
    }
    
    // Validate condition
    if (!document.getElementById('itemCondition').value) {
        showError('conditionError', 'Please select item condition');
        isValid = false;
    }
    
    // Validate price
    const price = parseFloat(document.getElementById('itemPrice').value);
    if (!price || price <= 0) {
        showError('priceError', 'Please enter a valid price');
        isValid = false;
    } else if (price > 10000000) {
        showError('priceError', 'Price cannot exceed ₹1 crore');
        isValid = false;
    }
    
    // Validate location
    if (!document.getElementById('itemLocation').value) {
        showError('locationError', 'Please select your city');
        isValid = false;
    }
    
    // NEW: Validate phone number for WhatsApp
    const phone = document.getElementById('sellerPhone').value.replace(/\D/g, '');
    if (!isValidIndianPhone(phone)) {
        showError('phoneError', 'Please enter a valid Indian mobile number for WhatsApp contact');
        isValid = false;
    }
    
    // Validate terms
    if (!document.getElementById('agreeTerms').checked) {
        showError('termsError', 'You must agree to the terms');
        isValid = false;
    }
    
    return isValid;
}

function submitItem() {
    console.log('Submitting item...');
    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Posting...';
        submitBtn.disabled = true;
        
        // Simulate posting delay
        setTimeout(() => {
            // Save to localStorage
            saveItemToStorage(formData);
            
            // Show success modal with WhatsApp integration
            showSuccessModal(formData);
            
            // Reset form
            const form = document.getElementById('postItemForm');
            if (form) {
                form.reset();
            }
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Add notification
            addNotification('Item posted', `Your item "${formData.title}" has been posted successfully`, 'post');
            
        }, 2000);
    }
}

// UPDATED: collectFormData to include proper WhatsApp-ready phone format
function collectFormData() {
    const currentUser = getCurrentUser();
    
    // Get the first uploaded image or use emoji icon
    let itemImage = getRandomItemIcon(document.getElementById('itemCategory').value);
    if (window.uploadedImages && window.uploadedImages.length > 0) {
        itemImage = window.uploadedImages[0].data; // Use first uploaded image
    }
    
    // Format phone for WhatsApp compatibility
    const rawPhone = document.getElementById('sellerPhone').value;
    const formattedPhone = formatPhoneForWhatsApp(rawPhone);
    
    return {
        id: Date.now(),
        title: document.getElementById('itemTitle').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        category: document.getElementById('itemCategory').value,
        condition: document.getElementById('itemCondition').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        negotiable: document.getElementById('priceNegotiable').checked,
        location: document.getElementById('itemLocation').value,
        area: document.getElementById('itemArea').value.trim(),
        seller: document.getElementById('sellerName').value.trim(),
        phone: formattedPhone, // WhatsApp-ready format
        preferredContact: document.querySelector('input[name="preferredContact"]:checked').value,
        postedDate: new Date().toISOString().split('T')[0],
        status: 'available',
        sellerId: currentUser.id,
        image: itemImage,
        images: window.uploadedImages || [], // Store all uploaded images
        urgent: false // Can be updated later
    };
}

// NEW: Format phone number for WhatsApp compatibility
function formatPhoneForWhatsApp(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Return in +91-XXXXXXXXXX format for WhatsApp
    if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
        return `+91-${cleanPhone}`;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        const mobile = cleanPhone.substring(1);
        return `+91-${mobile}`;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        const mobile = cleanPhone.substring(2);
        return `+91-${mobile}`;
    }
    
    return phone; // Return as-is if format is unexpected
}

function getRandomItemIcon(category) {
    const icons = {
        'Electronics': ['💻', '📱', '🖥️', '⌚', '🎮', '📷', '🎧'],
        'Furniture': ['🪑', '🛏️', '🚪', '🗃️', '🛋️'],
        'Appliances': ['🔥', '🧊', '🌪️', '💡'],
        'Books': ['📚', '📖', '📘', '📙'],
        'Clothing': ['👕', '👖', '👗', '🧥', '👟'],
        'Sports': ['⚽', '🏀', '🎾', '🏐', '🏓'],
        'Other': ['📦', '🔧', '🎯', '🎨']
    };
    
    const categoryIcons = icons[category] || icons['Other'];
    return categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
}

// function saveItemToStorage(itemData) {
//     // Get existing items
//     const existingItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    
//     // Add new item
//     existingItems.unshift(itemData); // Add to beginning
    
//     // Save back to storage
//     localStorage.setItem('marketplaceItems', JSON.stringify(existingItems));
    
//     console.log('Item saved:', itemData);
// }
// Replace saveItemToStorage function
async function saveItemToStorage(itemData) {
    // Show loading
    showToast('Saving item...', 'info');
    
    // Save to Firebase instead of localStorage
    const result = await dbService.saveItem(itemData);
    
    if (result.success) {
        console.log('Item saved to Firebase:', itemData);
        showToast('Item posted successfully!', 'success');
        
        // Update the item with the Firebase ID
        itemData.id = result.id;
        
        // Also save to localStorage as backup
        const existingItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
        existingItems.unshift(itemData);
        localStorage.setItem('marketplaceItems', JSON.stringify(existingItems));
    } else {
        console.error('Failed to save item:', result.error);
        showToast('Failed to post item. Please try again.', 'error');
    }
}

// UPDATED: showPreview to show actual uploaded images
function showPreview() {
    console.log('Showing preview...');
    const formData = collectFormData();
    
    // Determine what image to show in preview
    let previewImage;
    if (formData.images && formData.images.length > 0) {
        // Show actual uploaded image
        previewImage = `<img src="${formData.images[0].data}" alt="Item photo" style="width: 100%; height: 200px; object-fit: contain; border-radius: 0.5rem;">`;
        if (formData.images.length > 1) {
            previewImage += `<div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">${formData.images.length} photos</div>`;
        }
    } else {
        // Show emoji icon
        previewImage = `<div class="item-image" style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 200px; background: #f3f4f6;">${formData.image}</div>`;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'previewModal';
    modal.innerHTML = `
        <div class="modal-content preview-modal">
            <div class="modal-header">
                <h2>Preview Your Listing</h2>
                <button onclick="closePreview()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="item-card preview-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; max-width: 400px; margin: 0 auto;">
                    <div style="position: relative;">
                        ${previewImage}
                    </div>
                    <div class="item-content" style="padding: 16px;">
                        <h3 class="item-title" style="font-size: 1.1rem; font-weight: 600; color: #1a1a1a; margin: 0 0 8px 0;">${formData.title}</h3>
                        <div class="item-price" style="font-size: 1.2rem; font-weight: 700; color: #3b82f6; margin-bottom: 8px;">₹${formData.price.toLocaleString()}${formData.negotiable ? ' (Negotiable)' : ''}</div>
                        <div class="item-details" style="display: flex; gap: 12px; font-size: 0.85rem; color: #666; margin-bottom: 12px;">
                            <span>📍 ${formData.location}${formData.area ? ', ' + formData.area : ''}</span>
                            <span>${formData.condition}</span>
                        </div>
                        <p class="item-description" style="font-size: 0.9rem; color: #666; line-height: 1.4; margin-bottom: 12px;">${formData.description}</p>
                        <div class="seller-preview" style="font-size: 0.85rem; color: #666; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                            <div><strong>Seller:</strong> ${formData.seller}</div>
                            <div><strong>Contact:</strong> ${formData.phone} (${formData.preferredContact})</div>
                        </div>
                        
                        <!-- WhatsApp Preview -->
                        <div class="whatsapp-preview" style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 0.85rem;">
                            <div class="whatsapp-preview-header" style="font-weight: 600; color: #0ea5e9; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                💬 WhatsApp Integration Ready
                            </div>
                            <div>Buyers can contact you directly via WhatsApp with pre-filled messages about your item.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="closePreview()" class="btn btn--outline">Edit Listing</button>
                <button onclick="submitFromPreview()" class="btn btn--primary">Looks Good, Post It!</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    console.log('Preview modal added to DOM');
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.remove();
        document.body.classList.remove('modal-open');
        console.log('Preview modal closed');
    }
}

// FIXED: submitFromPreview function
function submitFromPreview() {
    console.log('Submit from preview clicked');
    closePreview(); // Close the preview modal first
    
    // Small delay to ensure modal is closed
    setTimeout(() => {
        submitItem(); // Then submit the item
    }, 100);
}

// UPDATED: Success modal with WhatsApp sharing
function showSuccessModal(itemData) {
    console.log('Showing success modal...');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'successModal';
    modal.innerHTML = `
        <div class="modal-content success-modal">
            <div class="modal-body">
                <div class="success-icon">🎉</div>
                <h2>Item Posted Successfully!</h2>
                <p>Your item "${itemData.title}" is now live and visible to potential buyers.</p>
                
                <div class="whatsapp-share-section" style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h4 style="color: #0ea5e9; margin: 0 0 8px 0;">📢 Promote Your Item</h4>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 12px;">Share your item on WhatsApp to reach more buyers:</p>
                    <button onclick="shareNewItemOnWhatsApp()" class="whatsapp-btn" style="width: 100%; justify-content: center;">
                        💬 Share on WhatsApp
                    </button>
                </div>
                
                <div class="success-actions">
                    <button onclick="goToHomepage()" class="btn btn--primary">
                        View on Homepage
                    </button>
                    <button onclick="goToMyItems()" class="btn btn--outline">
                        Manage My Items
                    </button>
                    <button onclick="postAnother()" class="btn btn--outline">
                        Post Another Item
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Store the item data for sharing
    window.lastPostedItem = itemData;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    console.log('Success modal added to DOM');
}

// NEW: Share newly posted item on WhatsApp
function shareNewItemOnWhatsApp() {
    const item = window.lastPostedItem;
    if (!item) return;
    
    const message = `🎉 Just posted a new item on MoveOut Market!

*${item.title}*
Price: ₹${item.price.toLocaleString()}${item.negotiable ? ' (Negotiable)' : ''}
Condition: ${item.condition}
Location: ${item.location}

${item.description}

Interested? Contact me: ${item.phone}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Show toast
    showToast('Opening WhatsApp to share your item...', 'success');
}

function goToHomepage() {
    document.body.classList.remove('modal-open');
    window.location.href = 'index.html';
}

function goToMyItems() {
    document.body.classList.remove('modal-open');
    window.location.href = 'my-items.html';
}

// UPDATED: postAnother to clear uploaded images and WhatsApp data
function postAnother() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
        document.body.classList.remove('modal-open');
    }
    window.scrollTo(0, 0);
    
    // Reset form
    const form = document.getElementById('postItemForm');
    if (form) {
        form.reset();
    }
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
    
    // Clear uploaded images and WhatsApp data
    window.uploadedImages = [];
    window.lastPostedItem = null;
    
    // Re-populate user info
    populateUserInfo();
    
    console.log('Form reset for new item');
}

// NEW: Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// NEW: Notification function for profile integration
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

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}