import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from '@/components/ui/toaster';

// Layout Components
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';

// Dashboard Pages
import { AdminDashboard } from '@/pages/Dashboard/AdminDashboard';
import { StudentDashboard } from '@/pages/Dashboard/StudentDashboard';
import { SettingsPage } from '@/pages/Dashboard/SettingsPage';

import { ManageStudents } from '@/pages/Dashboard/ManageStudents';
import { ManageExams } from '@/pages/Dashboard/ManageExams';
import { ManageHallTickets } from '@/pages/Dashboard/ManageHallTickets';
import { ManageNotifications } from '@/pages/Dashboard/ManageNotifications';
import { ManageResults } from '@/pages/Dashboard/ManageResults';
import { ManageSeatAllocation } from '@/pages/Dashboard/ManageSeatAllocation';
import { StudentExams } from '@/pages/Dashboard/StudentExams';
import { StudentHallTicket } from '@/pages/Dashboard/StudentHallTicket';
import { StudentSeatAllocation } from '@/pages/Dashboard/StudentSeatAllocation';
import { StudentResults } from '@/pages/Dashboard/StudentResults';
import { StudentNotifications } from '@/pages/Dashboard/StudentNotifications';
import { FacultyDashboard } from '@/pages/Dashboard/FacultyDashboard';
import { FacultyStudents } from '@/pages/Dashboard/FacultyStudents';
import { FacultyExams } from '@/pages/Dashboard/FacultyExams';
import { FacultyReports } from '@/pages/Dashboard/FacultyReports';
import { FacultyNotifications } from '@/pages/Dashboard/FacultyNotifications';
import { HODDashboard } from '@/pages/Dashboard/HODDashboard';
import { HODStudents } from '@/pages/Dashboard/HODStudents';
import { HODExams } from '@/pages/Dashboard/HODExams';
import { HODReports } from '@/pages/Dashboard/HODReports';
import { HODNotifications } from '@/pages/Dashboard/HODNotifications';
import { HODEligibility } from '@/pages/Dashboard/HODEligibility';
import { CollegeSettings } from '@/pages/Dashboard/CollegeSettings';

// Initialize with sample data
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

function App() {
  useEffect(() => {
    // Initialize with sample data if not exists
    const users = localStorage.getUsers();
    if (users.length === 0) {
      const sampleUsers = [
        {
          id: generateId(),
          name: 'Admin User',
          email: 'admin@test.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'John Doe',
          email: 'student@test.com',
          role: 'student',
          department: 'Computer Science',
          class: 'Third Year',
          rollNo: 'CS2021001',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Dr. Jane Smith',
          email: 'faculty@test.com',
          role: 'faculty',
          department: 'Computer Science',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Prof. Robert Wilson',
          email: 'hod@test.com',
          role: 'hod',
          department: 'Computer Science',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setUsers(sampleUsers);
    }

    // Initialize sample exams
    const exams = localStorage.getExams();
    if (exams.length === 0) {
      const sampleExams = [
        {
          id: generateId(),
          title: 'Mid Semester Exam',
          subject: 'Data Structures',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '12:00',
          duration: 180,
          department: 'Computer Science',
          class: 'Third Year',
          type: 'regular',
          venue: 'Hall A-101',
          totalSeats: 100,
          occupiedSeats: 85,
          status: 'scheduled',
        },
        {
          id: generateId(),
          title: 'End Semester Exam',
          subject: 'Computer Networks',
          date: '2024-01-18',
          startTime: '14:00',
          endTime: '17:00',
          duration: 180,
          department: 'Computer Science',
          class: 'Third Year',
          type: 'regular',
          venue: 'Hall B-205',
          totalSeats: 120,
          occupiedSeats: 95,
          status: 'scheduled',
        },
      ];
      localStorage.setExams(sampleExams);
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Dashboard Routes */}
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageStudents />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hall-tickets"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageHallTickets />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageResults />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageNotifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/seat-allocation"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ManageSeatAllocation />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/college-settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <CollegeSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exams"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/hall-ticket"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentHallTicket />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/seat-allocation"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentSeatAllocation />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentResults />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <StudentNotifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <FacultyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/students"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <FacultyStudents />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/exams"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <FacultyExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/reports"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <FacultyReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/notifications"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <FacultyNotifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/settings"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* HOD Routes */}
            <Route
              path="/hod"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/eligibility"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODEligibility />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/students"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODStudents />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/exams"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODExams />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/reports"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/notifications"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <HODNotifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/settings"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
                  <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
                </div>
              </div>
            } />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                  <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            } />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </Provider>
  );
}

export default App;