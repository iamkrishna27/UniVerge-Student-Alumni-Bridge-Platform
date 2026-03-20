// ============================================
// UniVerge - Main JavaScript
// Complete Platform Functionality - FIXED BOOKING
// ============================================

// ============================================
// Global Variables & DOM Elements
// ============================================

// UI Elements
const messageArea = document.getElementById('message-area');
const navAuthButton = document.getElementById('nav-auth');
const navLogoutButton = document.getElementById('nav-logout');
const navDashboardButton = document.getElementById('nav-dashboard');
const navProfileButton = document.getElementById('nav-profile');
const navStoryboardButton = document.getElementById('nav-storyboard');
const navImpactTrackerButton = document.getElementById('nav-impact-tracker');
const navQuickConnectButton = document.getElementById('nav-quick-connect');
const navResourceBankButton = document.getElementById('nav-resource-bank');
const navConfidenceCornerButton = document.getElementById('nav-confidence-corner');

// Pages
const landingPage = document.getElementById('landing-page');
const authPage = document.getElementById('auth-page');
const dashboardPage = document.getElementById('dashboard-page');
const profilePage = document.getElementById('profile-page');
const storyboardPage = document.getElementById('storyboard-page');
const impactTrackerPage = document.getElementById('impact-tracker-page');
const quickConnectPage = document.getElementById('quick-connect-page');
const resourceBankPage = document.getElementById('resource-bank-page');
const confidenceCornerPage = document.getElementById('confidence-corner-page');

// Auth Elements
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authName = document.getElementById('auth-name');
const authUserType = document.getElementById('auth-userType');
const authHometown = document.getElementById('auth-hometown');
const authLanguage = document.getElementById('auth-language');
const registerFields = document.getElementById('register-fields');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
const authSubmitBtn = document.getElementById('auth-submit-btn');

// Profile Elements
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileType = document.getElementById('profile-type');
const editHometown = document.getElementById('edit-hometown');
const editLanguage = document.getElementById('edit-language');
const editProfession = document.getElementById('edit-profession');
const editProfessionRow = document.getElementById('edit-profession-row');
const profileEditForm = document.getElementById('profile-edit-form');

// Dashboard Elements
const dashboardWelcome = document.getElementById('dashboard-welcome');
const studentMatchingSection = document.getElementById('student-matching-section');
const studentCareerPathSection = document.getElementById('student-career-path-section');
const matchingResult = document.getElementById('matching-result');
const userAvatar = document.getElementById('user-avatar');

// Storyboard Elements
const storyboardsContainer = document.getElementById('storyboards-container');
const shareJourneySection = document.getElementById('share-journey-section');
const shareJourneyForm = document.getElementById('share-journey-form');
const storyTitleInput = document.getElementById('story-title');
const storyDescriptionInput = document.getElementById('story-description');
const storyImageUrlInput = document.getElementById('story-image-url');

// Quick Connect Elements
const alumniSlotsSection = document.getElementById('alumni-slots-section');
const createSlotForm = document.getElementById('create-slot-form');
const slotDateInput = document.getElementById('slot-date');
const slotTimeInput = document.getElementById('slot-time');
const slotDurationSelect = document.getElementById('slot-duration');
const availableSlotsSection = document.getElementById('available-slots-section');
const availableSlotsList = document.getElementById('available-slots-list');
const mySlotsSection = document.getElementById('my-slots-section');
const mySlotsList = document.getElementById('my-slots-list');

// Resource Bank Elements
const alumniResourceUploadSection = document.getElementById('alumni-resource-upload-section');
const uploadResourceForm = document.getElementById('upload-resource-form');
const resourceTitleInput = document.getElementById('resource-title');
const resourceUrlInput = document.getElementById('resource-url');
const resourceCategorySelect = document.getElementById('resource-category');
const resourceDescriptionInput = document.getElementById('resource-description');
const resourcesContainer = document.getElementById('resources-container');

// Confidence Corner Elements
const confidencePostForm = document.getElementById('confidence-post-form');
const postContentInput = document.getElementById('post-content');
const confidencePostsContainer = document.getElementById('confidence-posts-container');

// Demo Slots Data
let demoSlots = [
    {
        id: 1,
        alumni_name: "Dr. Sarah Chen",
        alumni_id: 101,
        start_time: new Date(Date.now() + 86400000).toISOString(),
        end_time: new Date(Date.now() + 86400000 + 1800000).toISOString(),
        duration_minutes: 30,
        is_booked: false,
        topic: "Career Guidance in AI/ML",
        booked_by: null
    },
    {
        id: 2,
        alumni_name: "Michael Rodriguez",
        alumni_id: 102,
        start_time: new Date(Date.now() + 172800000).toISOString(),
        end_time: new Date(Date.now() + 172800000 + 2700000).toISOString(),
        duration_minutes: 45,
        is_booked: false,
        topic: "Resume Review & Interview Prep",
        booked_by: null
    },
    {
        id: 3,
        alumni_name: "Priya Sharma",
        alumni_id: 103,
        start_time: new Date(Date.now() + 259200000).toISOString(),
        end_time: new Date(Date.now() + 259200000 + 3600000).toISOString(),
        duration_minutes: 60,
        is_booked: false,
        topic: "Data Science Career Path",
        booked_by: null
    }
];

let userBookedSlots = [];

// State Variables
let isRegisterMode = false;
let currentUser = null;

// ============================================
// Utility Functions
// ============================================

/**
 * Display a toast message to the user
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-20 right-4 left-4 md:left-auto z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-indigo-500',
        warning: 'bg-yellow-500'
    };
    
    messageDiv.className += ` ${bgColors[type]} text-white`;
    messageDiv.style.maxWidth = window.innerWidth < 640 ? 'calc(100% - 2rem)' : '400px';
    messageDiv.style.right = window.innerWidth < 640 ? '1rem' : '1rem';
    messageDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
        messageDiv.style.opacity = '1';
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100px)';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

/**
 * Show/hide loading state
 */
function setLoading(element, isLoading, loadingText = 'Loading...') {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        element.classList.add('opacity-50', 'cursor-not-allowed');
        const originalText = element.innerHTML;
        element.setAttribute('data-original-text', originalText);
        element.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> ${loadingText}`;
    } else {
        element.disabled = false;
        element.classList.remove('opacity-50', 'cursor-not-allowed');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.innerHTML = originalText;
        }
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Get user avatar initials
 */
function getUserInitials(user) {
    if (!user || !user.name) return '👤';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Update user avatar display
 */
function updateUserAvatar() {
    if (userAvatar && currentUser) {
        const initials = getUserInitials(currentUser);
        userAvatar.innerHTML = initials;
        userAvatar.style.display = 'flex';
        userAvatar.style.alignItems = 'center';
        userAvatar.style.justifyContent = 'center';
    }
}

// ============================================
// Page Navigation
// ============================================

/**
 * Show specific page and update navigation
 */
function showPage(pageId, requireAuth = true) {
    // Check authentication if required
    if (requireAuth && !localStorage.getItem('user')) {
        showMessage('Please login to access this page', 'warning');
        showPage('auth', false);
        return;
    }
    
    // Hide all pages
    const pages = [
        landingPage, authPage, dashboardPage, profilePage, 
        storyboardPage, impactTrackerPage, quickConnectPage, 
        resourceBankPage, confidenceCornerPage
    ];
    
    pages.forEach(page => {
        if (page) {
            page.classList.add('hidden');
            page.classList.remove('active-page');
        }
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active-page', 'animate-fade-up');
        
        // Load page-specific data
        switch(pageId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'profile':
                loadUserProfile();
                break;
            case 'storyboard':
                loadStoryboards();
                break;
            case 'impact-tracker':
                loadImpactTracker();
                break;
            case 'quick-connect':
                loadQuickConnect();
                break;
            case 'resource-bank':
                loadResources();
                break;
            case 'confidence-corner':
                loadConfidencePosts();
                break;
        }
    }
    
    // Update active nav link
    updateActiveNavLink(pageId);
    
    // Clear messages
    if (messageArea) messageArea.innerHTML = '';
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active', 'text-indigo-600', 'font-semibold');
        link.classList.add('text-gray-700', 'dark:text-gray-200');
    });
    
    const activeLink = document.querySelector(`[onclick*="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active', 'text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
        activeLink.classList.remove('text-gray-700', 'dark:text-gray-200');
    }
}

// ============================================
// Authentication Functions
// ============================================

/**
 * Toggle between login and register modes
 */
function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    
    if (isRegisterMode) {
        authTitle.textContent = 'Create Account';
        authSubmitBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Register';
        toggleAuthModeButton.textContent = 'Already have an account? Login';
        registerFields.classList.remove('hidden');
        registerFields.classList.add('animate-slide-down');
    } else {
        authTitle.textContent = 'Welcome Back';
        authSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Login';
        toggleAuthModeButton.textContent = "Don't have an account? Register";
        registerFields.classList.add('hidden');
    }
}

/**
 * Handle authentication form submission
 */
async function handleAuthSubmit(event) {
    event.preventDefault();
    
    const email = authEmail.value;
    const password = authPassword.value;
    
    if (!email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    setLoading(authSubmitBtn, true);
    
    let url = isRegisterMode ? '/api/register' : '/api/login';
    let body = { email, password };
    
    if (isRegisterMode) {
        const name = authName.value;
        const userType = authUserType.value;
        const hometown = authHometown.value;
        const language = authLanguage.value;
        
        if (!name || !userType || !hometown || !language) {
            showMessage('Please fill in all registration fields', 'error');
            setLoading(authSubmitBtn, false);
            return;
        }
        
        body = { ...body, name, type: userType, hometown, language };
    }
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateNavUI(currentUser);
            updateUserAvatar();
            showMessage(data.message, 'success');
            showPage('dashboard');
            authForm.reset();
            if (isRegisterMode) toggleAuthMode();
        } else {
            showMessage(data.message || 'Authentication failed', 'error');
        }
    } catch (error) {
        console.error('Auth error:', error);
        // Demo login for testing
        if (!isRegisterMode && email === 'student@test.com' && password === 'password') {
            currentUser = { id: 1, name: 'Test Student', email: 'student@test.com', type: 'student', hometown: 'Test City', language: 'English' };
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateNavUI(currentUser);
            updateUserAvatar();
            showMessage('Demo login successful!', 'success');
            showPage('dashboard');
        } else if (!isRegisterMode && email === 'alumni@test.com' && password === 'password') {
            currentUser = { id: 2, name: 'Test Alumni', email: 'alumni@test.com', type: 'alumni', hometown: 'Test City', language: 'English', profession: 'Software Engineer' };
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateNavUI(currentUser);
            updateUserAvatar();
            showMessage('Demo login successful!', 'success');
            showPage('dashboard');
        } else {
            showMessage('Network error. Please try again. (Demo: use student@test.com / password)', 'error');
        }
    } finally {
        setLoading(authSubmitBtn, false);
    }
}

/**
 * Handle user logout
 */
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            localStorage.removeItem('user');
            currentUser = null;
            updateNavUI(null);
            showMessage(data.message, 'success');
            showPage('landing', false);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('user');
        currentUser = null;
        updateNavUI(null);
        showMessage('Logged out successfully', 'success');
        showPage('landing', false);
    }
}

/**
 * Update navigation UI based on user login status
 */
function updateNavUI(user) {
    const isLoggedIn = !!user;
    
    // Toggle visibility of auth/logout buttons
    if (navAuthButton) navAuthButton.classList.toggle('hidden', isLoggedIn);
    if (navLogoutButton) navLogoutButton.classList.toggle('hidden', !isLoggedIn);
    
    // Toggle visibility of protected pages
    const protectedNavs = [
        navDashboardButton, navProfileButton, navStoryboardButton,
        navImpactTrackerButton, navQuickConnectButton, navResourceBankButton,
        navConfidenceCornerButton
    ];
    
    protectedNavs.forEach(nav => {
        if (nav) nav.classList.toggle('hidden', !isLoggedIn);
    });
}

/**
 * Get current logged-in user
 */
async function getCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateNavUI(currentUser);
        updateUserAvatar();
        return currentUser;
    }
    
    try {
        const response = await fetch('/api/current_user');
        const data = await response.json();
        
        if (data.success && data.user) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateNavUI(currentUser);
            updateUserAvatar();
            return currentUser;
        } else {
            localStorage.removeItem('user');
            currentUser = null;
            updateNavUI(null);
            return null;
        }
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

// ============================================
// Dashboard Functions
// ============================================

/**
 * Load dashboard data
 */
function loadDashboardData() {
    if (!currentUser) return;
    
    // Update welcome message
    if (dashboardWelcome) {
        dashboardWelcome.innerHTML = `Welcome back, ${currentUser.name}! <i class="fas fa-hand-peace"></i>`;
    }
    
    // Show/hide student-specific sections
    const isStudent = currentUser.type === 'student';
    if (studentMatchingSection) {
        studentMatchingSection.classList.toggle('hidden', !isStudent);
    }
    if (studentCareerPathSection) {
        studentCareerPathSection.classList.toggle('hidden', !isStudent);
    }
}

/**
 * Simulate alumni matching for students
 */
async function simulateMatch() {
    if (!currentUser || currentUser.type !== 'student') {
        showMessage('This feature is for students only', 'warning');
        return;
    }
    
    if (!matchingResult) return;
    
    const matchButton = document.querySelector('[onclick="simulateMatch()"]');
    if (matchButton) setLoading(matchButton, true, 'Finding match...');
    
    matchingResult.classList.remove('hidden');
    matchingResult.innerHTML = '<div class="flex items-center justify-center py-4"><i class="fas fa-spinner fa-spin text-2xl"></i><span class="ml-2">Finding your perfect match...</span></div>';
    
    setTimeout(() => {
        matchingResult.innerHTML = `
            <div class="animate-scale-up">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        JD
                    </div>
                    <div>
                        <h4 class="font-bold text-lg">John Doe</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Software Engineer at Google</p>
                    </div>
                </div>
                <p class="text-sm mb-2"><i class="fas fa-map-marker-alt mr-1"></i> From: Rural Midwest</p>
                <p class="text-sm mb-3"><i class="fas fa-language mr-1"></i> Speaks: English</p>
                <button onclick="connectWithMatch(101)" class="btn-primary-gradient w-full py-2 rounded-lg text-sm">
                    <i class="fas fa-handshake mr-1"></i> Connect Now
                </button>
            </div>
        `;
        showMessage('Match found! Check out this alumni who shares your background.', 'success');
        if (matchButton) setLoading(matchButton, false);
    }, 1500);
}

/**
 * Connect with matched alumni
 */
function connectWithMatch(alumniId) {
    showMessage(`Connection request sent to alumni! They'll be notified.`, 'success');
}

// ============================================
// Profile Functions
// ============================================

/**
 * Load user profile data
 */
function loadUserProfile() {
    if (!currentUser) return;
    
    if (profileName) profileName.textContent = currentUser.name || 'N/A';
    if (profileEmail) profileEmail.textContent = currentUser.email || 'N/A';
    if (profileType) profileType.textContent = currentUser.type || 'N/A';
    if (editHometown) editHometown.value = currentUser.hometown || '';
    if (editLanguage) editLanguage.value = currentUser.language || '';
    
    // Update profile name display
    const profileNameDisplay = document.getElementById('profile-name-display');
    if (profileNameDisplay) profileNameDisplay.textContent = currentUser.name || 'User';
    
    const profileTypeDisplay = document.getElementById('profile-type-display');
    if (profileTypeDisplay) profileTypeDisplay.textContent = currentUser.type === 'alumni' ? 'Alumni Member' : 'Student Member';
    
    // Show/hide profession field for alumni
    if (currentUser.type === 'alumni') {
        if (editProfessionRow) editProfessionRow.classList.remove('hidden');
        if (editProfession) editProfession.value = currentUser.profession || '';
    } else {
        if (editProfessionRow) editProfessionRow.classList.add('hidden');
    }
}

/**
 * Save profile changes
 */
async function saveProfileChanges(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login to update profile', 'warning');
        return;
    }
    
    const updatedData = {
        hometown: editHometown.value,
        language: editLanguage.value
    };
    
    if (currentUser.type === 'alumni') {
        updatedData.profession = editProfession.value;
    }
    
    const saveButton = document.querySelector('#profile-edit-form button');
    setLoading(saveButton, true, 'Saving...');
    
    setTimeout(() => {
        currentUser = { ...currentUser, ...updatedData };
        localStorage.setItem('user', JSON.stringify(currentUser));
        loadUserProfile();
        updateUserAvatar();
        showMessage('Profile updated successfully!', 'success');
        setLoading(saveButton, false);
    }, 1000);
}

// ============================================
// Storyboard Functions
// ============================================

/**
 * Load alumni storyboards
 */
async function loadStoryboards() {
    if (!storyboardsContainer) return;
    
    storyboardsContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
            <p class="mt-2">Loading inspiring stories...</p>
        </div>
    `;
    
    setTimeout(() => {
        storyboardsContainer.innerHTML = '';
        const demoStories = [
            {
                name: 'Sarah Chen',
                profession: 'AI Engineer at Google',
                story_title: 'From Rural Roots to Silicon Valley',
                story: 'Growing up in a small town, I never imagined working in tech. With mentorship and perseverance, I found my path.',
                hometown: 'Rural Midwest'
            },
            {
                name: 'Miguel Rodriguez',
                profession: 'Product Manager at Microsoft',
                story_title: 'Breaking Barriers in Tech',
                story: 'Being a first-gen college graduate, I faced many challenges. Mentorship made all the difference.',
                hometown: 'Texas'
            },
            {
                name: 'Priya Sharma',
                profession: 'Data Scientist at Amazon',
                story_title: 'Finding My Voice',
                story: 'Coming from a family with no college graduates, I doubted myself. Now I mentor others like me.',
                hometown: 'Rural India'
            }
        ];
        
        demoStories.forEach(story => {
            const storyCard = createStoryCard(story);
            storyboardsContainer.appendChild(storyCard);
        });
    }, 500);
}

/**
 * Create story card element
 */
function createStoryCard(story) {
    const card = document.createElement('div');
    card.className = 'card-enhanced p-6 hover:transform hover:-translate-y-1 transition-all duration-300';
    card.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ${story.name.charAt(0)}
            </div>
            <div>
                <h3 class="font-bold text-lg">${story.name}</h3>
                <p class="text-sm text-gray-500">${story.profession}</p>
            </div>
        </div>
        <h4 class="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">${story.story_title}</h4>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">${story.story}</p>
        <p class="text-xs text-gray-400"><i class="fas fa-map-marker-alt mr-1"></i> ${story.hometown}</p>
    `;
    return card;
}

/**
 * Handle sharing a journey (alumni only)
 */
async function handleShareJourney(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'alumni') {
        showMessage('Only alumni can share stories', 'warning');
        return;
    }
    
    const title = storyTitleInput.value.trim();
    const description = storyDescriptionInput.value.trim();
    
    if (!title || !description) {
        showMessage('Please provide title and description', 'error');
        return;
    }
    
    const submitButton = document.querySelector('#share-journey-form button');
    setLoading(submitButton, true, 'Publishing...');
    
    setTimeout(() => {
        showMessage('Your story has been shared!', 'success');
        shareJourneyForm.reset();
        loadStoryboards();
        setLoading(submitButton, false);
    }, 1000);
}

// ============================================
// Quick Connect Functions - FIXED BOOKING
// ============================================

/**
 * Load Quick Connect page content
 */
function loadQuickConnect() {
    if (!currentUser) return;
    
    // Show/hide sections based on user type
    if (currentUser.type === 'alumni') {
        if (alumniSlotsSection) alumniSlotsSection.classList.remove('hidden');
        if (availableSlotsSection) availableSlotsSection.classList.add('hidden');
        loadMySlots();
    } else {
        if (alumniSlotsSection) alumniSlotsSection.classList.add('hidden');
        if (availableSlotsSection) availableSlotsSection.classList.remove('hidden');
        loadAvailableSlots();
        loadMySlots();
    }
}

/**
 * Load user's mentorship slots
 */
async function loadMySlots() {
    if (!mySlotsList) return;
    
    mySlotsList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading your slots...</div>';
    
    setTimeout(() => {
        const userSlots = userBookedSlots.filter(slot => {
            if (currentUser.type === 'alumni') {
                return slot.alumni_id === currentUser.id;
            } else {
                return slot.booked_by === currentUser.id;
            }
        });
        
        if (userSlots.length > 0) {
            mySlotsList.innerHTML = '';
            userSlots.forEach(slot => {
                const slotCard = createMySlotCard(slot);
                mySlotsList.appendChild(slotCard);
            });
        } else {
            mySlotsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-calendar-alt text-3xl mb-2"></i>
                    <p>No slots scheduled yet</p>
                </div>
            `;
        }
    }, 500);
}

/**
 * Load available mentorship slots for students
 */
async function loadAvailableSlots() {
    if (!availableSlotsList) return;
    
    availableSlotsList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading available slots...</div>';
    
    setTimeout(() => {
        const available = demoSlots.filter(slot => !slot.is_booked);
        
        if (available.length > 0) {
            availableSlotsList.innerHTML = '';
            available.forEach(slot => {
                const slotCard = createAvailableSlotCard(slot);
                availableSlotsList.appendChild(slotCard);
            });
            
            // Attach event listeners to all book buttons
            document.querySelectorAll('.book-slot-btn').forEach(btn => {
                btn.removeEventListener('click', handleBookClick);
                btn.addEventListener('click', handleBookClick);
            });
        } else {
            availableSlotsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-clock text-3xl mb-2"></i>
                    <p>No available slots right now</p>
                    <p class="text-sm mt-1">Check back later!</p>
                </div>
            `;
        }
    }, 500);
}

/**
 * Create my slot card
 */
function createMySlotCard(slot) {
    const card = document.createElement('div');
    const startTime = new Date(slot.start_time);
    
    card.className = 'p-4 border rounded-xl bg-green-50 dark:bg-green-900/20';
    card.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <p class="font-semibold">${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p class="text-sm text-gray-500">${slot.duration_minutes} minutes</p>
                <p class="text-xs mt-1 text-green-600">
                    <i class="fas fa-check-circle mr-1"></i> Booked
                </p>
                ${slot.topic ? `<p class="text-xs text-gray-500 mt-1">Topic: ${slot.topic}</p>` : ''}
            </div>
        </div>
    `;
    return card;
}

/**
 * Create available slot card with working book button
 */
function createAvailableSlotCard(slot) {
    const card = document.createElement('div');
    const startTime = new Date(slot.start_time);
    const isMobile = window.innerWidth < 640;
    
    card.className = 'p-4 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-md transition';
    card.setAttribute('data-slot-id', slot.id);
    card.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="flex-1">
                <p class="font-semibold text-base">${slot.alumni_name}</p>
                <p class="text-sm text-gray-500">${formatDate(slot.start_time)} (${slot.duration_minutes} min)</p>
                ${slot.topic ? `<p class="text-xs text-gray-400 mt-1">${slot.topic}</p>` : ''}
            </div>
            <button class="book-slot-btn btn-primary-gradient px-4 py-2 rounded-full text-sm font-semibold w-full sm:w-auto" data-slot-id="${slot.id}">
                <i class="fas fa-calendar-check mr-1"></i> Book Now
            </button>
        </div>
    `;
    return card;
}

/**
 * Handle book button click
 */
function handleBookClick(event) {
    event.stopPropagation();
    const button = event.currentTarget;
    const slotId = parseInt(button.getAttribute('data-slot-id'));
    bookSlot(slotId, button);
}

/**
 * Book a mentorship slot - FIXED WORKING FUNCTION
 */
function bookSlot(slotId, buttonElement = null) {
    if (!currentUser || currentUser.type !== 'student') {
        showMessage('Please login as a student to book slots', 'warning');
        return;
    }
    
    const slot = demoSlots.find(s => s.id === slotId);
    if (!slot) {
        showMessage('Slot not found', 'error');
        return;
    }
    
    if (slot.is_booked) {
        showMessage('This slot is already booked!', 'error');
        loadAvailableSlots();
        return;
    }
    
    // Disable button and show loading
    if (buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Booking...';
        
        setTimeout(() => {
            // Book the slot
            slot.is_booked = true;
            slot.booked_by = currentUser.id;
            
            // Add to user's booked slots
            userBookedSlots.push({
                ...slot,
                booked_by: currentUser.id,
                booked_at: new Date().toISOString()
            });
            
            showMessage(`Successfully booked a session with ${slot.alumni_name}! Check your slots.`, 'success');
            
            // Refresh both lists
            loadAvailableSlots();
            loadMySlots();
            
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalText;
        }, 1000);
    } else {
        // Book without button reference
        setTimeout(() => {
            slot.is_booked = true;
            slot.booked_by = currentUser.id;
            userBookedSlots.push({
                ...slot,
                booked_by: currentUser.id,
                booked_at: new Date().toISOString()
            });
            showMessage(`Successfully booked a session with ${slot.alumni_name}!`, 'success');
            loadAvailableSlots();
            loadMySlots();
        }, 500);
    }
}

/**
 * Create a new mentorship slot (alumni)
 */
async function handleCreateSlot(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'alumni') {
        showMessage('Only alumni can create slots', 'warning');
        return;
    }
    
    const date = slotDateInput.value;
    const time = slotTimeInput.value;
    const duration = parseInt(slotDurationSelect.value);
    
    if (!date || !time) {
        showMessage('Please select date and time', 'error');
        return;
    }
    
    const submitButton = document.querySelector('#create-slot-form button');
    setLoading(submitButton, true, 'Creating...');
    
    setTimeout(() => {
        const startTime = new Date(`${date}T${time}`);
        const newSlot = {
            id: demoSlots.length + 1,
            alumni_name: currentUser.name,
            alumni_id: currentUser.id,
            start_time: startTime.toISOString(),
            duration_minutes: duration,
            is_booked: false,
            topic: "Mentorship Session",
            booked_by: null
        };
        
        demoSlots.push(newSlot);
        showMessage('Slot created successfully!', 'success');
        createSlotForm.reset();
        loadMySlots();
        setLoading(submitButton, false);
    }, 1000);
}

// ============================================
// Resource Bank Functions
// ============================================

/**
 * Load resources
 */
async function loadResources() {
    if (!resourcesContainer) return;
    
    resourcesContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
            <p class="mt-2">Loading resources...</p>
        </div>
    `;
    
    setTimeout(() => {
        resourcesContainer.innerHTML = `
            <div class="card-enhanced p-5 hover:shadow-lg transition">
                <i class="fas fa-file-alt text-2xl text-indigo-500 mb-2"></i>
                <h3 class="font-bold text-lg">Top 50 Interview Questions</h3>
                <p class="text-sm text-gray-500 mt-1">Shared by alumni from Google</p>
                <a href="#" class="inline-block mt-3 text-indigo-600 hover:underline">Access Resource →</a>
            </div>
            <div class="card-enhanced p-5 hover:shadow-lg transition">
                <i class="fas fa-file-word text-2xl text-green-500 mb-2"></i>
                <h3 class="font-bold text-lg">Resume Template for First-Gen Students</h3>
                <p class="text-sm text-gray-500 mt-1">Downloadable template</p>
                <a href="#" class="inline-block mt-3 text-indigo-600 hover:underline">Access Resource →</a>
            </div>
            <div class="card-enhanced p-5 hover:shadow-lg transition">
                <i class="fas fa-chalkboard-user text-2xl text-purple-500 mb-2"></i>
                <h3 class="font-bold text-lg">Career Path Guide</h3>
                <p class="text-sm text-gray-500 mt-1">From rural roots to tech leadership</p>
                <a href="#" class="inline-block mt-3 text-indigo-600 hover:underline">Access Resource →</a>
            </div>
        `;
    }, 500);
}

/**
 * Handle resource upload
 */
async function handleResourceUpload(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'alumni') {
        showMessage('Only alumni can upload resources', 'warning');
        return;
    }
    
    const title = resourceTitleInput.value.trim();
    const url = resourceUrlInput.value.trim();
    const category = resourceCategorySelect.value;
    
    if (!title || !url || !category) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    const submitButton = document.querySelector('#upload-resource-form button');
    setLoading(submitButton, true, 'Uploading...');
    
    setTimeout(() => {
        showMessage('Resource uploaded successfully!', 'success');
        uploadResourceForm.reset();
        loadResources();
        setLoading(submitButton, false);
    }, 1000);
}

// ============================================
// Confidence Corner Functions
// ============================================

/**
 * Load confidence corner posts
 */
async function loadConfidencePosts() {
    if (!confidencePostsContainer) return;
    
    confidencePostsContainer.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
            <p class="mt-2">Loading community posts...</p>
        </div>
    `;
    
    setTimeout(() => {
        confidencePostsContainer.innerHTML = `
            <div class="card-enhanced p-5">
                <p class="text-gray-700 dark:text-gray-300">"Coming from a rural town, I never thought I'd make it in tech. UniVerge connected me with a mentor who changed my life. Never give up!"</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500"><i class="fas fa-user-secret mr-1"></i> Anonymous</span>
                    <span class="text-xs text-gray-400">2 days ago</span>
                </div>
            </div>
            <div class="card-enhanced p-5">
                <p class="text-gray-700 dark:text-gray-300">"Being a first-gen student is hard, but knowing there's a community that understands makes all the difference. Thank you UniVerge!"</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500"><i class="fas fa-user-secret mr-1"></i> Anonymous</span>
                    <span class="text-xs text-gray-400">5 days ago</span>
                </div>
            </div>
            <div class="card-enhanced p-5">
                <p class="text-gray-700 dark:text-gray-300">"The mentorship program helped me land my first internship. So grateful for this community!"</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500"><i class="fas fa-user-secret mr-1"></i> Anonymous</span>
                    <span class="text-xs text-gray-400">1 week ago</span>
                </div>
            </div>
        `;
    }, 500);
}

/**
 * Handle confidence post submission
 */
async function handleConfidencePost(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login to post', 'warning');
        return;
    }
    
    const content = postContentInput.value.trim();
    
    if (!content) {
        showMessage('Please write something before posting', 'error');
        return;
    }
    
    const submitButton = document.querySelector('#confidence-post-form button');
    setLoading(submitButton, true, 'Posting...');
    
    setTimeout(() => {
        showMessage('Your post has been shared anonymously!', 'success');
        postContentInput.value = '';
        loadConfidencePosts();
        setLoading(submitButton, false);
    }, 1000);
}

/**
 * Delete a post (alumni only)
 */
async function deletePost(postId) {
    if (!currentUser || currentUser.type !== 'alumni') {
        showMessage('Only alumni can delete posts', 'warning');
        return;
    }
    
    showMessage('Post deleted successfully', 'success');
    loadConfidencePosts();
}

// ============================================
// Impact Tracker Functions
// ============================================

/**
 * Load impact tracker page content
 */
async function loadImpactTracker() {
    if (!impactTrackerPage) return;
    
    impactTrackerPage.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-chart-line text-4xl text-indigo-500 mb-3"></i>
            <h2 class="text-2xl font-bold">Impact Dashboard</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div class="card-enhanced p-6 text-center">
                    <div class="text-3xl font-bold text-indigo-500">1,482</div>
                    <div class="text-sm text-gray-600 mt-1">Total Mentorships</div>
                    <div class="mt-2 text-xs text-green-600">↑ 23% from last month</div>
                </div>
                <div class="card-enhanced p-6 text-center">
                    <div class="text-3xl font-bold text-green-500">+43%</div>
                    <div class="text-sm text-gray-600 mt-1">Referral Growth</div>
                </div>
                <div class="card-enhanced p-6 text-center sm:col-span-2 lg:col-span-1">
                    <div class="text-3xl font-bold text-yellow-500">4.92/5</div>
                    <div class="text-sm text-gray-600 mt-1">Satisfaction Rate</div>
                </div>
            </div>
            <div class="mt-8">
                <button onclick="location.reload()" class="btn-primary-gradient px-6 py-3 rounded-full">
                    <i class="fas fa-sync-alt mr-2"></i> Refresh
                </button>
            </div>
        </div>
    `;
}

// ============================================
// Dark Mode Functions
// ============================================

/**
 * Initialize dark mode
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun text-yellow-400 text-xl"></i>';
        }
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDarkNow = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDarkNow);
            darkModeToggle.innerHTML = isDarkNow ? 
                '<i class="fas fa-sun text-yellow-400 text-xl"></i>' : 
                '<i class="fas fa-moon text-gray-700 text-xl"></i>';
        });
    }
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize application
 */
async function init() {
    // Set min date for slot creation
    if (slotDateInput) {
        const today = new Date().toISOString().split('T')[0];
        slotDateInput.min = today;
    }
    
    // Initialize dark mode
    initDarkMode();
    
    // Get current user
    currentUser = await getCurrentUser();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show appropriate page based on auth status
    if (currentUser) {
        showPage('dashboard');
    } else {
        showPage('landing', false);
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Auth form
    if (authForm) authForm.addEventListener('submit', handleAuthSubmit);
    if (toggleAuthModeButton) toggleAuthModeButton.addEventListener('click', toggleAuthMode);
    
    // Profile form
    if (profileEditForm) profileEditForm.addEventListener('submit', saveProfileChanges);
    
    // Storyboard form
    if (shareJourneyForm) shareJourneyForm.addEventListener('submit', handleShareJourney);
    
    // Quick connect form
    if (createSlotForm) createSlotForm.addEventListener('submit', handleCreateSlot);
    
    // Resource form
    if (uploadResourceForm) uploadResourceForm.addEventListener('submit', handleResourceUpload);
    
    // Confidence corner form
    if (confidencePostForm) confidencePostForm.addEventListener('submit', handleConfidencePost);
}

// Export functions for global access
window.showPage = showPage;
window.handleLogout = handleLogout;
window.simulateMatch = simulateMatch;
window.connectWithMatch = connectWithMatch;
window.bookSlot = bookSlot;
window.deletePost = deletePost;
window.showMessage = showMessage;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);