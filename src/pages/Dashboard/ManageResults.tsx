import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnifiedInput } from '@/components/ui/unified-input';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
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

export const ManageResults = () => {
  const [results, setResults] = useState<Result[]>(() => {
    const stored = window.localStorage.getItem('examResults');
    return stored ? JSON.parse(stored) : [
      {
        id: 'sample-1',
        studentId: localStorage.getUsers().find(u => u.role === 'student')?.id || '',
        examId: localStorage.getExams()[0]?.id || '',
        marks: 85,
        totalMarks: 100,
        grade: 'A',
        status: 'pass',
        uploadedAt: new Date().toISOString()
      }
    ];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    marks: '',
    totalMarks: '',
    grade: '',
    status: 'pass',
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

  const filteredResults = results.filter(result => {
    const studentName = getStudentName(result.studentId).toLowerCase();
    const examTitle = getExamTitle(result.examId).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return studentName.includes(search) || examTitle.includes(search);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marks = parseInt(formData.marks);
    const totalMarks = parseInt(formData.totalMarks);
    const grade = formData.grade || calculateGrade(marks, totalMarks);
    const status = marks >= (totalMarks * 0.4) ? 'pass' : 'fail';
    
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

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      studentId: result.studentId,
      examId: result.examId,
      marks: result.marks.toString(),
      totalMarks: result.totalMarks.toString(),
      grade: result.grade,
      status: result.status,
      remarks: result.remarks || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (resultId: string) => {
    const updatedResults = results.filter(result => result.id !== resultId);
    saveResults(updatedResults);
  };

  const resetForm = () => {
    setFormData({ studentId: '', examId: '', marks: '', totalMarks: '', grade: '', status: 'pass', remarks: '' });
    setEditingResult(null);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pass: 'secondary',
      fail: 'destructive',
      absent: 'outline'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
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



  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Results</h1>
            <p className="text-lg text-muted-foreground">Upload and manage examination results</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade (Optional)</Label>
                      <Input
                        id="grade"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        placeholder="Auto-calculated if empty"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pass">Pass</SelectItem>
                          <SelectItem value="fail">Fail</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Input
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Additional remarks"
                    />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-grade">Grade (Optional)</Label>
                    <Input
                      id="edit-grade"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="Auto-calculated if empty"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-remarks">Remarks (Optional)</Label>
                  <Input
                    id="edit-remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Additional remarks"
                  />
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
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Examination Results
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total results: <span className="font-semibold text-blue-600">{results.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/50 backdrop-blur-sm border-white/20"
                />
              </div>
            </div>
          </div>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(result)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(result.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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