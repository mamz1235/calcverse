
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFolders } from '../contexts/FolderContext';
import { FolderCard } from '../components/ProjectFolders/FolderCard';
import { FolderPlus, ArrowLeft, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { projectFolderTranslations } from '../utils/projectFolderTranslations';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#3b82f6', // Blue
];

const ProjectFolders: React.FC = () => {
  const { folders, createFolder } = useFolders();
  const { language } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const tFolder = projectFolderTranslations[language] || projectFolderTranslations['en'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName, selectedColor);
    setNewFolderName('');
    setSelectedColor(COLORS[0]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link to="/" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rtl:rotate-180" />
           </Link>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{tFolder.title}</h1>
        </div>
        <button 
           onClick={() => setShowCreateModal(true)}
           className="group flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
            <FolderPlus className="w-5 h-5" />
            <span>{tFolder.newFolder}</span>
        </button>
      </div>

      {folders.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center h-96">
           <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-6">
              <FolderPlus className="w-10 h-10 text-slate-300 dark:text-slate-600" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tFolder.noProjectsTitle}</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
             {tFolder.noProjectsDesc}
           </p>
           <button 
             onClick={() => setShowCreateModal(true)}
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-transform active:scale-95 flex items-center gap-2"
           >
             {tFolder.createFolderBtn}
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {folders.map(folder => (
             <Link key={folder.id} to={`/project-folders/${folder.id}`}>
               <FolderCard folder={folder} />
             </Link>
           ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-card dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tFolder.createModalTitle}</h2>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                       <X className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{tFolder.folderNameLabel}</label>
                       <input 
                         type="text" 
                         value={newFolderName}
                         onChange={e => setNewFolderName(e.target.value)}
                         placeholder={tFolder.folderNamePlaceholder}
                         className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                         autoFocus
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{tFolder.folderColorLabel}</label>
                       <div className="flex flex-wrap gap-3">
                          {COLORS.map(color => (
                             <button
                               type="button"
                               key={color}
                               onClick={() => setSelectedColor(color)}
                               className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-slate-800 scale-110' : ''}`}
                               style={{ backgroundColor: color }}
                             />
                          ))}
                       </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8">
                       <button 
                         type="button" 
                         onClick={() => setShowCreateModal(false)}
                         className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                       >
                         {tFolder.cancel}
                       </button>
                       <button 
                         type="submit"
                         disabled={!newFolderName.trim()}
                         className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {tFolder.create}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFolders;
