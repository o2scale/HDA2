import { Pause, Play, X, FileText, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboard-store';

const ActiveProcessingWidget = () => {
  const { processingJobs, pauseJob, cancelJob } = useDashboardStore();

  const getJobIcon = (type: string) => {
    return type === 'extraction' ? FileText : Languages;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-primary';
      case 'paused': return 'bg-warning';
      case 'completed': return 'bg-success';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="col-span-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Active Processing</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {processingJobs.map((job, index) => {
          const Icon = getJobIcon(job.type);
          
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-muted/30 rounded-lg border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm truncate max-w-48">
                      {job.documentName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={job.type === 'extraction' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {job.type === 'extraction' ? 'Text Extraction' : 'Translation'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {job.timeRemaining} remaining
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => pauseJob(job.id)}
                  >
                    {job.status === 'processing' ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => cancelJob(job.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
                
                <Progress 
                  value={job.progress} 
                  className="h-2"
                />
              </div>
            </motion.div>
          );
        })}
        
        {processingJobs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No active processing jobs</p>
            <p className="text-sm">Upload documents to start processing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveProcessingWidget;