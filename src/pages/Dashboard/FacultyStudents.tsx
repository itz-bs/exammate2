import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { studentsService, resultsService } from '@/services/backendService';

export const FacultyStudents: React.FC = () => {
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
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-muted-foreground">Students in {user?.department} department</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Students
          </CardTitle>
          <CardDescription>
            Total students: {students.length}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const stats = getStudentStats(student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.roll_no}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {stats.totalExams > 0 ? (
                        <div className="space-y-1">
                          <div className="text-sm">
                            <Badge variant="outline">
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