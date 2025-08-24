import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';
import { ThreeBackground } from '@/components/ui/three-background';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getTheme() === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setTheme('light');
    }
  }, [darkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50/50 via-red-50/50 to-pink-50/50 dark:from-orange-950/50 dark:via-red-950/50 dark:to-pink-950/50 relative overflow-hidden">
      <ThreeBackground />
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};