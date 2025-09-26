import { motion } from 'framer-motion';
import Header from '@/components/dashboard/Header';
import ActiveProcessingWidget from '@/components/dashboard/ActiveProcessingWidget';
import QuickUploadZone from '@/components/dashboard/QuickUploadZone';
import QueueStatusCards from '@/components/dashboard/QueueStatusCards';
import RecentDocumentsGrid from '@/components/dashboard/RecentDocumentsGrid';
import QualityMetricsPanel from '@/components/dashboard/QualityMetricsPanel';
import SystemHealthPanel from '@/components/dashboard/SystemHealthPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Dashboard Content */}
      <main className="pt-16">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Top Row: Active Processing + Quick Upload */}
            <ActiveProcessingWidget />
            <QuickUploadZone />
            
            {/* Second Row: Queue Status Cards */}
            <QueueStatusCards />
            
            {/* Third Row: Recent Documents */}
            <RecentDocumentsGrid />
            
            {/* Bottom Row: Quality Metrics + System Health */}
            <QualityMetricsPanel />
            <SystemHealthPanel />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
