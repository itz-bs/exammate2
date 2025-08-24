import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { FileUpload } from './file-upload';
import { Edit, Upload } from 'lucide-react';

interface DualInputProps {
  title: string;
  description: string;
  manualComponent: React.ReactNode;
  onFileProcessed: (data: any[]) => void;
  acceptedTypes?: string[];
  fileDescription?: string;
}

export const DualInput: React.FC<DualInputProps> = ({
  title,
  description,
  manualComponent,
  onFileProcessed,
  acceptedTypes = ['.xlsx', '.xls', '.pdf', '.csv'],
  fileDescription = 'Upload Excel, PDF, or CSV files for bulk import'
}) => {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-4">
            {manualComponent}
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <FileUpload
              onFileProcessed={onFileProcessed}
              acceptedTypes={acceptedTypes}
              title="Bulk Import"
              description={fileDescription}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};