import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent } from './card';
import { Upload, FileText, FileSpreadsheet, X, CheckCircle } from 'lucide-react';
import { processExcelFile, processPDFFile, uploadFileToSupabase } from '@/services/fileProcessingService';

interface FileUploadProps {
  onFileProcessed: (data: any[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  title?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileProcessed,
  acceptedTypes = ['.xlsx', '.xls', '.pdf', '.csv'],
  maxSize = 10,
  title = 'Upload File',
  description = 'Upload Excel, PDF, or CSV files'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setErrorMessage(`File size must be less than ${maxSize}MB`);
      setUploadStatus('error');
      return;
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setErrorMessage(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setUploadedFile(file);
    setErrorMessage('');

    try {
      let result;
      
      if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        result = await processExcelFile(file);
      } else if (fileExtension === '.pdf') {
        result = await processPDFFile(file);
      } else if (fileExtension === '.csv') {
        // Handle CSV files
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
        });
        result = { success: true, data };
      }

      if (result?.success && result.data) {
        onFileProcessed(result.data);
        setUploadStatus('success');
      } else {
        setErrorMessage(result?.error || 'Failed to process file');
        setUploadStatus('error');
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing the file');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (extension === 'xlsx' || extension === 'xls') return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">{title}</Label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {dragActive ? 'Drop file here' : 'Drag and drop file here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: {acceptedTypes.join(', ')} (max {maxSize}MB)
                </p>
              </div>
              <Input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile.name)}
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadStatus === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {uploading && (
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse w-1/2"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Processing file...</p>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <p className="text-sm text-green-600 mt-2">File processed successfully!</p>
              )}
              
              {uploadStatus === 'error' && (
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};