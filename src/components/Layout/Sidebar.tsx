
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Bell,
  Settings,

  UserCheck,
  BarChart3,
  MapPin,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Students', path: '/admin/users' },
    { icon: Calendar, label: 'Manage Exams', path: '/admin/exams' },
    { icon: FileText, label: 'Manage Hall Tickets', path: '/admin/hall-tickets' },
    { icon: MapPin, label: 'Seat Allocation', path: '/admin/seat-allocation' },
    { icon: BarChart3, label: 'Results', path: '/admin/results' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'College Settings', path: '/admin/college-settings' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ],
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: Calendar, label: 'My Exams', path: '/student/exams' },
    { icon: FileText, label: 'My Hall Ticket', path: '/student/hall-ticket' },
    { icon: MapPin, label: 'Seat Allocation', path: '/student/seat-allocation' },
    { icon: BarChart3, label: 'My Results', path: '/student/results' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ],
  faculty: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/faculty' },
    { icon: Users, label: 'My Students', path: '/faculty/students' },
    { icon: Calendar, label: 'My Exams', path: '/faculty/exams' },
    { icon: BarChart3, label: 'Reports', path: '/faculty/reports' },
    { icon: Bell, label: 'Notifications', path: '/faculty/notifications' },
    { icon: Settings, label: 'Settings', path: '/faculty/settings' },
  ],
  hod: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hod' },
    { icon: UserCheck, label: 'Student Eligibility', path: '/hod/eligibility' },
    { icon: Users, label: 'Department Students', path: '/hod/students' },
    { icon: Calendar, label: 'Department Exams', path: '/hod/exams' },
    { icon: BarChart3, label: 'Department Reports', path: '/hod/reports' },
    { icon: Bell, label: 'Notifications', path: '/hod/notifications' },
    { icon: Settings, label: 'Settings', path: '/hod/settings' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out z-50 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:fixed lg:top-16 lg:h-[calc(100vh-4rem)]'
        )}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-muted-foreground hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-950 dark:hover:to-red-950 hover:text-orange-600 dark:hover:text-orange-400'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};