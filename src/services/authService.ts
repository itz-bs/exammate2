import { LoginCredentials, RegisterData, User } from '@/types';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = localStorage.getUsers();
    const user = users.find(
      (u: User) => u.email === credentials.email && u.role === credentials.role
    );
    
    if (!user) {
      throw new Error('User not found. Please register first.');
    }
    
    // In a real app, you'd validate password here
    const token = `token_${generateId()}`;
    
    return {
      user,
      token,
    };
  }

  async register(userData: RegisterData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = localStorage.getUsers();
    const existingUser = users.find(
      (u: User) => u.email === userData.email && u.role === userData.role
    );
    
    if (existingUser) {
      throw new Error('User already exists with this email and role');
    }
    
    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      class: userData.class,
      rollNo: userData.rollNo,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setUsers(users);
    
    return newUser;
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getAuthToken();
    if (!token) return null;
    
    return localStorage.getUserData();
  }
}

export const authService = new AuthService();