import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Input } from './input';
import { Upload, FileText, FileSpreadsheet, X, CheckCircle, Plus } from 'lucide-react';

export const UnifiedInput = ({
  title,
  description,
  singleEntryComponent,
  onFileProcessed,
  acceptedTypes = ['.xlsx', '.xls', '.pdf', '.csv'],
  maxSize = 10,
  templateData,
  templateFilename = 'template.csv'
}: {
  title: string;
  description: string;
  singleEntryComponent: React.ReactNode;
  onFileProcessed: (data: any[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  templateData?: string;
  templateFilename?: string;
}) => {
  const [activeTab, setActiveTab] = useState('single');
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
      
      if (fileExtension === '.csv' || fileExtension === '.xlsx' || fileExtension === '.xls') {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val));
        
        result = { success: true, data };
      } else if (fileExtension === '.pdf') {
        // For PDF, we'll simulate processing
        result = { success: true, data: [{ message: 'PDF processing - please extract data manually' }] };
      }

      if (result?.success && result.data) {
        onFileProcessed(result.data);
        setUploadStatus('success');
      } else {
        setErrorMessage('Failed to process file');
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

  const downloadTemplate = () => {
    if (!templateData) return;
    
    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (extension === 'xlsx' || extension === 'xls') return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Single Entry
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="mt-4">
            {singleEntryComponent}
          </TabsContent>
          
          <TabsContent value="bulk" className="mt-4">
            <div className="space-y-4">
              {templateData && (
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Download Template</p>
                    <p className="text-sm text-muted-foreground">
                      Use this template to format your data correctly
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              )}

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
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse w-1/2"></div>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Processing file...</p>
                    </div>
                  )}
                  
                  {uploadStatus === 'success' && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">File processed successfully!</p>
                  )}
                  
                  {uploadStatus === 'error' && (
                    <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};