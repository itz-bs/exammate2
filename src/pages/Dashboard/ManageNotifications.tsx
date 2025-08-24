import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, Send, Bell } from 'lucide-react';
import { UnifiedInput } from '@/components/ui/unified-input';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRole: 'all' | 'admin' | 'student' | 'faculty' | 'hod';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent';
  createdAt: string;
  sentAt?: string;
}

export const ManageNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = window.localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [
      {
        id: 'sample-1',
        title: 'Exam Schedule Update',
        message: 'Mid semester exams will start from January 15th. Please check your hall tickets.',
        type: 'info' as const,
        targetRole: 'student' as const,
        priority: 'high' as const,
        status: 'sent' as const,
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString()
      }
    ];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    targetRole: 'all' as const,
    priority: 'medium' as const
  });

  const saveNotifications = (notifs: Notification[]) => {
    window.localStorage.setItem('notifications', JSON.stringify(notifs));
    setNotifications(notifs);
  };

  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotification) {
      const updatedNotifications = notifications.map(notif =>
        notif.id === editingNotification.id ? { ...notif, ...formData } : notif
      );
      saveNotifications(updatedNotifications);
    } else {
      const newNotification: Notification = {
        id: generateId(),
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      saveNotifications([...notifications, newNotification]);
    }
    
    resetForm();
  };

  const handleSend = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId 
        ? { ...notif, status: 'sent' as const, sentAt: new Date().toISOString() }
        : notif
    );
    saveNotifications(updatedNotifications);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetRole: notification.targetRole,
      priority: notification.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', type: 'info', targetRole: 'all', priority: 'medium' });
    setEditingNotification(null);
    setIsDialogOpen(false);
  };

  const handleBulkUpload = (data: any[]) => {
    const newNotifications = data.map(row => ({
      id: generateId(),
      title: row.Title || row.title || '',
      message: row.Message || row.message || '',
      type: (row.Type || row.type || 'info') as 'info' | 'success' | 'warning' | 'error',
      targetRole: (row['Target Role'] || row.targetRole || row.target_role || 'all') as 'all' | 'admin' | 'student' | 'faculty' | 'hod',
      priority: (row.Priority || row.priority || 'medium') as 'low' | 'medium' | 'high',
      status: 'draft' as const,
      createdAt: new Date().toISOString()
    })).filter(notif => notif.title && notif.message);
    
    if (newNotifications.length > 0) {
      saveNotifications([...notifications, ...newNotifications]);
      alert(`Successfully imported ${newNotifications.length} notifications`);
    } else {
      alert('No valid notification data found in the file');
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: any = {
      info: 'default',
      success: 'secondary',
      warning: 'outline',
      error: 'destructive'
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: any = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[priority]}>{priority}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Send Notifications</h1>
            <p className="text-lg text-muted-foreground">Broadcast messages to students, faculty, and staff</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send messages to users individually or broadcast to multiple recipients
              </DialogDescription>
            </DialogHeader>
            <UnifiedInput
              title="Message Broadcasting"
              description="Choose your preferred method to send notifications"
              singleEntryComponent={
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Notification title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Notification message"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Audience</Label>
                    <Select
                      value={formData.targetRole}
                      onValueChange={(value: any) => setFormData({ ...formData, targetRole: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="hod">HODs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              }
              onFileProcessed={handleBulkUpload}
              templateData="Title,Message,Type,Target Role,Priority\nExam Schedule Update,Mid semester exams will start from January 15th,info,student,high\nHoliday Notice,College will remain closed on Republic Day,info,all,medium"
              templateFilename="notifications-template.csv"
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notification</DialogTitle>
              <DialogDescription>
                Update notification details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-message">Message</Label>
                <Textarea
                  id="edit-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Notification message"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-targetRole">Target Audience</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(value: any) => setFormData({ ...formData, targetRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="hod">HODs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Notification
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                Sent Messages
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Total messages sent: <span className="font-semibold text-blue-600">{notifications.length}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/50 backdrop-blur-sm border-white/20"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {notification.targetRole === 'all' ? 'Everyone' : notification.targetRole}
                    </Badge>
                  </TableCell>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                  <TableCell>
                    <Badge variant={notification.status === 'sent' ? 'secondary' : 'outline'}>
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notification.sentAt ? new Date(notification.sentAt).toLocaleDateString() : 'Not sent'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {notification.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(notification.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
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