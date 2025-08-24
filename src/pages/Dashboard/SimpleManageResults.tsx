import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText } from 'lucide-react';
import { UnifiedInput } from '@/components/ui/unified-input';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

interface Result {
  id: string;
  studentId: string;
  examId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  status: 'pass' | 'fail' | 'absent';
  remarks?: string;
  uploadedAt: string;
}

export const SimpleManageResults = () => {
  const [results, setResults] = useState<Result[]>(() => {
    const stored = window.localStorage.getItem('examResults');
    return stored ? JSON.parse(stored) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    marks: '',
    totalMarks: '',
    grade: '',
    status: 'pass' as const,
    remarks: ''
  });

  const students = localStorage.getUsers().filter(u => u.role === 'student');
  const exams = localStorage.getExams();

  const saveResults = (resultsList: Result[]) => {
    window.localStorage.setItem('examResults', JSON.stringify(resultsList));
    setResults(resultsList);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.rollNo})` : 'Unknown Student';
  };

  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? `${exam.title} - ${exam.subject}` : 'Unknown Exam';
  };

  const calculateGrade = (marks: number, totalMarks: number) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marks = parseInt(formData.marks);
    const totalMarks = parseInt(formData.totalMarks);
    const grade = formData.grade || calculateGrade(marks, totalMarks);
    const status = marks >= (totalMarks * 0.4) ? 'pass' as const : 'fail' as const;
    
    if (editingResult) {
      const updatedResults = results.map(result =>
        result.id === editingResult.id 
          ? { 
              ...result, 
              ...formData,
              marks,
              totalMarks,
              grade,
              status: formData.status
            } 
          : result
      );
      saveResults(updatedResults);
    } else {
      const newResult: Result = {
        id: generateId(),
        studentId: formData.studentId,
        examId: formData.examId,
        marks,
        totalMarks,
        grade,
        status: formData.status,
        remarks: formData.remarks,
        uploadedAt: new Date().toISOString()
      };
      saveResults([...results, newResult]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ studentId: '', examId: '', marks: '', totalMarks: '', grade: '', status: 'pass', remarks: '' });
    setEditingResult(null);
    setIsDialogOpen(false);
  };

  const handleBulkUpload = (data: any[]) => {
    const bulkResults: Result[] = [];
    
    data.forEach(row => {
      const rollNo = row['Roll Number'] || row.rollNo || row.roll_no;
      const examTitle = row['Exam Title'] || row.examTitle || row.exam_title;
      const marks = parseInt(row.Marks || row.marks);
      const totalMarks = parseInt(row['Total Marks'] || row.totalMarks || row.total_marks);
      
      const student = students.find(s => s.rollNo === rollNo);
      const exam = exams.find(e => e.title === examTitle);
      
      if (student && exam && !isNaN(marks) && !isNaN(totalMarks)) {
        const grade = calculateGrade(marks, totalMarks);
        const status = marks >= (totalMarks * 0.4) ? 'pass' as const : 'fail' as const;
        
        bulkResults.push({
          id: generateId(),
          studentId: student.id,
          examId: exam.id,
          marks,
          totalMarks,
          grade,
          status,
          uploadedAt: new Date().toISOString()
        });
      }
    });
    
    if (bulkResults.length > 0) {
      saveResults([...results, ...bulkResults]);
      alert(`Successfully uploaded ${bulkResults.length} results`);
    } else {
      alert('No valid result data found in the file');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pass: 'secondary',
      fail: 'destructive',
      absent: 'outline'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Results</h1>
          <p className="text-muted-foreground">Upload and manage examination results</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Results
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Results</DialogTitle>
              <DialogDescription>
                Add results individually or import from file (Excel, PDF, CSV)
              </DialogDescription>
            </DialogHeader>
            <UnifiedInput
              title="Result Management"
              description="Choose your preferred method to add results"
              singleEntryComponent={
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student</Label>
                    <Select
                      value={formData.studentId}
                      onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.rollNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examId">Exam</Label>
                    <Select
                      value={formData.examId}
                      onValueChange={(value) => setFormData({ ...formData, examId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.title} - {exam.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks Obtained</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={formData.marks}
                        onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalMarks">Total Marks</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </form>
              }
              onFileProcessed={handleBulkUpload}
              templateData="Roll Number,Exam Title,Marks,Total Marks\nCS2021001,Mid Semester Exam,85,100\nCS2021002,Mid Semester Exam,78,100"
              templateFilename="results-template.csv"
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Result</DialogTitle>
              <DialogDescription>
                Update result information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-studentId">Student</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.rollNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-examId">Exam</Label>
                <Select
                  value={formData.examId}
                  onValueChange={(value) => setFormData({ ...formData, examId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title} - {exam.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-marks">Marks Obtained</Label>
                  <Input
                    id="edit-marks"
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-totalMarks">Total Marks</Label>
                  <Input
                    id="edit-totalMarks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Result
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Examination Results
          </CardTitle>
          <CardDescription>
            Total results: {results.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {getStudentName(result.studentId)}
                  </TableCell>
                  <TableCell>{getExamTitle(result.examId)}</TableCell>
                  <TableCell>
                    {result.marks}/{result.totalMarks} ({((result.marks/result.totalMarks)*100).toFixed(1)}%)
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.grade}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell>
                    {new Date(result.uploadedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};