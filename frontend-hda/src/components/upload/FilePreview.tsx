import { X, FileText, Image as ImageIcon, FileType, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUploadStore, UploadedFile } from '@/store/upload-store';
import { cn } from '@/lib/utils';

const FilePreview = () => {
  const { files, removeFile } = useUploadStore();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type === 'application/pdf') return FileText;
    return FileType;
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'border-warning bg-warning/5';
      case 'ready': return 'border-success bg-success/5';
      case 'processing': return 'border-primary bg-primary/5';
      case 'error': return 'border-destructive bg-destructive/5';
      case 'complete': return 'border-success bg-success/10';
      default: return 'border-border';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div className="text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No files uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-4 p-4 min-w-max">
        <AnimatePresence>
          {files.map((uploadedFile, index) => {
            const Icon = getFileIcon(uploadedFile.file);
            
            return (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative w-40 h-48 bg-card rounded-lg border-2 transition-all duration-200 hover:shadow-md group",
                  getStatusColor(uploadedFile.status)
                )}
              >
                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => removeFile(uploadedFile.id)}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* File Icon/Thumbnail */}
                <div className="flex items-center justify-center h-24 pt-4">
                  {uploadedFile.file.type.startsWith('image/') ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="max-w-16 max-h-16 object-cover rounded"
                    />
                  ) : (
                    <Icon className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>

                {/* File Info */}
                <div className="p-3 space-y-2">
                  <h4 
                    className="text-sm font-medium truncate" 
                    title={uploadedFile.file.name}
                  >
                    {uploadedFile.file.name}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(uploadedFile.file.size)}</span>
                    {uploadedFile.pageCount && uploadedFile.pageCount > 1 && (
                      <Badge variant="outline" className="text-xs">
                        {uploadedFile.pageCount} pages
                      </Badge>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="space-y-2">
                    {uploadedFile.status === 'uploading' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-warning">Uploading...</span>
                          <span>{Math.round(uploadedFile.progress)}%</span>
                        </div>
                        <Progress value={uploadedFile.progress} className="h-1" />
                      </div>
                    )}
                    
                    {uploadedFile.status === 'ready' && (
                      <div className="flex items-center space-x-1 text-xs text-success">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span>Ready</span>
                      </div>
                    )}
                    
                    {uploadedFile.status === 'processing' && (
                      <div className="flex items-center space-x-1 text-xs text-primary">
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span>Processing</span>
                      </div>
                    )}
                    
                    {uploadedFile.status === 'error' && (
                      <div className="flex items-center space-x-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <span>Error</span>
                      </div>
                    )}
                    
                    {uploadedFile.status === 'complete' && (
                      <div className="flex items-center space-x-1 text-xs text-success">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span>Complete</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Tooltip */}
                {uploadedFile.error && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {uploadedFile.error}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilePreview;