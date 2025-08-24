import { Exam } from '@/types';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

class ExamService {
  async getExams(): Promise<Exam[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return localStorage.getExams();
  }

  async createExam(examData: Partial<Exam>): Promise<Exam> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exams = localStorage.getExams();
    const newExam: Exam = {
      id: generateId(),
      title: examData.title || '',
      subject: examData.subject || '',
      date: examData.date || '',
      startTime: examData.startTime || '',
      endTime: examData.endTime || '',
      duration: examData.duration || 0,
      department: examData.department || '',
      class: examData.class || '',
      type: examData.type || 'regular',
      venue: examData.venue,
      totalSeats: examData.totalSeats,
      occupiedSeats: 0,
      status: 'scheduled',
    };
    
    exams.push(newExam);
    localStorage.setExams(exams);
    
    return newExam;
  }

  async updateExam(id: string, examData: Partial<Exam>): Promise<Exam> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exams = localStorage.getExams();
    const examIndex = exams.findIndex((e: Exam) => e.id === id);
    
    if (examIndex === -1) {
      throw new Error('Exam not found');
    }
    
    const updatedExam = { ...exams[examIndex], ...examData };
    exams[examIndex] = updatedExam;
    localStorage.setExams(exams);
    
    return updatedExam;
  }

  async deleteExam(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exams = localStorage.getExams();
    const filteredExams = exams.filter((e: Exam) => e.id !== id);
    localStorage.setExams(filteredExams);
  }
}

export const examService = new ExamService();