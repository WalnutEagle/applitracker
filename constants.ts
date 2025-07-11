// WARNING: Hardcoding credentials is insecure and should not be done in a real-world production application.
// This is for demonstration purposes only, as per the user's request for a serverless static app.
export const USER_CREDENTIALS = {
  username: import.meta.env.VITE_APP_LOGIN_ID || "dev_user",
  password: import.meta.env.VITE_APP_PASSWORD || "dev_pass",
};

export const LOCAL_STORAGE_KEYS = {
    COUNT: 'jobAppTracker_count',
    GOAL: 'jobAppTracker_goal',
    EMAIL_NOTIFICATIONS: 'jobAppTracker_emailNotifications',
    LAST_VISIT_DATE: 'jobAppTracker_lastVisitDate',
    HISTORY: 'jobAppTracker_history',
    STREAK: 'jobAppTracker_streak',
    GOAL_MET_TODAY: 'jobAppTracker_goalMetToday',
    THEME: 'jobAppTracker_theme',
};