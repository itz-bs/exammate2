export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student', 
  FACULTY: 'faculty',
  HOD: 'hod'
} as const;

export const EXAM_TYPES = {
  REGULAR: 'regular',
  ARREAR: 'arrear'
} as const;

export const EXAM_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing', 
  COMPLETED: 'completed'
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export const ROLE_COLORS = {
  admin: 'bg-blue-500',
  student: 'bg-green-500',
  faculty: 'bg-purple-500',
  hod: 'bg-orange-500'
};

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

export const CLASSES = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year'
];