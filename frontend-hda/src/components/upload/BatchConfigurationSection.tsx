import { Package, Calendar, AlertTriangle, Clock, DollarSign, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadStore } from '@/store/upload-store';

const BatchConfigurationSection = () => {
  const { settings, updateSettings, costEstimate, processFiles, isProcessing } = useUploadStore();

  const priorityOptions = [
    { value: 'low', label: 'Low', icon: Clock, color: 'text-muted-foreground', multiplier: '1x' },
    { value: 'normal', label: 'Normal', icon: Package, color: 'text-primary', multiplier: '1x' },
    { value: 'high', label: 'High', icon: AlertTriangle, color: 'text-warning', multiplier: '1.5x' },
    { value: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-destructive', multiplier: '3x' },
  ];

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Batch Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Batch Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="add-to-batch" className="text-sm font-medium">
              Add to batch
            </Label>
            <Switch
              id="add-to-batch"
              checked={settings.addToBatch}
              onCheckedChange={(checked) => updateSettings({ addToBatch: checked })}
            />
          </div>

          {settings.addToBatch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <Label htmlFor="batch-name" className="text-sm font-medium">
                  Batch name
                </Label>
                <Input
                  id="batch-name"
                  placeholder="Enter batch name..."
                  value={settings.batchName}
                  onChange={(e) => updateSettings({ batchName: e.target.value })}
                  className="mt-1"
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority</Label>
            <Select
              value={settings.priority}
              onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') =>
                updateSettings({ priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">({option.multiplier} cost)</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="process-immediately" className="text-sm font-medium">
                Process immediately
              </Label>
              <Switch
                id="process-immediately"
                checked={settings.processImmediately}
                onCheckedChange={(checked) => updateSettings({ processImmediately: checked })}
              />
            </div>

            {!settings.processImmediately && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">Schedule for later</Label>
                <Input
                  type="datetime-local"
                  onChange={(e) => updateSettings({ scheduledTime: new Date(e.target.value) })}
                />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Cost & Time Estimator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-0 bg-card border border-border rounded-lg p-4 shadow-lg"
      >
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Cost & Time Estimate</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated cost:</span>
                <span className="font-medium">${costEstimate.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Processing time:</span>
                <span className="font-medium">{formatTime(costEstimate.processingTime)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Queue position:</span>
                <span className="font-medium">#{costEstimate.queuePosition}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span className="font-medium capitalize">{settings.priority}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={processFiles}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Clock className="h-4 w-4" />
                </motion.div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : 'Process Now'}
            </Button>
            
            <Button variant="outline" className="w-full" disabled={isProcessing}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Queue
            </Button>
          </div>

          {costEstimate.totalCost > 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 p-2 bg-warning/10 border border-warning/20 rounded text-warning text-xs"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Large batch detected. Consider splitting for faster processing.</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BatchConfigurationSection;