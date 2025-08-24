import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const statsData = [
  { name: 'Total Students', value: 1248, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950' },
  { name: 'Upcoming Exams', value: 8, icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950' },
  { name: 'Hall Tickets', value: 892, icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950' },
  { name: 'Active Faculty', value: 67, icon: BookOpen, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950' },
];

const examData = [
  { name: 'CSE', regular: 45, arrear: 12 },
  { name: 'IT', regular: 38, arrear: 8 },
  { name: 'ECE', regular: 42, arrear: 15 },
  { name: 'ME', regular: 35, arrear: 10 },
  { name: 'CE', regular: 40, arrear: 7 },
];

const departmentData = [
  { name: 'CSE', value: 325, color: '#3B82F6' },
  { name: 'IT', value: 280, color: '#10B981' },
  { name: 'ECE', value: 245, color: '#8B5CF6' },
  { name: 'ME', value: 198, color: '#F59E0B' },
  { name: 'CE', value: 200, color: '#EF4444' },
];

const recentActivities = [
  { id: 1, activity: 'New exam scheduled for CSE Department', time: '2 hours ago', type: 'success' },
  { id: 2, activity: 'Hall tickets generated for IT students', time: '4 hours ago', type: 'info' },
  { id: 3, activity: 'Faculty meeting scheduled', time: '1 day ago', type: 'warning' },
  { id: 4, activity: 'Results published for ECE', time: '2 days ago', type: 'success' },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <AnimatedGradient className="relative overflow-hidden rounded-2xl p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div 
          className="relative flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="space-y-2">
            <motion.h1 
              className="text-4xl font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Admin Dashboard
            </motion.h1>
            <motion.p 
              className="text-lg text-white/90"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Welcome back! Here's what's happening in your system.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Exam
            </Button>
          </motion.div>
        </motion.div>
      </AnimatedGradient>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <FloatingCard key={stat.name} delay={index * 0.1}>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <motion.p 
                      className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {stat.value.toLocaleString()}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Statistics */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
            <CardTitle className="text-xl">Department-wise Exam Statistics</CardTitle>
            <CardDescription>Regular vs Arrear exams by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={examData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="regular" fill="#F97316" name="Regular" />
                <Bar dataKey="arrear" fill="#EF4444" name="Arrear" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Distribution */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
            <CardTitle className="text-xl">Student Distribution</CardTitle>
            <CardDescription>Students by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Exam Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
            <CardTitle className="text-xl">Recent Activities</CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.activity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exam Status Overview */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
            <CardTitle className="text-xl">Exam Status Overview</CardTitle>
            <CardDescription>Current exam preparation status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hall Tickets Generated</span>
                <span className="text-sm text-gray-500">892/1248</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Seat Allocation</span>
                <span className="text-sm text-gray-500">6/8</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eligibility Verification</span>
                <span className="text-sm text-gray-500">1180/1248</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">System Ready</span>
              </div>
              <Badge variant="secondary">All Systems</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/users')}>
              <Users className="h-6 w-6" />
              <span className="text-sm">Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/exams')}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Exam</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/results')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Generate Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/results')}>
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};