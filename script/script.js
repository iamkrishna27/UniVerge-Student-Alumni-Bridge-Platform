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
const navHomeButton = document.getElementById('nav-home');
const navDashboardButton = document.getElementById('nav-dashboard');
const navProfileButton = document.getElementById('nav-profile');
const navStoryboardButton = document.getElementById('nav-storyboard');
const navJobBoardButton = document.getElementById('nav-job-board');
const navQuickConnectButton = document.getElementById('nav-quick-connect');
const navResourceBankButton = document.getElementById('nav-resource-bank');
const navConfidenceCornerButton = document.getElementById('nav-confidence-corner');
const navChatButton = document.getElementById('nav-chat');

// Pages
const landingPage = document.getElementById('landing-page');
const authPage = document.getElementById('auth-page');
const dashboardPage = document.getElementById('dashboard-page');
const profilePage = document.getElementById('profile-page');
const storyboardPage = document.getElementById('storyboard-page');
const jobBoardPage = document.getElementById('job-board-page');
const quickConnectPage = document.getElementById('quick-connect-page');
const resourceBankPage = document.getElementById('resource-bank-page');
const confidenceCornerPage = document.getElementById('confidence-corner-page');
const chatPage = document.getElementById('chat-page');
const publicProfilePage = document.getElementById('public-profile-page');

// Auth Elements
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authFirstName = document.getElementById('auth-firstname');
const authLastName = document.getElementById('auth-lastname');
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
const profilePhotoImg = document.getElementById('profile-photo-img');
const profilePhotoInput = document.getElementById('profile-photo-input');
const removePhotoBtn = document.getElementById('remove-photo-btn');
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

// State Variables
let isRegisterMode = false;
let currentUser = null;
let previousPageBeforeProfile = null;

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
    if (!userAvatar || !currentUser) return;

    if (currentUser.profile_image) {
        userAvatar.style.backgroundImage = `url(${currentUser.profile_image})`;
        userAvatar.style.backgroundSize = 'cover';
        userAvatar.style.backgroundPosition = 'center';
        userAvatar.textContent = '';
    } else {
        userAvatar.style.backgroundImage = '';
        const initials = getUserInitials(currentUser);
        userAvatar.textContent = initials;
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
    // Redirect landing or auth pages to dashboard when already logged in
    if (currentUser && (pageId === 'landing' || pageId === 'auth')) {
        showPage('dashboard');
        return;
    }

    // Check authentication if required
    if (requireAuth && !localStorage.getItem('user') && !currentUser) {
        showMessage('Please login to access this page', 'warning');
        showPage('auth', false);
        return;
    }

    // Hide all pages
    const pages = [
        landingPage, authPage, dashboardPage, profilePage,
        storyboardPage, jobBoardPage, quickConnectPage,
        resourceBankPage, confidenceCornerPage, chatPage, publicProfilePage
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

        // Small delay to ensure CSS transitions apply smoothly
        setTimeout(() => {
            targetPage.classList.add('active-page', 'animate-fade-up');
        }, 10);

        // Load page-specific data explicitly when page is opened
        switch (pageId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'profile':
                loadUserProfile();
                break;
            case 'storyboard':
                loadStoryboards();
                break;
            case 'job-board':
                loadJobs();
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
            case 'chat':
                const chatParams = new URLSearchParams(window.location.search);
                const chatConnection = chatParams.get('connection');
                if (typeof loadConversations === 'function') {
                    loadConversations(chatConnection);
                }
                break;
        }
    } else {
        // If target page doesn't exist in DOM, we are likely on a separate standalone page (like /chat)
        // Redirect to main app with the target page in query params
        if (pageId !== 'chat') {
            if (currentUser) {
                const basePath = currentUser.type === 'student' ? '/student/dashboard' : '/alumni/dashboard';
                window.location.href = `${basePath}?page=${pageId}`;
            } else {
                window.location.href = `/?page=${pageId}`;
            }
        } else {
            window.location.href = '/chat';
        }
        return;
    }

    // Update active nav link
    updateActiveNavLink(pageId);

    // Update browser URL for landing/dashboard where appropriate
    if (pageId === 'dashboard' && currentUser) {
        const targetPath = currentUser.type === 'student' ? '/student/dashboard' : '/alumni/dashboard';
        if (window.location.pathname !== targetPath) {
            history.replaceState(null, '', targetPath);
        }
    } else if (pageId === 'landing') {
        if (window.location.pathname !== '/') {
            history.replaceState(null, '', '/');
        }
    } else if (pageId === 'auth') {
        if (window.location.pathname !== '/auth') {
            history.replaceState(null, '', '/auth');
        }
    } else if (pageId === 'chat') {
        if (window.location.pathname !== '/chat') {
            history.replaceState(null, '', '/chat' + window.location.search);
        }
    }

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

/**
 * Handle browser back navigation
 */
window.addEventListener('popstate', (event) => {
    // If we're on public profile and user hits back
    if (window.location.pathname.startsWith('/profile/') && event.state !== null) {
        // Just standard back navigation
    } else if (previousPageBeforeProfile) {
        showPage(previousPageBeforeProfile);
        previousPageBeforeProfile = null;
    }
});

/**
 * Open public profile dynamically
 */
async function openProfile(id, role) {
    if (!id || !role) return;

    // Track where we came from
    const activePage = document.querySelector('.active-page');
    if (activePage && activePage.id !== 'public-profile-page') {
        previousPageBeforeProfile = activePage.id.replace('-page', '');
    }

    // Show the public profile container
    showPage('public-profile');
    
    // Push the URL state without reloading
    history.pushState({ page: 'public-profile', id, role }, '', `/profile/${role}/${id}`);

    const loadingDiv = document.getElementById('public-profile-loading');
    const contentDiv = document.getElementById('public-profile-content');
    
    loadingDiv.classList.remove('hidden');
    contentDiv.classList.add('hidden');
    contentDiv.innerHTML = '';

    try {
        const response = await fetch(`/api/profile/${role}/${id}`);
        const data = await response.json();

        if (data.success) {
            const profile = data.profile;
            
            // Build dynamic UI based on role
            let uiHtml = `
                <div class="relative rounded-t-2xl overflow-hidden mb-6 h-32 md:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full header-banner">
                </div>
                <div class="relative -mt-20 md:-mt-24 px-6 md:px-10 flex flex-col items-center sm:items-start sm:flex-row gap-6 mb-8">
                    <img src="${profile.profile_image || 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&size=200'}" 
                         alt="Profile Photo" 
                         class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover bg-white">
                    
                    <div class="mt-2 text-center sm:text-left flex-1">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">${profile.name || 'Anonymous User'}</h2>
                        
                        ${role === 'alumni' ? `
                            <p class="text-xl text-indigo-600 dark:text-indigo-400 font-semibold mb-1">${profile.role || 'Alumni'}</p>
                            <p class="text-gray-600 dark:text-gray-300"><i class="fas fa-building mr-2"></i>${profile.company || 'Company N/A'}</p>
                            ${profile.location ? `<p class="text-gray-500 dark:text-gray-400 text-sm mt-1"><i class="fas fa-map-marker-alt mr-2"></i>${profile.location}</p>` : ''}
                        ` : `
                            <p class="text-xl text-indigo-600 dark:text-indigo-400 font-semibold mb-1">${profile.department || 'Student'} • Year ${profile.year || 'N/A'}</p>
                            <p class="text-gray-600 dark:text-gray-300"><i class="fas fa-university mr-2"></i>${profile.college || 'University N/A'}</p>
                        `}
                    </div>
                </div>

                <div class="px-6 md:px-10 flex gap-3 mb-8 justify-center sm:justify-start">
                    ${profile.connection_status === 'connected' ? `
                        <button onclick="openChat('${profile.connection_id}', '${profile.id}')" class="btn-primary-gradient px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition">
                            <i class="fas fa-comment-dots"></i> Message
                        </button>
                    ` : `
                        <button onclick="showMessage('You must be connected to message this user.', 'warning')" class="bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-not-allowed">
                            <i class="fas fa-comment-dots"></i> Message
                        </button>
                    `}
                    
                    ${role === 'alumni' && currentUser && currentUser.type === 'student' ? (
                        profile.connection_status === 'connected' ? `
                            <button class="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-default">
                                <i class="fas fa-check"></i> Connected
                            </button>
                        ` : profile.connection_status === 'pending' ? `
                            <button class="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-6 py-2 rounded-full font-semibold flex items-center gap-2 cursor-default">
                                <i class="fas fa-clock"></i> Request Sent
                            </button>
                        ` : `
                            <button onclick="sendConnectionRequest('${profile.id}', this)" class="btn-secondary-gradient px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition">
                                <i class="fas fa-user-plus"></i> Connect
                            </button>
                        `
                    ) : ''}
                    
                    ${role === 'student' && currentUser && currentUser.type === 'alumni' && profile.connection_status === 'connected' ? `
                        <button onclick="openTaskModal('${profile.connection_id}'); goBackFromProfile();" class="btn-secondary-gradient px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition">
                            <i class="fas fa-tasks"></i> Assign Task
                        </button>
                        <button onclick="goBackFromProfile(); showPage('dashboard');" class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition">
                            <i class="fas fa-chart-line"></i> Tracker
                        </button>
                    ` : ''}
                </div>

                <div class="px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="md:col-span-2 space-y-6">
                        <!-- Bio -->
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 class="text-lg font-bold mb-3 border-b pb-2">About</h3>
                            <p class="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">${profile.bio || 'This user has not written a bio yet.'}</p>
                        </div>
                        
                        <!-- Role Specific Detailed Sections -->
                        ${role === 'alumni' && profile.experience ? `
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 class="text-lg font-bold mb-3 border-b pb-2">Experience</h3>
                                <p class="text-gray-700 dark:text-gray-200"><i class="fas fa-briefcase mr-2"></i>${profile.experience} Years of Professional Experience</p>
                            </div>
                        ` : ''}

                        ${role === 'student' && profile.projects && profile.projects.length > 0 ? `
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 class="text-lg font-bold mb-3 border-b pb-2">Projects</h3>
                                <ul class="list-disc list-inside space-y-2">
                                    ${profile.projects.map(p => `<li>${p.title || 'Project'}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>

                    <div class="space-y-6">
                        <!-- Sidebar content: Skills -->
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 class="text-lg font-bold mb-3 border-b pb-2">Skills</h3>
                            <div class="flex flex-wrap gap-2">
                                ${profile.skills ? profile.skills.split(',').map(s => `<span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm px-3 py-1 rounded-full whitespace-nowrap">${s.trim()}</span>`).join('') : '<span class="text-gray-500 italic text-sm">No skills listed</span>'}
                            </div>
                        </div>

                        ${role === 'student' && profile.career_interests ? `
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 class="text-lg font-bold mb-3 border-b pb-2"><i class="fas fa-compass text-indigo-500 mr-2"></i>Career Interests</h3>
                                <p class="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">${profile.career_interests}</p>
                            </div>
                        ` : ''}

                        ${profile.linkedin || profile.github || profile.portfolio ? `
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                                <h3 class="text-lg font-bold mb-3 border-b pb-2">Links</h3>
                                ${profile.linkedin ? `
                                    <a href="${profile.linkedin.startsWith('http') ? profile.linkedin : 'https://' + profile.linkedin}" target="_blank" class="text-blue-600 hover:underline font-semibold flex items-center gap-2">
                                        <i class="fab fa-linkedin text-xl"></i> View LinkedIn
                                    </a>
                                ` : ''}
                                ${profile.github ? `
                                    <a href="${profile.github.startsWith('http') ? profile.github : 'https://' + profile.github}" target="_blank" class="text-gray-800 dark:text-gray-200 hover:underline font-semibold flex items-center gap-2">
                                        <i class="fab fa-github text-xl"></i> View GitHub
                                    </a>
                                ` : ''}
                                ${profile.portfolio ? `
                                    <a href="${profile.portfolio.startsWith('http') ? profile.portfolio : 'https://' + profile.portfolio}" target="_blank" class="text-purple-600 hover:underline font-semibold flex items-center gap-2">
                                        <i class="fas fa-globe text-xl"></i> View Portfolio
                                    </a>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            contentDiv.innerHTML = uiHtml;
            loadingDiv.classList.add('hidden');
            contentDiv.classList.remove('hidden');
        } else {
            showMessage(data.message || 'Unable to load profile data', 'error');
            goBackFromProfile();
        }
    } catch (err) {
        console.error('Error fetching profile:', err);
        showMessage('Network error fetching profile', 'error');
        goBackFromProfile();
    }
}

/**
 * Return to previous page from profile
 */
function goBackFromProfile() {
    if (previousPageBeforeProfile) {
        showPage(previousPageBeforeProfile);
        previousPageBeforeProfile = null;
    } else {
        // Fallback
        showPage('dashboard');
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
        const firstName = authFirstName.value;
        const lastName = authLastName.value;
        const name = `${firstName} ${lastName}`.trim();
        const userType = authUserType.value;
        const hometown = authHometown.value;
        const language = authLanguage.value;

        if (!firstName || !lastName || !userType || !hometown || !language) {
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
        navJobBoardButton, navQuickConnectButton, navResourceBankButton,
        navConfidenceCornerButton, navChatButton
    ];

    if (navHomeButton) navHomeButton.classList.toggle('hidden', isLoggedIn);

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

    if (dashboardWelcome) {
        dashboardWelcome.innerHTML = `Welcome back, ${currentUser.name}! <i class="fas fa-hand-peace"></i>`;
    }

    const isStudent = currentUser.type === 'student';
    if (studentMatchingSection) {
        studentMatchingSection.classList.toggle('hidden', !isStudent);
    }
    if (studentCareerPathSection) {
        studentCareerPathSection.classList.toggle('hidden', !isStudent);
    }

    // Trigger the real directory search for students!
    if (isStudent) {
        loadAlumniDirectory();
    }

    // Dashboard widgets for alumni and students
    loadRecentActivity();
    loadUpcomingSessions();
}

/**
 * Load recent activity cards on alumni dashboard
 */
async function loadRecentActivity() {
    const container = document.getElementById('recentActivityList');
    if (!container || !currentUser || currentUser.type !== 'alumni') return;

    container.innerHTML = '<p class="text-gray-500 text-sm">Loading recent activity...</p>';

    try {
        const response = await fetch('/api/dashboard/recent-activity');
        const data = await response.json();

        if (!data.success) {
            container.innerHTML = `<p class="text-red-500 text-sm">${data.message || 'Unable to load recent activity.'}</p>`;
            return;
        }

        const activities = data.recent_activity || [];
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No recent activity found.</p>';
            return;
        }

        container.innerHTML = '';

        activities.forEach(item => {
            let icon = 'fas fa-info-circle';
            let iconBg = 'bg-gray-100 text-gray-600';
            switch (item.type) {
                case 'mentorship_request':
                    icon = 'fas fa-user-plus';
                    iconBg = 'bg-yellow-100 text-yellow-600';
                    break;
                case 'task_completed':
                    icon = 'fas fa-check-circle';
                    iconBg = 'bg-green-100 text-green-600';
                    break;
                case 'mentorship_connection':
                    icon = 'fas fa-user-check';
                    iconBg = 'bg-blue-100 text-blue-600';
                    break;
                case 'job_application':
                    icon = 'fas fa-briefcase';
                    iconBg = 'bg-purple-100 text-purple-600';
                    break;
                default:
                    icon = 'fas fa-info-circle';
            }

            const itemHtml = `
                <div class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${iconBg}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-sm">${item.message}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${item.time}</p>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', itemHtml);
        });

    } catch (error) {
        console.error('loadRecentActivity error:', error);
        container.innerHTML = '<p class="text-red-500 text-sm">Failed to load recent activity.</p>';
    }
}

/**
 * Load upcoming mentorship sessions for alumni dashboard
 */
async function loadUpcomingSessions() {
    const container = document.getElementById('upcomingSessionsList');
    if (!container || !currentUser || currentUser.type !== 'alumni') return;

    container.innerHTML = '<p class="text-gray-500 text-sm">Loading upcoming sessions...</p>';

    try {
        const response = await fetch('/api/dashboard/upcoming-sessions');
        const data = await response.json();

        if (!data.success) {
            container.innerHTML = `<p class="text-red-500 text-sm">${data.message || 'Unable to load sessions.'}</p>`;
            return;
        }

        const sessions = data.upcoming_sessions || [];
        if (sessions.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No upcoming sessions found.</p>';
            return;
        }

        container.innerHTML = '';

        sessions.forEach(session => {
            const itemHtml = `
                <div class="border-l-4 border-indigo-500 pl-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <p class="font-semibold">${session.student_name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${session.date} • ${session.time}</p>
                    <a href="${session.meeting_link || '#'}" target="_blank" class="mt-2 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 text-sm font-semibold">
                        <i class="fas fa-video"></i> Join Meeting
                    </a>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', itemHtml);
        });

    } catch (error) {
        console.error('loadUpcomingSessions error:', error);
        container.innerHTML = '<p class="text-red-500 text-sm">Failed to load upcoming sessions.</p>';
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
function setProfilePhoto(url) {
    if (!profilePhotoImg) return;
    if (url) {
        profilePhotoImg.src = url;
    } else if (currentUser && currentUser.name) {
        profilePhotoImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff&size=128`;
    } else {
        profilePhotoImg.src = 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&size=128';
    }
}

async function loadUserProfile() {
    if (!currentUser) return;

    try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (data.success && data.user) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
    } catch (err) {
        console.error('Cannot refresh profile:', err);
    }

    if (profileName) profileName.textContent = currentUser.name || 'N/A';
    if (profileEmail) profileEmail.textContent = currentUser.email || 'N/A';
    if (profileType) profileType.textContent = currentUser.type || 'N/A';
    if (editHometown) editHometown.value = currentUser.hometown || '';
    if (editLanguage) editLanguage.value = currentUser.language || '';

    const profileNameDisplay = document.getElementById('profile-name-display');
    if (profileNameDisplay) profileNameDisplay.textContent = currentUser.name || 'User';

    const profileTypeDisplay = document.getElementById('profile-type-display');
    if (profileTypeDisplay) profileTypeDisplay.textContent = currentUser.type ? currentUser.type.toUpperCase() : '';

    setProfilePhoto(currentUser.profile_image);
    updateUserAvatar();

    // Shared fields
    const skillsField = document.getElementById('edit-skills');
    const bioField = document.getElementById('edit-bio');
    const linkedinField = document.getElementById('edit-linkedin');
    const githubField = document.getElementById('edit-github');
    const portfolioField = document.getElementById('edit-portfolio');

    if (skillsField) skillsField.value = currentUser.skills || '';
    if (bioField) bioField.value = currentUser.bio || '';
    if (linkedinField) linkedinField.value = currentUser.linkedin || '';
    if (githubField) githubField.value = currentUser.github || '';
    if (portfolioField) portfolioField.value = currentUser.portfolio || '';

    // Available for
    if (currentUser.type === 'alumni') {
        const availableFor = currentUser.available_for || [];
        document.getElementById('avail-mentorship').checked = availableFor.includes('mentorship');
        document.getElementById('avail-internship').checked = availableFor.includes('internship_referrals');
        document.getElementById('avail-job').checked = availableFor.includes('job_referrals');
        document.getElementById('avail-resume').checked = availableFor.includes('resume_review');
        document.getElementById('avail-mock').checked = availableFor.includes('mock_interviews');
    } else {
        // Ensure unchecked for students
        document.getElementById('avail-mentorship').checked = false;
        document.getElementById('avail-internship').checked = false;
        document.getElementById('avail-job').checked = false;
        document.getElementById('avail-resume').checked = false;
        document.getElementById('avail-mock').checked = false;
    }

    // Show/hide Available For section based on user type
    const availSection = document.getElementById('available-for-section');
    if (availSection) {
        availSection.style.display = currentUser.type === 'alumni' ? 'block' : 'none';
    }

    // Alumni only details
    const alumniSection = document.getElementById('alumni-professional-section');
    if (currentUser.type === 'alumni') {
        if (editProfessionRow) editProfessionRow.classList.remove('hidden');
        if (editProfession) editProfession.value = currentUser.profession || '';
        if (alumniSection) alumniSection.classList.remove('hidden');

        document.getElementById('edit-company-name').value = currentUser.company_name || '';
        document.getElementById('edit-designation').value = currentUser.designation || '';
        document.getElementById('edit-company-location').value = currentUser.company_location || '';
        document.getElementById('edit-experience-years').value = currentUser.experience_years || '';

        // hide student specific if any
        document.getElementById('student-extra-fields')?.classList.add('hidden');
    } else {
        if (editProfessionRow) editProfessionRow.classList.add('hidden');
        if (alumniSection) alumniSection.classList.add('hidden');

        // student structured data may still use this
        document.getElementById('edit-company-name').value = '';
        document.getElementById('edit-designation').value = '';
        document.getElementById('edit-company-location').value = '';
        document.getElementById('edit-experience-years').value = '';
        document.getElementById('student-extra-fields')?.classList.remove('hidden');
    }
}


/**
 * Save profile changes
 */
async function saveProfileChanges(event) {
    event.preventDefault();
    if (!currentUser) return;

    const updatedData = {
        hometown: editHometown.value,
        language: editLanguage.value,
        profession: currentUser.type === 'alumni' ? editProfession.value : undefined,
        company_name: document.getElementById('edit-company-name')?.value || '',
        designation: document.getElementById('edit-designation')?.value || '',
        company_location: document.getElementById('edit-company-location')?.value || '',
        experience_years: document.getElementById('edit-experience-years')?.value || '',
        bio: document.getElementById('edit-bio')?.value || '',
        skills: document.getElementById('edit-skills')?.value || '',
        linkedin: document.getElementById('edit-linkedin')?.value || '',
        github: document.getElementById('edit-github')?.value || '',
        portfolio: document.getElementById('edit-portfolio')?.value || ''
    };

    const available = [];
    if (currentUser.type === 'alumni') {
        if (document.getElementById('avail-mentorship')?.checked) available.push('mentorship');
        if (document.getElementById('avail-internship')?.checked) available.push('internship_referrals');
        if (document.getElementById('avail-job')?.checked) available.push('job_referrals');
        if (document.getElementById('avail-resume')?.checked) available.push('resume_review');
        if (document.getElementById('avail-mock')?.checked) available.push('mock_interviews');
    }
    updatedData.available_for = available;

    const saveButton = document.querySelector('#profile-edit-form button');
    setLoading(saveButton, true, 'Saving...');

    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            loadUserProfile();
            showMessage('Profile updated successfully!', 'success');
        } else {
            showMessage(data.message || 'Failed to save profile', 'error');
        }
    } catch (e) {
        showMessage('Error saving profile', 'error');
    }

    setLoading(saveButton, false);
}

function previewProfilePhoto() {
    const file = profilePhotoInput?.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        showMessage('Please upload JPG or PNG images only', 'error');
        profilePhotoInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        if (profilePhotoImg) profilePhotoImg.src = reader.result;
    };
    reader.readAsDataURL(file);

    // Save to backend
    uploadProfilePhoto(file);
}

async function uploadProfilePhoto(file) {
    if (!currentUser || !file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
        const response = await fetch('/api/profile/upload-photo', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            setProfilePhoto(data.profile_image);
            updateUserAvatar();
            showMessage('Profile photo updated!', 'success');
        } else {
            showMessage(data.message || 'Error uploading photo', 'error');
        }
    } catch (error) {
        console.error('uploadProfilePhoto error:', error);
        showMessage('Upload failed', 'error');
    }
}

async function removeProfilePhoto() {
    if (!currentUser) return;

    try {
        const response = await fetch('/api/profile/remove-photo', {
            method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            setProfilePhoto(null);
            updateUserAvatar();
            showMessage('Profile photo removed', 'success');
        } else {
            showMessage(data.message || 'Could not remove photo', 'error');
        }
    } catch (error) {
        console.error('removeProfilePhoto error:', error);
        showMessage('Remove photo failed', 'error');
    }
}

// ============================================
// Storyboard Functions
// ============================================

/**
 * Load alumni storyboards from Database
 */
async function loadStoryboards() {
    if (!storyboardsContainer) return;

    // NEW FIX: Show the posting form ONLY if the user is an Alumni
    if (shareJourneySection) {
        if (currentUser && currentUser.type === 'alumni') {
            shareJourneySection.classList.remove('hidden');
        } else {
            shareJourneySection.classList.add('hidden');
        }
    }

    storyboardsContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
            <p class="mt-2">Loading the feed...</p>
        </div>
    `;

    try {
        const response = await fetch('/api/storyboards');
        const data = await response.json();

        if (data.success && data.storyboards.length > 0) {
            storyboardsContainer.innerHTML = '';
            // Render each story like a feed post
            data.storyboards.forEach(story => {
                const storyCard = createStoryCard(story);
                storyboardsContainer.appendChild(storyCard);
            });
        } else {
            storyboardsContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No stories shared yet. Be the first to inspire!</div>';
        }
    } catch (error) {
        console.error('Error loading stories:', error);
        storyboardsContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Failed to load stories. Check connection.</div>';
    }
}

/**
 * Create a LinkedIn-style story feed card element
 */
function createStoryCard(story) {
    const card = document.createElement('div');
    card.className = 'card-enhanced p-6 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full';

    const dateStr = story.created_at ? new Date(story.created_at).toLocaleDateString() : 'Just now';
    const imgHtml = story.image_url ? `<img src="${story.image_url}" alt="Story Image" class="w-full h-64 object-cover rounded-lg mb-4 mt-2 border border-gray-200 dark:border-gray-700">` : '';

    // Safely prepare strings for the onclick functions to prevent errors with quotes
    const safeTitle = story.story_title ? story.story_title.replace(/'/g, "\\'") : '';
    const safeDesc = story.story ? story.story.replace(/'/g, "\\'") : '';

    // 1. Generate the Edit/Delete buttons ONLY if it's the author's post
    let adminButtons = '';
    if (currentUser && currentUser.id === story.alumni_id) {
        adminButtons = `
            <button onclick="openEditModal('${story.id}', '${safeTitle}', '${safeDesc}')" class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <i class="fas fa-edit text-lg"></i> Edit
            </button>
            <button onclick="deleteStoryRequest('${story.id}')" class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <i class="fas fa-trash text-lg"></i> Delete
            </button>
        `;
    }

    // 2. Build the full card HTML
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ${story.name ? story.name.charAt(0) : 'A'}
                </div>
                <div>
                    <h3 class="font-bold text-lg leading-tight cursor-pointer hover:underline" onclick="openProfile('${story.alumni_id}', 'alumni')">${story.name}</h3>
                    <p class="text-xs text-gray-500">${story.profession || 'Alumni'} • ${dateStr}</p>
                </div>
            </div>
        </div>
        
        <h4 class="font-bold text-indigo-600 dark:text-indigo-400 mb-2">${story.story_title}</h4>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-wrap">${story.story}</p>
        ${imgHtml}
        
        <div class="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 text-gray-500 font-semibold text-sm items-center">
            
            <button class="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <i class="far fa-thumbs-up text-lg"></i> Inspire
            </button>
            <button class="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <i class="far fa-comment text-lg"></i> Comment
            </button>
            
            <div class="flex-grow"></div>

            ${adminButtons}
            
            <button onclick="openReportModal('${story.alumni_id}', 'story', '${story.id}')" class="text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <i class="fas fa-flag text-lg"></i> Report
            </button>
            
        </div>
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
    const imageUrl = storyImageUrlInput ? storyImageUrlInput.value.trim() : '';

    if (!title || !description) {
        showMessage('Please provide title and description', 'error');
        return;
    }

    const submitButton = document.querySelector('#share-journey-form button');
    setLoading(submitButton, true, 'Publishing...');

    try {
        const response = await fetch('/api/storyboards/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, image_url: imageUrl })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Your story is live!', 'success');
            shareJourneyForm.reset();
            loadStoryboards(); // Reloads the feed with the new post at the top
        } else {
            showMessage(data.message || 'Failed to post', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        setLoading(submitButton, false);
    }
}

// ============================================
// Quick Connect Functions - DATABASE INTEGRATED
// ============================================

/**
 * Handles alumni creating a new mentorship slot
 */
async function handleCreateSlot(event) {
    event.preventDefault();

    if (!currentUser || currentUser.type !== 'alumni') {
        showMessage('Only alumni can create slots', 'warning');
        return;
    }

    const date = document.getElementById('slot-date').value;
    const time = document.getElementById('slot-time').value;
    const duration = document.getElementById('slot-duration').value;
    const meetingLink = document.getElementById('slot-meeting-link').value;

    if (!date || !time || !meetingLink) {
        showMessage('Please fill out all fields, including the meeting link', 'error');
        return;
    }

    const submitButton = document.querySelector('#create-slot-form button');
    setLoading(submitButton, true, 'Creating...');

    try {
        const response = await fetch('/api/slots/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, time, duration, meeting_link: meetingLink })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Slot created successfully!', 'success');
            document.getElementById('create-slot-form').reset();
            loadMySlots(); // Refresh the list
        } else {
            showMessage(data.message || 'Failed to create slot', 'error');
        }
    } catch (error) {
        console.error('Create slot error:', error);
        showMessage('Network error. Please check connection.', 'error');
    } finally {
        setLoading(submitButton, false);
    }
}
/**
 * Fetches real mentorship slots from MongoDB and displays them
 */
async function loadAvailableSlots() {
    if (!availableSlotsList) return;

    availableSlotsList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-indigo-500"></i> Loading available slots...</div>';

    try {
        const response = await fetch('/api/slots/available');
        const data = await response.json();

        if (data.success && data.slots.length > 0) {
            availableSlotsList.innerHTML = '';

            data.slots.forEach(slot => {
                const startTime = new Date(slot.start_time);

                const cardHtml = `
                    <div class="p-4 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-md transition mb-3 bg-white dark:bg-gray-800">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div class="flex-1">
                                <p class="font-semibold text-base text-indigo-600 cursor-pointer hover:underline" onclick="openProfile('${slot.alumni_id}', 'alumni')">${slot.alumni_name}</p>
                                <p class="text-sm text-gray-500">${startTime.toLocaleString()} (${slot.duration_minutes} min)</p>
                            </div>
                            <button class="book-slot-btn btn-primary-gradient px-4 py-2 rounded-full text-sm font-semibold text-white" 
                                    data-slot-id="${slot.id}">
                                <i class="fas fa-calendar-check mr-1"></i> Book Now
                            </button>
                        </div>
                    </div>`;

                availableSlotsList.insertAdjacentHTML('beforeend', cardHtml);
            });

            document.querySelectorAll('.book-slot-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const slotId = e.currentTarget.getAttribute('data-slot-id');
                    bookSlot(slotId, e.currentTarget);
                };
            });

        } else {
            availableSlotsList.innerHTML = '<p class="text-center text-gray-500 py-4">No available slots found in the database.</p>';
        }
    } catch (error) {
        console.error("Error loading available slots:", error);
        availableSlotsList.innerHTML = '<p class="text-center text-red-500 py-4">Failed to load slots. Is the server running?</p>';
    }
}

function loadQuickConnect() {
    if (!currentUser) return;
    if (currentUser.type === 'alumni') {
        if (alumniSlotsSection) alumniSlotsSection.classList.remove('hidden');
        if (availableSlotsSection) availableSlotsSection.classList.add('hidden');
    } else {
        if (alumniSlotsSection) alumniSlotsSection.classList.add('hidden');
        if (availableSlotsSection) availableSlotsSection.classList.remove('hidden');
        loadAvailableSlots();
    }
    loadMySlots();
}

/**
 * Consolidated and fixed loadMySlots function
 */
async function loadMySlots() {
    if (!mySlotsList) return;
    mySlotsList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-indigo-500"></i> Loading...</div>';

    try {
        const response = await fetch('/api/slots/my');
        const data = await response.json();

        if (data.success && data.slots.length > 0) {
            mySlotsList.innerHTML = '';
            data.slots.forEach(slot => {
                const startTime = new Date(slot.start_time);

                const statusHtml = slot.is_booked ?
                    `<p class="text-xs text-green-600 font-bold mt-1"><i class="fas fa-check-circle"></i> Booked by: ${slot.student_name || 'A Student'}</p>` :
                    `<p class="text-xs text-gray-400 mt-1">Not booked yet</p>`;

                const joinBtnHtml = slot.meeting_link ?
                    `<a href="${slot.meeting_link}" target="_blank" class="mt-3 inline-flex items-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition">
                        <i class="fas fa-video mr-2"></i> Join GMeet
                    </a>` : '';

                // NEW: Show "Rate Session" if the student booked it and hasn't reviewed it yet
                const reviewBtnHtml = (currentUser && currentUser.type === 'student' && slot.is_booked && !slot.is_reviewed) ?
                    `<button onclick="openFeedbackModal('${slot.id}')" class="mt-3 ml-2 inline-flex items-center border border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                        <i class="fas fa-star mr-2"></i> Rate Session
                    </button>` : '';

                const cardHtml = `
                    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm mb-3">
                        <p class="font-bold">${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p class="text-sm text-gray-500">${slot.duration_minutes} mins</p>
                        ${statusHtml}
                        <div class="flex flex-wrap items-center mt-1">
                            ${joinBtnHtml}
                            ${reviewBtnHtml}
                        </div>
                    </div>`;
                mySlotsList.insertAdjacentHTML('beforeend', cardHtml);
            });
        } else {
            mySlotsList.innerHTML = '<p class="text-center py-8 text-gray-500">No sessions scheduled.</p>';
        }
    } catch (error) {
        console.error("Error loading my slots:", error);
        mySlotsList.innerHTML = '<p class="text-center py-4 text-red-500">Error fetching slots. Please try again.</p>';
    }
}

async function bookSlot(slotId, buttonElement) {
    if (!currentUser || currentUser.type !== 'student') {
        showMessage('Please login as a student to book slots', 'warning');
        return;
    }

    const originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    try {
        const response = await fetch(`/api/slots/book/${slotId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Successfully booked! The Alumni will see your name.', 'success');
            loadAvailableSlots();
            loadMySlots();
        } else {
            showMessage(data.message || 'Booking failed', 'error');
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Booking error:', error);
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}

// ============================================
// Resource Bank - DIRECT FILE UPLOAD VERSION
// ============================================

// NEW: Global variable to store resources for fast filtering
let globalResources = [];

async function loadResources() {
    if (!resourcesContainer) return;
    if (currentUser.type === 'alumni') alumniResourceUploadSection.classList.remove('hidden');
    else alumniResourceUploadSection.classList.add('hidden');

    try {
        const response = await fetch('/api/resources');
        const data = await response.json();
        if (data.success) {
            globalResources = data.resources; // Save to global variable
            renderResources(globalResources); // Render all initially
        }
    } catch (error) { console.error(error); }
}

// NEW: Function to render the HTML cards
function renderResources(resourcesArray) {
    if (resourcesArray.length === 0) {
        resourcesContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">No resources found.</p>';
        return;
    }

    resourcesContainer.innerHTML = resourcesArray.map(res => `
        <div class="card-enhanced p-5 animate-fade-in border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <i class="fas fa-file-pdf text-indigo-500 text-3xl"></i>
                <span class="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-400">
                    ${res.category}
                </span>
            </div>
            <h3 class="font-bold mt-2 text-lg leading-tight mb-1">${res.title}</h3>
            <p class="text-xs text-gray-500 mb-3">Shared by ${res.alumni_name}</p>
            <a href="${res.url}" target="_blank" class="btn-primary-gradient inline-block px-4 py-2 rounded-lg text-white text-sm font-semibold text-center w-full hover:shadow-lg transition">
                <i class="fas fa-download mr-1"></i> Download
            </a>
        </div>
    `).join('');
}

// NEW: Function triggered when you type in the search bar or change the dropdown
window.filterResources = function () {
    const searchTerm = document.getElementById('resource-search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('resource-filter-select').value;

    const filtered = globalResources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm) || res.description?.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderResources(filtered);
};


async function handleResourceUpload(event) {
    event.preventDefault();
    const fileInput = document.getElementById('resource-file-input');
    const title = document.getElementById('resource-title').value;
    const category = document.getElementById('resource-category').value;

    if (!fileInput.files[0]) {
        showMessage("Please select a file to upload", "error");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', document.getElementById('resource-description').value);

    const submitButton = event.target.querySelector('button');
    setLoading(submitButton, true, 'Uploading...');

    try {
        const response = await fetch('/api/resources/create', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage('File uploaded successfully!', 'success');
            event.target.reset();
            loadResources(); // This refreshes the download list
        }
    } catch (error) {
        showMessage("Upload failed", "error");
    } finally {
        setLoading(submitButton, false);
    }
}

// ============================================
// Confidence Corner Functions
// ============================================

/**
 * Load confidence corner posts from MongoDB
 */
async function loadConfidencePosts() {
    if (!confidencePostsContainer) return;

    confidencePostsContainer.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        const response = await fetch('/api/confidence_corner/posts');
        const data = await response.json();

        if (data.success && data.posts.length > 0) {
            confidencePostsContainer.innerHTML = '';
            data.posts.forEach(post => {
                const date = new Date(post.created_at).toLocaleDateString();
                const postCard = document.createElement('div');
                postCard.className = 'card-enhanced p-5 animate-fade-in mb-4 relative';
                postCard.innerHTML = `
                    <p class="text-gray-700 dark:text-gray-300 pr-8">"${post.content}"</p>
                    <div class="flex justify-between items-center mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                        <span class="text-sm text-gray-500"><i class="fas fa-user-secret mr-1"></i> Anonymous</span>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-400">${date}</span>
                            
                            <button onclick="openReportModal('${post.user_id}', 'post', '${post.id}')" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                <i class="fas fa-flag"></i> Report
                            </button>
                        </div>
                    </div>
                `;
                confidencePostsContainer.appendChild(postCard);
            });
        } else {
            confidencePostsContainer.innerHTML = '<p class="text-center text-gray-500">No community posts yet. Be the first!</p>';
        }
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

/**
 * Handle confidence post submission to Backend
 */
async function handleConfidencePost(event) {
    event.preventDefault();
    const content = postContentInput.value.trim();

    if (!content) return;

    const submitButton = document.querySelector('#confidence-post-form button');
    setLoading(submitButton, true, 'Posting...');

    try {
        const response = await fetch('/api/confidence_corner/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            showMessage('Post shared anonymously!', 'success');
            postContentInput.value = '';
            loadConfidencePosts();
        }
    } catch (error) {
        showMessage('Post failed. Check connection.', 'error');
    } finally {
        setLoading(submitButton, false);
    }
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

// ==========================================
// BACKGROUND TASKS (Online Status & Reminders)
// ==========================================

// Ping server every 1 minute to show we are online
setInterval(() => {
    if (currentUser) {
        fetch('/api/ping', { method: 'POST' }).catch(e => console.log("Ping failed"));
    }
}, 60000);

// Check for upcoming sessions every 5 minutes
let notifiedSessions = [];
setInterval(() => {
    if (!currentUser || !mySlotsList) return;

    // Check the HTML of your slots for start times (simplest approach for your current UI)
    const cards = mySlotsList.querySelectorAll('.border-gray-200');
    cards.forEach(card => {
        const timeText = card.querySelector('.font-bold').innerText; // e.g. "4/2/2026 at 03:00 PM"
        const slotTime = new Date(timeText);
        const now = new Date();

        // Calculate minutes difference
        const diffMs = slotTime - now;
        const diffMins = Math.floor(diffMs / 60000);

        // If session is in less than 15 minutes and we haven't notified yet
        if (diffMins > 0 && diffMins <= 15 && !notifiedSessions.includes(timeText)) {
            notifiedSessions.push(timeText);
            // Trigger browser notification or your in-app toast
            showMessage(`Reminder: You have a mentorship session in ${diffMins} minutes!`, 'warning');

            // Optional: System notification if browser allows
            if (Notification.permission === "granted") {
                new Notification("UniVerge Session Reminder", { body: `Session starts in ${diffMins} minutes.` });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    });
}, 300000); // Check every 5 mins

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

    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get('page');

    if (currentUser) {
        updateNavUI(currentUser);
        if (pageFromUrl) {
            showPage(pageFromUrl);
            // Optionally clean up URL
            history.replaceState(null, '', currentUser.type === 'student' ? '/student/dashboard' : '/alumni/dashboard');
        } else if (path === '/' || path === '/landing' || path === '/auth' || path === '/student/dashboard' || path === '/alumni/dashboard' || path === '/chat') {
            if (path === '/chat') {
                showPage('chat');
            } else {
                showPage('dashboard');
            }
        } else {
            const currentPage = document.querySelector('.active-page');
            if (currentPage) {
                showPage(currentPage.id.replace('-page', ''));
            } else {
                showPage('dashboard');
            }
        }
    } else {
        if (path === '/student/dashboard' || path === '/alumni/dashboard' || path === '/auth' || path === '/chat') {
            history.replaceState(null, '', '/');
        }
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
    if (profilePhotoInput) profilePhotoInput.addEventListener('change', previewProfilePhoto);
    if (removePhotoBtn) removePhotoBtn.addEventListener('click', removeProfilePhoto);

    // Storyboard form
    if (shareJourneyForm) shareJourneyForm.addEventListener('submit', handleShareJourney);

    // Quick connect form (ADDED missing handler linkage)
    if (createSlotForm) createSlotForm.addEventListener('submit', handleCreateSlot);

    // Resource form
    if (uploadResourceForm) uploadResourceForm.addEventListener('submit', handleResourceUpload);

    // Confidence corner form
    if (confidencePostForm) confidencePostForm.addEventListener('submit', handleConfidencePost);
}

// ============================================
// Phase 2: Alumni Search & Feedback System
// ============================================

async function loadAlumniDirectory() {
    const container = document.getElementById('alumni-directory-results');
    const searchTerm = document.getElementById('alumni-search-input')?.value || '';

    if (!container) return;
    container.innerHTML = '<div class="col-span-full text-center py-4"><i class="fas fa-spinner fa-spin text-indigo-500"></i> Searching...</div>';

    try {
        const userId = currentUser ? currentUser.id : '';
        const response = await fetch(`/api/alumni?search=${encodeURIComponent(searchTerm)}&user_id=${userId}`);
        const data = await response.json();

        if (data.success && data.alumni.length > 0) {
            container.innerHTML = data.alumni.map(al => `
                <div class="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        ${al.name.charAt(0)}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 cursor-pointer hover:underline" onclick="openProfile('${al.id}', 'alumni')">
    ${al.name} 
    ${al.is_online ? '<span class="w-3 h-3 bg-green-500 rounded-full" title="Online Now"></span>' : '<span class="w-3 h-3 bg-gray-300 rounded-full" title="Offline"></span>'}
</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${al.profession || 'Alumni Member'}</p>
                        <p class="text-xs text-gray-500 mt-1"><i class="fas fa-map-marker-alt"></i> ${al.hometown || 'Unknown Location'}</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button onclick="openMentorshipModal('${al.id}')" class="btn-primary-gradient px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center text-white">
                            <i class="fas fa-handshake mr-1"></i> Request Mentor
                        </button>
                        <button onclick="openReportModal('${al.id}', 'profile', '')" class="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 transition-colors px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center">
                            <i class="fas fa-flag mr-1"></i> Report
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="col-span-full text-center text-gray-500 py-4">No mentors found matching that search.</p>';
        }
    } catch (e) { console.error(e); }
}

function openFeedbackModal(slotId) {
    document.getElementById('feedback-slot-id').value = slotId;
    document.getElementById('feedback-modal').classList.remove('hidden');
}

function closeFeedbackModal() {
    document.getElementById('feedback-modal').classList.add('hidden');
    document.getElementById('feedback-form').reset();
}

async function submitFeedback(event) {
    event.preventDefault();
    const slotId = document.getElementById('feedback-slot-id').value;
    const rating = document.getElementById('feedback-rating').value;
    const review = document.getElementById('feedback-review').value;
    const btn = event.target.querySelector('button[type="submit"]');

    setLoading(btn, true, 'Submitting...');

    try {
        const res = await fetch(`/api/feedback/${slotId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, review })
        });
        const data = await res.json();
        if (data.success) {
            showMessage('Rating submitted! Thank you.', 'success');
            closeFeedbackModal();
            loadMySlots(); // Refresh slots so the button disappears
        } else {
            showMessage(data.message, 'error');
        }
    } catch (e) { showMessage('Error submitting rating', 'error'); }

    setLoading(btn, false);
}


// ==========================================
// EDIT / DELETE STORIES
// ==========================================

async function deleteStoryRequest(storyId) {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
        const response = await fetch(`/api/storyboards/${storyId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            showMessage("Story deleted", "success");
            loadStoryboards(); // Refresh feed
        } else alert(data.message);
    } catch (e) { console.error(e); }
}

function openEditModal(storyId, title, desc) {
    document.getElementById('edit-story-id').value = storyId;
    document.getElementById('edit-story-title').value = title;
    document.getElementById('edit-story-desc').value = desc;
    document.getElementById('editStoryModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editStoryModal').style.display = 'none';
}

async function submitStoryEdit() {
    const id = document.getElementById('edit-story-id').value;
    const title = document.getElementById('edit-story-title').value;
    const desc = document.getElementById('edit-story-desc').value;

    try {
        const response = await fetch(`/api/storyboards/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: desc })
        });
        const data = await response.json();
        if (data.success) {
            showMessage("Story updated!", "success");
            closeEditModal();
            loadStoryboards(); // Refresh feed
        }
    } catch (e) { console.error(e); }
}

// Don't forget to add these to the bottom of your script.js exports!
window.deleteStoryRequest = deleteStoryRequest;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.submitStoryEdit = submitStoryEdit;

function openChat(connectionId, receiverId) {
    window.location.href = `/chat?connection=${connectionId}`;
}

// Export functions for global access
window.showPage = showPage;
window.handleLogout = handleLogout;
window.simulateMatch = simulateMatch;
window.connectWithMatch = connectWithMatch;
window.bookSlot = bookSlot;
window.deletePost = deletePost;
window.showMessage = showMessage;
window.openChat = openChat;
window.openChat = openChat;

// NEW EXPORTS FOR PHASE 2:
window.loadAlumniDirectory = loadAlumniDirectory;
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.submitFeedback = submitFeedback;

window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.submitReportRequest = submitReportRequest;
window.openProfile = openProfile;
window.goBackFromProfile = goBackFromProfile;
window.sendConnectionRequest = async function(alumniId, buttonElement) {
    if (!currentUser || currentUser.type !== 'student') return;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
        const response = await fetch('/api/connections/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alumni_id: alumniId, student_id: currentUser.id })
        });
        const data = await response.json();
        if (data.success) {
            buttonElement.innerHTML = '<i class="fas fa-clock"></i> Request Sent';
            buttonElement.classList.remove('btn-secondary-gradient');
            buttonElement.classList.add('bg-yellow-100', 'text-yellow-700', 'dark:bg-yellow-900/40', 'dark:text-yellow-400');
        } else {
            buttonElement.disabled = false;
            buttonElement.innerHTML = '<i class="fas fa-user-plus"></i> Connect';
            showMessage(data.message || 'Failed to send request', 'error');
        }
    } catch (e) {
        console.error(e);
        buttonElement.disabled = false;
        buttonElement.innerHTML = '<i class="fas fa-user-plus"></i> Connect';
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
// --- Reporting & Moderation Logic ---

function openReportModal(reportedUserId, contentType, contentId) {
    // Populate hidden fields with the specific context
    document.getElementById('report-target-user-id').value = reportedUserId || '';
    document.getElementById('report-content-type').value = contentType || 'general';
    document.getElementById('report-content-id').value = contentId || '';

    // Clear previous text
    document.getElementById('report-details').value = '';

    // Show the modal
    document.getElementById('reportModal').style.display = 'flex';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

async function submitReportRequest() {
    const reportedUserId = document.getElementById('report-target-user-id').value;
    const contentType = document.getElementById('report-content-type').value;
    const contentId = document.getElementById('report-content-id').value;
    const reason = document.getElementById('report-reason').value;
    const details = document.getElementById('report-details').value;

    const reportData = {
        reported_user_id: reportedUserId,
        content_type: contentType,
        content_id: contentId,
        reason: reason,
        details: details
    };

    try {
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            closeReportModal();
        } else {
            alert(data.message || "Failed to submit report.");
        }
    } catch (error) {
        console.error("Error submitting report:", error);
        alert("An error occurred. Please try again.");
    }
}

// ============================================
// Job Board Functions (New Feature)
// ============================================

async function loadJobs() {
    if (!document.getElementById('jobs-container')) return;

    if (currentUser && currentUser.type === 'alumni') {
        document.getElementById('alumni-job-post-section').classList.remove('hidden');
    } else {
        document.getElementById('alumni-job-post-section').classList.add('hidden');
    }

    const container = document.getElementById('jobs-container');
    container.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i><p>Loading opportunities...</p></div>';

    try {
        const response = await fetch('/api/jobs');
        const data = await response.json();

        if (data.success && data.jobs.length > 0) {
            container.innerHTML = '';
            data.jobs.forEach(job => {
                const dateStr = new Date(job.created_at).toLocaleDateString();

                let skillTags = '';
                if (job.required_skills) {
                    const skills = job.required_skills.split(',').map(s => s.trim()).filter(s => s);
                    skillTags = skills.map(skill => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-semibold">${skill}</span>`).join(' ');
                }

                let applyParams = '';
                if (job.application_link) {
                    applyParams = `<a href="${job.application_link}" target="_blank" class="btn-primary-gradient px-4 py-2 rounded-lg text-sm transition font-bold text-white leading-none inline-flex items-center"><i class="fas fa-external-link-alt mr-1"></i> Apply Externally</a>`;
                } else if (job.contact_email) {
                    applyParams = `<a href="mailto:${job.contact_email}" class="btn-primary-gradient px-4 py-2 rounded-lg text-sm transition font-bold text-white leading-none inline-flex items-center"><i class="fas fa-envelope mr-1"></i> Apply via Email</a>`;
                } else {
                    applyParams = (currentUser && currentUser.type === 'student') ?
                        `<button onclick="handleApplyJob('${job.id}')" class="btn-primary-gradient px-4 py-2 rounded-lg text-sm transition font-bold text-white"><i class="fas fa-paper-plane mr-1"></i> Apply Now</button>` : '';
                }

                const expLevel = job.experience_level ? `<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold whitespace-nowrap"><i class="fas fa-graduation-cap mr-1"></i>${job.experience_level}</span>` : '';
                const compBadge = job.compensation_type ? `<span class="px-3 py-1 ${job.compensation_type === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} rounded-full text-xs font-bold whitespace-nowrap"><i class="fas fa-money-bill-wave mr-1"></i>${job.compensation_type} ${job.salary_range ? '(' + job.salary_range + ')' : ''}</span>` : '';
                const deadlineStr = job.application_deadline ? `<span class="text-red-500 font-semibold bg-red-50 px-2 py-1 rounded whitespace-nowrap text-xs"><i class="fas fa-exclamation-circle mr-1"></i>Deadline: ${new Date(job.application_deadline).toLocaleDateString()}</span>` : '';
                const joiningStr = job.joining_date ? `<span class="text-blue-500 font-semibold bg-blue-50 px-2 py-1 rounded whitespace-nowrap text-xs"><i class="fas fa-calendar-check mr-1"></i>Joining: ${new Date(job.joining_date).toLocaleDateString()}</span>` : '';

                const jobCard = document.createElement('div');
                jobCard.className = 'p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition bg-white dark:bg-gray-800 mb-6';
                jobCard.innerHTML = `
                    <div class="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                        <div>
                            <h4 class="font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-1">${job.title}</h4>
                            <p class="font-semibold text-gray-800 dark:text-gray-200 text-lg">${job.company}</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center">
                            ${expLevel}
                            ${compBadge}
                            <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold whitespace-nowrap">${job.type}</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4 items-center">
                        <span><i class="fas fa-map-marker-alt mr-1"></i>${job.location}</span>
                        <span><i class="fas fa-clock mr-1"></i>Posted ${dateStr}</span>
                        ${deadlineStr}
                        ${joiningStr}
                    </div>
                    
                    ${skillTags ? `<div class="mb-4 flex flex-wrap gap-2">${skillTags}</div>` : ''}
                    
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-5 border border-gray-100 dark:border-gray-700">
                        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">${job.description}</p>
                    </div>
                    
                    <div class="flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                        <span class="text-gray-500">Posted by: <strong>${job.alumni_name}</strong></span>
                        ${applyParams}
                    </div>
                `;
                container.appendChild(jobCard);
            });
        } else {
            container.innerHTML = '<div class="text-center py-8 text-gray-500">No job opportunities posted yet.</div>';
        }
    } catch (e) {
        container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading opportunities. Please try again later.</div>';
        console.error("Error loading jobs:", e);
    }
}

document.getElementById('create-job-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.type !== 'alumni') return;

    const submitBtn = e.target.querySelector('button');
    setLoading(submitBtn, true, 'Posting...');

    const body = {
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        application_link: document.getElementById('job-application-link').value,
        contact_email: document.getElementById('job-contact-email').value,
        experience_level: document.getElementById('job-experience-level').value,
        required_skills: document.getElementById('job-required-skills').value,
        compensation_type: document.getElementById('job-compensation-type').value,
        salary_range: document.getElementById('job-salary-range').value,
        application_deadline: document.getElementById('job-deadline').value,
        joining_date: document.getElementById('job-joining-date').value
    };

    try {
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (data.success) {
            showMessage('Opportunity posted successfully!', 'success');
            e.target.reset();
            loadJobs();
        } else {
            showMessage(data.message || 'Failed to post opportunity.', 'error');
        }
    } catch (err) {
        showMessage('Network Error posting opportunity.', 'error');
        console.error(err);
    }
    setLoading(submitBtn, false);
});

async function handleApplyJob(jobId) {
    if (!currentUser || currentUser.type !== 'student') {
        showMessage('Only students can apply.', 'warning');
        return;
    }
    try {
        const response = await fetch('/api/jobs/' + jobId + '/apply', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (e) {
        showMessage('Failed to process your application.', 'error');
        console.error("Error applying to job:", e);
    }
}

window.handleApplyJob = handleApplyJob;
window.loadJobs = loadJobs;

// ============================================
// Mentorship System (New Feature)
// ============================================

function openMentorshipModal(alumniId) {
    if (!currentUser || currentUser.type !== 'student') {
        showMessage('You must be registered as a student to request mentorship.', 'warning');
        return;
    }
    document.getElementById('request-alumni-id').value = alumniId;
    document.getElementById('request-mentorship-modal').classList.remove('hidden');
}

function closeMentorshipModal() {
    document.getElementById('request-mentorship-modal').classList.add('hidden');
    document.getElementById('request-mentorship-form').reset();
}

document.getElementById('request-mentorship-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    setLoading(btn, true, 'Sending...');

    const payload = {
        alumni_id: document.getElementById('request-alumni-id').value,
        department: document.getElementById('request-department').value,
        year: document.getElementById('request-year').value,
        skills: document.getElementById('request-skills').value,
        goal: document.getElementById('request-goal').value,
        preferred_duration: document.getElementById('request-duration').value || "Not Specified"
    };

    try {
        const response = await fetch('/api/mentorship/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            showMessage(data.message, 'success');
            closeMentorshipModal();
            loadDashboardData();
        } else {
            showMessage(data.message || 'Failed to send request.', 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Network error sending mentorship request.', 'error');
    }
    setLoading(btn, false);
});

function openTaskModal(connectionId) {
    document.getElementById('task-connection-id').value = connectionId;
    document.getElementById('assign-task-modal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('assign-task-modal').classList.add('hidden');
    document.getElementById('assign-task-form').reset();
}

document.getElementById('assign-task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    setLoading(btn, true, 'Assigning...');

    const payload = {
        connection_id: document.getElementById('task-connection-id').value,
        task_title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        deadline: document.getElementById('task-deadline').value,
        priority: document.getElementById('task-priority').value
    };

    try {
        const response = await fetch('/api/mentorship/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            showMessage(data.message, 'success');
            closeTaskModal();
            loadDashboardData();
        } else {
            showMessage(data.message || 'Failed to assign task.', 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Error assigning task.', 'error');
    }
    setLoading(btn, false);
});

function openCompleteModal(taskId) {
    document.getElementById('complete-task-id').value = taskId;
    document.getElementById('complete-task-modal').classList.remove('hidden');
}

function closeCompleteModal() {
    document.getElementById('complete-task-modal').classList.add('hidden');
    document.getElementById('complete-task-form').reset();
}

document.getElementById('complete-task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    setLoading(btn, true, 'Submitting...');

    const taskId = document.getElementById('complete-task-id').value;
    const payload = {
        completion_notes: document.getElementById('task-notes').value,
        submission_link: document.getElementById('task-link').value
    };

    try {
        const response = await fetch('/api/mentorship/task/' + taskId + '/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            showMessage(data.message, 'success');
            closeCompleteModal();
            loadDashboardData();
        } else {
            showMessage(data.message || 'Failed to complete task.', 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Error completing task.', 'error');
    }
    setLoading(btn, false);
});

document.getElementById('progress-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    setLoading(btn, true, 'Logging...');

    const connectionId = document.getElementById('progress-connection-id').value;
    if (!connectionId) {
        showMessage('No active mentorship connection found.', 'error');
        setLoading(btn, false);
        return;
    }

    const payload = {
        connection_id: connectionId,
        progress_text: document.getElementById('progress-text').value
    };

    try {
        const response = await fetch('/api/mentorship/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            showMessage(data.message, 'success');
            e.target.reset();
            loadDashboardData();
        } else {
            showMessage(data.message || 'Failed to submit progress.', 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Error submitting progress.', 'error');
    }
    setLoading(btn, false);
});

async function respondToRequest(reqId, status) {
    try {
        const response = await fetch('/api/mentorship/request/' + reqId + '/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (data.success) {
            showMessage(data.message, 'success');
            loadDashboardData();
        } else {
            showMessage(data.message || 'Failed', 'error');
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadMentorshipDashboard() {
    document.getElementById('mentorship-hub-section').classList.remove('hidden');

    if (currentUser.type === 'alumni') {
        document.getElementById('mentorship-alumni-view').classList.remove('hidden');
        document.getElementById('mentorship-student-view').classList.add('hidden');

        // Load Pending Requests
        const reqRes = await fetch('/api/mentorship/requests');
        const reqData = await reqRes.json();
        const reqContainer = document.getElementById('mentorship-requests-container');
        if (reqData.success && reqData.requests.length > 0) {
            reqContainer.innerHTML = reqData.requests.map(r => `
                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition hover:shadow-md">
                    <p class="font-bold text-lg text-indigo-600 mb-1 cursor-pointer hover:underline" onclick="openProfile('${r.student_id}', 'student')">${r.student_name}</p>
                    <p class="text-sm text-gray-500 mb-2"><i class="fas fa-graduation-cap"></i> ${r.department} • Year: ${r.year}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Goal:</strong> ${r.goal}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-4"><strong>Skills:</strong> ${r.skills}</p>
                    <div class="flex gap-2">
                        <button onclick="respondToRequest('${r.id}', 'accepted')" class="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center justify-center flex-1 transition"><i class="fas fa-check mr-2"></i> Accept</button>
                        <button onclick="respondToRequest('${r.id}', 'rejected')" class="bg-gray-100 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold text-gray-700 flex items-center justify-center flex-1 transition"><i class="fas fa-times mr-2"></i> Reject</button>
                    </div>
                </div>
            `).join('');
        } else {
            reqContainer.innerHTML = '<p class="text-gray-500 text-sm italic">No pending mentorship requests.</p>';
        }

        // Load Connections
        const conRes = await fetch('/api/mentorship/connections');
        const conData = await conRes.json();
        const conContainer = document.getElementById('mentorship-mentees-container');
        if (conData.success && conData.connections.length > 0) {
            conContainer.innerHTML = '';
            for (const c of conData.connections) {
                const progRes = await fetch('/api/mentorship/progress?connection_id=' + c.id);
                const progData = await progRes.json();
                const progCount = progData.success ? progData.progress.length : 0;

                conContainer.innerHTML += `
                    <div class="p-5 border border-indigo-100 dark:border-indigo-900/50 rounded-xl bg-white dark:bg-gray-800 shadow-lg relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition duration-500"></div>
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h5 class="font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-1 cursor-pointer hover:underline" onclick="openProfile('${c.student_id}', 'student')"><i class="fas fa-user-graduate text-indigo-500 mr-2"></i>${c.student_name}</h5>
                                <p class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block mt-1">Mentee</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="openChat('${c.id}', '${c.student_id}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                    <i class="fas fa-comments mr-2"></i> Message
                                </button>
                                <button onclick="openTaskModal('${c.id}')" class="btn-primary-gradient px-4 py-2 text-sm rounded-lg font-bold text-white shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"><i class="fas fa-plus mr-1"></i> Assign Task</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-800">
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Tracker</span>
                            <p class="text-sm font-bold text-green-600"><i class="fas fa-chart-line mr-1"></i> ${progCount} Updates</p>
                        </div>
                    </div>
                `;
            }
        } else {
            conContainer.innerHTML = '<p class="col-span-full text-gray-500 text-sm italic">You currently have no mentees.</p>';
        }
    } else {
        // Student View
        document.getElementById('mentorship-student-view').classList.remove('hidden');
        document.getElementById('mentorship-alumni-view').classList.add('hidden');

        const conRes = await fetch('/api/mentorship/connections');
        const conData = await conRes.json();

        if (conData.success && conData.connections.length > 0) {
            const activeConnection = conData.connections[0]; // Retaining for tasks/progress default load
            document.getElementById('progress-connection-id').value = activeConnection.id;

            const mentorContainer = document.getElementById('mentorship-mentor-container');
            mentorContainer.style.maxHeight = '350px';
            mentorContainer.style.overflowY = 'auto';
            mentorContainer.classList.add('space-y-4');

            mentorContainer.innerHTML = conData.connections.map(conn => `
                <div class="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm gap-4">
                    <div class="flex items-center gap-4 w-full sm:w-auto">
                        <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-inner flex-shrink-0">
                            ${conn.alumni_name.charAt(0)}
                        </div>
                        <div>
                            <p class="font-bold text-xl text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onclick="openProfile('${conn.alumni_id}', 'alumni')">${conn.alumni_name}</p>
                            <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-md mt-1"><i class="fas fa-shield-check"></i> Connected Alumni Mentor</span>
                        </div>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto justify-end">
                        <button onclick="openProfile('${conn.alumni_id}', 'alumni')" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm">
                            View Profile
                        </button>
                        <button onclick="openChat('${conn.id}', '${conn.alumni_id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            <i class="fas fa-comments mr-2"></i> Message
                        </button>
                    </div>
                </div>
            `).join('');

            // Load Tasks
            const taskRes = await fetch('/api/mentorship/tasks?connection_id=' + activeConnection.id);
            const taskData = await taskRes.json();
            const taskContainer = document.getElementById('mentorship-tasks-container');
            if (taskData.success && taskData.tasks.length > 0) {
                taskContainer.innerHTML = taskData.tasks.map(t => {
                    const badgeClr = t.priority === 'high' ? 'bg-red-100 text-red-800' : (t.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800');
                    const isCompleted = t.status === 'completed';
                    const compBtn = isCompleted ?
                        `<span class="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full"><i class="fas fa-check-circle"></i> Completed</span>` :
                        `<button onclick="openCompleteModal('${t.id}')" class="bg-gray-100 hover:bg-green-500 hover:text-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 transition shadow-sm hover:shadow">Mark as Done</button>`;
                    const opacityLayer = isCompleted ? 'opacity-80' : 'opacity-100';
                    return `
                    <div class="p-4 border ${isCompleted ? 'border-green-200 dark:border-green-900 bg-green-50/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'} rounded-xl shadow-sm ${opacityLayer}">
                        <div class="flex justify-between items-start mb-3">
                            <h5 class="font-bold text-lg text-gray-900 dark:text-white">${t.task_title}</h5>
                            <span class="px-2 py-1 rounded-lg text-xs font-bold ${badgeClr} uppercase tracking-wider">${t.priority}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">${t.description}</p>
                        <div class="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-xs font-semibold ${isCompleted ? 'text-green-600' : 'text-red-500'}"><i class="fas fa-clock mr-1"></i>Due: ${t.deadline}</span>
                            ${compBtn}
                        </div>
                    </div>`;
                }).join('');
            } else {
                taskContainer.innerHTML = '<div class="text-center p-6 bg-gray-50 rounded-xl"><p class="text-gray-500 italic">No tasks currently assigned.</p></div>';
            }

            // Load Progress
            const progRes = await fetch('/api/mentorship/progress?connection_id=' + activeConnection.id);
            const progData = await progRes.json();
            const progContainer = document.getElementById('progress-history-container');
            if (progData.success && progData.progress.length > 0) {
                progContainer.innerHTML = progData.progress.map(p => `
                    <div class="relative pl-6 pb-4 border-l-2 border-indigo-200 dark:border-indigo-800 last:border-0 last:pb-0">
                        <div class="absolute w-3 h-3 bg-indigo-500 rounded-full left-[-7px] top-1 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"></div>
                        <p class="text-xs text-indigo-500 font-bold mb-1 uppercase tracking-wider">${new Date(p.created_at).toLocaleDateString()}</p>
                        <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${p.progress_text}</p>
                        </div>
                    </div>
                `).join('');
            } else {
                progContainer.innerHTML = '<p class="text-gray-400 italic text-sm text-center py-4">No progress logs recorded yet.</p>';
            }
        } else {
            document.getElementById('mentorship-mentor-container').innerHTML = `
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <p class="text-yellow-700 dark:text-yellow-500 font-medium"><i class="fas fa-exclamation-circle mr-2"></i>You are not connected to a mentor yet.</p>
                    <p class="text-sm text-yellow-600 dark:text-yellow-600 mt-1">Search the directory below and send a request to get started!</p>
                </div>
            `;
            document.getElementById('mentorship-tasks-container').innerHTML = '<div class="opacity-50 blur-[1px] select-none"><div class="p-4 border rounded-xl"><div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div><div class="h-2 bg-gray-200 rounded w-full mb-2"></div><div class="h-2 bg-gray-200 rounded w-2/3"></div></div></div>';
            document.getElementById('progress-history-container').innerHTML = '';
        }
    }
}

const originalLoadDashboardData = loadDashboardData || function () { };
window.loadDashboardData = async function () {
    await originalLoadDashboardData();
    loadMentorshipDashboard();
};

window.openMentorshipModal = openMentorshipModal;
window.closeMentorshipModal = closeMentorshipModal;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.openCompleteModal = openCompleteModal;
window.closeCompleteModal = closeCompleteModal;
