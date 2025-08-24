import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, Calendar, MapPin, User, Eye, Printer, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';
import { getStudentSeatAllocation, isAllocationVisibleForStudent } from '@/utils/seatAllocation';
import { generateOfficialHallTicket } from '@/utils/hallTicketTemplate';

export const StudentHallTicket = () => {
  const { user } = useAuth();
  const [previewTicket, setPreviewTicket] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get hall tickets for this student
  const hallTickets = JSON.parse(window.localStorage.getItem('hallTickets') || '[]');
  const studentTickets = hallTickets.filter((ticket: any) => ticket.studentId === user?.id);
  
  const exams = localStorage.getExams();

  // Update current time every minute to check seat allocation visibility
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getExamDetails = (examId: string) => {
    return exams.find(exam => exam.id === examId);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      generated: 'default',
      issued: 'secondary',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };



  const handlePreview = (ticket: any) => {
    setPreviewTicket(ticket);
  };

  const handlePrint = (ticket: any) => {
    const exam = getExamDetails(ticket.examId);
    if (!exam || !user) return;

    const htmlContent = generateOfficialHallTicket(ticket, exam, user);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleDownload = (ticket: any) => {
    const exam = getExamDetails(ticket.examId);
    if (!exam || !user) return;

    const htmlContent = generateOfficialHallTicket(ticket, exam, user);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `official-hall-ticket-${user.rollNo}-${exam.subject}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Hall Ticket</h1>
        <p className="text-muted-foreground">Download your examination hall tickets</p>
      </div>

      <div className="grid gap-4">
        {studentTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Hall Tickets Available</h3>
                <p className="text-muted-foreground">
                  Your hall tickets haven't been generated yet. Please contact the administration.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          studentTickets.map((ticket: any) => {
            const exam = getExamDetails(ticket.examId);
            if (!exam) return null;

            return (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium">
                        {exam.subject}
                      </CardDescription>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Student Details</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.name} ({user?.rollNo})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Exam Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.date} | {exam.startTime} - {exam.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Venue Details</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.venue}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  {/* Seat Allocation Display */}
                  {(() => {
                    const seatAllocation = getStudentSeatAllocation(user?.id || '', ticket.examId);
                    const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
                    const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
                    const isVisible = isAllocationVisibleForStudent(ticket.examId);
                    
                    if (seatAllocation && isVisible) {
                      return (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Seat Allocation</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Hall:</span> {seatAllocation.hallNumber}
                            </div>
                            <div>
                              <span className="font-medium">Seat:</span> {seatAllocation.seatNumber}
                            </div>
                          </div>
                        </div>
                      );
                    } else if (currentTime < threeHoursBefore) {
                      const timeUntilVisible = threeHoursBefore.getTime() - currentTime.getTime();
                      const hoursLeft = Math.floor(timeUntilVisible / (1000 * 60 * 60));
                      const minutesLeft = Math.floor((timeUntilVisible % (1000 * 60 * 60)) / (1000 * 60));
                      
                      return (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-600">Seat Allocation</span>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Available in {hoursLeft}h {minutesLeft}m (3 hours before exam)
                          </p>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Generated: {new Date(ticket.generatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePreview(ticket)}
                              disabled={ticket.status === 'cancelled'}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Hall Ticket Preview</DialogTitle>
                            </DialogHeader>
                            {previewTicket && (() => {
                              const exam = getExamDetails(previewTicket.examId);
                              if (!exam || !user) return null;
                              
                              return (
                                <div className="border rounded p-4 bg-white text-black max-h-96 overflow-y-auto">
                                  <div className="space-y-4">
                                    <div className="text-center border-b pb-4">
                                      <h2 className="text-xl font-bold">HALL TICKET</h2>
                                      <p className="text-sm text-gray-600">{exam.title}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-semibold">Student Name:</p>
                                        <p className="text-sm">{user.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Roll Number:</p>
                                        <p className="text-sm">{user.rollNo}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Subject:</p>
                                        <p className="text-sm">{exam.subject}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Date:</p>
                                        <p className="text-sm">{exam.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Time:</p>
                                        <p className="text-sm">{exam.startTime} - {exam.endTime}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Duration:</p>
                                        <p className="text-sm">{exam.duration} minutes</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">Venue:</p>
                                        <p className="text-sm">{exam.venue}</p>
                                      </div>

                                    </div>
                                    
                                    <div className="border-t pt-4 text-xs text-gray-500">
                                      <p>• Bring this hall ticket to the examination hall</p>
                                      <p>• Arrive 30 minutes before the exam starts</p>
                                      <p>• Carry a valid ID proof</p>
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
                          onClick={() => handlePrint(ticket)}
                          disabled={ticket.status === 'cancelled'}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleDownload(ticket)}
                          disabled={ticket.status === 'cancelled'}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};