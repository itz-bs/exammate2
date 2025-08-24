const STORAGE_KEYS = {
  AUTH_TOKEN: 'exammate_token',
  USER_DATA: 'exammate_user',
  THEME: 'exammate_theme',
  USERS: 'exammate_users',
  EXAMS: 'exammate_exams',
  HALL_TICKETS: 'exammate_hall_tickets',
  NOTIFICATIONS: 'exammate_notifications',
  COLLEGE_SETTINGS: 'exammate_college_settings'
};

export const localStorage = {
  // Auth
  setAuthToken: (token: string) => {
    window.localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  
  getAuthToken: (): string | null => {
    return window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  setUserData: (user: any) => {
    window.localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },
  
  getUserData: () => {
    const data = window.localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  
  clearAuth: () => {
    window.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Theme
  setTheme: (theme: string) => {
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  getTheme: (): string => {
    return window.localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  // Data
  setUsers: (users: any[]) => {
    window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  getUsers: (): any[] => {
    const data = window.localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  
  setExams: (exams: any[]) => {
    window.localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },
  
  getExams: (): any[] => {
    const data = window.localStorage.getItem(STORAGE_KEYS.EXAMS);
    return data ? JSON.parse(data) : [];
  },
  
  setHallTickets: (hallTickets: any[]) => {
    window.localStorage.setItem(STORAGE_KEYS.HALL_TICKETS, JSON.stringify(hallTickets));
  },
  
  getHallTickets: (): any[] => {
    const data = window.localStorage.getItem(STORAGE_KEYS.HALL_TICKETS);
    return data ? JSON.parse(data) : [];
  },
  
  setNotifications: (notifications: any[]) => {
    window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  
  getNotifications: (): any[] => {
    const data = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },
  
  setCollegeSettings: (settings: any) => {
    window.localStorage.setItem(STORAGE_KEYS.COLLEGE_SETTINGS, JSON.stringify(settings));
  },
  
  getCollegeSettings: (): any => {
    const data = window.localStorage.getItem(STORAGE_KEYS.COLLEGE_SETTINGS);
    return data ? JSON.parse(data) : {
      name: 'Sample College',
      address: 'College Address, City, State',
      phone: '+1-234-567-8900',
      email: 'info@college.edu',
      collegeLogo: '',
      collegeSeal: '',
      principalName: 'Dr. Principal Name',
      principalSignature: '',
      affiliatedUniversity: 'Sample University',
      collegeCode: 'SC001'
    };
  },
  
  // Generic localStorage methods
  setItem: (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  
  getItem: (key: string, defaultValue: any = null) => {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }
};