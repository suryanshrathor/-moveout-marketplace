// Complete Profile Page JavaScript - js/profile.js

// Global variables
let currentUserProfile = {};
let notificationsData = [];
let selectedAvatar = '👤';
let viewsChart = null;

// Initialize the Profile page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded');
    initializeProfilePage();
});

function initializeProfilePage() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to access your profile');
        window.location.href = 'index.html';
        return;
    }
    
    setupEventListeners();
    loadUserProfile();
    loadNotifications();
    loadAnalytics();
    loadRecentActivity();
    updateHeaderForUser();
}

function setupEventListeners() {
    // Header actions
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    const myItemsBtn = document.getElementById('myItemsBtn');
    if (myItemsBtn) {
        myItemsBtn.addEventListener('click', () => {
            window.location.href = 'my-items.html';
        });
    }
    
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', showUserMenu);
    }
    
    // Profile actions
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }
    
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', openAvatarModal);
    }
    
    // Settings toggles
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
    if (emailNotificationsToggle) {
        emailNotificationsToggle.addEventListener('change', saveSettings);
    }
    
    const pushNotificationsToggle = document.getElementById('pushNotificationsToggle');
    if (pushNotificationsToggle) {
        pushNotificationsToggle.addEventListener('change', saveSettings);
    }
    
    // Account actions
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordModal);
    }
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportUserData);
    }
    
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearLocalData);
    }
    
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }
    
    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationDropdown);
    }
    
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsRead);
    }
    
    const clearNotificationsBtn = document.getElementById('clearNotificationsBtn');
    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener('click', clearAllNotifications);
    }
    
    // Analytics
    const analyticsPeriod = document.getElementById('analyticsPeriod');
    if (analyticsPeriod) {
        analyticsPeriod.addEventListener('change', loadAnalytics);
    }
    
    // Activity
    const viewAllActivityBtn = document.getElementById('viewAllActivityBtn');
    if (viewAllActivityBtn) {
        viewAllActivityBtn.addEventListener('click', viewAllActivity);
    }
    
    // Avatar selection
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', selectAvatar);
    });
}

function updateHeaderForUser() {
    const currentUser = getCurrentUser();
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (currentUser && userMenuBtn) {
        userMenuBtn.textContent = `Hi, ${currentUser.firstName}`;
    }
}

// Profile Data Management
function loadUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Load profile data (extend currentUser or create separate profile)
    currentUserProfile = {
        ...currentUser,
        avatar: currentUser.avatar || '👤',
        bio: currentUser.bio || '',
        memberSince: currentUser.memberSince || '2024-10-01',
        darkMode: localStorage.getItem('darkMode') === 'true',
        emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
        pushNotifications: localStorage.getItem('pushNotifications') !== 'false',
        ...JSON.parse(localStorage.getItem('userProfile') || '{}')
    };
    
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const profile = currentUserProfile;
    
    // Update profile info
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) userAvatar.textContent = profile.avatar;
    
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = `${profile.firstName} ${profile.lastName}`;
    
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = profile.email;
    
    const userPhone = document.getElementById('userPhone');
    if (userPhone) userPhone.textContent = profile.phone;
    
    const userLocation = document.getElementById('userLocation');
    if (userLocation) userLocation.textContent = profile.location || 'Not set';
    
    const memberSince = document.getElementById('memberSince');
    if (memberSince) memberSince.textContent = `Member since: ${formatDate(profile.memberSince)}`;
    
    // Update settings
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.checked = profile.darkMode;
    
    const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
    if (emailNotificationsToggle) emailNotificationsToggle.checked = profile.emailNotifications;
    
    const pushNotificationsToggle = document.getElementById('pushNotificationsToggle');
    if (pushNotificationsToggle) pushNotificationsToggle.checked = profile.pushNotifications;
    
    // Load user items count
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const userItems = allItems.filter(item => item.sellerId === profile.id);
    const soldItems = userItems.filter(item => item.status === 'sold');
    
    const totalItemsPosted = document.getElementById('totalItemsPosted');
    if (totalItemsPosted) totalItemsPosted.textContent = userItems.length;
    
    const totalItemsSold = document.getElementById('totalItemsSold');
    if (totalItemsSold) totalItemsSold.textContent = soldItems.length;
}

function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(currentUserProfile));
    
    // Also update currentUser
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...currentUserProfile };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
}

// Edit Profile Modal
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    
    const profile = currentUserProfile;
    
    // Populate form
    const editFirstName = document.getElementById('editFirstName');
    if (editFirstName) editFirstName.value = profile.firstName || '';
    
    const editLastName = document.getElementById('editLastName');
    if (editLastName) editLastName.value = profile.lastName || '';
    
    const editPhone = document.getElementById('editPhone');
    if (editPhone) editPhone.value = profile.phone || '';
    
    const editDefaultLocation = document.getElementById('editDefaultLocation');
    if (editDefaultLocation) editDefaultLocation.value = profile.location || 'Bangalore';
    
    const editBio = document.getElementById('editBio');
    if (editBio) editBio.value = profile.bio || '';
    
    // Setup character counter
    setupBioCharCounter();
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function saveProfileChanges() {
    // Get form values
    const firstName = document.getElementById('editFirstName')?.value.trim();
    const lastName = document.getElementById('editLastName')?.value.trim();
    const phone = document.getElementById('editPhone')?.value.trim();
    const location = document.getElementById('editDefaultLocation')?.value;
    const bio = document.getElementById('editBio')?.value.trim();
    
    // Validate
    if (!firstName || !lastName || !phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Update profile
    currentUserProfile = {
        ...currentUserProfile,
        firstName,
        lastName,
        phone,
        location,
        bio
    };
    
    saveUserProfile();
    updateProfileDisplay();
    closeEditProfileModal();
    
    showToast('Profile updated successfully!', 'success');
    addNotification('Profile updated', 'You updated your profile information', 'profile');
}

function setupBioCharCounter() {
    const bioInput = document.getElementById('editBio');
    if (!bioInput) return;
    
    const counter = bioInput.parentElement.querySelector('.char-counter');
    if (!counter) return;
    
    function updateCounter() {
        const current = bioInput.value.length;
        const max = bioInput.getAttribute('maxlength');
        counter.textContent = `${current}/${max}`;
    }
    
    updateCounter();
    bioInput.addEventListener('input', updateCounter);
}

// Avatar Management
function openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Highlight current avatar
    selectedAvatar = currentUserProfile.avatar;
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === selectedAvatar) {
            option.classList.add('selected');
        }
    });
}

function closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function selectAvatar(event) {
    selectedAvatar = event.target.dataset.avatar;
    
    // Update selection UI
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function saveAvatarSelection() {
    currentUserProfile.avatar = selectedAvatar;
    saveUserProfile();
    updateProfileDisplay();
    closeAvatarModal();
    
    showToast('Avatar updated successfully!', 'success');
    addNotification('Avatar changed', 'You updated your profile avatar', 'profile');
}

// Settings Management
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const isDarkMode = darkModeToggle.checked;
    currentUserProfile.darkMode = isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    saveUserProfile();
    
    // Apply dark mode
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        showToast('Dark mode enabled', 'info');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        showToast('Light mode enabled', 'info');
    }
    
    addNotification('Settings changed', `${isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'settings');
}

function saveSettings() {
    const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
    const pushNotificationsToggle = document.getElementById('pushNotificationsToggle');
    if (!emailNotificationsToggle || !pushNotificationsToggle) return;
    
    const emailNotifications = emailNotificationsToggle.checked;
    const pushNotifications = pushNotificationsToggle.checked;
    
    currentUserProfile.emailNotifications = emailNotifications;
    currentUserProfile.pushNotifications = pushNotifications;
    
    localStorage.setItem('emailNotifications', emailNotifications);
    localStorage.setItem('pushNotifications', pushNotifications);
    saveUserProfile();
    
    showToast('Settings saved successfully!', 'success');
}

// Password Management
function openPasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Clear form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) changePasswordForm.reset();
}

function closePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Simulate password change (in real app, this would be an API call)
    setTimeout(() => {
        closePasswordModal();
        showToast('Password changed successfully!', 'success');
        addNotification('Security update', 'Your password was changed', 'security');
    }, 1000);
}

// Analytics Management
function loadAnalytics() {
    const analyticsPeriod = document.getElementById('analyticsPeriod');
    if (!analyticsPeriod) return;
    
    const period = analyticsPeriod.value;
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;
    
    // Filter user's items
    const userItems = allItems.filter(item => item.sellerId === currentUser.id);
    
    // Calculate analytics
    const totalViews = userItems.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalInquiries = userItems.reduce((sum, item) => sum + (item.inquiries || 0), 0);
    const soldItems = userItems.filter(item => item.status === 'sold');
    const totalEarnings = soldItems.reduce((sum, item) => sum + (item.price || 0), 0);
    
    // Update analytics display
    const totalViewsAnalytics = document.getElementById('totalViewsAnalytics');
    if (totalViewsAnalytics) totalViewsAnalytics.textContent = totalViews;
    
    const totalInquiriesAnalytics = document.getElementById('totalInquiriesAnalytics');
    if (totalInquiriesAnalytics) totalInquiriesAnalytics.textContent = totalInquiries;
    
    const totalEarningsAnalytics = document.getElementById('totalEarningsAnalytics');
    if (totalEarningsAnalytics) totalEarningsAnalytics.textContent = `₹${totalEarnings.toLocaleString()}`;
    
    const averageRatingAnalytics = document.getElementById('averageRatingAnalytics');
    if (averageRatingAnalytics) averageRatingAnalytics.textContent = '4.8'; // Mock rating
    
    // Generate chart data
    generateViewsChart(period);
}

function generateViewsChart(period) {
    const canvas = document.getElementById('viewsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const days = parseInt(period);
    
    // Generate mock chart data
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 50) + 10);
    }
    
    // Destroy existing chart if it exists
    if (viewsChart) {
        viewsChart.destroy();
    }
    
    // Create new chart
    viewsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Views',
                data: data,
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-10)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'var(--color-border)'
                    }
                },
                x: {
                    grid: {
                        color: 'var(--color-border)'
                    }
                }
            }
        }
    });
}

// Recent Activity
function loadRecentActivity() {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;
    
    // Generate mock recent activity
    const activities = [
        { icon: '👁️', text: 'Your item "MacBook Pro" got 5 new views', time: '2 hours ago', type: 'view' },
        { icon: '💬', text: 'New inquiry for "Study Table"', time: '4 hours ago', type: 'inquiry' },
        { icon: '💰', text: 'You sold "Samsung Monitor" for ₹8,500', time: '1 day ago', type: 'sale' },
        { icon: '📦', text: 'You posted a new item "Gaming Chair"', time: '2 days ago', type: 'post' },
        { icon: '⭐', text: 'You received a 5-star rating', time: '3 days ago', type: 'rating' }
    ];
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Notifications Management
function loadNotifications() {
    notificationsData = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    updateNotificationCount();
    updateNotificationDropdown();
}

function updateNotificationCount() {
    const unreadCount = notificationsData.filter(n => !n.read).length;
    const badge = document.getElementById('notificationCount');
    if (!badge) return;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function updateNotificationDropdown() {
    const list = document.getElementById('notificationList');
    if (!list) return;
    
    if (notificationsData.length === 0) {
        list.innerHTML = '<div class="notification-item notification-empty">No notifications yet</div>';
        return;
    }
    
    list.innerHTML = '';
    
    // Show last 10 notifications
    const recentNotifications = notificationsData.slice(0, 10);
    
    recentNotifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.read ? '' : 'unread'}`;
        item.innerHTML = `
            <div class="notification-icon">${getNotificationIcon(notification.type)}</div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-text">${notification.message}</div>
                <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
            </div>
        `;
        
        item.addEventListener('click', () => markNotificationRead(notification.id));
        list.appendChild(item);
    });
}

function getNotificationIcon(type) {
    const icons = {
        view: '👁️',
        inquiry: '💬',
        sale: '💰',
        post: '📦',
        rating: '⭐',
        profile: '👤',
        settings: '⚙️',
        security: '🔐'
    };
    return icons[type] || '🔔';
}

function addNotification(title, message, type = 'general') {
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notificationsData.unshift(notification);
    
    // Keep only last 50 notifications
    if (notificationsData.length > 50) {
        notificationsData = notificationsData.slice(0, 50);
    }
    
    localStorage.setItem('userNotifications', JSON.stringify(notificationsData));
    updateNotificationCount();
    updateNotificationDropdown();
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        // Auto-close after 10 seconds
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 10000);
    } else {
        dropdown.style.display = 'none';
    }
}

function markNotificationRead(notificationId) {
    const notification = notificationsData.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('userNotifications', JSON.stringify(notificationsData));
        updateNotificationCount();
        updateNotificationDropdown();
    }
}

function markAllNotificationsRead() {
    notificationsData.forEach(n => n.read = true);
    localStorage.setItem('userNotifications', JSON.stringify(notificationsData));
    updateNotificationCount();
    updateNotificationDropdown();
    showToast('All notifications marked as read', 'success');
}

function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notificationsData = [];
        localStorage.removeItem('userNotifications');
        updateNotificationCount();
        updateNotificationDropdown();
        showToast('All notifications cleared', 'success');
    }
}

// Account Actions
function exportUserData() {
    const currentUser = getCurrentUser();
    const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    const userItems = allItems.filter(item => item.sellerId === currentUser.id);
    
    const userData = {
        profile: currentUserProfile,
        items: userItems,
        notifications: notificationsData,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `moveout-market-data-${currentUser.firstName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!', 'success');
    addNotification('Data export', 'Your marketplace data has been exported', 'profile');
}

function clearLocalData() {
    if (confirm('This will clear all your local data including items, notifications, and settings. Are you sure?')) {
        const currentUser = getCurrentUser();
        
        // Clear user-specific data but keep user session
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userNotifications');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('emailNotifications');
        localStorage.removeItem('pushNotifications');
        
        // Clear user items
        const allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
        const otherItems = allItems.filter(item => item.sellerId !== currentUser.id);
        localStorage.setItem('marketplaceItems', JSON.stringify(otherItems));
        
        showToast('Local data cleared successfully!', 'success');
        
        // Reload page
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

function deleteAccount() {
    if (confirm('This will permanently delete your account and all data. This action cannot be undone. Are you sure?')) {
        if (confirm('Are you absolutely sure? Type "DELETE" to confirm:')) {
            // In a real app, this would call an API
            showToast('Account deletion requested. You will be contacted via email.', 'info');
            addNotification('Account deletion', 'Account deletion request submitted', 'security');
        }
    }
}

// User Menu (same as other pages)
function showUserMenu() {
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
            <div class="user-menu-item" onclick="window.location.href='post-item.html'">📦 Post Item</div>
            <div class="user-menu-item" onclick="window.location.href='my-items.html'">📋 My Items</div>
            <div class="user-menu-item" onclick="window.location.href='index.html'">🏠 Homepage</div>
            <div class="user-menu-divider"></div>
            <div class="user-menu-item logout" onclick="logout()">🚪 Logout</div>
        `;
        
        // Position menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            const rect = userMenuBtn.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = (rect.bottom + 10) + 'px';
            menu.style.right = '1rem';
            menu.style.zIndex = '1000';
        }
        
        document.body.appendChild(menu);
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !document.getElementById('userMenuBtn')?.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
}

function viewAllActivity() {
    showToast('Full activity log - Coming in future update!', 'info');
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
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
    
    // Auto-remove after duration
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

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        window.location.href = 'index.html';
    }
}

// Utility functions from other pages
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}
