import { Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboard-store';

const QueueStatusCards = () => {
  const { queueStats } = useDashboardStore();

  const cards = [
    {
      title: 'Pending',
      value: queueStats.pending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Processing',
      value: queueStats.processing,
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      animate: true
    },
    {
      title: 'Completed Today',
      value: queueStats.completedToday,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    }
  ];

  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`
              cursor-pointer transition-all duration-200 hover:shadow-md border
              ${card.borderColor}
            `}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">
                      {card.value}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <motion.div
                      animate={card.animate ? { rotate: 360 } : {}}
                      transition={card.animate ? { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear" 
                      } : {}}
                    >
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </motion.div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`${card.color} ${card.borderColor}`}
                  >
                    View Queue
                  </Badge>
                  
                  <div className="text-xs text-muted-foreground">
                    {card.title === 'Pending' && 'Awaiting processing'}
                    {card.title === 'Processing' && 'Currently active'}
                    {card.title === 'Completed Today' && 'Since midnight'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QueueStatusCards;