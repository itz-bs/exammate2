import { supabase } from '../lib/supabase';

export interface FileUploadResult {
  success: boolean;
  data?: any[];
  error?: string;
}

export const processExcelFile = async (file: File): Promise<FileUploadResult> => {
  try {
    // For now, we'll handle CSV-like processing for Excel files
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj;
    }).filter(row => Object.values(row).some(val => val));
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to process Excel file' };
  }
};

export const processPDFFile = async (file: File): Promise<FileUploadResult> => {
  try {
    // For PDF processing, we'll use a simple text extraction approach
    // In production, you'd use libraries like pdf-parse or pdf2pic
    const formData = new FormData();
    formData.append('file', file);
    
    // Mock PDF processing - in real implementation, use PDF parsing library
    return { success: true, data: [{ message: 'PDF processing not fully implemented in demo' }] };
  } catch (error) {
    return { success: false, error: 'Failed to process PDF file' };
  }
};

export const uploadFileToSupabase = async (file: File, bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getFileUrl = async (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    return null;
  }
};