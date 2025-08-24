import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Mail, GraduationCap, TrendingUp, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { studentsService, resultsService } from '@/services/backendService';

export const HODStudents: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, resultsData] = await Promise.all([
          studentsService.getAll(),
          resultsService.getAll()
        ]);
        
        const departmentStudents = studentsData.filter(s => s.department === user?.department);
        setStudents(departmentStudents);
        setResults(resultsData);
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
  
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStudentStats = (studentId: string) => {
    const studentResults = results.filter((r: any) => r.student_id === studentId);
    const passedExams = studentResults.filter((r: any) => r.status === 'pass').length;
    const totalExams = studentResults.length;
    const averageMarks = studentResults.length > 0 
      ? studentResults.reduce((sum: number, r: any) => sum + (r.marks / r.total_marks * 100), 0) / studentResults.length
      : 0;
    
    return { passedExams, totalExams, averageMarks };
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

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Department Students</h1>
            <p className="text-lg text-muted-foreground">Manage and monitor students in {user?.department} department</p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <FileText className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{students.length}</p>
                <p className="text-xs text-muted-foreground">Department: {user?.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Classes</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{Object.keys(classWiseStats).length}</p>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {results.length > 0 ? 
                    (results.reduce((sum: number, r: any) => sum + (r.marks / r.totalMarks * 100), 0) / results.length).toFixed(1) + '%'
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-muted-foreground">Department average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Overview */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            Class-wise Distribution
          </CardTitle>
          <CardDescription>Student performance by class</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(classWiseStats).map(([className, stats]: [string, any]) => (
              <div key={className} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{className}</h4>
                  <Badge variant="outline">{stats.total} students</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Results: {stats.results}</p>
                  <p>Pass Rate: {stats.results > 0 ? `${(stats.passed / stats.results * 100).toFixed(1)}%` : 'No data'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Students Directory
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total students: <span className="font-semibold text-emerald-600">{students.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/50 backdrop-blur-sm border-white/20"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <TableRow key={student.id} className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950 dark:hover:to-teal-950 transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">{student.roll_no}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {stats.totalExams > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={stats.averageMarks >= 60 ? "default" : "destructive"} className="text-xs">
                                {stats.passedExams}/{stats.totalExams} passed
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Avg: {stats.averageMarks.toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline">No results</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Students Found</h3>
              <p className="text-muted-foreground">No students match your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};