import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

export const StudentSeatAllocation = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [allocations, setAllocations] = useState<any[]>([]);
  
  useEffect(() => {
    const stored = window.localStorage.getItem('seatAllocations');
    setAllocations(stored ? JSON.parse(stored) : []);
  }, []);

  const studentAllocations = allocations.filter((allocation: any) => allocation.studentId === user?.id);
  const exams = localStorage.getExams();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getExamDetails = (examId: string) => {
    return exams.find(exam => exam.id === examId);
  };

  const isAllocationVisible = (examId: string) => {
    const exam = getExamDetails(examId);
    if (!exam) return false;
    
    const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
    const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
    
    return currentTime >= threeHoursBefore;
  };

  const getTimeUntilVisible = (examId: string) => {
    const exam = getExamDetails(examId);
    if (!exam) return null;
    
    const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
    const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
    const timeUntilVisible = threeHoursBefore.getTime() - currentTime.getTime();
    
    if (timeUntilVisible <= 0) return null;
    
    const hoursLeft = Math.floor(timeUntilVisible / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeUntilVisible % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hoursLeft, minutesLeft };
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Seat Allocation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">View your examination seat assignments and important details</p>
        </div>
      </div>

      <div className="grid gap-6">
        {studentAllocations.length === 0 ? (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="pt-12 pb-12">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mb-6">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Seat Allocations</h3>
                <p className="text-muted-foreground text-lg">
                  Your seat allocations haven't been assigned yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          studentAllocations.map((allocation: any) => {
            const exam = getExamDetails(allocation.examId);
            if (!exam) return null;

            const isVisible = isAllocationVisible(allocation.examId);
            const timeUntil = getTimeUntilVisible(allocation.examId);

            return (
              <Card key={allocation.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                        {exam.subject}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={isVisible ? "secondary" : "outline"} 
                      className={`px-4 py-2 text-sm font-semibold ${isVisible ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                    >
                      {isVisible ? "Available" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <div className="p-2 rounded-lg bg-blue-500">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Exam Date & Time</p>
                          <p className="text-base font-medium">
                            {exam.date} | {exam.startTime} - {exam.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                        <div className="p-2 rounded-lg bg-purple-500">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Venue</p>
                          <p className="text-base font-medium">
                            {exam.venue}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {isVisible ? (
                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-500">
                              <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-green-700 dark:text-green-300">Seat Assignment</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                              <p className="text-sm text-muted-foreground mb-1">Hall</p>
                              <p className="text-xl font-bold text-green-600">{allocation.hallNumber}</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                              <p className="text-sm text-muted-foreground mb-1">Seat</p>
                              <p className="text-xl font-bold text-green-600">{allocation.seatNumber}</p>
                            </div>
                          </div>
                        </div>
                      ) : timeUntil ? (
                        <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-yellow-500">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">Seat Assignment</span>
                          </div>
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-yellow-600 mb-2">
                              {timeUntil.hoursLeft}h {timeUntil.minutesLeft}m
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Available in (3 hours before exam)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-500">
                              <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">Seat Assignment</span>
                          </div>
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <p className="text-base text-blue-700 dark:text-blue-300 font-medium">
                              Assignment available 3 hours before exam
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-lg">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Important Instructions
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Timing:</strong> Seat assignments are revealed 3 hours before the exam start time.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Arrival:</strong> Please arrive at the examination venue 30 minutes before the scheduled time.</span>
                        </li>
                      </ul>
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