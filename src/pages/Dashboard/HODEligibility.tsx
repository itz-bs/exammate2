import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

interface EligibilityRecord {
  id: string;
  studentId: string;
  examId: string;
  status: 'eligible' | 'not-eligible' | 'conditional';
  reason?: string;
  updatedAt: string;
}

export const HODEligibility: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const students = localStorage.getUsers().filter(u => u.role === 'student' && u.department === user?.department);
  const exams = localStorage.getExams().filter(e => e.department === user?.department);
  const results = JSON.parse(localStorage.getItem('examResults') || '[]');
  const eligibilityRecords = JSON.parse(localStorage.getItem('eligibilityRecords') || '[]');
  
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentEligibility = (studentId: string) => {
    const studentResults = results.filter((r: any) => r.studentId === studentId);
    const totalExams = studentResults.length;
    const passedExams = studentResults.filter((r: any) => r.status === 'pass').length;
    const averageMarks = studentResults.length > 0 
      ? studentResults.reduce((sum: number, r: any) => sum + (r.marks / r.totalMarks * 100), 0) / studentResults.length
      : 0;
    
    // Eligibility criteria
    const hasMinimumExams = totalExams >= 2;
    const hasGoodAttendance = true; // Assuming good attendance for demo
    const hasPassingGrade = averageMarks >= 40;
    const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;
    
    let status: 'eligible' | 'not-eligible' | 'conditional' = 'eligible';
    let reason = '';
    
    if (!hasMinimumExams) {
      status = 'not-eligible';
      reason = 'Insufficient exam attempts';
    } else if (!hasPassingGrade) {
      status = 'not-eligible';
      reason = 'Below minimum average (40%)';
    } else if (passRate < 50) {
      status = 'conditional';
      reason = 'Low pass rate - requires approval';
    }
    
    return { status, reason, totalExams, passedExams, averageMarks, passRate };
  };

  const updateEligibility = (studentId: string, examId: string, status: 'eligible' | 'not-eligible' | 'conditional', reason?: string) => {
    const existingRecords = JSON.parse(localStorage.getItem('eligibilityRecords') || '[]');
    const newRecord: EligibilityRecord = {
      id: `${studentId}-${examId}`,
      studentId,
      examId,
      status,
      reason,
      updatedAt: new Date().toISOString()
    };
    
    const updatedRecords = existingRecords.filter((r: EligibilityRecord) => r.id !== newRecord.id);
    updatedRecords.push(newRecord);
    
    localStorage.setItem('eligibilityRecords', JSON.stringify(updatedRecords));
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      eligible: 'secondary',
      'not-eligible': 'destructive',
      conditional: 'outline'
    };
    const icons: any = {
      eligible: CheckCircle,
      'not-eligible': XCircle,
      conditional: AlertCircle
    };
    const Icon = icons[status];
    
    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Eligibility</h1>
        <p className="text-muted-foreground">Manage student examination eligibility</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Eligibility Status
          </CardTitle>
          <CardDescription>
            Review and approve student eligibility for examinations
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
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const eligibility = getStudentEligibility(student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {eligibility.totalExams} exams, {eligibility.passedExams} passed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {eligibility.averageMarks.toFixed(1)}% | Pass rate: {eligibility.passRate.toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(eligibility.status)}
                        {eligibility.reason && (
                          <p className="text-xs text-muted-foreground">{eligibility.reason}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Eligibility - {student.name}</DialogTitle>
                            <DialogDescription>
                              Review and update student eligibility status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Total Exams</p>
                                <p className="text-2xl font-bold">{eligibility.totalExams}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Passed Exams</p>
                                <p className="text-2xl font-bold">{eligibility.passedExams}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Average Marks</p>
                                <p className="text-2xl font-bold">{eligibility.averageMarks.toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Pass Rate</p>
                                <p className="text-2xl font-bold">{eligibility.passRate.toFixed(1)}%</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Current Status</p>
                              {getStatusBadge(eligibility.status)}
                              {eligibility.reason && (
                                <p className="text-sm text-muted-foreground">{eligibility.reason}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  // For demo, we'll just show the action
                                  alert(`Approved eligibility for ${student.name}`);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  alert(`Marked as conditional for ${student.name}`);
                                }}
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Conditional
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  alert(`Rejected eligibility for ${student.name}`);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Students Found</h3>
              <p className="text-muted-foreground">No students match your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};