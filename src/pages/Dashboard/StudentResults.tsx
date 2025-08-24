import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

export const StudentResults = () => {
  const { user } = useAuth();
  
  const [results, setResults] = useState<any[]>([]);
  
  useEffect(() => {
    const stored = window.localStorage.getItem('examResults');
    setResults(stored ? JSON.parse(stored) : []);
  }, []);
  const studentResults = results.filter((result: any) => result.studentId === user?.id);
  const exams = localStorage.getExams();

  const getExamDetails = (examId: string) => {
    return exams.find(exam => exam.id === examId);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pass: 'secondary',
      fail: 'destructive',
      absent: 'outline'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const calculateStats = () => {
    const passedExams = studentResults.filter((r: any) => r.status === 'pass').length;
    const totalExams = studentResults.length;
    const averageMarks = studentResults.length > 0 
      ? studentResults.reduce((sum: number, r: any) => sum + (r.marks / r.totalMarks * 100), 0) / studentResults.length
      : 0;
    
    return { passedExams, totalExams, averageMarks };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Results</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">View your examination results and performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Exams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passed Exams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.passedExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.averageMarks.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="grid gap-4">
        {studentResults.length === 0 ? (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="pt-12 pb-12">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mb-6">
                  <BarChart3 className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Results Available</h3>
                <p className="text-muted-foreground text-lg">Your exam results haven't been published yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          studentResults.map((result: any) => {
            const exam = getExamDetails(result.examId);
            if (!exam) return null;

            const percentage = (result.marks / result.totalMarks * 100).toFixed(1);

            return (
              <Card key={result.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600 dark:text-blue-400">{exam.subject}</CardDescription>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Marks Obtained</p>
                      <p className="text-2xl font-bold">{result.marks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Marks</p>
                      <p className="text-2xl font-bold">{result.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Percentage</p>
                      <p className="text-2xl font-bold">{percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grade</p>
                      <p className="text-2xl font-bold">{result.grade}</p>
                    </div>
                  </div>
                  {result.remarks && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">Remarks</p>
                      <p className="text-sm text-muted-foreground">{result.remarks}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};