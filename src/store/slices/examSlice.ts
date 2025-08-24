import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Exam } from '@/types';
import { examService } from '@/services/examService';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  currentExam: null,
  isLoading: false,
  error: null,
};

export const fetchExams = createAsyncThunk('exams/fetchExams', async () => {
  const response = await examService.getExams();
  return response;
});

export const createExam = createAsyncThunk('exams/createExam', async (examData: Partial<Exam>) => {
  const response = await examService.createExam(examData);
  return response;
});

export const updateExam = createAsyncThunk('exams/updateExam', async ({ id, data }: { id: string; data: Partial<Exam> }) => {
  const response = await examService.updateExam(id, data);
  return response;
});

export const deleteExam = createAsyncThunk('exams/deleteExam', async (id: string) => {
  await examService.deleteExam(id);
  return id;
});

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exams
      .addCase(fetchExams.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch exams';
      })
      // Create exam
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      // Update exam
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex(exam => exam.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      // Delete exam
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter(exam => exam.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentExam } = examSlice.actions;
export default examSlice.reducer;