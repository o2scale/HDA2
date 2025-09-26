import { Server, Users, Clock, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboard-store';

const SystemHealthPanel = () => {
  const { systemHealth } = useDashboardStore();

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-success' : 'text-destructive';
  };

  const getStatusBadge = (status: string, service: string) => {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-success' : 'bg-destructive'}`}>
          <motion.div
            className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-success' : 'bg-destructive'}`}
            animate={status === 'online' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="text-sm font-medium">{service}</span>
        <Badge variant={status === 'online' ? 'default' : 'destructive'} className="text-xs">
          {status}
        </Badge>
      </div>
    );
  };

  const getQuotaColor = (usage: number) => {
    if (usage >= 90) return 'text-destructive';
    if (usage >= 70) return 'text-warning';
    return 'text-primary';
  };

  return (
    <Card className="col-span-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Server className="h-5 w-5 mr-2 text-primary" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">API Services</h4>
          <div className="space-y-2">
            {getStatusBadge(systemHealth.geminiStatus, 'Gemini AI')}
            {getStatusBadge(systemHealth.openaiStatus, 'OpenAI')}
            {getStatusBadge(systemHealth.supabaseStatus, 'Supabase')}
          </div>
        </div>

        {/* Quota Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Quota Usage</h4>
            <span className={`text-sm font-semibold ${getQuotaColor(systemHealth.quotaUsage)}`}>
              {systemHealth.quotaUsage}%
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={systemHealth.quotaUsage} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Monthly limit</span>
              <span>{systemHealth.quotaUsage >= 90 ? 'High usage' : systemHealth.quotaUsage >= 70 ? 'Moderate usage' : 'Normal usage'}</span>
            </div>
          </div>
          
          {systemHealth.quotaUsage >= 90 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-destructive">Approaching quota limit</span>
            </motion.div>
          )}
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-3 bg-muted/20 rounded-lg"
          >
            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold">{systemHealth.activeUsers}</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-3 bg-muted/20 rounded-lg"
          >
            <Zap className="h-5 w-5 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </motion.div>
        </div>

        {/* Last Sync */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last sync</span>
            </div>
            <span className="font-medium">{systemHealth.lastSync}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthPanel;