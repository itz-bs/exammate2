import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

const upcomingExams = [
  { id: 1, subject: 'Data Structures', date: '2024-01-15', time: '09:00 AM', venue: 'Hall A-101', status: 'scheduled' },
  { id: 2, subject: 'Computer Networks', date: '2024-01-18', time: '02:00 PM', venue: 'Hall B-205', status: 'scheduled' },
  { id: 3, subject: 'Database Systems', date: '2024-01-22', time: '10:00 AM', venue: 'Hall C-301', status: 'scheduled' },
  { id: 4, subject: 'Software Engineering', date: '2024-01-25', time: '02:00 PM', venue: 'Hall A-102', status: 'scheduled' },
];

const recentResults = [
  { subject: 'Operating Systems', score: 85, grade: 'A', status: 'passed' },
  { subject: 'Computer Graphics', score: 78, grade: 'B+', status: 'passed' },
  { subject: 'Web Technologies', score: 92, grade: 'A+', status: 'passed' },
];

const statsData = [
  { name: 'Upcoming Exams', value: 4, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950' },
  { name: 'Completed Exams', value: 12, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950' },
  { name: 'Average Score', value: '85%', icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950' },
  { name: 'Current CGPA', value: '8.4', icon: Trophy, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950' },
];

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Student Dashboard</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {user?.name}! Ready for your exams?</p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <FileText className="h-5 w-5 mr-2" />
            Download Hall Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Exams */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span>Upcoming Exams</span>
          </CardTitle>
          <CardDescription>Your scheduled examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-lg p-2">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{exam.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exam.date} at {exam.time} • {exam.venue}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{exam.status}</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
            <CardTitle className="text-xl">Recent Results</CardTitle>
            <CardDescription>Your latest exam scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{result.subject}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Grade: {result.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{result.score}%</p>
                  <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
            <CardTitle className="text-xl">Academic Progress</CardTitle>
            <CardDescription>Your semester progress overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Semester Completion</span>
                <span className="text-sm text-gray-500">12/16 subjects</span>
              </div>
              <Progress value={75} className="h-3" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assignment Completion</span>
                <span className="text-sm text-gray-500">18/20</span>
              </div>
              <Progress value={90} className="h-3" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">On Track</span>
              </div>
              <Badge variant="secondary">Good Standing</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used student services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/student/hall-ticket')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Hall Ticket</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/student/exams')}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Exam Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/student/results')}>
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/student/notifications')}>
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};