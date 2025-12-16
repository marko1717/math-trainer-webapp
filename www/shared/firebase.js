/* ===================================
   MATH QUEST - Firebase Integration
   =================================== */

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzXo5cCqYgFB8sl7EJIQ0tZR-kV8f30OY",
    authDomain: "nmt-trainer.firebaseapp.com",
    projectId: "nmt-trainer",
    storageBucket: "nmt-trainer.firebasestorage.app",
    messagingSenderId: "29779857440",
    appId: "1:29779857440:web:9cedda91dbda7174a36c45",
    measurementId: "G-PKKQ8Y4QH0"
};

// Firebase App instance
let app = null;
let auth = null;
let db = null;
let currentUser = null;

// Initialize Firebase
async function initFirebase() {
    if (app) return { app, auth, db };

    try {
        // Dynamic import for Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, signInWithCredential, getRedirectResult, signOut, GoogleAuthProvider, OAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // Store methods for external use
        window.firebaseAuth = {
            signInWithPopup,
            signInWithRedirect,
            signInWithCredential,
            getRedirectResult,
            signOut,
            GoogleAuthProvider,
            OAuthProvider,
            onAuthStateChanged
        };

        window.firebaseDb = {
            doc,
            setDoc,
            getDoc,
            collection,
            query,
            where,
            orderBy,
            limit,
            getDocs,
            addDoc,
            updateDoc,
            serverTimestamp
        };

        console.log('✅ Firebase initialized successfully');
        return { app, auth, db };
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        throw error;
    }
}

// ==========================================
// AUTHENTICATION
// ==========================================

// Sign in with Google
async function signInWithGoogle() {
    await initFirebase();
    const { signInWithPopup, GoogleAuthProvider } = window.firebaseAuth;

    try {
        const provider = new GoogleAuthProvider();

        // Check if we're in a Capacitor WebView
        const isCapacitor = window.Capacitor !== undefined;

        if (isCapacitor) {
            // In Capacitor, we need to use a different approach
            // Try popup first, if it fails show instructions
            console.log('📱 Capacitor detected, trying popup auth');
            try {
                const result = await signInWithPopup(auth, provider);
                currentUser = result.user;
                await createOrUpdateUserProfile(currentUser);
                console.log('✅ Signed in:', currentUser.displayName);
                return currentUser;
            } catch (popupError) {
                console.error('Popup failed in Capacitor:', popupError);
                // If popup blocked, inform user
                throw new Error('Авторизація через Google поки недоступна в додатку. Спробуйте Apple ID або веб-версію.');
            }
        } else {
            // Use popup for regular browser
            const result = await signInWithPopup(auth, provider);
            currentUser = result.user;
            await createOrUpdateUserProfile(currentUser);
            console.log('✅ Signed in:', currentUser.displayName);
            return currentUser;
        }
    } catch (error) {
        console.error('❌ Sign in error:', error);
        throw error;
    }
}

// Sign in with Apple
async function signInWithApple() {
    await initFirebase();
    const { signInWithPopup, signInWithCredential, OAuthProvider } = window.firebaseAuth;

    try {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        // Check if we're in a Capacitor WebView with native plugin
        const isCapacitor = window.Capacitor !== undefined;
        const hasNativePlugin = isCapacitor && window.Capacitor.Plugins?.SignInWithApple;

        if (hasNativePlugin) {
            // Use native Sign In with Apple plugin
            console.log('🍎 Using native Apple Sign In');
            try {
                const result = await window.Capacitor.Plugins.SignInWithApple.authorize({
                    clientId: 'com.mathtrainer.nmt',
                    redirectURI: 'https://nmt-trainer.firebaseapp.com/__/auth/handler',
                    scopes: 'email name'
                });

                // Create Firebase credential from Apple response
                const credential = provider.credential({
                    idToken: result.response.identityToken,
                    rawNonce: result.response.authorizationCode
                });

                const userCredential = await signInWithCredential(auth, credential);
                currentUser = userCredential.user;
                await createOrUpdateUserProfile(currentUser);
                console.log('✅ Apple Sign-in successful:', currentUser.displayName || currentUser.email);
                return currentUser;
            } catch (nativeError) {
                console.error('Native Apple Sign In failed:', nativeError);
                // Fall back to popup
                console.log('🍎 Falling back to popup Apple Sign In');
            }
        }

        // Use popup (for browser or as fallback)
        console.log('🍎 Using popup Apple Sign In');
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        await createOrUpdateUserProfile(currentUser);
        console.log('✅ Apple Sign-in successful:', currentUser.displayName || currentUser.email);
        return currentUser;

    } catch (error) {
        console.error('❌ Apple Sign in error:', error);
        // Provide more helpful error message
        if (error.code === 'auth/popup-blocked') {
            throw new Error('Popup заблоковано. Дозвольте popup у налаштуваннях браузера.');
        } else if (error.code === 'auth/operation-not-allowed') {
            throw new Error('Apple Sign In не налаштовано. Зверніться до адміністратора.');
        }
        throw error;
    }
}

// Sign out
async function signOutUser() {
    await initFirebase();
    const { signOut } = window.firebaseAuth;

    try {
        await signOut(auth);
        currentUser = null;
        console.log('✅ Signed out');
    } catch (error) {
        console.error('❌ Sign out error:', error);
        throw error;
    }
}

// Listen to auth state changes
async function onAuthChange(callback) {
    await initFirebase();
    const { onAuthStateChanged } = window.firebaseAuth;

    return onAuthStateChanged(auth, (user) => {
        currentUser = user;
        callback(user);
    });
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// ==========================================
// USER PROFILE
// ==========================================

// Create or update user profile
async function createOrUpdateUserProfile(user) {
    const { doc, setDoc, getDoc, serverTimestamp } = window.firebaseDb;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // New user - create profile
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            stats: {
                totalXP: 0,
                level: 1,
                streak: 0,
                lastActivityDate: null,
                totalTimeSpent: 0,
                trainersCompleted: 0
            }
        });
        console.log('✅ New user profile created');
    } else {
        // Existing user - update last login
        await setDoc(userRef, {
            lastLoginAt: serverTimestamp()
        }, { merge: true });
    }
}

// Get user profile
async function getUserProfile() {
    if (!currentUser) return null;

    const { doc, getDoc } = window.firebaseDb;
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? userSnap.data() : null;
}

// Update user stats
async function updateUserStats(statsUpdate) {
    if (!currentUser) return;

    const { doc, setDoc } = window.firebaseDb;
    const userRef = doc(db, 'users', currentUser.uid);

    await setDoc(userRef, {
        stats: statsUpdate
    }, { merge: true });
}

// ==========================================
// TRAINER PROGRESS
// ==========================================

// Save trainer session result
async function saveTrainerSession(trainerData) {
    if (!currentUser) {
        console.log('⚠️ User not logged in, saving to localStorage only');
        saveToLocalStorage(trainerData);
        return null;
    }

    const { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } = window.firebaseDb;

    // Session data
    const session = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        trainerId: trainerData.trainerId,
        trainerName: trainerData.trainerName,
        score: trainerData.score,
        totalQuestions: trainerData.totalQuestions,
        percentage: Math.round((trainerData.score / trainerData.totalQuestions) * 100),
        timeSpent: trainerData.timeSpent || 0,
        difficulty: trainerData.difficulty || 'normal',
        completedAt: serverTimestamp()
    };

    // Add to sessions collection
    const sessionRef = await addDoc(collection(db, 'sessions'), session);
    console.log('✅ Session saved:', sessionRef.id);

    // Update trainer progress (best score, attempts)
    await updateTrainerProgress(trainerData);

    // Update user stats
    await updateUserStatsAfterSession(trainerData);

    return sessionRef.id;
}

// Update trainer-specific progress
async function updateTrainerProgress(trainerData) {
    if (!currentUser) return;

    const { doc, setDoc, getDoc, serverTimestamp } = window.firebaseDb;

    const progressRef = doc(db, 'users', currentUser.uid, 'trainerProgress', trainerData.trainerId);
    const progressSnap = await getDoc(progressRef);

    const percentage = Math.round((trainerData.score / trainerData.totalQuestions) * 100);

    if (progressSnap.exists()) {
        const existing = progressSnap.data();
        await setDoc(progressRef, {
            trainerId: trainerData.trainerId,
            trainerName: trainerData.trainerName,
            bestScore: Math.max(existing.bestScore || 0, percentage),
            attempts: (existing.attempts || 0) + 1,
            totalTimeSpent: (existing.totalTimeSpent || 0) + (trainerData.timeSpent || 0),
            lastPlayedAt: serverTimestamp()
        });
    } else {
        await setDoc(progressRef, {
            trainerId: trainerData.trainerId,
            trainerName: trainerData.trainerName,
            bestScore: percentage,
            attempts: 1,
            totalTimeSpent: trainerData.timeSpent || 0,
            firstPlayedAt: serverTimestamp(),
            lastPlayedAt: serverTimestamp()
        });
    }
}

// Update user stats after session
async function updateUserStatsAfterSession(trainerData) {
    if (!currentUser) return;

    const { doc, getDoc, setDoc } = window.firebaseDb;

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const stats = userData.stats || {};

    // Calculate XP earned (10 XP per correct answer, bonus for percentage)
    const baseXP = trainerData.score * 10;
    const percentage = (trainerData.score / trainerData.totalQuestions) * 100;
    const bonusXP = percentage === 100 ? 50 : percentage >= 80 ? 20 : 0;
    const earnedXP = baseXP + bonusXP;

    // Calculate new level (100 XP per level)
    const newTotalXP = (stats.totalXP || 0) + earnedXP;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    // Calculate streak (using ISO date string for comparison)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const lastActivity = stats.lastActivityDate;
    let newStreak = stats.streak || 0;

    if (lastActivity !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastActivity === yesterday) {
            newStreak += 1;
        } else {
            // Either first activity ever or streak broken
            newStreak = 1;
        }
    }

    const updatedStats = {
        totalXP: newTotalXP,
        level: newLevel,
        streak: newStreak,
        lastActivityDate: today,
        totalTimeSpent: (stats.totalTimeSpent || 0) + (trainerData.timeSpent || 0),
        trainersCompleted: (stats.trainersCompleted || 0) + 1
    };

    await setDoc(userRef, { stats: updatedStats }, { merge: true });

    console.log('📊 Stats updated:', updatedStats);
    return { earnedXP, newLevel, newStreak };
}

// Get user's trainer progress
async function getTrainerProgress(trainerId) {
    if (!currentUser) return null;

    const { doc, getDoc } = window.firebaseDb;
    const progressRef = doc(db, 'users', currentUser.uid, 'trainerProgress', trainerId);
    const progressSnap = await getDoc(progressRef);

    return progressSnap.exists() ? progressSnap.data() : null;
}

// Get all trainer progress for user
async function getAllTrainerProgress() {
    if (!currentUser) return [];

    const { collection, getDocs } = window.firebaseDb;
    const progressRef = collection(db, 'users', currentUser.uid, 'trainerProgress');
    const progressSnap = await getDocs(progressRef);

    const progress = [];
    progressSnap.forEach((doc) => {
        progress.push({ id: doc.id, ...doc.data() });
    });

    return progress;
}

// ==========================================
// SESSION HISTORY
// ==========================================

// Get recent sessions for user
async function getRecentSessions(limitCount = 10) {
    if (!currentUser) return [];

    const { collection, query, where, orderBy, limit, getDocs } = window.firebaseDb;

    const sessionsRef = collection(db, 'sessions');

    let sessions = [];

    try {
        // Try with orderBy (requires composite index)
        const q = query(
            sessionsRef,
            where('userId', '==', currentUser.uid),
            orderBy('completedAt', 'desc'),
            limit(limitCount)
        );
        const sessionsSnap = await getDocs(q);
        sessionsSnap.forEach((doc) => {
            const data = doc.data();
            sessions.push({
                id: doc.id,
                ...data,
                completedAt: data.completedAt?.toDate() || new Date()
            });
        });
    } catch (error) {
        // Fallback: query without orderBy, sort on client
        console.log('Index not ready, using fallback query');
        const q = query(
            sessionsRef,
            where('userId', '==', currentUser.uid)
        );
        const sessionsSnap = await getDocs(q);
        sessionsSnap.forEach((doc) => {
            const data = doc.data();
            sessions.push({
                id: doc.id,
                ...data,
                completedAt: data.completedAt?.toDate() || new Date()
            });
        });
        // Sort on client side
        sessions.sort((a, b) => b.completedAt - a.completedAt);
        sessions = sessions.slice(0, limitCount);
    }

    return sessions;
}

// ==========================================
// LOCAL STORAGE FALLBACK
// ==========================================

function saveToLocalStorage(trainerData) {
    const key = 'mathquest_offline_sessions';
    const sessions = JSON.parse(localStorage.getItem(key) || '[]');
    sessions.push({
        ...trainerData,
        completedAt: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(sessions));
}

// Sync offline sessions when user logs in
async function syncOfflineSessions() {
    if (!currentUser) return;

    const key = 'mathquest_offline_sessions';
    const sessions = JSON.parse(localStorage.getItem(key) || '[]');

    if (sessions.length === 0) return;

    console.log(`📤 Syncing ${sessions.length} offline sessions...`);

    for (const session of sessions) {
        await saveTrainerSession(session);
    }

    localStorage.removeItem(key);
    console.log('✅ Offline sessions synced');
}

// ==========================================
// EXPORTS
// ==========================================

window.MathQuestFirebase = {
    // Init
    initFirebase,

    // Auth
    signInWithGoogle,
    signInWithApple,
    signOutUser,
    onAuthChange,
    getCurrentUser,

    // Profile
    getUserProfile,
    updateUserStats,

    // Progress
    saveTrainerSession,
    getTrainerProgress,
    getAllTrainerProgress,

    // History
    getRecentSessions,

    // Sync
    syncOfflineSessions
};

// Auto-initialize Firebase and restore auth state
(async function autoInit() {
    try {
        await initFirebase();

        // Handle redirect result (for WebView auth)
        const { getRedirectResult, onAuthStateChanged } = window.firebaseAuth;
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                currentUser = result.user;
                await createOrUpdateUserProfile(currentUser);
                console.log('✅ Redirect sign-in successful:', currentUser.displayName);

                // Dispatch event for UI to update
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
            }
        } catch (redirectError) {
            console.log('No redirect result or error:', redirectError.message);
        }

        // Listen to auth state changes to restore currentUser
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            if (user) {
                console.log('✅ User restored:', user.displayName || user.email);
            } else {
                console.log('ℹ️ No user logged in');
            }
            // Dispatch event for UI to update
            window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
        });
    } catch (error) {
        console.error('Auto-init error:', error);
    }
})();

console.log('📦 MathQuestFirebase module loaded');
