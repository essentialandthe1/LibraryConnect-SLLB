import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileText, ChevronRight } from 'lucide-react';

export default function Folders() {
  const folders = [
    {
      name: 'Finance Department',
      documents: 24,
      color: 'bg-success/10 text-success',
      lastUpdated: '2 hours ago',
    },
    {
      name: 'Human Resources',
      documents: 18,
      color: 'bg-info/10 text-info',
      lastUpdated: '5 hours ago',
    },
    {
      name: 'Procurement',
      documents: 12,
      color: 'bg-warning/10 text-warning',
      lastUpdated: '1 day ago',
    },
    {
      name: 'Administration',
      documents: 32,
      color: 'bg-primary/10 text-primary',
      lastUpdated: '1 day ago',
    },
    {
      name: 'Eastern Region',
      documents: 15,
      color: 'bg-accent/10 text-accent-foreground',
      lastUpdated: '2 days ago',
    },
    {
      name: 'Northern Region',
      documents: 11,
      color: 'bg-destructive/10 text-destructive',
      lastUpdated: '3 days ago',
    },
    {
      name: 'Southern Region',
      documents: 9,
      color: 'bg-success/10 text-success',
      lastUpdated: '3 days ago',
    },
    {
      name: 'Western Region',
      documents: 14,
      color: 'bg-info/10 text-info',
      lastUpdated: '4 days ago',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Folders</h1>
        <p className="mt-1 text-muted-foreground">Browse documents organized by department and region</p>
      </div>

      {/* Departments Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Departments</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {folders.slice(0, 4).map((folder, index) => (
            <Card key={index} className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader>
                <div className={`mb-2 inline-flex rounded-lg p-3 ${folder.color}`}>
                  <FolderOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">{folder.name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {folder.documents} documents
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  <span className="text-xs text-muted-foreground">Updated {folder.lastUpdated}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Regions Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Regions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {folders.slice(4).map((folder, index) => (
            <Card key={index} className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader>
                <div className={`mb-2 inline-flex rounded-lg p-3 ${folder.color}`}>
                  <FolderOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">{folder.name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {folder.documents} documents
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  <span className="text-xs text-muted-foreground">Updated {folder.lastUpdated}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
