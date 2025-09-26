import { useState, useCallback } from 'react';
import { Upload, FileText, Image, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickUploadZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    // Handle file processing here
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files);
    // Handle file processing here
  }, []);

  return (
    <Card className="col-span-4 h-fit">
      <CardContent className="p-0">
        <motion.div
          className={`
            relative p-8 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${isDragOver 
              ? 'border-primary bg-primary/5 border-solid' 
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center space-y-4">
            <motion.div
              animate={{
                scale: isDragOver ? 1.1 : 1,
                rotate: isDragOver ? 5 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className={`
                h-12 w-12 mx-auto transition-colors duration-200
                ${isDragOver ? 'text-primary' : 'text-muted-foreground'}
              `} />
            </motion.div>
            
            <div>
              <p className={`
                font-medium transition-colors duration-200
                ${isDragOver ? 'text-primary' : 'text-foreground'}
              `}>
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF, JPG, PNG, DOCX
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>PDF</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Image className="h-3 w-3" />
                <span>Images</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <File className="h-3 w-3" />
                <span>DOCX</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="p-4 border-t border-border bg-muted/20">
          <Button variant="outline" size="sm" className="w-full">
            Browse Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickUploadZone;