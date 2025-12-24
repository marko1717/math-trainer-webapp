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

// Storage key for persisting user session
const USER_STORAGE_KEY = 'math_quest_user';

// Load user from localStorage on startup
function loadStoredUser() {
    try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
            currentUser = JSON.parse(stored);
            console.log('📱 Restored user from storage:', currentUser.email || currentUser.uid);
            // Dispatch event so UI can update
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
            }, 100);
            return currentUser;
        }
    } catch (e) {
        console.error('Error loading stored user:', e);
    }
    return null;
}

// Save user to localStorage
function saveUserToStorage(user) {
    try {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            console.log('📱 Saved user to storage');
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
            console.log('📱 Removed user from storage');
        }
    } catch (e) {
        console.error('Error saving user to storage:', e);
    }
}

// Initialize Firebase
async function initFirebase() {
    if (app) return { app, auth, db };

    try {
        // Dynamic import for Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, signInWithCredential, getRedirectResult, signOut, GoogleAuthProvider, OAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

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
            deleteDoc,
            writeBatch,
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
    const { signInWithPopup, signInWithCredential, GoogleAuthProvider } = window.firebaseAuth;

    try {
        const provider = new GoogleAuthProvider();

        // Check if we're in a Capacitor WebView with native plugin
        const isCapacitor = window.Capacitor !== undefined;
        const hasNativeGoogleAuth = isCapacitor && window.Capacitor.Plugins?.GoogleAuth;

        console.log('🔍 Auth debug:', {
            isCapacitor,
            hasNativeGoogleAuth,
            plugins: window.Capacitor?.Plugins ? Object.keys(window.Capacitor.Plugins) : 'none'
        });

        if (hasNativeGoogleAuth) {
            // Use native Google Sign In plugin
            console.log('📱 Using native Google Sign In');
            try {
                // IMPORTANT: Must initialize the plugin first before signIn()
                console.log('📱 Initializing GoogleAuth plugin...');
                await window.Capacitor.Plugins.GoogleAuth.initialize({
                    clientId: '29779857440-u1sbkbnf8in4q692jd24tq0itqjfsq6n.apps.googleusercontent.com',
                    scopes: ['profile', 'email'],
                    grantOfflineAccess: true
                });
                console.log('📱 GoogleAuth initialized, calling signIn()...');
                const googleUser = await window.Capacitor.Plugins.GoogleAuth.signIn();
                console.log('📱 Native Google response:', JSON.stringify(googleUser, null, 2));

                if (!googleUser?.authentication?.idToken) {
                    console.error('❌ No idToken in response:', googleUser);
                    throw new Error('Не отримано токен авторизації');
                }

                // Create Firebase credential from Google response
                console.log('📱 Creating Firebase credential...');
                const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
                console.log('📱 Signing in with credential...');
                const userCredential = await signInWithCredential(auth, credential);
                currentUser = userCredential.user;
                await createOrUpdateUserProfile(currentUser);
                console.log('✅ Google Sign-in successful:', currentUser.displayName);
                return currentUser;
            } catch (nativeError) {
                console.error('❌ Native Google Sign In failed:', nativeError);
                console.error('❌ Error details:', JSON.stringify(nativeError, Object.getOwnPropertyNames(nativeError)));
                throw new Error('Помилка входу через Google: ' + (nativeError.message || nativeError));
            }
        } else if (isCapacitor) {
            // Capacitor without native plugin - try popup
            console.log('📱 Capacitor detected but NO GoogleAuth plugin, trying popup auth');
            try {
                const result = await signInWithPopup(auth, provider);
                currentUser = result.user;
                await createOrUpdateUserProfile(currentUser);
                console.log('✅ Signed in:', currentUser.displayName);
                return currentUser;
            } catch (popupError) {
                console.error('Popup failed in Capacitor:', popupError);
                throw new Error('Авторизація через Google поки недоступна в додатку. Спробуйте Apple ID.');
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

// Generate random nonce for Apple Sign In
function generateNonce(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
    }
    return result;
}

// SHA256 hash for nonce
async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Refresh Firebase ID token using refresh token
async function refreshIdToken() {
    if (!currentUser?.stsTokenManager?.refreshToken) {
        console.log('❌ No refresh token available');
        return null;
    }

    try {
        const apiKey = firebaseConfig.apiKey;
        const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;

        console.log('🔄 Refreshing ID token...');
        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(currentUser.stsTokenManager.refreshToken)}`
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Token refresh failed:', data);
            // If refresh token is invalid, user needs to re-login
            if (data.error?.message?.includes('TOKEN_EXPIRED') || data.error?.message?.includes('INVALID_REFRESH_TOKEN')) {
                console.log('🔄 Refresh token invalid, clearing session...');
                currentUser = null;
                saveUserToStorage(null);
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));
            }
            return null;
        }

        console.log('✅ Token refreshed successfully');

        // Update stored tokens
        currentUser.stsTokenManager.accessToken = data.id_token;
        currentUser.stsTokenManager.refreshToken = data.refresh_token;
        saveUserToStorage(currentUser);

        return data.id_token;
    } catch (error) {
        console.error('❌ Token refresh error:', error);
        return null;
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
                // Generate nonce - required for Firebase to verify the token
                const rawNonce = generateNonce(32);
                const hashedNonce = await sha256(rawNonce);
                console.log('🍎 Generated nonce, length:', rawNonce.length);

                const result = await window.Capacitor.Plugins.SignInWithApple.authorize({
                    clientId: 'com.mathtrainer.nmt',
                    scopes: 'email name',
                    nonce: hashedNonce  // Apple expects SHA256 hashed nonce
                });

                console.log('🍎 Apple response received:', result.response ? 'success' : 'empty');
                console.log('🍎 Identity token (first 50 chars):', result.response?.identityToken?.substring(0, 50));

                if (!result.response?.identityToken) {
                    throw new Error('No identity token received from Apple');
                }

                // IMPORTANT: Apple sends fullName and email ONLY on FIRST authorization
                // We must capture and save these values immediately before they're lost
                const appleFullName = result.response.fullName;
                const appleEmail = result.response.email;

                // Build display name from Apple's fullName (givenName + familyName)
                let appleDisplayName = null;
                if (appleFullName) {
                    const parts = [];
                    if (appleFullName.givenName) parts.push(appleFullName.givenName);
                    if (appleFullName.familyName) parts.push(appleFullName.familyName);
                    if (parts.length > 0) {
                        appleDisplayName = parts.join(' ');
                    }
                }

                console.log('🍎 Apple provided data - email:', appleEmail, 'name:', appleDisplayName);

                // Use Firebase SDK with OAuthCredential
                // Now that iOS app is registered in Firebase, it should accept Bundle ID as audience
                console.log('🍎 Using Firebase SDK with OAuthCredential...');

                // Create OAuthCredential for Apple using provider instance
                const appleProvider = new OAuthProvider('apple.com');
                const credential = appleProvider.credential({
                    idToken: result.response.identityToken,
                    rawNonce: rawNonce
                });

                console.log('🍎 Signing in with Firebase credential...');
                const userCredential = await signInWithCredential(auth, credential);
                const firebaseUser = userCredential.user;

                console.log('🍎 Firebase sign in successful! User:', firebaseUser.email || firebaseUser.uid);

                // IMPORTANT: Prioritize Apple-provided data over Firebase data
                // Apple only sends fullName and email on FIRST authorization, so we must use them
                const finalEmail = appleEmail || firebaseUser.email || null;
                const finalDisplayName = appleDisplayName || firebaseUser.displayName || null;

                console.log('🍎 Final user data - email:', finalEmail, 'displayName:', finalDisplayName);

                // Create user object with Apple data
                const user = {
                    uid: firebaseUser.uid,
                    email: finalEmail,
                    displayName: finalDisplayName,
                    photoURL: firebaseUser.photoURL || null,
                    emailVerified: firebaseUser.emailVerified || false,
                    // Get tokens from Firebase user
                    stsTokenManager: {
                        accessToken: await firebaseUser.getIdToken(),
                        refreshToken: firebaseUser.refreshToken
                    }
                };

                // Store the user
                currentUser = user;

                // Save user to localStorage for persistence
                saveUserToStorage(user);

                // Save to Firestore
                await createOrUpdateUserProfile(firebaseUser);

                // Also update with Apple-provided name if we have it
                if (appleDisplayName || appleEmail) {
                    const { doc, setDoc } = window.firebaseDb;
                    const userRef = doc(db, 'users', user.uid);
                    const updateData = {};
                    if (appleDisplayName) updateData.displayName = appleDisplayName;
                    if (appleEmail) updateData.email = appleEmail;
                    await setDoc(userRef, updateData, { merge: true });
                    console.log('🍎 Updated Firestore with Apple-provided data');
                }

                console.log('✅ Apple Sign-in successful:', user.displayName || user.email || user.uid);

                // Dispatch auth state change
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));

                return user;
            } catch (nativeError) {
                console.error('🍎 Native Apple Sign In failed:', nativeError);
                console.error('🍎 Error details:', JSON.stringify(nativeError, Object.getOwnPropertyNames(nativeError)));
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
    console.log('🚪 Starting sign out...');

    // FIRST: Clear local state immediately (this always works)
    currentUser = null;
    saveUserToStorage(null);
    console.log('🚪 Local storage cleared');

    // SECOND: Dispatch event to update UI immediately
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));
    console.log('🚪 Auth state event dispatched');

    // THIRD: Try to sign out from Firebase (optional, may fail)
    try {
        if (window.firebaseAuth?.signOut && auth) {
            await Promise.race([
                window.firebaseAuth.signOut(auth),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
            ]);
            console.log('🚪 Firebase SDK signOut completed');
        }
    } catch (e) {
        console.log('🚪 Firebase SDK signOut skipped:', e.message);
    }

    console.log('✅ Signed out successfully');
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
    if (!currentUser) {
        // Try to load from storage
        loadStoredUser();
    }
    return currentUser;
}

// ==========================================
// USER PROFILE
// ==========================================

// Create or update user profile via REST API (for Capacitor native auth)
// appleDisplayName and appleEmail are optional - only provided on first Apple Sign In
async function createOrUpdateUserProfileREST(user, idToken, appleDisplayName = null, appleEmail = null) {
    try {
        const projectId = firebaseConfig.projectId;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${user.uid}`;

        // First, try to get existing document
        const getResponse = await fetch(firestoreUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        const now = new Date().toISOString();

        if (getResponse.status === 404) {
            // New user - create profile with Apple-provided data
            const newUserData = {
                fields: {
                    uid: { stringValue: user.uid },
                    email: { stringValue: user.email || '' },
                    displayName: { stringValue: user.displayName || '' },
                    photoURL: { stringValue: user.photoURL || '' },
                    createdAt: { timestampValue: now },
                    lastLoginAt: { timestampValue: now },
                    stats: {
                        mapValue: {
                            fields: {
                                totalXP: { integerValue: '0' },
                                level: { integerValue: '1' },
                                streak: { integerValue: '0' },
                                totalTimeSpent: { integerValue: '0' },
                                trainersCompleted: { integerValue: '0' }
                            }
                        }
                    }
                }
            };

            await fetch(firestoreUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
            });
            console.log('✅ New user profile created via REST');
        } else if (getResponse.ok) {
            // Existing user - check if we have new data from Apple to update
            const existingData = await getResponse.json();
            const existingFields = existingData.fields || {};

            const existingDisplayName = existingFields.displayName?.stringValue || '';
            const existingEmail = existingFields.email?.stringValue || '';

            // Build update data - always update lastLoginAt
            // Also update displayName/email if Apple provided new data and existing is empty
            const updateFields = {
                lastLoginAt: { timestampValue: now }
            };
            const updateMasks = ['lastLoginAt'];

            // If Apple provided a display name and we don't have one saved, save it
            if (appleDisplayName && (!existingDisplayName || existingDisplayName.length < 2)) {
                updateFields.displayName = { stringValue: appleDisplayName };
                updateMasks.push('displayName');
                console.log('🍎 Updating displayName with Apple-provided value:', appleDisplayName);
            }

            // If Apple provided email and we don't have one saved, save it
            if (appleEmail && !existingEmail) {
                updateFields.email = { stringValue: appleEmail };
                updateMasks.push('email');
                console.log('🍎 Updating email with Apple-provided value:', appleEmail);
            }

            const updateData = { fields: updateFields };
            const updateMaskParam = updateMasks.map(f => `updateMask.fieldPaths=${f}`).join('&');

            await fetch(`${firestoreUrl}?${updateMaskParam}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            console.log('✅ User profile updated via REST');
        }
    } catch (error) {
        console.error('Error creating/updating user profile via REST:', error);
        // Don't throw - profile update is not critical for sign-in
    }
}

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

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return getUserProfileREST();
    }

    const { doc, getDoc } = window.firebaseDb;
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? userSnap.data() : null;
}

// Update user display name
async function updateUserDisplayName(displayName) {
    if (!currentUser) return;

    // Update local user object
    currentUser.displayName = displayName;
    saveUserToStorage(currentUser);

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return updateUserDisplayNameREST(displayName);
    }

    // Use Firebase SDK
    const { doc, setDoc } = window.firebaseDb;
    const userRef = doc(db, 'users', currentUser.uid);

    await setDoc(userRef, {
        displayName: displayName
    }, { merge: true });

    console.log('✅ Display name updated:', displayName);
}

// Update user display name via REST API
async function updateUserDisplayNameREST(displayName) {
    if (!currentUser?.stsTokenManager?.accessToken) return;

    try {
        const projectId = firebaseConfig.projectId;
        const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}`;
        let idToken = currentUser.stsTokenManager.accessToken;

        const updateData = {
            fields: {
                displayName: { stringValue: displayName }
            }
        };

        let response = await fetch(`${userUrl}?updateMask.fieldPaths=displayName`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        // If token expired, try to refresh
        if (response.status === 401 || response.status === 403) {
            console.log('🔄 Token expired, refreshing...');
            const newToken = await refreshIdToken();
            if (newToken) {
                response = await fetch(`${userUrl}?updateMask.fieldPaths=displayName`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to update display name via REST:', response.status, errorText);
            throw new Error('Failed to update display name');
        }

        console.log('✅ Display name updated via REST:', displayName);
    } catch (error) {
        console.error('Error updating display name via REST:', error);
        throw error;
    }
}

// Get user profile via REST API
async function getUserProfileREST() {
    if (!currentUser?.stsTokenManager?.accessToken) return null;

    try {
        const projectId = firebaseConfig.projectId;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}`;

        const response = await fetch(firestoreUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.stsTokenManager.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log('Could not fetch profile via REST:', response.status);
            return null;
        }

        const data = await response.json();

        // Convert Firestore REST format to normal object
        return convertFirestoreDoc(data.fields);
    } catch (error) {
        console.error('Error fetching profile via REST:', error);
        return null;
    }
}

// Convert Firestore REST document to plain object
function convertFirestoreDoc(fields) {
    if (!fields) return null;

    const result = {};
    for (const [key, value] of Object.entries(fields)) {
        result[key] = convertFirestoreValue(value);
    }
    return result;
}

// Convert single Firestore value
function convertFirestoreValue(value) {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.timestampValue !== undefined) return new Date(value.timestampValue);
    if (value.nullValue !== undefined) return null;
    if (value.arrayValue !== undefined) {
        return (value.arrayValue.values || []).map(convertFirestoreValue);
    }
    if (value.mapValue !== undefined) {
        return convertFirestoreDoc(value.mapValue.fields);
    }
    return null;
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

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return saveTrainerSessionREST(trainerData);
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

    // Mark that user practiced today (for notifications)
    if (window.MathQuestNotifications?.cancelTodayReminders) {
        window.MathQuestNotifications.cancelTodayReminders();
    }

    return sessionRef.id;
}

// Save trainer session via REST API
async function saveTrainerSessionREST(trainerData) {
    if (!currentUser?.stsTokenManager?.accessToken) return null;

    try {
        const projectId = firebaseConfig.projectId;
        let idToken = currentUser.stsTokenManager.accessToken;
        const now = new Date().toISOString();
        const percentage = Math.round((trainerData.score / trainerData.totalQuestions) * 100);

        // 1. Save session document
        const sessionsUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions`;

        // Ensure all values are properly converted to strings for Firestore REST API
        const score = parseInt(trainerData.score, 10) || 0;
        const totalQuestions = parseInt(trainerData.totalQuestions, 10) || 1;
        const timeSpent = parseInt(trainerData.timeSpent, 10) || 0;
        const difficulty = String(trainerData.difficulty || 'normal');

        const sessionData = {
            fields: {
                userId: { stringValue: String(currentUser.uid) },
                userEmail: { stringValue: String(currentUser.email || '') },
                trainerId: { stringValue: String(trainerData.trainerId) },
                trainerName: { stringValue: String(trainerData.trainerName) },
                score: { integerValue: String(score) },
                totalQuestions: { integerValue: String(totalQuestions) },
                percentage: { integerValue: String(percentage) },
                timeSpent: { integerValue: String(timeSpent) },
                difficulty: { stringValue: difficulty },
                completedAt: { timestampValue: now }
            }
        };

        console.log('📤 Saving session data:', JSON.stringify(sessionData, null, 2));

        let sessionResponse = await fetch(sessionsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionData)
        });

        // If token expired (401/403), try to refresh it
        // Don't retry on 400 INVALID_ARGUMENT - that's a data format error, not auth
        if (sessionResponse.status === 401 || sessionResponse.status === 403) {
            let errorData;
            try {
                errorData = await sessionResponse.clone().json();
            } catch (e) {
                errorData = { error: { message: await sessionResponse.text() } };
            }
            console.error('REST API auth error, trying to refresh token:', errorData);

            console.log('🔄 Token may be expired, trying to refresh...');
            const newToken = await refreshIdToken();
            if (newToken) {
                idToken = newToken;
                // Retry with new token
                sessionResponse = await fetch(sessionsUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sessionData)
                });
            }
        }

        if (!sessionResponse.ok) {
            let errText;
            try {
                errText = await sessionResponse.text();
            } catch (e) {
                errText = 'Unable to read error';
            }
            console.error('Failed to save session via REST:', sessionResponse.status, errText);
            saveToLocalStorage(trainerData);
            return null;
        }

        const sessionResult = await sessionResponse.json();
        const sessionId = sessionResult.name.split('/').pop();
        console.log('✅ Session saved via REST:', sessionId);

        // 2. Update trainer progress (use potentially refreshed token)
        await updateTrainerProgressREST(trainerData, idToken, percentage, now);

        // 3. Update user stats (use potentially refreshed token)
        await updateUserStatsAfterSessionREST(trainerData, idToken);

        // Mark that user practiced today (for notifications)
        if (window.MathQuestNotifications?.cancelTodayReminders) {
            window.MathQuestNotifications.cancelTodayReminders();
        }

        return sessionId;
    } catch (error) {
        console.error('Error saving trainer session via REST:', error);
        saveToLocalStorage(trainerData);
        return null;
    }
}

// Update trainer progress via REST API
async function updateTrainerProgressREST(trainerData, idToken, percentage, now) {
    try {
        const projectId = firebaseConfig.projectId;
        const progressUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}/trainerProgress/${trainerData.trainerId}`;

        // First get existing progress
        const getResponse = await fetch(progressUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        let progressData;
        if (getResponse.status === 404) {
            // New trainer progress
            progressData = {
                fields: {
                    trainerId: { stringValue: trainerData.trainerId },
                    trainerName: { stringValue: trainerData.trainerName },
                    bestScore: { integerValue: String(percentage) },
                    attempts: { integerValue: '1' },
                    totalTimeSpent: { integerValue: String(trainerData.timeSpent || 0) },
                    firstPlayedAt: { timestampValue: now },
                    lastPlayedAt: { timestampValue: now }
                }
            };
        } else if (getResponse.ok) {
            const existing = await getResponse.json();
            const existingFields = convertFirestoreDoc(existing.fields);
            progressData = {
                fields: {
                    trainerId: { stringValue: trainerData.trainerId },
                    trainerName: { stringValue: trainerData.trainerName },
                    bestScore: { integerValue: String(Math.max(existingFields.bestScore || 0, percentage)) },
                    attempts: { integerValue: String((existingFields.attempts || 0) + 1) },
                    totalTimeSpent: { integerValue: String((existingFields.totalTimeSpent || 0) + (trainerData.timeSpent || 0)) },
                    firstPlayedAt: existing.fields.firstPlayedAt || { timestampValue: now },
                    lastPlayedAt: { timestampValue: now }
                }
            };
        } else {
            return;
        }

        await fetch(progressUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressData)
        });

        console.log('✅ Trainer progress updated via REST');
    } catch (error) {
        console.error('Error updating trainer progress via REST:', error);
    }
}

// Update user stats after session via REST API
async function updateUserStatsAfterSessionREST(trainerData, idToken) {
    try {
        const projectId = firebaseConfig.projectId;
        const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}`;

        // Get current user data
        const getResponse = await fetch(userUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!getResponse.ok) return;

        const userData = await getResponse.json();
        const profile = convertFirestoreDoc(userData.fields);
        const stats = profile.stats || {};

        // Calculate XP earned
        const baseXP = trainerData.score * 10;
        const percentage = (trainerData.score / trainerData.totalQuestions) * 100;
        const bonusXP = percentage === 100 ? 50 : percentage >= 80 ? 20 : 0;
        const earnedXP = baseXP + bonusXP;

        const newTotalXP = (stats.totalXP || 0) + earnedXP;
        const newLevel = Math.floor(newTotalXP / 100) + 1;

        // Calculate streak
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = stats.lastActivityDate;
        let newStreak = stats.streak || 0;

        if (lastActivity !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastActivity === yesterday) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        }

        const updatedStats = {
            fields: {
                stats: {
                    mapValue: {
                        fields: {
                            totalXP: { integerValue: String(newTotalXP) },
                            level: { integerValue: String(newLevel) },
                            streak: { integerValue: String(newStreak) },
                            lastActivityDate: { stringValue: today },
                            totalTimeSpent: { integerValue: String((stats.totalTimeSpent || 0) + (trainerData.timeSpent || 0)) },
                            trainersCompleted: { integerValue: String((stats.trainersCompleted || 0) + 1) }
                        }
                    }
                }
            }
        };

        await fetch(`${userUrl}?updateMask.fieldPaths=stats`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedStats)
        });

        console.log('✅ User stats updated via REST');
    } catch (error) {
        console.error('Error updating user stats via REST:', error);
    }
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

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return getAllTrainerProgressREST();
    }

    const { collection, getDocs } = window.firebaseDb;
    const progressRef = collection(db, 'users', currentUser.uid, 'trainerProgress');
    const progressSnap = await getDocs(progressRef);

    const progress = [];
    progressSnap.forEach((doc) => {
        progress.push({ id: doc.id, ...doc.data() });
    });

    return progress;
}

// Get all trainer progress via REST API
async function getAllTrainerProgressREST() {
    if (!currentUser?.stsTokenManager?.accessToken) return [];

    try {
        const projectId = firebaseConfig.projectId;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}/trainerProgress`;

        const response = await fetch(firestoreUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.stsTokenManager.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log('Could not fetch trainer progress via REST:', response.status);
            return [];
        }

        const data = await response.json();

        if (!data.documents) return [];

        return data.documents.map(doc => {
            const id = doc.name.split('/').pop();
            return { id, ...convertFirestoreDoc(doc.fields) };
        });
    } catch (error) {
        console.error('Error fetching trainer progress via REST:', error);
        return [];
    }
}

// ==========================================
// SESSION HISTORY
// ==========================================

// Get recent sessions for user
async function getRecentSessions(limitCount = 10) {
    if (!currentUser) return [];

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return getRecentSessionsREST(limitCount);
    }

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

// Get recent sessions via REST API
async function getRecentSessionsREST(limitCount = 10) {
    if (!currentUser?.stsTokenManager?.accessToken) return [];

    try {
        const projectId = firebaseConfig.projectId;
        // Use structured query to filter by userId
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.stsTokenManager.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'sessions' }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'userId' },
                            op: 'EQUAL',
                            value: { stringValue: currentUser.uid }
                        }
                    },
                    orderBy: [{ field: { fieldPath: 'completedAt' }, direction: 'DESCENDING' }],
                    limit: limitCount
                }
            })
        });

        if (!response.ok) {
            console.log('Could not fetch sessions via REST:', response.status);
            return [];
        }

        const data = await response.json();

        return data
            .filter(item => item.document)
            .map(item => {
                const doc = item.document;
                const id = doc.name.split('/').pop();
                const fields = convertFirestoreDoc(doc.fields);
                return { id, ...fields };
            });
    } catch (error) {
        console.error('Error fetching sessions via REST:', error);
        return [];
    }
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
// ACCOUNT DELETION
// ==========================================

// Delete user account and all associated data
async function deleteUserAccount() {
    if (!currentUser) {
        throw new Error('No user logged in');
    }

    console.log('🗑️ Starting account deletion for user:', currentUser.uid);

    // If user has REST API token, use REST API
    if (currentUser.stsTokenManager?.accessToken) {
        return deleteUserAccountREST();
    }

    // Use Firebase SDK
    const { doc, deleteDoc, collection, getDocs, writeBatch } = window.firebaseDb;

    try {
        // 1. Delete all sessions
        console.log('🗑️ Deleting sessions...');
        const { query, where } = window.firebaseDb;
        const sessionsRef = collection(db, 'sessions');
        const sessionsQuery = query(sessionsRef, where('userId', '==', currentUser.uid));
        const sessionsSnap = await getDocs(sessionsQuery);

        const batch = writeBatch(db);
        sessionsSnap.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });

        // 2. Delete trainer progress subcollection
        console.log('🗑️ Deleting trainer progress...');
        const progressRef = collection(db, 'users', currentUser.uid, 'trainerProgress');
        const progressSnap = await getDocs(progressRef);
        progressSnap.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });

        // 3. Delete user document
        console.log('🗑️ Deleting user document...');
        const userRef = doc(db, 'users', currentUser.uid);
        batch.delete(userRef);

        // Commit all deletions
        await batch.commit();
        console.log('✅ All user data deleted from Firestore');

        // 4. Delete Firebase Auth account
        console.log('🗑️ Deleting Firebase Auth account...');
        await auth.currentUser.delete();
        console.log('✅ Firebase Auth account deleted');

        // 5. Clear local storage
        currentUser = null;
        saveUserToStorage(null);
        localStorage.removeItem('math_quest_name_skipped');
        localStorage.removeItem('mathquest_offline_sessions');

        // Dispatch event
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));

        console.log('✅ Account deletion complete');
        return true;
    } catch (error) {
        console.error('❌ Account deletion error:', error);
        throw error;
    }
}

// Delete user account via REST API
async function deleteUserAccountREST() {
    if (!currentUser?.stsTokenManager?.accessToken) {
        throw new Error('No access token available');
    }

    const projectId = firebaseConfig.projectId;
    let idToken = currentUser.stsTokenManager.accessToken;

    try {
        // Try to refresh token first to ensure it's valid
        const newToken = await refreshIdToken();
        if (newToken) {
            idToken = newToken;
        }

        // 1. Delete all sessions for this user
        console.log('🗑️ Deleting sessions via REST...');
        const sessionsQueryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

        const sessionsResponse = await fetch(sessionsQueryUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'sessions' }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'userId' },
                            op: 'EQUAL',
                            value: { stringValue: currentUser.uid }
                        }
                    }
                }
            })
        });

        if (sessionsResponse.ok) {
            const sessionsData = await sessionsResponse.json();
            for (const item of sessionsData) {
                if (item.document?.name) {
                    await fetch(`https://firestore.googleapis.com/v1/${item.document.name}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    });
                }
            }
            console.log('✅ Sessions deleted');
        }

        // 2. Delete trainer progress subcollection
        console.log('🗑️ Deleting trainer progress via REST...');
        const progressUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}/trainerProgress`;

        const progressResponse = await fetch(progressUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${idToken}` }
        });

        if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            if (progressData.documents) {
                for (const doc of progressData.documents) {
                    await fetch(`https://firestore.googleapis.com/v1/${doc.name}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    });
                }
            }
            console.log('✅ Trainer progress deleted');
        }

        // 3. Delete user document
        console.log('🗑️ Deleting user document via REST...');
        const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${currentUser.uid}`;

        await fetch(userUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        console.log('✅ User document deleted');

        // 4. Delete Firebase Auth account via REST API
        console.log('🗑️ Deleting Firebase Auth account via REST...');
        const deleteAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${firebaseConfig.apiKey}`;

        const deleteAuthResponse = await fetch(deleteAuthUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: idToken })
        });

        if (!deleteAuthResponse.ok) {
            const errorData = await deleteAuthResponse.json();
            console.error('Auth deletion error:', errorData);
            // Continue anyway - data is already deleted
        } else {
            console.log('✅ Firebase Auth account deleted');
        }

        // 5. Clear local storage
        currentUser = null;
        saveUserToStorage(null);
        localStorage.removeItem('math_quest_name_skipped');
        localStorage.removeItem('mathquest_offline_sessions');

        // Dispatch event
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));

        console.log('✅ Account deletion complete via REST');
        return true;
    } catch (error) {
        console.error('❌ Account deletion error (REST):', error);
        throw error;
    }
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
    deleteUserAccount,

    // Profile
    getUserProfile,
    updateUserStats,
    updateUserDisplayName,

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
        // First, try to restore user from localStorage (for REST API auth)
        const storedUser = loadStoredUser();
        if (storedUser) {
            console.log('📱 User restored from localStorage:', storedUser.email || storedUser.uid);
            // Event will be dispatched by loadStoredUser
        }

        await initFirebase();

        // Handle redirect result (for WebView auth)
        const { getRedirectResult, onAuthStateChanged } = window.firebaseAuth;
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                currentUser = result.user;
                await createOrUpdateUserProfile(currentUser);
                saveUserToStorage(currentUser);
                console.log('✅ Redirect sign-in successful:', currentUser.displayName);

                // Dispatch event for UI to update
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
            }
        } catch (redirectError) {
            console.log('No redirect result or error:', redirectError.message);
        }

        // Listen to auth state changes to restore currentUser (Firebase SDK users)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                saveUserToStorage(user);
                console.log('✅ User restored from Firebase SDK:', user.displayName || user.email);
                // Dispatch event for UI to update
                window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
            } else if (!currentUser) {
                // Only clear if we don't have a REST API user
                console.log('ℹ️ No Firebase SDK user logged in');
            }
        });
    } catch (error) {
        console.error('Auto-init error:', error);
    }
})();

console.log('📦 MathQuestFirebase module loaded');
