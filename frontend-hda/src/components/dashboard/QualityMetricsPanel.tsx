import { TrendingUp, FileCheck, Languages, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboardStore } from '@/store/dashboard-store';

const QualityMetricsPanel = () => {
  const { qualityMetrics } = useDashboardStore();

  const getQualityColor = (value: number) => {
    if (value >= 90) return 'text-success';
    if (value >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getQualityBgColor = (value: number) => {
    if (value >= 90) return 'bg-success';
    if (value >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  const metrics = [
    {
      label: 'Text Extraction',
      value: qualityMetrics.textExtractionQuality,
      icon: FileCheck,
      unit: '%'
    },
    {
      label: 'Translation',
      value: qualityMetrics.translationQuality,
      icon: Languages,
      unit: '%'
    },
    {
      label: 'Documents Verified',
      value: qualityMetrics.documentsVerified,
      icon: Target,
      unit: ''
    }
  ];

  return (
    <Card className="col-span-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Quality Metrics - Last 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Accuracy Circle */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground/20"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - qualityMetrics.averageAccuracy / 100)}`}
                className={getQualityColor(qualityMetrics.averageAccuracy)}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - qualityMetrics.averageAccuracy / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getQualityColor(qualityMetrics.averageAccuracy)}`}>
                  {qualityMetrics.averageAccuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {metric.unit === '%' ? (
                    <>
                      <div className="w-20">
                        <Progress 
                          value={metric.value} 
                          className="h-2"
                        />
                      </div>
                      <span className={`text-sm font-semibold min-w-[40px] ${getQualityColor(metric.value)}`}>
                        {metric.value}%
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-primary min-w-[40px]">
                      {metric.value}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Target Achievement */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target Achievement</span>
            <span className={`font-semibold ${qualityMetrics.averageAccuracy >= 95 ? 'text-success' : 'text-warning'}`}>
              {qualityMetrics.averageAccuracy >= 95 ? 'Excellent' : 'Good'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Target: 95% accuracy across all metrics
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityMetricsPanel;