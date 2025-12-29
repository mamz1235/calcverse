
import React, { useState } from 'react';
import { ProjectFolder } from '../../types/folder';
import { Folder, Users, Clock, PieChart, Calculator, Activity, FileText, Settings, GripVertical, MoreVertical } from 'lucide-react';
import { getCalculatorById } from '../../utils/calculatorRegistry';
import { useLanguage } from '../../contexts/LanguageContext';
import { projectFolderTranslations } from '../../utils/projectFolderTranslations';

// Icon mapping helper
const getIcon = (name: string) => {
  const icons: any = { PieChart, Calculator, Activity, FileText, Settings, Folder };
  const Icon = icons[name] || Folder;
  return <Icon className="w-8 h-8 text-white/90 drop-shadow-md" />;
};

export const FolderCard: React.FC<{ folder: ProjectFolder }> = ({ folder }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();
  const tFolder = projectFolderTranslations[language] || projectFolderTranslations['en'];

  return (
    <div 
      className="group relative flex flex-col w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- MAIN FOLDER CONTAINER --- */}
      <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer bg-card flex flex-col">
        
        {/* COLOR COVER */}
        <div 
            className="absolute inset-0 w-full h-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: folder.cover.value }}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="transform group-hover:scale-110 transition-transform duration-300">
               {getIcon('Folder')}
            </div>
        </div>

        {/* BADGES */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
           {folder.isShared && (
             <div className="bg-white/20 backdrop-blur-md border border-white/10 text-white p-1.5 rounded-full shadow-sm">
                <Users className="w-3 h-3" />
             </div>
           )}
           <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
             {folder.itemCount}
           </div>
        </div>

        {/* TITLE OVERLAY (Bottom) */}
        <div className="absolute bottom-0 inset-x-0 p-4 pt-8 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate pr-4">
            {folder.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-white/60 text-[10px] font-medium uppercase tracking-wider">
             <Clock className="w-3 h-3" />
             <span>{tFolder.modified} {new Date(folder.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
