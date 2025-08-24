import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';
import { checkAndUpdateSeatVisibility, getStudentSeatAllocation } from '@/utils/seatAllocation';

export const StudentExams: React.FC = () => {
  const { user } = useAuth();
  const exams = localStorage.getExams();
  
  // Filter exams for the student's department and class
  const studentExams = exams.filter(exam => 
    exam.department === user?.department && exam.class === user?.class
  );

  useEffect(() => {
    // Check and update seat visibility on component mount
    checkAndUpdateSeatVisibility();
    
    // Set up interval to check every minute
    const interval = setInterval(checkAndUpdateSeatVisibility, 60000);
    
    return () => clearInterval(interval);
  }, []);

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Exams</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">View your scheduled examinations and important details</p>
        </div>
      </div>

      <div className="grid gap-4">
        {studentExams.length === 0 ? (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="pt-12 pb-12">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mb-6">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Exams Scheduled</h3>
                <p className="text-muted-foreground text-lg">No exams are currently scheduled for your class.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          studentExams.map((exam) => (
            <Card key={exam.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-emerald-600 dark:text-emerald-400">{exam.subject}</CardDescription>
                  </div>
                  {getStatusBadge(exam.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="p-2 rounded-lg bg-blue-500">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Date</p>
                      <p className="text-base font-medium">{exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <div className="p-2 rounded-lg bg-purple-500">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Time</p>
                      <p className="text-base font-medium">
                        {exam.startTime} - {exam.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="p-2 rounded-lg bg-green-500">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">Venue</p>
                      <p className="text-base font-medium">{exam.venue}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Duration: {exam.duration} minutes</span>
                    <span>Seats: {exam.occupiedSeats}/{exam.totalSeats}</span>
                  </div>
                  
                  {/* Seat Allocation Display */}
                  {(() => {
                    const seatAllocation = getStudentSeatAllocation(user?.id || '', exam.id);
                    const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
                    const now = new Date();
                    const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
                    
                    if (seatAllocation && now >= threeHoursBefore) {
                      return (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
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
                    } else if (now < threeHoursBefore) {
                      const timeUntilVisible = threeHoursBefore.getTime() - now.getTime();
                      const hoursLeft = Math.floor(timeUntilVisible / (1000 * 60 * 60));
                      const minutesLeft = Math.floor((timeUntilVisible % (1000 * 60 * 60)) / (1000 * 60));
                      
                      return (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};