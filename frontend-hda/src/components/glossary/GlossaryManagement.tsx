import GlossaryHeader from './GlossaryHeader';
import GlossaryTable from './GlossaryTable';
import GlossaryDetailPanel from './GlossaryDetailPanel';
import AddTermModal from './AddTermModal';
import { useGlossaryStore } from '@/store/glossary-store';

const GlossaryManagement = () => {
  const { selectedTermId } = useGlossaryStore();

  return (
    <div className="min-h-screen bg-background">
      <GlossaryHeader />
      
      <main className="flex h-[calc(100vh-theme(spacing.32))]">
        {/* Main Content - Table */}
        <div className={`transition-all duration-300 ${selectedTermId ? 'w-[70%]' : 'w-full'}`}>
          <div className="h-full overflow-auto p-6">
            <GlossaryTable />
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTermId && (
          <div className="w-[30%] min-w-[400px]">
            <GlossaryDetailPanel />
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTermModal />
    </div>
  );
};

export default GlossaryManagement;