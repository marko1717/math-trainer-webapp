/* ===================================
   MATH QUEST - Local Notifications
   =================================== */

// Notification IDs
const NOTIFICATION_IDS = {
    STREAK_REMINDER: 1,
    DAILY_PRACTICE: 2,
    STREAK_DANGER: 3
};

// Storage keys
const STORAGE_KEYS = {
    NOTIFICATIONS_ENABLED: 'mathquest_notifications_enabled',
    LAST_NOTIFICATION_SETUP: 'mathquest_last_notification_setup'
};

// Check if Capacitor Local Notifications plugin is available
function isNotificationsAvailable() {
    return window.Capacitor?.Plugins?.LocalNotifications !== undefined;
}

// Request notification permissions
async function requestPermissions() {
    if (!isNotificationsAvailable()) {
        console.log('Local notifications not available (not in native app)');
        return false;
    }

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;
        const result = await LocalNotifications.requestPermissions();
        console.log('Notification permissions:', result);
        return result.display === 'granted';
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
}

// Check notification permissions
async function checkPermissions() {
    if (!isNotificationsAvailable()) return false;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;
        const result = await LocalNotifications.checkPermissions();
        return result.display === 'granted';
    } catch (error) {
        console.error('Error checking notification permissions:', error);
        return false;
    }
}

// Schedule daily streak reminder notification
// Fires every day at 19:00 (7 PM) if user hasn't practiced yet
async function scheduleStreakReminder() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        // Cancel existing streak reminder first
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_IDS.STREAK_REMINDER }] });

        // Schedule for 7 PM daily
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(19, 0, 0, 0);

        // If it's already past 7 PM, schedule for tomorrow
        if (now > notificationTime) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    id: NOTIFICATION_IDS.STREAK_REMINDER,
                    title: 'Math Quest',
                    body: 'Не забудь потренуватися сьогодні, щоб зберегти streak! 🔥',
                    schedule: {
                        at: notificationTime,
                        repeats: true,
                        every: 'day'
                    },
                    sound: 'default',
                    actionTypeId: 'OPEN_APP'
                }
            ]
        });

        console.log('Streak reminder scheduled for:', notificationTime);
    } catch (error) {
        console.error('Error scheduling streak reminder:', error);
    }
}

// Schedule motivational practice reminder
// Fires at 10 AM on weekends and 16:00 on weekdays
async function scheduleDailyPractice() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        // Cancel existing reminder first
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_IDS.DAILY_PRACTICE }] });

        // Random motivational messages
        const messages = [
            '5 хвилин практики - і ти готовий до НМТ! 📚',
            'Математика чекає на тебе! Поїхали! 🚀',
            'Кожен день робить тебе сильнішим! 💪',
            'Час прокачати свої math skills! 🧠',
            'Сьогодні відмінний день для тренування! ⭐'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Schedule for 4 PM
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(16, 0, 0, 0);

        if (now > notificationTime) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    id: NOTIFICATION_IDS.DAILY_PRACTICE,
                    title: 'Math Quest',
                    body: randomMessage,
                    schedule: {
                        at: notificationTime,
                        repeats: true,
                        every: 'day'
                    },
                    sound: 'default',
                    actionTypeId: 'OPEN_APP'
                }
            ]
        });

        console.log('Daily practice reminder scheduled for:', notificationTime);
    } catch (error) {
        console.error('Error scheduling daily practice:', error);
    }
}

// Schedule urgent reminder when streak is about to be lost (11 PM)
async function scheduleStreakDanger() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        // Cancel existing reminder first
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_IDS.STREAK_DANGER }] });

        // Schedule for 11 PM daily
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(23, 0, 0, 0);

        if (now > notificationTime) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    id: NOTIFICATION_IDS.STREAK_DANGER,
                    title: 'Твій streak в небезпеці! 🔥',
                    body: 'Залишилась одна година! Зайди і збережи свій streak!',
                    schedule: {
                        at: notificationTime,
                        repeats: true,
                        every: 'day'
                    },
                    sound: 'default',
                    actionTypeId: 'OPEN_APP'
                }
            ]
        });

        console.log('Streak danger reminder scheduled for:', notificationTime);
    } catch (error) {
        console.error('Error scheduling streak danger:', error);
    }
}

// Cancel all notifications for today (call after user completes a session)
async function cancelTodayReminders() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        // Get pending notifications
        const pending = await LocalNotifications.getPending();
        console.log('Pending notifications:', pending);

        // For now, just mark that user practiced today
        localStorage.setItem('mathquest_last_practice', new Date().toISOString().split('T')[0]);

        console.log('Marked today as practiced');
    } catch (error) {
        console.error('Error canceling today reminders:', error);
    }
}

// Initialize notifications system
async function initNotifications() {
    if (!isNotificationsAvailable()) {
        console.log('Local notifications not available');
        return false;
    }

    // Check if user has enabled notifications
    const notificationsEnabled = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);

    if (notificationsEnabled === 'true') {
        const hasPermission = await checkPermissions();

        if (hasPermission) {
            // Schedule all notifications
            await scheduleStreakReminder();
            await scheduleDailyPractice();
            await scheduleStreakDanger();

            localStorage.setItem(STORAGE_KEYS.LAST_NOTIFICATION_SETUP, new Date().toISOString());
            console.log('Notifications initialized');
            return true;
        } else {
            // Permission was revoked
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
        }
    }

    return false;
}

// Enable notifications (call from settings)
async function enableNotifications() {
    if (!isNotificationsAvailable()) {
        console.log('Local notifications not available');
        return false;
    }

    const hasPermission = await requestPermissions();

    if (hasPermission) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');

        // Schedule notifications
        await scheduleStreakReminder();
        await scheduleDailyPractice();
        await scheduleStreakDanger();

        console.log('Notifications enabled');
        return true;
    } else {
        console.log('Notification permission denied');
        return false;
    }
}

// Disable notifications
async function disableNotifications() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        // Cancel all scheduled notifications
        await LocalNotifications.cancel({
            notifications: [
                { id: NOTIFICATION_IDS.STREAK_REMINDER },
                { id: NOTIFICATION_IDS.DAILY_PRACTICE },
                { id: NOTIFICATION_IDS.STREAK_DANGER }
            ]
        });

        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
        console.log('Notifications disabled');
    } catch (error) {
        console.error('Error disabling notifications:', error);
    }
}

// Check if notifications are enabled
function areNotificationsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) === 'true';
}

// Listen for notification clicks
function setupNotificationListeners() {
    if (!isNotificationsAvailable()) return;

    try {
        const { LocalNotifications } = window.Capacitor.Plugins;

        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
            console.log('Notification action performed:', notification);
            // App will naturally open, no additional action needed
        });

        LocalNotifications.addListener('localNotificationReceived', (notification) => {
            console.log('Notification received:', notification);
        });

        console.log('Notification listeners set up');
    } catch (error) {
        console.error('Error setting up notification listeners:', error);
    }
}

// Export
window.MathQuestNotifications = {
    init: initNotifications,
    enable: enableNotifications,
    disable: disableNotifications,
    isEnabled: areNotificationsEnabled,
    isAvailable: isNotificationsAvailable,
    cancelTodayReminders,
    setupListeners: setupNotificationListeners,
    requestPermissions,
    checkPermissions
};

// Auto-initialize
(async function() {
    setupNotificationListeners();
    await initNotifications();
    console.log('MathQuestNotifications module loaded');
})();
