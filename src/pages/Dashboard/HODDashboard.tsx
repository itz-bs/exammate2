import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, BarChart3, UserCheck, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

export const HODDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const students = localStorage.getUsers().filter(u => u.role === 'student' && u.department === user?.department);
  const faculty = localStorage.getUsers().filter(u => u.role === 'faculty' && u.department === user?.department);
  const exams = localStorage.getExams().filter(e => e.department === user?.department);
  const results = JSON.parse(localStorage.getItem('examResults') || '[]');
  const departmentResults = results.filter((r: any) => {
    const student = students.find(s => s.id === r.studentId);
    return student;
  });

  const stats = {
    totalStudents: students.length,
    totalFaculty: faculty.length,
    totalExams: exams.length,
    passRate: departmentResults.length > 0 
      ? (departmentResults.filter((r: any) => r.status === 'pass').length / departmentResults.length * 100).toFixed(1)
      : 0,
    averageMarks: departmentResults.length > 0
      ? (departmentResults.reduce((sum: number, r: any) => sum + (r.marks / r.totalMarks * 100), 0) / departmentResults.length).toFixed(1)
      : 0
  };

  const classWiseStats = students.reduce((acc: any, student) => {
    const className = student.class;
    if (!acc[className]) {
      acc[className] = { total: 0, results: 0, passed: 0 };
    }
    acc[className].total++;
    
    const studentResults = departmentResults.filter((r: any) => r.studentId === student.id);
    acc[className].results += studentResults.length;
    acc[className].passed += studentResults.filter((r: any) => r.status === 'pass').length;
    
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HOD Dashboard</h1>
            <p className="text-lg text-muted-foreground">Department: {user?.department} | Manage your department efficiently</p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Settings className="h-5 w-5 mr-2" />
            Department Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalFaculty}</p>
                <p className="text-xs text-muted-foreground">Department faculty</p>
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
                <p className="text-sm font-medium text-muted-foreground">Exams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalExams}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.passRate}%</p>
                <p className="text-xs text-muted-foreground">Overall performance</p>
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
                <p className="text-sm font-medium text-muted-foreground">Average</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.averageMarks}%</p>
                <p className="text-xs text-muted-foreground">Department average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Class-wise Performance
            </CardTitle>
            <CardDescription>Student performance by class</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(classWiseStats).map(([className, stats]: [string, any]) => (
                <div key={className} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{className}</p>
                    <p className="text-sm text-muted-foreground">{stats.total} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {stats.results > 0 ? `${(stats.passed / stats.results * 100).toFixed(1)}%` : 'No results'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.passed}/{stats.results} passed
                    </p>
                  </div>
                </div>
              ))}
              {Object.keys(classWiseStats).length === 0 && (
                <p className="text-muted-foreground text-center py-8">No class data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Recent Exams
            </CardTitle>
            <CardDescription>Upcoming department examinations</CardDescription>
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
                    <p className="text-xs text-muted-foreground">
                      {exam.occupiedSeats}/{exam.totalSeats} seats
                    </p>
                  </div>
                </div>
              ))}
              {exams.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No exams scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used HOD services</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/hod/students')}>
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Faculty</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/hod/exams')}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Exam Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/hod/reports')}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Performance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/hod/reports')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};