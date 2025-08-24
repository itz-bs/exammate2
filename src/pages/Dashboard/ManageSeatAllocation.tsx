import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, MapPin, Users, Calendar } from 'lucide-react';
import { UnifiedInput } from '@/components/ui/unified-input';
import { seatAllocationsService, studentsService, examsService } from '@/services/backendService';
import { generateId } from '@/utils/helpers';

interface SeatAllocation {
  id: string;
  student_id: string;
  exam_id: string;
  hall_number: string;
  seat_number: string;
  created_at: string;
  student?: any;
  exam?: any;
}

export const ManageSeatAllocation = () => {
  const [allocations, setAllocations] = useState<SeatAllocation[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<SeatAllocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    hallNumber: '',
    seatNumber: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, examsData] = await Promise.all([
        studentsService.getAll(),
        examsService.getAll()
      ]);
      setStudents(studentsData);
      setExams(examsData);
      
      if (examsData.length > 0) {
        const firstExam = examsData[0];
        setSelectedExam(firstExam.id);
        await fetchAllocations(firstExam.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async (examId: string) => {
    try {
      const allocationsData = await seatAllocationsService.getByExam(examId);
      setAllocations(allocationsData);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    fetchAllocations(examId);
  };

  const getStudentName = (allocation: SeatAllocation) => {
    if (allocation.student) {
      return `${allocation.student.name} (${allocation.student.roll_no})`;
    }
    const student = students.find(s => s.id === allocation.student_id);
    return student ? `${student.name} (${student.roll_no})` : 'Unknown Student';
  };

  const getExamTitle = (allocation: SeatAllocation) => {
    if (allocation.exam) {
      return `${allocation.exam.title} - ${allocation.exam.subject}`;
    }
    const exam = exams.find(e => e.id === allocation.exam_id);
    return exam ? `${exam.title} - ${exam.subject}` : 'Unknown Exam';
  };

  const filteredAllocations = allocations.filter(allocation => {
    const studentName = getStudentName(allocation).toLowerCase();
    const examTitle = getExamTitle(allocation).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return studentName.includes(search) || 
           examTitle.includes(search) || 
           allocation.hall_number.toLowerCase().includes(search) ||
           allocation.seat_number.toLowerCase().includes(search);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const allocationData = {
        student_id: formData.studentId,
        exam_id: formData.examId,
        hall_number: formData.hallNumber,
        seat_number: formData.seatNumber
      };

      if (editingAllocation) {
        // Update existing allocation
        await seatAllocationsService.update?.(editingAllocation.id, allocationData);
      } else {
        // Create new allocation
        await seatAllocationsService.create?.(allocationData);
      }
      
      // Refresh allocations
      if (selectedExam) {
        await fetchAllocations(selectedExam);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving allocation:', error);
      alert('Error saving seat allocation. Please try again.');
    }
  };

  const handleEdit = (allocation: SeatAllocation) => {
    setEditingAllocation(allocation);
    setFormData({
      studentId: allocation.student_id,
      examId: allocation.exam_id,
      hallNumber: allocation.hall_number,
      seatNumber: allocation.seat_number
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (allocationId: string) => {
    try {
      await seatAllocationsService.delete?.(allocationId);
      if (selectedExam) {
        await fetchAllocations(selectedExam);
      }
    } catch (error) {
      console.error('Error deleting allocation:', error);
      alert('Error deleting seat allocation. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ studentId: '', examId: '', hallNumber: '', seatNumber: '' });
    setEditingAllocation(null);
    setIsDialogOpen(false);
  };

  const handleBulkUpload = async (data: any[]) => {
    const newAllocations: any[] = [];
    
    data.forEach(row => {
      const rollNo = row['Roll Number'] || row.rollNo || row.roll_no;
      const examTitle = row['Exam Title'] || row.examTitle || row.exam_title;
      const hallNumber = row['Hall Number'] || row.hallNumber || row.hall_number;
      const seatNumber = row['Seat Number'] || row.seatNumber || row.seat_number;
      
      const student = students.find(s => s.roll_no === rollNo);
      const exam = exams.find(e => e.title === examTitle);
      
      if (student && exam && hallNumber && seatNumber) {
        newAllocations.push({
          student_id: student.id,
          exam_id: exam.id,
          hall_number: hallNumber.toString(),
          seat_number: seatNumber.toString()
        });
      }
    });
    
    try {
      if (newAllocations.length > 0) {
        await seatAllocationsService.bulkInsert(newAllocations);
        if (selectedExam) {
          await fetchAllocations(selectedExam);
        }
        alert(`Successfully allocated ${newAllocations.length} seats`);
      } else {
        alert('No valid seat allocation data found in the file');
      }
    } catch (error) {
      console.error('Error bulk uploading allocations:', error);
      alert('Error uploading seat allocations. Please try again.');
    }
  };

  const handleAutoAllocate = async () => {
    if (!selectedExam) {
      alert('Please select an exam first.');
      return;
    }

    try {
      const exam = exams.find(e => e.id === selectedExam);
      if (!exam) return;

      // Get students for this exam's department and class
      const eligibleStudents = students.filter(s => 
        s.department === exam.department && s.class === exam.class
      );

      if (eligibleStudents.length === 0) {
        alert('No eligible students found for this exam.');
        return;
      }

      // Check if seats are already allocated
      const existingAllocations = await seatAllocationsService.getByExam(selectedExam);
      if (existingAllocations.length > 0) {
        const confirm = window.confirm('Seats are already allocated for this exam. Do you want to clear and re-allocate?');
        if (!confirm) return;
        
        // Delete existing allocations
        for (const allocation of existingAllocations) {
          await seatAllocationsService.delete(allocation.id);
        }
      }

      // Auto-generate seat allocations
      const newAllocations = [];
      const totalSeats = exam.total_seats || 100;
      const seatsPerHall = 50; // Configurable
      
      for (let i = 0; i < eligibleStudents.length && i < totalSeats; i++) {
        const student = eligibleStudents[i];
        const hallNumber = Math.floor(i / seatsPerHall) + 1;
        const seatNumber = (i % seatsPerHall) + 1;
        
        newAllocations.push({
          student_id: student.id,
          exam_id: selectedExam,
          hall_number: `Hall-${hallNumber}`,
          seat_number: seatNumber.toString().padStart(2, '0')
        });
      }

      if (newAllocations.length > 0) {
        await seatAllocationsService.bulkInsert(newAllocations);
        await fetchAllocations(selectedExam);
        alert(`Successfully auto-allocated ${newAllocations.length} seats.`);
      }
    } catch (error) {
      console.error('Error auto-allocating seats:', error);
      alert('Error auto-allocating seats. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Seat Allocation</h1>
            <p className="text-lg text-muted-foreground">Allocate seats for examinations with precision and ease</p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleAutoAllocate}
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
            >
              <Users className="h-5 w-5 mr-2" />
              Auto Allocate
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Manual Allocate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Seat Allocation</DialogTitle>
              <DialogDescription>
                Allocate seats individually or import from file (Excel, PDF, CSV)
              </DialogDescription>
            </DialogHeader>
            <UnifiedInput
              title="Seat Allocation Management"
              description="Choose your preferred method to allocate seats"
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
                            {student.name} ({student.roll_no})
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
                            {exam.title} - {exam.subject} ({exam.date})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hallNumber">Hall Number</Label>
                      <Input
                        id="hallNumber"
                        value={formData.hallNumber}
                        onChange={(e) => setFormData({ ...formData, hallNumber: e.target.value })}
                        placeholder="e.g., A-101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seatNumber">Seat Number</Label>
                      <Input
                        id="seatNumber"
                        value={formData.seatNumber}
                        onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                        placeholder="e.g., 15"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Allocate Seat
                  </Button>
                </form>
              }
              onFileProcessed={handleBulkUpload}
              templateData="Roll Number,Exam Title,Hall Number,Seat Number\nCS2021001,Mid Semester Exam,A-101,01\nCS2021002,Mid Semester Exam,A-101,02"
              templateFilename="seat-allocation-template.csv"
            />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Seat Allocation</DialogTitle>
              <DialogDescription>
                Update seat allocation information
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
                        {student.name} ({student.roll_no})
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
                        {exam.title} - {exam.subject} ({exam.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-hallNumber">Hall Number</Label>
                  <Input
                    id="edit-hallNumber"
                    value={formData.hallNumber}
                    onChange={(e) => setFormData({ ...formData, hallNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-seatNumber">Seat Number</Label>
                  <Input
                    id="edit-seatNumber"
                    value={formData.seatNumber}
                    onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Allocation
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                Seat Allocations
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total allocations: <span className="font-semibold text-blue-600">{allocations.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedExam} onValueChange={handleExamChange}>
                <SelectTrigger className="w-64 bg-white/50 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {exam.title} - {exam.subject}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search allocations..."
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
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:bg-gradient-to-r">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Student</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Exam</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Hall</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Seat</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllocations.map((allocation, index) => (
                  <TableRow key={allocation.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {getStudentName(allocation).charAt(0)}
                        </div>
                        <span>{getStudentName(allocation)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium">{getExamTitle(allocation)}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                        {allocation.hall_number}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm font-medium">
                        {allocation.seat_number}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground">
                      {new Date(allocation.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(allocation)}
                          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(allocation.id)}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};