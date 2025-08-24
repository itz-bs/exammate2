import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Calendar, Upload } from 'lucide-react';
import { UnifiedInput } from '@/components/ui/unified-input';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

export const ManageExams = () => {
  const [exams, setExams] = useState(localStorage.getExams());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    department: '',
    class: '',
    venue: '',
    totalSeats: '',
    type: 'regular'
  });

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      const updatedExams = exams.map(exam =>
        exam.id === editingExam.id ? { 
          ...exam, 
          ...formData,
          duration: parseInt(formData.duration),
          totalSeats: parseInt(formData.totalSeats),
          occupiedSeats: exam.occupiedSeats || 0
        } : exam
      );
      localStorage.setExams(updatedExams);
      setExams(updatedExams);
    } else {
      const newExam = {
        id: generateId(),
        ...formData,
        duration: parseInt(formData.duration),
        totalSeats: parseInt(formData.totalSeats),
        occupiedSeats: 0,
        status: 'scheduled'
      };
      const updatedExams = [...exams, newExam];
      localStorage.setExams(updatedExams);
      setExams(updatedExams);
    }
    
    resetForm();
  };

  const handleEdit = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subject: exam.subject,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration.toString(),
      department: exam.department,
      class: exam.class,
      venue: exam.venue,
      totalSeats: exam.totalSeats.toString(),
      type: exam.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (examId: string) => {
    const updatedExams = exams.filter(exam => exam.id !== examId);
    localStorage.setExams(updatedExams);
    setExams(updatedExams);
  };

  const resetForm = () => {
    setFormData({
      title: '', subject: '', date: '', startTime: '', endTime: '',
      duration: '', department: '', class: '', venue: '', totalSeats: '', type: 'regular'
    });
    setEditingExam(null);
    setIsDialogOpen(false);
  };

  const handleBulkUpload = (data: any[]) => {
    const newExams = data.map(row => ({
      id: generateId(),
      title: row.Title || row.title || '',
      subject: row.Subject || row.subject || '',
      date: row.Date || row.date || '',
      startTime: row['Start Time'] || row.startTime || row.start_time || '',
      endTime: row['End Time'] || row.endTime || row.end_time || '',
      duration: parseInt(row.Duration || row.duration || '180'),
      department: row.Department || row.department || '',
      class: row.Class || row.class || '',
      venue: row.Venue || row.venue || '',
      totalSeats: parseInt(row['Total Seats'] || row.totalSeats || row.total_seats || '100'),
      occupiedSeats: 0,
      status: 'scheduled',
      type: row.Type || row.type || 'regular'
    })).filter(exam => exam.title && exam.subject && exam.date);
    
    if (newExams.length > 0) {
      const updatedExams = [...exams, ...newExams];
      localStorage.setExams(updatedExams);
      setExams(updatedExams);
      alert(`Successfully imported ${newExams.length} exams`);
    } else {
      alert('No valid exam data found in the file');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      scheduled: 'default',
      ongoing: 'secondary',
      completed: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Exams</h1>
            <p className="text-lg text-muted-foreground">Schedule and manage examination details with precision</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Exams
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Exams</DialogTitle>
              <DialogDescription>
                Add exams individually or import from file (Excel, PDF, CSV)
              </DialogDescription>
            </DialogHeader>
            <UnifiedInput
              title="Exam Management"
              description="Choose your preferred method to add exams"
              singleEntryComponent={
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Input
                        id="class"
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalSeats">Total Seats</Label>
                      <Input
                        id="totalSeats"
                        type="number"
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exam
                  </Button>
                </form>
              }
              onFileProcessed={handleBulkUpload}
              templateData="Title,Subject,Date,Start Time,End Time,Duration,Department,Class,Venue,Total Seats\nMid Semester Exam,Data Structures,2024-01-15,09:00,12:00,180,Computer Science,Third Year,Hall A-101,100\nEnd Semester Exam,Computer Networks,2024-01-18,14:00,17:00,180,Computer Science,Third Year,Hall B-205,120"
              templateFilename="exams-template.csv"
            />
          </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Exam</DialogTitle>
              <DialogDescription>
                Update exam information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Exam Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Input
                    id="edit-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-venue">Venue</Label>
                  <Input
                    id="edit-venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Input
                    id="edit-class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-totalSeats">Total Seats</Label>
                  <Input
                    id="edit-totalSeats"
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Exam
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
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                Exams Schedule
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total exams: <span className="font-semibold text-blue-600">{exams.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search exams..."
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
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {filteredExams.map((exam, index) => (
                  <TableRow key={exam.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {exam.title.charAt(0)}
                        </div>
                        <span>{exam.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{exam.subject}</TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">
                        <div className="font-medium">{exam.date}</div>
                        <div className="text-muted-foreground">{exam.startTime} - {exam.endTime}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{exam.department}</TableCell>
                    <TableCell className="py-4">{exam.venue}</TableCell>
                    <TableCell className="py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                        {exam.occupiedSeats}/{exam.totalSeats}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(exam.status)}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(exam)}
                          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(exam.id)}
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