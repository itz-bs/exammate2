import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UnifiedInput } from '@/components/ui/unified-input';
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

export const ManageStudents = () => {
  const [students, setStudents] = useState(localStorage.getUsers().filter(u => u.role === 'student'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: '',
    class: ''
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = localStorage.getUsers();
    
    if (editingStudent) {
      const updatedUsers = allUsers.map(user =>
        user.id === editingStudent.id ? { ...user, ...formData } : user
      );
      localStorage.setUsers(updatedUsers);
      setStudents(updatedUsers.filter(u => u.role === 'student'));
    } else {
      const newStudent = {
        id: generateId(),
        ...formData,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...allUsers, newStudent];
      localStorage.setUsers(updatedUsers);
      setStudents(updatedUsers.filter(u => u.role === 'student'));
    }
    
    resetForm();
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo || '',
      department: student.department || '',
      class: student.class || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (studentId: string) => {
    const allUsers = localStorage.getUsers();
    const updatedUsers = allUsers.filter(user => user.id !== studentId);
    localStorage.setUsers(updatedUsers);
    setStudents(updatedUsers.filter(u => u.role === 'student'));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', rollNo: '', department: '', class: '' });
    setEditingStudent(null);
    setIsDialogOpen(false);
  };

  const handleBulkUpload = (data: any[]) => {
    const allUsers = localStorage.getUsers();
    const newStudents = data.map(row => ({
      id: generateId(),
      name: row.Name || row.name || '',
      email: row.Email || row.email || '',
      rollNo: row['Roll Number'] || row.rollNo || row.roll_no || '',
      department: row.Department || row.department || '',
      class: row.Class || row.class || '',
      role: 'student',
      createdAt: new Date().toISOString()
    })).filter(student => student.name && student.email && student.rollNo);
    
    if (newStudents.length > 0) {
      const updatedUsers = [...allUsers, ...newStudents];
      localStorage.setUsers(updatedUsers);
      setStudents(updatedUsers.filter(u => u.role === 'student'));
      alert(`Successfully imported ${newStudents.length} students`);
    } else {
      alert('No valid student data found in the file');
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Students</h1>
            <p className="text-lg text-muted-foreground">Add, edit, and manage student records with ease</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Students
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Import Students</DialogTitle>
                <DialogDescription>
                  Add students individually or import from file (Excel, PDF, CSV)
                </DialogDescription>
              </DialogHeader>
              <UnifiedInput
                title="Student Management"
                description="Choose your preferred method to add students"
                singleEntryComponent={
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number</Label>
                      <Input
                        id="rollNo"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input
                          id="class"
                          value={formData.class}
                          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </form>
                }
                onFileProcessed={handleBulkUpload}
                templateData="Name,Email,Roll Number,Department,Class\nJohn Doe,john@example.com,CS2021001,Computer Science,Third Year\nJane Smith,jane@example.com,CS2021002,Computer Science,Third Year"
                templateFilename="students-template.csv"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                {editingStudent ? 'Update student information' : 'Enter student details to add them to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStudent ? 'Update' : 'Add'} Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Total students: {students.length}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};