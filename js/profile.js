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
    
    // Load profile with refresh option
    loadUserProfile().then(() => {
        loadNotifications();
        loadAnalytics();
        loadRecentActivity();
        updateHeaderForUser();
    }).catch(error => {
        console.error('Error initializing profile:', error);
        showToast('Error loading profile. Please refresh the page.', 'error');
    });
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

async function updateHeaderForUser() {
    try {
        // Get fresh user data
        const currentUser = await refreshCurrentUser() || getCurrentUser();
        const userMenuBtn = document.getElementById('userMenuBtn');
        
        if (currentUser && userMenuBtn) {
            userMenuBtn.textContent = `Hi, ${currentUser.firstName || 'User'}`;
        }
        
        // Also update any other header elements that show user info
        const headerAvatar = document.getElementById('headerAvatar');
        if (headerAvatar && currentUser) {
            headerAvatar.textContent = currentUser.avatar || '👤';
        }
    } catch (error) {
        console.error('Error updating header for user:', error);
        // Fallback to basic update
        const currentUser = getCurrentUser();
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (currentUser && userMenuBtn) {
            userMenuBtn.textContent = `Hi, ${currentUser.firstName || 'User'}`;
        }
    }
}

// Profile Data Management
async function loadUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No current user found');
        return;
    }
    
    // Start with loading indicator
    showLoadingProfile(true);
    
    try {
        // First try to fetch fresh data from cloud
        let cloudUserData = await loadUserFromBin();
        
        if (cloudUserData) {
            // Use cloud data as primary source
            currentUserProfile = {
                ...cloudUserData,
                // Merge with any local-only settings
                darkMode: localStorage.getItem('darkMode') === 'true',
                emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
                pushNotifications: localStorage.getItem('pushNotifications') !== 'false',
                // Override with any local profile extensions
                ...JSON.parse(localStorage.getItem('userProfileExtensions') || '{}')
            };
            
            // Update localStorage with fresh cloud data
            localStorage.setItem('currentUser', JSON.stringify(cloudUserData));
            console.log('Profile loaded from cloud data');
            showToast('Profile synced with cloud', 'success', 2000);
        } else {
            // Fallback to localStorage if cloud data unavailable
            console.log('Using localStorage fallback for profile');
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
            showToast('Using cached profile data', 'warning', 3000);
        }
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Use localStorage as fallback on error
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
        showToast('Error loading profile, using cached data', 'error');
    }
    
    showLoadingProfile(false);
    await updateProfileDisplay();
}

async function loadUserItems() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No current user found');
        return [];
    }
    
    let allItems = [];
    try {
        const response = await jsonBinService.getAllItems();
        // console.log('Raw JSONBin response:', JSON.stringify(response, null, 2));
        allItems = Array.isArray(response) ? response : response?.record?.items || [];
        if (!Array.isArray(allItems)) {
            console.error('JSONBin response is not an array:', allItems);
            allItems = [];
        }
        // Sync localStorage
        localStorage.setItem('marketplaceItems', JSON.stringify(allItems));
    } catch (error) {
        console.error('Error fetching items from JSONBin:', error);
        showToast('Failed to load items from cloud storage', 'error');
        allItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    }
    
    const userItems = allItems.filter(item => String(item.sellerId) === String(currentUser.id));
    console.log(`Found ${userItems.length} user items`);
    return userItems;
}

async function updateProfileDisplay() {
    const profile = currentUserProfile;
    
    // Update profile info with null checks
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) userAvatar.textContent = profile.avatar || '👤';
    
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = `${profile.firstName || 'Unknown'} ${profile.lastName || 'User'}`;
    
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = profile.email || 'Not provided';
    
    const userPhone = document.getElementById('userPhone');
    if (userPhone) userPhone.textContent = profile.phone || 'Not provided';
    
    const userLocation = document.getElementById('userLocation');
    if (userLocation) userLocation.textContent = profile.location || 'Not set';
    
    const userBio = document.getElementById('userBio');
    if (userBio) {
        userBio.textContent = profile.bio || 'No bio provided';
        // Show/hide bio section based on content
        const bioSection = userBio.closest('.profile-section');
        if (bioSection) {
            bioSection.style.display = profile.bio ? 'block' : 'none';
        }
    }
    
    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
        const memberDate = profile.memberSince || profile.createdAt || '2024-10-01';
        memberSince.textContent = `Member since: ${formatDate(memberDate)}`;
    }
    
    // Update settings toggles
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.checked = profile.darkMode || false;
    
    const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
    if (emailNotificationsToggle) emailNotificationsToggle.checked = profile.emailNotifications !== false;
    
    const pushNotificationsToggle = document.getElementById('pushNotificationsToggle');
    if (pushNotificationsToggle) pushNotificationsToggle.checked = profile.pushNotifications !== false;
    
    // Load user statistics
    await updateUserStatistics();
}

async function saveUserProfile() {
    // Save to localStorage first for immediate UI updates
    localStorage.setItem('userProfile', JSON.stringify(currentUserProfile));
    
    // Update current user object
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...currentUserProfile };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Try to sync with cloud
    try {
        const cloudSyncSuccess = await syncUserWithCloud(updatedUser);
        
        if (cloudSyncSuccess) {
            console.log('User profile synced with cloud successfully');
            
            // Store any local-only extensions separately
            const localExtensions = {
                darkMode: currentUserProfile.darkMode,
                emailNotifications: currentUserProfile.emailNotifications,
                pushNotifications: currentUserProfile.pushNotifications
            };
            localStorage.setItem('userProfileExtensions', JSON.stringify(localExtensions));
        } else {
            console.warn('Failed to sync with cloud, data saved locally');
            showToast('Profile updated locally (sync with cloud failed)', 'warning');
        }
    } catch (error) {
        console.error('Error syncing profile:', error);
        showToast('Profile updated locally but cloud sync failed', 'error');
    }
}

// Edit Profile Modal
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) {
        console.error('Edit profile modal not found');
        showToast('Cannot open profile editor', 'error');
        return;
    }
    
    const profile = currentUserProfile;
    
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

async function saveProfileChanges() {
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
    
    // Show saving indicator
    const saveBtn = document.querySelector('#editProfileModal .btn-primary');
    const originalText = saveBtn?.textContent;
    if (saveBtn) {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
    }
    
    try {
        // Update profile
        currentUserProfile = {
            ...currentUserProfile,
            firstName,
            lastName,
            phone,
            location,
            bio
        };
        
        await saveUserProfile();
        updateProfileDisplay();
        closeEditProfileModal();
        
        showToast('Profile updated successfully!', 'success');
        addNotification('Profile updated', 'You updated your profile information', 'profile');
    } catch (error) {
        console.error('Error saving profile changes:', error);
        showToast('Error saving profile changes', 'error');
    } finally {
        // Reset button
        if (saveBtn && originalText) {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }
    }
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
    if (!modal) {
        console.error('Avatar modal not found');
        showToast('Cannot open avatar selector', 'error');
        return;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
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
    if (!modal) {
        console.error('Change password modal not found');
        showToast('Cannot open password editor', 'error');
        return;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
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

async function changePassword() {
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
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
    
    const currentUser = getCurrentUser();
    try {
        const updatedUser = { ...currentUser, password: CryptoJS.SHA256(newPassword).toString() };
        if (window.jsonBinService && typeof window.jsonBinService.updateUser === 'function') {
            await jsonBinService.updateUser(String(currentUser.id), updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            closePasswordModal();
            showToast('Password changed successfully!', 'success');
            addNotification('Security update', 'Your password was changed', 'security');
        } else {
            console.warn('jsonBinService.updateUser is not available, saving locally only');
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            closePasswordModal();
            showToast('Password changed locally (cloud sync unavailable)', 'warning');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        showToast('Failed to change password', 'error');
    }
}

// Analytics Management
async function loadAnalytics() {
    const analyticsPeriod = document.getElementById('analyticsPeriod');
    if (!analyticsPeriod) return;
    
    const period = analyticsPeriod.value;
    const userItems = await loadUserItems();
    
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
    if (totalEarningsAnalytics) totalEarningsAnalytics.textContent = `¥${totalEarnings.toLocaleString()}`;
    
    const averageRatingAnalytics = document.getElementById('averageRatingAnalytics');
    if (averageRatingAnalytics) averageRatingAnalytics.textContent = '4.8'; // Mock rating
    
    // Generate chart data
    generateViewsChart(period, userItems);
}

function generateViewsChart(period, userItems) {
    const canvas = document.getElementById('viewsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const days = parseInt(period);
    
    // Generate chart data based on user items
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        // Sum views for items posted before or on this date
        const dailyViews = userItems
            .filter(item => new Date(item.postedDate) <= date)
            .reduce((sum, item) => sum + (item.views || 0), 0);
        data.push(dailyViews);
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
async function loadRecentActivity() {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;
    
    const userItems = await loadUserItems();
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    
    // Generate activities from items and notifications
    const activities = [];
    
    // Add activities from items (e.g., posts, sales)
    userItems.forEach(item => {
        activities.push({
            icon: '📦',
            text: `You posted a new item "${item.title}"`,
            time: formatTimeAgo(item.postedDate),
            type: 'post'
        });
        if (item.status === 'sold') {
            activities.push({
                icon: '💰',
                text: `You sold "${item.title}" for ¥${item.price.toLocaleString()}`,
                time: formatTimeAgo(item.lastUpdated || item.postedDate),
                type: 'sale'
            });
        }
    });
    
    // Add activities from notifications
    notifications.forEach(notification => {
        if (['view', 'inquiry', 'rating'].includes(notification.type)) {
            activities.push({
                icon: getNotificationIcon(notification.type),
                text: notification.message,
                time: formatTimeAgo(notification.timestamp),
                type: notification.type
            });
        }
    });
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // Show up to 5 recent activities
    activityList.innerHTML = '';
    activities.slice(0, 5).forEach(activity => {
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
    
    if (activities.length === 0) {
        activityList.innerHTML = '<div class="activity-item">No recent activity</div>';
    }
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
async function exportUserData() {
    const currentUser = getCurrentUser();
    const userItems = await loadUserItems();
    
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

async function clearLocalData() {
    if (confirm('This will clear all your local data including items, notifications, and settings. Are you sure?')) {
        const currentUser = getCurrentUser();
        
        // Clear user-specific data but keep user session
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userNotifications');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('emailNotifications');
        localStorage.removeItem('pushNotifications');
        
        // Clear user items from JSONBin and localStorage
        try {
            const allItems = await jsonBinService.getAllItems();
            const otherItems = allItems.filter(item => String(item.sellerId) !== String(currentUser.id));
            await jsonBinService.saveAllItems(otherItems);
            localStorage.setItem('marketplaceItems', JSON.stringify(otherItems));
            showToast('Local data cleared successfully!', 'success');
        } catch (error) {
            console.error('Error clearing items from JSONBin:', error);
            showToast('Failed to clear items from cloud storage', 'error');
        }
        
        // Reload page
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

async function deleteAccount() {
    if (confirm('This will permanently delete your account and all data. This action cannot be undone. Are you sure?')) {
        if (prompt('Type "DELETE" to confirm:') === 'DELETE') {
            const currentUser = getCurrentUser();
            try {
                const allItems = await jsonBinService.getAllItems();
                const otherItems = allItems.filter(item => String(item.sellerId) !== String(currentUser.id));
                await jsonBinService.saveAllItems(otherItems);
                
                if (window.jsonBinService && typeof window.jsonBinService.deleteUser === 'function') {
                    await jsonBinService.deleteUser(String(currentUser.id));
                } else {
                    console.warn('jsonBinService.deleteUser is not available');
                }
                
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userProfile');
                localStorage.removeItem('userNotifications');
                localStorage.removeItem('darkMode');
                localStorage.removeItem('emailNotifications');
                localStorage.removeItem('pushNotifications');
                localStorage.removeItem('marketplaceItems');
                
                showToast('Account deleted successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                console.error('Error deleting account:', error);
                showToast('Failed to delete account', 'error');
            }
        }
    }
}

// User Menu
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

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

async function loadUserFromBin() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
        console.error('No current user found');
        return null;
    }
    
    try {
        // First try to get user from JSONBin user service
        if (window.jsonBinService && typeof window.jsonBinService.getUser === 'function') {
            const cloudUserData = await jsonBinService.getUser(String(currentUser.id));
            if (cloudUserData) {
                console.log('User data fetched from cloud successfully');
                return cloudUserData;
            }
        }
        
        // Fallback: try to get from users collection if getUser doesn't exist
        if (window.jsonBinService && typeof window.jsonBinService.getAllUsers === 'function') {
            const allUsers = await jsonBinService.getAllUsers();
            const userData = allUsers.find(user => String(user.id) === String(currentUser.id));
            if (userData) {
                console.log('User data found in users collection');
                return userData;
            }
        }
        
        console.warn('User not found in cloud storage');
        return null;
    } catch (error) {
        console.error('Error fetching user from cloud:', error);
        return null;
    }
}

async function syncUserWithCloud(userData) {
    try {
        if (window.jsonBinService && typeof window.jsonBinService.updateUser === 'function') {
            await jsonBinService.updateUser(String(userData.id), userData);
            console.log('User data synced with cloud');
            return true;
        } else {
            console.warn('jsonBinService.updateUser not available');
            return false;
        }
    } catch (error) {
        console.error('Failed to sync user with cloud:', error);
        return false;
    }
}

async function refreshCurrentUser() {
    const localUser = getCurrentUser();
    if (!localUser) return null;
    
    try {
        const cloudUser = await loadUserFromBin();
        if (cloudUser) {
            // Update localStorage with fresh user data
            localStorage.setItem('currentUser', JSON.stringify(cloudUser));
            return cloudUser;
        }
        return localUser;
    } catch (error) {
        console.error('Error refreshing user data:', error);
        return localUser;
    }
}

async function updateUserStatistics() {
    try {
        const userItems = await loadUserItems();
        const soldItems = userItems.filter(item => item.status === 'sold');
        
        // Update item counts
        const totalItemsPosted = document.getElementById('totalItemsPosted');
        if (totalItemsPosted) totalItemsPosted.textContent = userItems.length || 0;
        
        const totalItemsSold = document.getElementById('totalItemsSold');
        if (totalItemsSold) totalItemsSold.textContent = soldItems.length || 0;
        
        // Calculate total earnings
        const totalEarnings = soldItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        const totalEarningsDisplay = document.getElementById('totalEarnings');
        if (totalEarningsDisplay) totalEarningsDisplay.textContent = `¥${totalEarnings.toLocaleString()}`;
        
        // Calculate success rate
        const successRate = userItems.length > 0 ? Math.round((soldItems.length / userItems.length) * 100) : 0;
        const successRateDisplay = document.getElementById('successRate');
        if (successRateDisplay) successRateDisplay.textContent = `${successRate}%`;
        
    } catch (error) {
        console.error('Error updating user statistics:', error);
        // Set default values on error
        const totalItemsPosted = document.getElementById('totalItemsPosted');
        if (totalItemsPosted) totalItemsPosted.textContent = '0';
        
        const totalItemsSold = document.getElementById('totalItemsSold');
        if (totalItemsSold) totalItemsSold.textContent = '0';
    }
}

function showLoadingProfile(show) {
    const profileContainer = document.getElementById('profileContainer') || document.querySelector('.profile-container');
    let loadingIndicator = document.getElementById('profileLoading');
    
    if (show) {
        if (profileContainer) profileContainer.style.opacity = '0.5';
        if (!loadingIndicator) {
            // Create loading indicator if it doesn't exist
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'profileLoading';
            loadingIndicator.className = 'profile-loading';
            loadingIndicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                text-align: center;
            `;
            loadingIndicator.innerHTML = `
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                "></div>
                <div class="loading-text">Loading profile...</div>
            `;
            document.body.appendChild(loadingIndicator);
            
            // Add CSS animation if not exists
            if (!document.querySelector('#loading-spinner-css')) {
                const style = document.createElement('style');
                style.id = 'loading-spinner-css';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            loadingIndicator.style.display = 'block';
        }
    } else {
        if (profileContainer) profileContainer.style.opacity = '1';
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

async function refreshProfileData() {
    showToast('Refreshing profile data...', 'info');
    try {
        await loadUserProfile();
        showToast('Profile data refreshed!', 'success');
    } catch (error) {
        console.error('Error refreshing profile:', error);
        showToast('Failed to refresh profile data', 'error');
    }
}