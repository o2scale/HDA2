import { Download, RotateCcw, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStore } from '@/store/dashboard-store';

const RecentDocumentsGrid = () => {
  const { recentDocuments } = useDashboardStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="text-primary border-primary">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="text-success border-success">Ready</Badge>;
      case 'verified':
        return <Badge variant="outline" className="text-accent border-accent">Verified</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="col-span-12">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="group"
            >
              <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-md border border-border/50 hover:border-border">
                <CardContent className="p-4">
                  {/* Document Thumbnail */}
                  <div className="relative mb-4 bg-muted/30 rounded-lg aspect-[3/2] flex items-center justify-center overflow-hidden">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Document Info */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm truncate" title={document.title}>
                        {document.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        {getStatusBadge(document.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reprocess
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{document.lastModified}</span>
                      <span>{document.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {recentDocuments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-sm">Upload your first document to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDocumentsGrid;