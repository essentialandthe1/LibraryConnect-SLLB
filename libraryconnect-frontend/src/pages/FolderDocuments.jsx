import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Search, FileText, Download, Eye } from 'lucide-react';

const FolderDocuments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderName = searchParams.get('name') || 'Unknown Folder';
  const [search, setSearch] = useState('');

  // Mock documents
  const documents = [
    {
      id: '1',
      title: 'Annual Report 2024.pdf',
      category: 'Report',
      uploadedBy: 'John Kamara',
      uploadedAt: '2024-05-15',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'Budget Proposal.xlsx',
      category: 'Finance',
      uploadedBy: 'Fatmata Sesay',
      uploadedAt: '2024-05-14',
      size: '1.2 MB',
    },
    {
      id: '3',
      title: 'Staff Training Schedule.docx',
      category: 'HR',
      uploadedBy: 'Mohamed Turay',
      uploadedAt: '2024-05-13',
      size: '856 KB',
    },
  ];

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 animate-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Folders
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{folderName}</h1>
        <p className="text-muted-foreground mt-1">{documents.length} documents in this folder</p>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No documents found</div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.uploadedBy} • {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{doc.category}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/view-document/${doc.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FolderDocuments;
