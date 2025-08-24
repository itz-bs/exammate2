import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Calendar, Download, FileText, PieChart, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { studentsService, examsService, resultsService } from '@/services/backendService';

export const HODReports: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('performance');
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, examsData, resultsData] = await Promise.all([
          studentsService.getAll(),
          examsService.getAll(),
          resultsService.getAll()
        ]);
        
        const departmentStudents = studentsData.filter(s => s.department === user?.department);
        const departmentExams = examsData.filter(e => e.department === user?.department);
        const departmentResults = resultsData.filter((r: any) => {
          const student = departmentStudents.find(s => s.id === r.student_id);
          return student;
        });
        
        setStudents(departmentStudents);
        setExams(departmentExams);
        setResults(departmentResults);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.department) {
      fetchData();
    }
  }, [user?.department]);

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    totalExams: exams.length,
    totalResults: results.length,
    passRate: results.length > 0 
      ? (results.filter((r: any) => r.status === 'pass').length / results.length * 100).toFixed(1)
      : 0,
    averageMarks: results.length > 0
      ? (results.reduce((sum: number, r: any) => sum + (r.marks / r.total_marks * 100), 0) / results.length).toFixed(1)
      : 0
  };

  // Class-wise performance
  const classWisePerformance = students.reduce((acc: any, student) => {
    const className = student.class || 'Unassigned';
    if (!acc[className]) {
      acc[className] = { total: 0, results: 0, passed: 0, totalMarks: 0 };
    }
    acc[className].total++;
    
    const studentResults = results.filter((r: any) => r.student_id === student.id);
    acc[className].results += studentResults.length;
    acc[className].passed += studentResults.filter((r: any) => r.status === 'pass').length;
    acc[className].totalMarks += studentResults.reduce((sum: number, r: any) => sum + (r.marks / r.total_marks * 100), 0);
    
    return acc;
  }, {});

  // Subject-wise performance
  const subjectWisePerformance = results.reduce((acc: any, result: any) => {
    const exam = exams.find(e => e.id === result.exam_id);
    if (exam) {
      const subject = exam.subject;
      if (!acc[subject]) {
        acc[subject] = { total: 0, passed: 0, totalMarks: 0 };
      }
      acc[subject].total++;
      if (result.status === 'pass') acc[subject].passed++;
      acc[subject].totalMarks += (result.marks / result.total_marks * 100);
    }
    return acc;
  }, {});

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const generateReport = (type: string) => {
    // This would typically generate and download a PDF/Excel report
    alert(`Generating ${type} report for ${user?.department} department...`);
  };

  const reportTypes = [
    { value: 'performance', label: 'Performance Report', icon: BarChart3 },
    { value: 'attendance', label: 'Attendance Report', icon: Users },
    { value: 'exam-analysis', label: 'Exam Analysis', icon: PieChart },
    { value: 'student-progress', label: 'Student Progress', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Department Reports</h1>
            <p className="text-lg text-muted-foreground">Comprehensive analytics and reports for {user?.department} department</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48 bg-white/20 backdrop-blur-sm border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => generateReport(selectedReport)}>
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Results</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.totalResults}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{stats.averageMarks}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Performance */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Class-wise Performance Analysis
          </CardTitle>
          <CardDescription>Detailed performance breakdown by class</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(classWisePerformance).map(([className, data]: [string, any]) => (
              <div key={className} className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{className}</h4>
                  <Badge variant="outline">{data.total} students</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate:</span>
                    <span className="font-medium">
                      {data.results > 0 ? `${(data.passed / data.results * 100).toFixed(1)}%` : 'No data'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Marks:</span>
                    <span className="font-medium">
                      {data.results > 0 ? `${(data.totalMarks / data.results).toFixed(1)}%` : 'No data'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Results Published:</span>
                    <span className="font-medium">{data.results}</span>
                  </div>
                  {data.results > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(data.passed / data.results) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Performance */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            Subject-wise Performance Analysis
          </CardTitle>
          <CardDescription>Performance breakdown by subject</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(subjectWisePerformance).map(([subject, data]: [string, any]) => (
              <div key={subject} className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{subject}</h4>
                  <Badge variant="secondary">{data.total} results</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate:</span>
                    <span className="font-medium">
                      {data.total > 0 ? `${(data.passed / data.total * 100).toFixed(1)}%` : 'No data'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Marks:</span>
                    <span className="font-medium">
                      {data.total > 0 ? `${(data.totalMarks / data.total).toFixed(1)}%` : 'No data'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Students Passed:</span>
                    <span className="font-medium">{data.passed}/{data.total}</span>
                  </div>
                  {data.total > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(data.passed / data.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="text-xl">Quick Report Actions</CardTitle>
          <CardDescription>Generate and export various department reports</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <Button 
                key={type.value}
                variant="outline" 
                className="h-20 flex flex-col space-y-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
                onClick={() => generateReport(type.value)}
              >
                <type.icon className="h-6 w-6" />
                <span className="text-sm text-center">{type.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};