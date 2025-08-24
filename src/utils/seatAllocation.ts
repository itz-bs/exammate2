import { localStorage } from './localStorage';
import { generateId } from './helpers';

interface SeatAllocation {
  id: string;
  examId: string;
  studentId: string;
  hallNumber: string;
  seatNumber: string;
  allocatedAt: string;
  isVisible: boolean;
}

export const generateSeatAllocations = (examId: string) => {
  const exam = localStorage.getExams().find(e => e.id === examId);
  if (!exam) return;

  const students = localStorage.getUsers().filter(u => 
    u.role === 'student' && 
    u.department === exam.department && 
    u.class === exam.class
  );

  const existingAllocations = JSON.parse(localStorage.getItem('seatAllocations') || '[]');
  const examAllocations = existingAllocations.filter((a: SeatAllocation) => a.examId === examId);
  
  if (examAllocations.length > 0) return; // Already allocated

  const allocations: SeatAllocation[] = [];
  const seatsPerHall = 50; // Configurable
  const totalHalls = Math.ceil(students.length / seatsPerHall);

  // Shuffle students for random allocation
  const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

  shuffledStudents.forEach((student, index) => {
    const hallNumber = `${exam.venue}-${Math.floor(index / seatsPerHall) + 1}`;
    const seatNumber = (index % seatsPerHall) + 1;

    allocations.push({
      id: generateId(),
      examId,
      studentId: student.id,
      hallNumber,
      seatNumber: seatNumber.toString().padStart(2, '0'),
      allocatedAt: new Date().toISOString(),
      isVisible: false
    });
  });

  const updatedAllocations = [...existingAllocations, ...allocations];
  localStorage.setItem('seatAllocations', JSON.stringify(updatedAllocations));
  
  return allocations;
};

export const makeSeatAllocationsVisible = (examId: string) => {
  const allocations = JSON.parse(localStorage.getItem('seatAllocations') || '[]');
  const updatedAllocations = allocations.map((allocation: SeatAllocation) => 
    allocation.examId === examId 
      ? { ...allocation, isVisible: true }
      : allocation
  );
  
  localStorage.setItem('seatAllocations', JSON.stringify(updatedAllocations));
};

export const checkAndUpdateSeatVisibility = () => {
  const exams = localStorage.getExams();
  const now = new Date();
  
  exams.forEach(exam => {
    const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
    const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
    
    // Only make visible exactly 3 hours before exam
    if (now >= threeHoursBefore && now < examDateTime) {
      // Generate allocations if not exists
      generateSeatAllocations(exam.id);
      // Make visible 3 hours before
      makeSeatAllocationsVisible(exam.id);
    }
  });
};

export const isAllocationVisibleForStudent = (examId: string): boolean => {
  const exam = localStorage.getExams().find(e => e.id === examId);
  if (!exam) return false;
  
  const now = new Date();
  const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
  const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
  
  return now >= threeHoursBefore && now < examDateTime;
};

export const getStudentSeatAllocation = (studentId: string, examId: string) => {
  // Check if allocation should be visible for this specific exam
  if (!isAllocationVisibleForStudent(examId)) {
    return null;
  }
  
  const allocations = JSON.parse(localStorage.getItem('seatAllocations') || '[]');
  return allocations.find((a: SeatAllocation) => 
    a.studentId === studentId && a.examId === examId && a.isVisible
  );
};

export const getAllSeatAllocations = (examId: string) => {
  const allocations = JSON.parse(localStorage.getItem('seatAllocations') || '[]');
  return allocations.filter((a: SeatAllocation) => a.examId === examId);
};