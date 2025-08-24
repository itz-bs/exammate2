import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { studentsService, examsService, resultsService } from '@/services/backendService';

export const FacultyReports: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('student-performance');
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

  const stats = {
    totalStudents: students.length,
    totalExams: exams.length,
    totalResults: results.length,
    averageMarks: results.length > 0
      ? (results.reduce((sum: number, r: any) => sum + (r.marks / r.total_marks * 100), 0) / results.length).toFixed(1)
      : 0
  };

  const classWiseStats = students.reduce((acc: any, student) => {
    const className = student.class || 'Unassigned';
    if (!acc[className]) {
      acc[className] = { total: 0, results: 0, passed: 0 };
    }
    acc[className].total++;
    
    const studentResults = results.filter((r: any) => r.student_id === student.id);
    acc[className].results += studentResults.length;
    acc[className].passed += studentResults.filter((r: any) => r.status === 'pass').length;
    
    return acc;
  }, {});

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const generateReport = (type: string) => {
    alert(`Generating ${type} report for ${user?.department} department...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Department Reports</h1>
          <p className="text-muted-foreground">View analytics and reports for {user?.department} department</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student-performance">Student Performance</SelectItem>
              <SelectItem value="exam-analysis">Exam Analysis</SelectItem>
              <SelectItem value="attendance">Attendance Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => generateReport(selectedReport)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exams</p>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Results</p>
                <p className="text-2xl font-bold">{stats.totalResults}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">{stats.averageMarks}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Class-wise Performance
          </CardTitle>
          <CardDescription>Performance breakdown by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(classWiseStats).map(([className, data]: [string, any]) => (
              <div key={className} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{className}</h4>
                  <Badge variant="outline">{data.total} students</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Results: {data.results}</p>
                  <p>Pass Rate: {data.results > 0 ? `${(data.passed / data.results * 100).toFixed(1)}%` : 'No data'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
          <CardDescription>Generate various department reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => generateReport('performance')}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Performance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => generateReport('attendance')}>
              <Users className="h-6 w-6" />
              <span className="text-sm">Attendance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => generateReport('exam-analysis')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Exam Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};