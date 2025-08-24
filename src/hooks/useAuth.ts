import { useAppSelector } from '@/store';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isAdmin = hasRole('admin');
  const isStudent = hasRole('student');
  const isFaculty = hasRole('faculty');
  const isHOD = hasRole('hod');

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isStudent,
    isFaculty,
    isHOD,
  };
};