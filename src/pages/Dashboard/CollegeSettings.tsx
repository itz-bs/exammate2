import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, Building, FileImage, Signature } from 'lucide-react';
import { localStorage } from '@/utils/localStorage';

interface CollegeSettings {
  collegeName: string;
  collegeAddress: string;
  collegePhone: string;
  collegeEmail: string;
  collegeLogo: string;
  collegeSeal: string;
  principalName: string;
  principalSignature: string;
  affiliatedUniversity: string;
  collegeCode: string;
}

export const CollegeSettings = () => {
  const [settings, setSettings] = useState<CollegeSettings>(() => {
    const stored = window.localStorage.getItem('collegeSettings');
    return stored ? JSON.parse(stored) : {
      collegeName: '',
      collegeAddress: '',
      collegePhone: '',
      collegeEmail: '',
      collegeLogo: '',
      collegeSeal: '',
      principalName: '',
      principalSignature: '',
      affiliatedUniversity: '',
      collegeCode: ''
    };
  });

  const handleInputChange = (field: keyof CollegeSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof CollegeSettings, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSettings(prev => ({ ...prev, [field]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    window.localStorage.setItem('collegeSettings', JSON.stringify(settings));
    alert('College settings saved successfully!');
  };

  const FileUploadField = ({ 
    label, 
    field, 
    currentValue, 
    accept = "image/*" 
  }: { 
    label: string; 
    field: keyof CollegeSettings; 
    currentValue: string;
    accept?: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(field, file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload {label}
          </Button>
        </div>
        {currentValue && (
          <div className="flex items-center gap-2">
            <img 
              src={currentValue} 
              alt={label} 
              className="w-12 h-12 object-contain border rounded"
            />
            <span className="text-sm text-green-600">✓ Uploaded</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">College Settings</h1>
          <p className="text-lg text-muted-foreground">Configure college information for official documents</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Building className="h-6 w-6 text-white" />
              </div>
              College Information
            </CardTitle>
            <CardDescription>Basic college details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  value={settings.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  placeholder="Enter college name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collegeCode">College Code</Label>
                <Input
                  id="collegeCode"
                  value={settings.collegeCode}
                  onChange={(e) => handleInputChange('collegeCode', e.target.value)}
                  placeholder="Enter college code"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collegeAddress">College Address</Label>
              <Textarea
                id="collegeAddress"
                value={settings.collegeAddress}
                onChange={(e) => handleInputChange('collegeAddress', e.target.value)}
                placeholder="Enter complete college address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collegePhone">Phone Number</Label>
                <Input
                  id="collegePhone"
                  value={settings.collegePhone}
                  onChange={(e) => handleInputChange('collegePhone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collegeEmail">Email Address</Label>
                <Input
                  id="collegeEmail"
                  type="email"
                  value={settings.collegeEmail}
                  onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="affiliatedUniversity">Affiliated University</Label>
              <Input
                id="affiliatedUniversity"
                value={settings.affiliatedUniversity}
                onChange={(e) => handleInputChange('affiliatedUniversity', e.target.value)}
                placeholder="Enter affiliated university name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Visual Assets */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <FileImage className="h-6 w-6 text-white" />
              </div>
              Visual Assets
            </CardTitle>
            <CardDescription>Upload college logo and official seal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploadField
              label="College Logo"
              field="collegeLogo"
              currentValue={settings.collegeLogo}
            />
            <FileUploadField
              label="College Seal"
              field="collegeSeal"
              currentValue={settings.collegeSeal}
            />
          </CardContent>
        </Card>

        {/* Principal Information */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Signature className="h-6 w-6 text-white" />
              </div>
              Principal Information
            </CardTitle>
            <CardDescription>Principal details and signature for official documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principalName">Principal Name</Label>
              <Input
                id="principalName"
                value={settings.principalName}
                onChange={(e) => handleInputChange('principalName', e.target.value)}
                placeholder="Enter principal's full name"
              />
            </div>
            
            <FileUploadField
              label="Principal Signature"
              field="principalSignature"
              currentValue={settings.principalSignature}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};