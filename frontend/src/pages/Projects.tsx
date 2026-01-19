import { Button } from '../components/Button';
import { Plus } from 'lucide-react';

export const Projects = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold dark:text-white">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Collaborate on real-world projects.</p>
         </div>
         <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            New Project
         </Button>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
          {/* Placeholder for project cards */}
          <div className="text-center py-20 bg-gray-50 dark:bg-charcoal/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
               <p className="text-gray-500 font-medium">No projects found. Be the first to launch one!</p>
          </div>
      </div>
    </div>
  );
};
