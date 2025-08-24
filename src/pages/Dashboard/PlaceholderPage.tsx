import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
          <Button size="lg" variant="outline" onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Construction className="h-6 w-6 text-white" />
            </div>
            Under Development
          </CardTitle>
          <CardDescription className="text-base">This feature is currently being developed</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 mb-6">
              <Construction className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The {title.toLowerCase()} feature is coming soon. We're working hard to bring you this functionality with the best user experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};