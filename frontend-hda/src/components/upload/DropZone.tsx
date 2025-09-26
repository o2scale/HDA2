import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileCheck, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUploadStore } from '@/store/upload-store';

const DropZone = () => {
  const { addFiles, dragActive, setDragActive } = useUploadStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
    setDragActive(false);
  }, [addFiles, setDragActive]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const isActive = isDragActive || dragActive;

  return (
    <div className="h-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative h-full border-3 border-dashed rounded-lg transition-all duration-300 cursor-pointer",
          "flex flex-col items-center justify-center p-8 text-center",
          isActive && !isDragReject
            ? "border-primary bg-primary/5 border-solid"
            : isDragReject
            ? "border-destructive bg-destructive/5 border-solid"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
        )}
        style={{
          animation: isActive ? 'dash 2s linear infinite' : undefined,
        }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {isDragReject ? (
                <>
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
                  <h3 className="text-xl font-semibold text-destructive mb-2">
                    Invalid file type
                  </h3>
                  <p className="text-destructive/80">
                    Only PDF, JPG, PNG, and DOCX files are supported
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CloudUpload className="h-16 w-16 mx-auto mb-4 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Release to upload
                  </h3>
                  <p className="text-primary/80">
                    Files will be processed immediately
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <CloudUpload className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Drop your files here
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Support for PDF, JPG, PNG, DOCX files up to 100MB each
              </p>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-success" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-success" />
                  <span>Images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-success" />
                  <span>DOCX</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Choose Files
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};

export default DropZone;