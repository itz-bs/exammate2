import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, BarChart3, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const students = localStorage.getUsers().filter(u => u.role === 'student' && u.department === user?.department);
  const exams = localStorage.getExams().filter(e => e.department === user?.department);
  const results = JSON.parse(window.localStorage.getItem('examResults') || '[]');
  const notifications = JSON.parse(window.localStorage.getItem('notifications') || '[]');

  const stats = {
    totalStudents: students.length,
    totalExams: exams.length,
    totalResults: results.length,
    recentNotifications: notifications.filter((n: any) => n.targetRole === 'faculty' || n.targetRole === 'all').length
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Faculty Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {user?.name}! Manage your department efficiently.</p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <BookOpen className="h-5 w-5 mr-2" />
            Manage Students
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Department: {user?.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department Exams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalExams}</p>
                <p className="text-xs text-muted-foreground">Scheduled exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Results</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalResults}</p>
                <p className="text-xs text-muted-foreground">Published results</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.recentNotifications}</p>
                <p className="text-xs text-muted-foreground">Recent updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Recent Exams
            </CardTitle>
            <CardDescription>Upcoming examinations in your department</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {exams.slice(0, 5).map((exam: any) => (
                <div key={exam.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">{exam.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{exam.date}</p>
                    <p className="text-xs text-muted-foreground">{exam.startTime}</p>
                  </div>
                </div>
              ))}
              {exams.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No exams scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Users className="h-5 w-5 text-white" />
              </div>
              Department Students
            </CardTitle>
            <CardDescription>Students in {user?.department}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {students.slice(0, 5).map((student: any) => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.class}</p>
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No students found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used faculty services</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/faculty/students')}>
              <Users className="h-6 w-6" />
              <span className="text-sm">View Students</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/faculty/exams')}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Exam Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/faculty/reports')}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/faculty/notifications')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};