import { supabase } from '../lib/supabase';

// Students Service
export const studentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(student: any) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async bulkInsert(students: any[]) {
    const { data, error } = await supabase
      .from('students')
      .insert(students)
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Exams Service
export const examsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(exam: any) {
    const { data, error } = await supabase
      .from('exams')
      .insert(exam)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Results Service
export const resultsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        student:students(name, roll_no),
        exam:exams(title, subject)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(result: any) {
    const { data, error } = await supabase
      .from('results')
      .insert(result)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async bulkInsert(results: any[]) {
    const { data, error } = await supabase
      .from('results')
      .insert(results)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        exam:exams(title, subject, date)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Hall Tickets Service
export const hallTicketsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('hall_tickets')
      .select(`
        *,
        student:students(name, roll_no),
        exam:exams(title, subject, date, start_time, venue)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(ticket: any) {
    const { data, error } = await supabase
      .from('hall_tickets')
      .insert(ticket)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('hall_tickets')
      .select(`
        *,
        exam:exams(title, subject, date, start_time, end_time, venue, duration)
      `)
      .eq('student_id', studentId)
      .eq('status', 'issued')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Notifications Service
export const notificationsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(notification: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByRole(role: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`target_role.eq.all,target_role.eq.${role}`)
      .eq('status', 'sent')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markAsSent(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Seat Allocations Service
export const seatAllocationsService = {
  async getByExam(examId: string) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .select(`
        *,
        student:students(name, roll_no),
        exam:exams(title, subject)
      `)
      .eq('exam_id', examId)
      .order('seat_number');
    
    if (error) throw error;
    return data;
  },

  async create(allocation: any) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .insert(allocation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('seat_allocations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async bulkInsert(allocations: any[]) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .insert(allocations)
      .select();
    
    if (error) throw error;
    return data;
  },

  async makeVisible(examId: string) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .update({ is_visible: true })
      .eq('exam_id', examId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getStudentAllocation(studentId: string, examId: string) {
    const { data, error } = await supabase
      .from('seat_allocations')
      .select('*')
      .eq('student_id', studentId)
      .eq('exam_id', examId)
      .eq('is_visible', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};