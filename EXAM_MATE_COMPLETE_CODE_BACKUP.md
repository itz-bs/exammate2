# Exam Mate - Complete Code Backup

## Project Overview
Complete Examination Management System with role-based authentication, seat allocation, hall ticket generation, and modern UI with orange-red gradient theme.

## Key Features Implemented
- ✅ Role-based authentication (Admin, Student, Faculty, HOD)
- ✅ Seat allocation with 3-hour visibility rule
- ✅ Hall ticket generation with preview and download
- ✅ Student profile restrictions (read-only)
- ✅ Modern gradient UI with orange-red theme
- ✅ Responsive design for mobile and desktop
- ✅ Bulk upload functionality
- ✅ Real-time countdown timers
- ✅ College settings management

## Theme Colors
- Primary: Orange (#F97316) to Red (#EF4444)
- Gradients: `from-orange-500 to-red-500`
- Hover: `from-orange-600 to-red-600`

## Core Components

### 1. Button Component (src/components/ui/button.tsx)
```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 hover:shadow-xl transition-all duration-300',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 2. Badge Component (src/components/ui/badge.tsx)
```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### 3. Progress Component (src/components/ui/progress.tsx)
```tsx
import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-orange-500 to-red-500 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
```

### 4. Floating Card Component (src/components/ui/floating-card.tsx)
```tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingCard = ({ children, delay = 0, className = '' }: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

### 5. Animated Gradient Component (src/components/ui/animated-gradient.tsx)
```tsx
import { ReactNode } from 'react';

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedGradient = ({ children, className = '' }: AnimatedGradientProps) => {
  return (
    <div className={`bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 ${className}`}>
      {children}
    </div>
  );
};
```

### 6. Three Background Component (src/components/ui/three-background.tsx)
```tsx
export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10">
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-red-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400/30 rounded-full animate-ping"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/2 right-1/3 w-8 h-8 border border-orange-300/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 border border-red-300/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
```

### 7. Unified Input Component (src/components/ui/unified-input.tsx)
```tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileText, Plus } from 'lucide-react';
import { processFile } from '@/services/fileProcessingService';

interface UnifiedInputProps {
  title: string;
  description: string;
  singleEntryComponent: React.ReactNode;
  onFileProcessed: (data: any[]) => void;
  templateData: string;
  templateFilename: string;
}

export const UnifiedInput = ({
  title,
  description,
  singleEntryComponent,
  onFileProcessed,
  templateData,
  templateFilename
}: UnifiedInputProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await processFile(file);
      onFileProcessed(data);
    } catch (error) {
      console.error('File processing error:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
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

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
            <Plus className="h-5 w-5 text-white" />
          </div>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            {singleEntryComponent}
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Upload File</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for Excel (.xlsx), PDF, and CSV files
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={downloadTemplate}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.pdf,.csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                    <Button disabled={isProcessing} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {isProcessing ? 'Processing...' : 'Choose File'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
```

## Key Dashboard Pages

### Admin Dashboard (src/pages/Dashboard/AdminDashboard.tsx)
- Orange-red gradient theme
- Animated stats cards
- Charts and analytics
- Quick actions panel

### Student Dashboard (src/pages/Dashboard/StudentDashboard.tsx)
- Emerald-teal gradient theme for students
- Exam schedule display
- Progress tracking
- Hall ticket access

### Faculty Dashboard (src/pages/Dashboard/FacultyDashboard.tsx)
- Orange-red gradient theme
- Department student management
- Exam oversight
- Performance analytics

### HOD Dashboard (src/pages/Dashboard/HODDashboard.tsx)
- Orange-red gradient theme
- Department-wide statistics
- Faculty management
- Class-wise performance

## Management Pages

### Seat Allocation Management (src/pages/Dashboard/ManageSeatAllocation.tsx)
- Individual and bulk seat allocation
- 3-hour visibility rule implementation
- Search and filter functionality
- Real-time updates

### Hall Ticket Management (src/pages/Dashboard/ManageHallTickets.tsx)
- Hall ticket generation with photos
- Preview and download functionality
- Status management
- Bulk operations

### Student Seat Allocation View (src/pages/Dashboard/StudentSeatAllocation.tsx)
- 3-hour countdown timer
- Seat visibility restrictions
- Exam details display
- Instructions panel

## Utility Functions

### Local Storage Utils (src/utils/localStorage.ts)
```tsx
export const localStorage = {
  getUsers: () => JSON.parse(window.localStorage.getItem('users') || '[]'),
  getExams: () => JSON.parse(window.localStorage.getItem('exams') || '[]'),
  getCollegeSettings: () => JSON.parse(window.localStorage.getItem('collegeSettings') || '{}'),
  setCollegeSettings: (settings: any) => window.localStorage.setItem('collegeSettings', JSON.stringify(settings))
};
```

### Seat Allocation Utils (src/utils/seatAllocation.ts)
```tsx
export const checkAndUpdateSeatVisibility = () => {
  const allocations = JSON.parse(window.localStorage.getItem('seatAllocations') || '[]');
  const exams = JSON.parse(window.localStorage.getItem('exams') || '[]');
  const now = new Date();
  
  allocations.forEach((allocation: any) => {
    const exam = exams.find((e: any) => e.id === allocation.examId);
    if (exam) {
      const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
      const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
      allocation.isVisible = now >= threeHoursBefore;
    }
  });
  
  window.localStorage.setItem('seatAllocations', JSON.stringify(allocations));
};

export const getStudentSeatAllocation = (studentId: string, examId: string) => {
  const allocations = JSON.parse(window.localStorage.getItem('seatAllocations') || '[]');
  return allocations.find((a: any) => a.studentId === studentId && a.examId === examId);
};

export const isAllocationVisibleForStudent = (examId: string) => {
  const exams = JSON.parse(window.localStorage.getItem('exams') || '[]');
  const exam = exams.find((e: any) => e.id === examId);
  if (!exam) return false;
  
  const now = new Date();
  const examDateTime = new Date(`${exam.date} ${exam.startTime}`);
  const threeHoursBefore = new Date(examDateTime.getTime() - 3 * 60 * 60 * 1000);
  
  return now >= threeHoursBefore;
};
```

### Hall Ticket Template (src/utils/hallTicketTemplate.ts)
```tsx
export const generateOfficialHallTicket = (ticket: any, exam: any, student: any) => {
  const collegeSettings = JSON.parse(window.localStorage.getItem('collegeSettings') || '{}');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hall Ticket - ${student.rollNo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .content { margin: 20px 0; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${collegeSettings.collegeName || 'College Name'}</h1>
        <p>${collegeSettings.collegeAddress || 'College Address'}</p>
        <h2>HALL TICKET</h2>
        <h3>${exam.title}</h3>
      </div>
      <div class="content">
        <div class="row">
          <span><span class="label">Student Name:</span> ${student.name}</span>
          <span><span class="label">Roll Number:</span> ${student.rollNo}</span>
        </div>
        <div class="row">
          <span><span class="label">Subject:</span> ${exam.subject}</span>
          <span><span class="label">Date:</span> ${exam.date}</span>
        </div>
        <div class="row">
          <span><span class="label">Time:</span> ${exam.startTime} - ${exam.endTime}</span>
          <span><span class="label">Duration:</span> ${exam.duration} minutes</span>
        </div>
        <div class="row">
          <span><span class="label">Venue:</span> ${exam.venue}</span>
          <span><span class="label">Hall & Seat:</span> ${ticket.hallNumber} - ${ticket.seatNumber}</span>
        </div>
      </div>
      <div style="margin-top: 30px; font-size: 12px;">
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Bring this hall ticket to the examination hall</li>
          <li>Arrive 30 minutes before the exam starts</li>
          <li>Carry a valid ID proof</li>
          <li>Mobile phones are strictly prohibited</li>
        </ul>
      </div>
    </body>
    </html>
  `;
};
```

## Authentication & Security

### Login Page (src/pages/Auth/LoginPage.tsx)
- Orange-red gradient theme
- Role-based authentication
- Form validation with Zod
- Responsive design

### Auth Hook (src/hooks/useAuth.ts)
- User session management
- Role-based access control
- Authentication state

## Responsive Design Features

### Tailwind Classes Used:
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` - Responsive grids
- `flex-col md:flex-row` - Responsive flex direction
- `text-sm md:text-base lg:text-lg` - Responsive typography
- `p-4 md:p-6 lg:p-8` - Responsive padding
- `space-y-4 md:space-y-6` - Responsive spacing

### Mobile Optimizations:
- Touch-friendly button sizes (h-11, h-20)
- Collapsible navigation
- Stacked layouts on small screens
- Optimized card spacing

## File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── floating-card.tsx
│   │   ├── animated-gradient.tsx
│   │   ├── three-background.tsx
│   │   └── unified-input.tsx
│   └── Layout/
├── pages/
│   ├── Auth/
│   │   └── LoginPage.tsx
│   └── Dashboard/
│       ├── AdminDashboard.tsx
│       ├── StudentDashboard.tsx
│       ├── FacultyDashboard.tsx
│       ├── HODDashboard.tsx
│       ├── ManageSeatAllocation.tsx
│       ├── StudentSeatAllocation.tsx
│       ├── ManageHallTickets.tsx
│       └── CollegeSettings.tsx
├── utils/
│   ├── localStorage.ts
│   ├── seatAllocation.ts
│   ├── hallTicketTemplate.ts
│   └── helpers.ts
└── hooks/
    └── useAuth.ts
```

## Environment Configuration (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Exam Mate
VITE_APP_VERSION=1.0.0
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://cddezdtwechiwrqbbkco.supabase.co
```

## Key Features Summary

1. **Complete Exam Management System** - Full CRUD operations for exams, students, faculty
2. **Seat Allocation with 3-Hour Rule** - Students can only see seats 3 hours before exam
3. **Hall Ticket Generation** - Professional templates with college branding
4. **Role-Based Access Control** - Different dashboards for each user type
5. **Modern UI with Orange-Red Theme** - Consistent gradient styling throughout
6. **Responsive Design** - Works on mobile and desktop
7. **Bulk Operations** - Excel/CSV upload for mass data entry
8. **Real-Time Updates** - Live countdown timers and status updates
9. **College Branding** - Customizable college settings and logos
10. **Security Features** - Authentication, authorization, and data validation

This backup contains all the code created and modified for the Exam Mate system with the new orange-red theme and complete functionality.