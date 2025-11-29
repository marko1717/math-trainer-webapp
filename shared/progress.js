// Progress Tracking System
// Shared module for saving and loading user progress

const PROGRESS_KEY = 'math_trainer_progress';

// Progress structure
const defaultProgress = {
    version: 1,
    lastUpdated: null,
    trainers: {},
    stats: {
        totalCorrect: 0,
        totalWrong: 0,
        totalTime: 0,
        sessionsCount: 0
    },
    achievements: [],
    settings: {
        soundEnabled: true,
        vibrationEnabled: true,
        darkMode: 'auto'
    }
};

// Load progress from localStorage
function loadProgress() {
    try {
        const stored = localStorage.getItem(PROGRESS_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            return { ...defaultProgress, ...data };
        }
    } catch (e) {
        console.log('Could not load progress');
    }
    return { ...defaultProgress };
}

// Save progress to localStorage
function saveProgress(progress) {
    try {
        progress.lastUpdated = Date.now();
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        return true;
    } catch (e) {
        console.error('Could not save progress:', e);
        return false;
    }
}

// Get trainer-specific progress
function getTrainerProgress(trainerId) {
    const progress = loadProgress();
    return progress.trainers[trainerId] || {
        highestLevel: 1,
        completedLevels: [],
        totalCorrect: 0,
        totalWrong: 0,
        bestStreak: 0,
        lastPlayed: null,
        sessions: []
    };
}

// Save trainer session result
function saveTrainerSession(trainerId, sessionData) {
    const progress = loadProgress();

    if (!progress.trainers[trainerId]) {
        progress.trainers[trainerId] = {
            highestLevel: 1,
            completedLevels: [],
            totalCorrect: 0,
            totalWrong: 0,
            bestStreak: 0,
            lastPlayed: null,
            sessions: []
        };
    }

    const trainer = progress.trainers[trainerId];

    // Update stats
    trainer.totalCorrect += sessionData.correct || 0;
    trainer.totalWrong += sessionData.wrong || 0;
    trainer.lastPlayed = Date.now();

    if (sessionData.streak > trainer.bestStreak) {
        trainer.bestStreak = sessionData.streak;
    }

    // Update level progress
    if (sessionData.level && sessionData.completed) {
        if (!trainer.completedLevels.includes(sessionData.level)) {
            trainer.completedLevels.push(sessionData.level);
        }
        if (sessionData.level >= trainer.highestLevel) {
            trainer.highestLevel = sessionData.level + 1;
        }
    }

    // Store session (keep last 10)
    trainer.sessions.unshift({
        date: Date.now(),
        level: sessionData.level,
        correct: sessionData.correct,
        wrong: sessionData.wrong,
        accuracy: sessionData.accuracy
    });
    trainer.sessions = trainer.sessions.slice(0, 10);

    // Update global stats
    progress.stats.totalCorrect += sessionData.correct || 0;
    progress.stats.totalWrong += sessionData.wrong || 0;
    progress.stats.sessionsCount++;

    // Check achievements
    checkAchievements(progress, trainerId, sessionData);

    saveProgress(progress);
    return trainer;
}

// Achievement system
function checkAchievements(progress, trainerId, sessionData) {
    const newAchievements = [];

    // First session
    if (progress.stats.sessionsCount === 1) {
        newAchievements.push({
            id: 'first_session',
            name: 'Перший крок',
            icon: '🎯',
            date: Date.now()
        });
    }

    // Perfect session (100% accuracy)
    if (sessionData.accuracy === 100 && sessionData.correct >= 5) {
        const perfectId = `perfect_${trainerId}`;
        if (!progress.achievements.find(a => a.id === perfectId)) {
            newAchievements.push({
                id: perfectId,
                name: 'Бездоганно!',
                icon: '⭐',
                trainer: trainerId,
                date: Date.now()
            });
        }
    }

    // High streak
    if (sessionData.streak >= 10) {
        if (!progress.achievements.find(a => a.id === 'streak_10')) {
            newAchievements.push({
                id: 'streak_10',
                name: 'Серія 10!',
                icon: '🔥',
                date: Date.now()
            });
        }
    }

    // Total correct answers milestones
    const milestones = [50, 100, 250, 500, 1000];
    milestones.forEach(milestone => {
        if (progress.stats.totalCorrect >= milestone) {
            const achievementId = `total_${milestone}`;
            if (!progress.achievements.find(a => a.id === achievementId)) {
                newAchievements.push({
                    id: achievementId,
                    name: `${milestone} правильних!`,
                    icon: '🏆',
                    date: Date.now()
                });
            }
        }
    });

    // Add new achievements
    progress.achievements.push(...newAchievements);

    return newAchievements;
}

// Get overall stats summary
function getStatsSummary() {
    const progress = loadProgress();
    const trainerCount = Object.keys(progress.trainers).length;
    const totalAccuracy = progress.stats.totalCorrect + progress.stats.totalWrong > 0
        ? Math.round((progress.stats.totalCorrect / (progress.stats.totalCorrect + progress.stats.totalWrong)) * 100)
        : 0;

    return {
        trainersUsed: trainerCount,
        totalCorrect: progress.stats.totalCorrect,
        totalWrong: progress.stats.totalWrong,
        totalAccuracy,
        sessionsCount: progress.stats.sessionsCount,
        achievementsCount: progress.achievements.length
    };
}

// Export for use in trainers
window.Progress = {
    load: loadProgress,
    save: saveProgress,
    getTrainer: getTrainerProgress,
    saveSession: saveTrainerSession,
    getSummary: getStatsSummary
};
