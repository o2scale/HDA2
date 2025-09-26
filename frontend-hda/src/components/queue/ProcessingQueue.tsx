import { useEffect } from 'react';
import QueueHeader from './QueueHeader';
import KanbanView from './KanbanView';
import ListView from './ListView';
import { useQueueStore } from '@/store/queue-store';

const ProcessingQueue = () => {
  const { viewMode, simulateRealTimeUpdates, stopSimulation } = useQueueStore();

  useEffect(() => {
    // Start real-time simulation
    simulateRealTimeUpdates();
    
    // Cleanup on unmount
    return () => {
      stopSimulation();
    };
  }, [simulateRealTimeUpdates, stopSimulation]);

  return (
    <div className="min-h-screen bg-background">
      <QueueHeader />
      <main className="pt-0">
        {viewMode === 'kanban' ? <KanbanView /> : <ListView />}
      </main>
    </div>
  );
};

export default ProcessingQueue;