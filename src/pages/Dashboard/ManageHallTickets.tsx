import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, FileText, Download, Eye } from 'lucide-react';
import { UnifiedInput } from '@/components/ui/unified-input';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';
import { generateOfficialHallTicket } from '@/utils/hallTicketTemplate';

interface HallTicket {
  id: string;
  studentId: string;
  examId: string;
  seatNumber: string;
  hallNumber: string;
  status: 'generated' | 'issued' | 'cancelled';
  generatedAt: string;
  studentPhoto?: string;
}

export const ManageHallTickets = () => {
  const [hallTickets, setHallTickets] = useState<HallTicket[]>(() => {
    const stored = window.localStorage.getItem('hallTickets');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<HallTicket | null>(null);
  const [formData, setFormData] = useState<{
    studentId: string;
    examId: string;
    seatNumber: string;
    hallNumber: string;
    status: 'generated' | 'issued' | 'cancelled';
    studentPhoto: string;
  }>({
    studentId: '',
    examId: '',
    seatNumber: '',
    hallNumber: '',
    status: 'generated',
    studentPhoto: ''
  });
  const [_photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewTicket, setPreviewTicket] = useState<HallTicket | null>(null);

  const students = localStorage.getUsers().filter(u => u.role === 'student');
  const exams = localStorage.getExams();

  const saveHallTickets = (tickets: HallTicket[]) => {
    window.localStorage.setItem('hallTickets', JSON.stringify(tickets));
    setHallTickets(tickets);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.rollNo})` : 'Unknown Student';
  };

  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? `${exam.title} - ${exam.subject}` : 'Unknown Exam';
  };

  const filteredTickets = hallTickets.filter(ticket => {
    const studentName = getStudentName(ticket.studentId).toLowerCase();
    const examTitle = getExamTitle(ticket.examId).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return studentName.includes(search) || 
           examTitle.includes(search) || 
           ticket.seatNumber.toLowerCase().includes(search) ||
           ticket.hallNumber.toLowerCase().includes(search);
  });

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData({ ...formData, studentPhoto: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (editingTicket) {
      const updatedTickets = hallTickets.map(ticket =>
        ticket.id === editingTicket.id ? { ...ticket, ...formData } : ticket
      );
      saveHallTickets(updatedTickets);
    } else {
      const newTicket: HallTicket = {
        id: generateId(),
        ...formData,
        generatedAt: new Date().toISOString()
      };
      saveHallTickets([...hallTickets, newTicket]);
    }
    
    resetForm();
  };

  const handleEdit = (ticket: HallTicket) => {
    setEditingTicket(ticket);
    setFormData({
      studentId: ticket.studentId,
      examId: ticket.examId,
      seatNumber: ticket.seatNumber,
      hallNumber: ticket.hallNumber,
      status: ticket.status,
      studentPhoto: ticket.studentPhoto || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ticketId: string) => {
    const updatedTickets = hallTickets.filter(ticket => ticket.id !== ticketId);
    saveHallTickets(updatedTickets);
  };

  const resetForm = () => {
    setFormData({ studentId: '', examId: '', seatNumber: '', hallNumber: '', status: 'generated', studentPhoto: '' });
    setEditingTicket(null);
    setIsDialogOpen(false);
    setPhotoFile(null);
  };

  const handleBulkUpload = (data: any[]) => {
    const newTickets: HallTicket[] = [];
    
    data.forEach(row => {
      const rollNo = row['Roll Number'] || row.rollNo || row.roll_no;
      const examTitle = row['Exam Title'] || row.examTitle || row.exam_title;
      const hallNumber = row['Hall Number'] || row.hallNumber || row.hall_number;
      const seatNumber = row['Seat Number'] || row.seatNumber || row.seat_number;
      
      const student = students.find(s => s.rollNo === rollNo);
      const exam = exams.find(e => e.title === examTitle);
      
      if (student && exam && hallNumber && seatNumber) {
        newTickets.push({
          id: generateId(),
          studentId: student.id,
          examId: exam.id,
          seatNumber: seatNumber.toString(),
          hallNumber: hallNumber.toString(),
          status: 'generated',
          generatedAt: new Date().toISOString()
        });
      }
    });
    
    if (newTickets.length > 0) {
      saveHallTickets([...hallTickets, ...newTickets]);
      alert(`Successfully generated ${newTickets.length} hall tickets`);
    } else {
      alert('No valid hall ticket data found in the file');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      generated: 'default',
      issued: 'secondary',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const handlePreview = (ticket: HallTicket) => {
    setPreviewTicket(ticket);
  };

  const handleDownload = (ticket: HallTicket) => {
    const student = students.find(s => s.id === ticket.studentId);
    const exam = exams.find(e => e.id === ticket.examId);
    
    if (!student || !exam) return;

    const hallTicketHTML = generateOfficialHallTicket(ticket, exam, student);
    const blob = new Blob([hallTicketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `official-hall-ticket-${student.rollNo}-${exam.subject}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Hall Tickets</h1>
            <p className="text-lg text-muted-foreground">Generate and manage student hall tickets efficiently</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Generate Hall Tickets
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Generate Hall Tickets</DialogTitle>
                <DialogDescription>
                  Generate hall tickets individually or in bulk from file (Excel, PDF, CSV)
                </DialogDescription>
              </DialogHeader>
              <UnifiedInput
                title="Hall Ticket Generation"
                description="Choose your preferred method to generate hall tickets"
                singleEntryComponent={
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Click below to generate a single hall ticket with student photo and seat details.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Single Hall Ticket
                    </Button>
                  </div>
                }
                onFileProcessed={handleBulkUpload}
                templateData="Roll Number,Exam Title,Hall Number,Seat Number\nCS2021001,Mid Semester Exam,A-101,01\nCS2021002,Mid Semester Exam,A-101,02"
                templateFilename="hall-tickets-template.csv"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTicket ? 'Edit Hall Ticket' : 'Generate New Hall Ticket'}</DialogTitle>
              <DialogDescription>
                {editingTicket ? 'Update hall ticket information' : 'Select student and exam to generate hall ticket'}
              </DialogDescription>
            </DialogHeader>
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'generated' | 'issued' | 'cancelled') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generated">Generated</SelectItem>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Student Photo (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoFile(file);
                        handlePhotoUpload(file);
                      }
                    }}
                  />
                </div>
                {formData.studentPhoto && (
                  <div className="mt-2">
                    <img 
                      src={formData.studentPhoto} 
                      alt="Student photo" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTicket ? 'Update' : 'Generate'} Hall Ticket
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
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Hall Tickets
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total hall tickets: <span className="font-semibold text-blue-600">{hallTickets.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search hall tickets..."
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
                  <TableHead>Exam</TableHead>
                  <TableHead>Hall & Seat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {getStudentName(ticket.studentId)}
                  </TableCell>
                  <TableCell>{getExamTitle(ticket.examId)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Hall: {ticket.hallNumber}</div>
                      <div className="text-muted-foreground">Seat: {ticket.seatNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    {new Date(ticket.generatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(ticket)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Hall Ticket Preview</DialogTitle>
                          </DialogHeader>
                          {previewTicket && (() => {
                            const student = students.find(s => s.id === previewTicket.studentId);
                            const exam = exams.find(e => e.id === previewTicket.examId);
                            const collegeSettings = localStorage.getCollegeSettings();
                            
                            if (!student || !exam) return null;
                            
                            return (
                              <div className="border rounded p-6 bg-white text-black max-h-96 overflow-y-auto">
                                <div className="space-y-6">
                                  <div className="text-center border-b pb-4">
                                    <h1 className="text-2xl font-bold">{collegeSettings.name}</h1>
                                    <p className="text-sm">{collegeSettings.address}</p>
                                    <p className="text-sm">Phone: {collegeSettings.phone} | Email: {collegeSettings.email}</p>
                                    <h2 className="text-xl font-bold mt-4">HALL TICKET</h2>
                                    <p className="text-lg font-semibold">{exam.title}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm font-semibold">Student Name:</p>
                                        <p className="text-base">{student.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Roll Number:</p>
                                        <p className="text-base">{student.rollNo}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Department:</p>
                                        <p className="text-base">{student.department}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Class:</p>
                                        <p className="text-base">{student.class}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm font-semibold">Subject:</p>
                                        <p className="text-base">{exam.subject}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Date:</p>
                                        <p className="text-base">{exam.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Time:</p>
                                        <p className="text-base">{exam.startTime} - {exam.endTime}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Duration:</p>
                                        <p className="text-base">{exam.duration} minutes</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm font-semibold">Venue:</p>
                                    <p className="text-base">{exam.venue}</p>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Instructions:</h3>
                                    <ul className="text-xs space-y-1 text-gray-600">
                                      <li>• Bring this hall ticket to the examination hall</li>
                                      <li>• Arrive 30 minutes before the exam starts</li>
                                      <li>• Carry a valid ID proof (Student ID/Aadhar Card)</li>
                                      <li>• Mobile phones are strictly prohibited</li>
                                      <li>• Use only blue/black pen for writing</li>
                                    </ul>
                                  </div>
                                  
                                  <div className="flex justify-between items-end pt-4 border-t">
                                    <div>
                                      <p className="text-xs">Generated: {new Date(previewTicket.generatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="border-t border-black w-32 mb-1"></div>
                                      <p className="text-xs">Principal Signature</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(ticket)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ticket)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ticket.id)}
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