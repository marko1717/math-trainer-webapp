/* ===================================
   MATH QUEST - PROFILE APP
   =================================== */

// Trainer icons mapping
const TRAINER_ICONS = {
    'arithmetic': '📐',
    'geometric': '📈',
    'quadratic': '📊',
    'triangle': '📐',
    'parity': '🔢',
    'powers': '⚡',
    'percent': '💯',
    'fsm': '🧮',
    'graphs': '📉',
    'flashcards': '🃏',
    'graph-builder': '✏️'
};

const TRAINER_NAMES = {
    'arithmetic': 'Арифметична прогресія',
    'geometric': 'Геометрична прогресія',
    'quadratic': 'Квадратні рівняння',
    'triangle': 'Трикутники',
    'parity': 'Парність',
    'powers': 'Степені',
    'percent': 'Відсотки',
    'fsm': 'Формули скороч. множення',
    'graphs': 'Графіки функцій',
    'flashcards': 'Флеш-картки',
    'graph-builder': 'Побудова графіків'
};

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const profileScreen = document.getElementById('profileScreen');
const appleLoginBtn = document.getElementById('appleLoginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Name input elements removed - Apple App Store Guideline 4.0 compliance
// We never ask users for name/email after Sign in with Apple

// Logout modal elements
const logoutModal = document.getElementById('logoutModal');
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

// Delete account elements
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Profile elements
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const totalXP = document.getElementById('totalXP');
const userLevel = document.getElementById('userLevel');
const userStreak = document.getElementById('userStreak');
const trainersCompleted = document.getElementById('trainersCompleted');
const currentLevel = document.getElementById('currentLevel');
const xpProgress = document.getElementById('xpProgress');
const levelFill = document.getElementById('levelFill');
const trainerProgressList = document.getElementById('trainerProgressList');
const recentActivity = document.getElementById('recentActivity');
const achievementsList = document.getElementById('achievementsList');

// Current user reference
let currentUserRef = null;

// Wait for Firebase to load
async function init() {
    // Wait a bit for firebase.js to load
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!window.MathQuestFirebase) {
        console.error('Firebase not loaded');
        return;
    }

    // Initialize Firebase
    await window.MathQuestFirebase.initFirebase();

    // Check if user is already logged in (from localStorage)
    const existingUser = window.MathQuestFirebase.getCurrentUser();
    console.log('📱 Checking existing user on init:', existingUser ? existingUser.email : 'none');
    if (existingUser) {
        // User already logged in, show profile immediately
        handleAuthChange(existingUser);
    }

    // Listen for auth changes (Firebase SDK)
    window.MathQuestFirebase.onAuthChange(handleAuthChange);

    // Also listen for custom authStateChanged event (for REST API auth in Capacitor)
    window.addEventListener('authStateChanged', (e) => {
        const user = e.detail?.user;
        console.log('📱 Custom authStateChanged event received:', user ? user.email : 'null');
        handleAuthChange(user);
    });

    // Setup event listeners
    appleLoginBtn.addEventListener('click', handleAppleLogin);
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
    logoutBtn.addEventListener('click', showLogoutModal);
    cancelLogoutBtn.addEventListener('click', hideLogoutModal);
    confirmLogoutBtn.addEventListener('click', handleLogout);

    // Delete account listeners
    deleteAccountBtn.addEventListener('click', showDeleteModal);
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    confirmDeleteBtn.addEventListener('click', handleDeleteAccount);
}

// Apple App Store Guideline 4.0 - Design compliance
// We NEVER ask users for name/email after Sign in with Apple
// The name input screen has been completely removed from the app

// Handle auth state changes
async function handleAuthChange(user) {
    currentUserRef = user;

    if (user) {
        // Load saved display name from Firestore if available
        const profile = await window.MathQuestFirebase.getUserProfile();
        const savedDisplayName = profile?.displayName;

        if (savedDisplayName && savedDisplayName.length > 1) {
            user.displayName = savedDisplayName;
        }

        // Show profile directly - never ask for name (Apple Guideline 4.0)
        showScreen('profile');
        await loadUserProfile(user);
        await loadTrainerProgress();
        await loadRecentActivity();
        updateAchievements();

        // Sync offline sessions
        await window.MathQuestFirebase.syncOfflineSessions();
    } else {
        // User is signed out
        showScreen('login');
    }
}

// Show screen
function showScreen(screen) {
    loginScreen.classList.remove('active');
    profileScreen.classList.remove('active');

    if (screen === 'login') {
        loginScreen.classList.add('active');
    } else {
        profileScreen.classList.add('active');
    }
}

// Handle Apple login
async function handleAppleLogin() {
    appleLoginBtn.disabled = true;
    appleLoginBtn.textContent = 'Завантаження...';

    try {
        await window.MathQuestFirebase.signInWithApple();
    } catch (error) {
        console.error('Apple login error:', error);
        alert('Помилка входу через Apple. Спробуйте ще раз.');
    }

    appleLoginBtn.disabled = false;
    appleLoginBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.22 0-1.43.65-2.18.52-3.03-.4C3.79 16.17 4.38 9.94 8.9 9.69c1.27.07 2.15.73 2.9.78.96-.2 1.87-.81 2.87-.73 1.2.1 2.11.57 2.72 1.42-2.45 1.49-1.87 4.76.46 5.68-.57 1.49-1.3 2.96-2.8 4.44zm-3.41-15.3c-.09 1.93 1.6 3.52 3.48 3.37.22-1.98-1.73-3.67-3.48-3.37z"/>
        </svg>
        Увійти через Apple
    `;
}

// Handle Google login
async function handleGoogleLogin() {
    googleLoginBtn.disabled = true;
    googleLoginBtn.textContent = 'Завантаження...';

    try {
        await window.MathQuestFirebase.signInWithGoogle();
    } catch (error) {
        console.error('Google login error:', error);
        alert('Помилка входу через Google. Спробуйте ще раз.');
    }

    googleLoginBtn.disabled = false;
    googleLoginBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Увійти через Google
    `;
}

// Show logout modal
function showLogoutModal() {
    logoutModal.classList.remove('hidden');
}

// Hide logout modal
function hideLogoutModal() {
    logoutModal.classList.add('hidden');
}

// Handle logout
async function handleLogout() {
    hideLogoutModal();
    confirmLogoutBtn.disabled = true;
    confirmLogoutBtn.textContent = 'Виходимо...';

    try {
        localStorage.removeItem('math_quest_name_skipped');
        await window.MathQuestFirebase.signOutUser();
    } catch (error) {
        console.error('Logout error:', error);
    }

    confirmLogoutBtn.disabled = false;
    confirmLogoutBtn.textContent = 'Так, вийти';
}

// Load user profile
async function loadUserProfile(user) {
    // Set basic info
    userAvatar.src = user.photoURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧙</text></svg>';
    userName.textContent = user.displayName || 'Користувач';
    userEmail.textContent = user.email || 'Анонімний користувач';

    // Try to load stats from Firestore
    try {
        const profile = await window.MathQuestFirebase.getUserProfile();

        // Use saved displayName if available
        if (profile?.displayName) {
            userName.textContent = profile.displayName;
        }

        if (profile && profile.stats) {
            const stats = profile.stats;
            totalXP.textContent = stats.totalXP || 0;
            userLevel.textContent = stats.level || 1;
            userStreak.textContent = stats.streak || 0;
            trainersCompleted.textContent = stats.trainersCompleted || 0;

            // Update level progress
            const xp = stats.totalXP || 0;
            const level = stats.level || 1;
            const xpForCurrentLevel = (level - 1) * 100;
            const xpInCurrentLevel = xp - xpForCurrentLevel;
            const xpNeeded = 100;

            currentLevel.textContent = level;
            xpProgress.textContent = `${xpInCurrentLevel}/${xpNeeded} XP`;
            levelFill.style.width = `${(xpInCurrentLevel / xpNeeded) * 100}%`;
        } else {
            // Default stats for new user
            totalXP.textContent = 0;
            userLevel.textContent = 1;
            userStreak.textContent = 0;
            trainersCompleted.textContent = 0;
            currentLevel.textContent = 1;
            xpProgress.textContent = '0/100 XP';
            levelFill.style.width = '0%';
        }
    } catch (error) {
        console.log('Could not load profile from Firestore, using defaults:', error);
        // Default stats
        totalXP.textContent = 0;
        userLevel.textContent = 1;
        userStreak.textContent = 0;
        trainersCompleted.textContent = 0;
        currentLevel.textContent = 1;
        xpProgress.textContent = '0/100 XP';
        levelFill.style.width = '0%';
    }
}

// Load trainer progress
async function loadTrainerProgress() {
    const progress = await window.MathQuestFirebase.getAllTrainerProgress();

    if (progress.length === 0) {
        trainerProgressList.innerHTML = '<div class="empty-message">Ще немає прогресу. Почни тренування!</div>';
        return;
    }

    trainerProgressList.innerHTML = progress.map(p => `
        <div class="trainer-item">
            <div class="trainer-icon">${TRAINER_ICONS[p.trainerId] || '📝'}</div>
            <div class="trainer-info">
                <div class="trainer-name">${p.trainerName || TRAINER_NAMES[p.trainerId] || p.trainerId}</div>
                <div class="trainer-stats">Спроб: ${p.attempts || 0}</div>
            </div>
            <div class="trainer-score">${p.bestScore || 0}%</div>
        </div>
    `).join('');
}

// Load recent activity
async function loadRecentActivity() {
    const sessions = await window.MathQuestFirebase.getRecentSessions(10);

    if (sessions.length === 0) {
        recentActivity.innerHTML = '<div class="empty-message">Ще немає активності</div>';
        return;
    }

    recentActivity.innerHTML = sessions.map(s => {
        const date = formatDate(s.completedAt);
        const scoreClass = s.percentage >= 80 ? 'good' : s.percentage >= 50 ? 'medium' : 'bad';

        return `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-trainer">${TRAINER_ICONS[s.trainerId] || '📝'} ${s.trainerName || TRAINER_NAMES[s.trainerId] || s.trainerId}</div>
                    <div class="activity-date">${date}</div>
                </div>
                <div class="activity-score ${scoreClass}">${s.score}/${s.totalQuestions}</div>
            </div>
        `;
    }).join('');
}

// Update achievements
async function updateAchievements() {
    const profile = await window.MathQuestFirebase.getUserProfile();
    if (!profile || !profile.stats) return;

    const stats = profile.stats;
    const achievements = achievementsList.querySelectorAll('.achievement');

    // First win
    if (stats.trainersCompleted >= 1) {
        achievements[0].classList.remove('locked');
        achievements[0].classList.add('unlocked');
    }

    // Streak 7
    if (stats.streak >= 7) {
        achievements[1].classList.remove('locked');
        achievements[1].classList.add('unlocked');
    }

    // Level 10
    if (stats.level >= 10) {
        achievements[5].classList.remove('locked');
        achievements[5].classList.add('unlocked');
    }

    // 10 sessions
    if (stats.trainersCompleted >= 10) {
        achievements[3].classList.remove('locked');
        achievements[3].classList.add('unlocked');
    }
}

// Format date
function formatDate(date) {
    if (!date) return '';

    const now = new Date();
    const d = new Date(date);
    const diff = now - d;

    if (diff < 60000) return 'Щойно';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} хв тому`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} год тому`;

    const today = now.toDateString();
    const dateStr = d.toDateString();

    if (today === dateStr) return 'Сьогодні';

    const yesterday = new Date(now - 86400000).toDateString();
    if (yesterday === dateStr) return 'Вчора';

    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}

// Show delete account modal
function showDeleteModal() {
    deleteAccountModal.classList.remove('hidden');
}

// Hide delete account modal
function hideDeleteModal() {
    deleteAccountModal.classList.add('hidden');
}

// Handle account deletion
async function handleDeleteAccount() {
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = 'Видаляємо...';

    try {
        await window.MathQuestFirebase.deleteUserAccount();

        // Hide modal and show login screen
        hideDeleteModal();
        alert('Ваш акаунт успішно видалено.');

    } catch (error) {
        console.error('Delete account error:', error);

        // Check for specific errors
        if (error.code === 'auth/requires-recent-login') {
            alert('Для видалення акаунту потрібно повторно увійти в систему. Будь ласка, вийдіть і увійдіть знову.');
        } else {
            alert('Помилка видалення акаунту: ' + (error.message || 'Спробуйте ще раз.'));
        }
    }

    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Так, видалити';
}

// Initialize
init();
