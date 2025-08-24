import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localStorage } from '@/utils/localStorage';

export const StudentNotifications = () => {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    const stored = window.localStorage.getItem('notifications');
    setNotifications(stored ? JSON.parse(stored) : []);
  }, []);
  const studentNotifications = notifications.filter((notif: any) => 
    notif.status === 'sent' && (notif.targetRole === 'all' || notif.targetRole === 'student')
  );

  const getTypeIcon = (type: string) => {
    const icons: any = {
      info: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: XCircle
    };
    const Icon = icons[type] || Info;
    return <Icon className="h-5 w-5" />;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">View important announcements and updates</p>
      </div>

      <div className="grid gap-4">
        {studentNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Notifications</h3>
                <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          studentNotifications.map((notification: any) => (
            <Card key={notification.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(notification.type)}
                    <CardTitle className="text-xl">{notification.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {getTypeBadge(notification.type)}
                    {getPriorityBadge(notification.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{notification.message}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                  <span>Priority: {notification.priority}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};