export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'faculty' | 'hod';
  department?: string;
  class?: string;
  rollNo?: string;
  photo?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  department: string;
  class: string;
  type: 'regular' | 'arrear';
  venue?: string;
  totalSeats?: number;
  occupiedSeats?: number;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface HallTicket {
  id: string;
  studentId: string;
  examId: string;
  seatNumber: string;
  venue: string;
  qrCode: string;
  generatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRole?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  exams: Exam[];
  notifications: Notification[];
  hallTickets: HallTicket[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: User['role'];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: User['role'];
  department?: string;
  class?: string;
  rollNo?: string;
}