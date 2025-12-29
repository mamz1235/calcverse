
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFolders } from '../contexts/FolderContext';
import { ArrowLeft, Edit2, Trash2, Plus, Calculator, X, Check } from 'lucide-react';
import { CALCULATORS, getCalculatorById } from '../utils/calculatorRegistry';
import { useLanguage } from '../contexts/LanguageContext';
import CategoryIcon from '../components/CategoryIcon';
import { projectFolderTranslations } from '../utils/projectFolderTranslations';

const ProjectFolderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFolder, renameFolder, deleteFolder, addCalculatorToFolder, removeCalculatorFromFolder } = useFolders();
  const { t, language } = useLanguage();
  
  const folder = getFolder(id || '');
  const tFolder = projectFolderTranslations[language] || projectFolderTranslations['en'];

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [showAddCalcModal, setShowAddCalcModal] = useState(false);
  const [searchCalc, setSearchCalc] = useState('');

  if (!folder) {
    return <div className="p-8 text-center text-slate-500">Folder not found.</div>;
  }

  const handleRename = () => {
    if (editName.trim()) {
      renameFolder(folder.id, editName);
    }
    setIsEditingName(false);
  };

  const startEditing = () => {
    setEditName(folder.name);
    setIsEditingName(true);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this folder?')) {
      deleteFolder(folder.id);
      navigate('/project-folders');
    }
  };

  const filteredCalculators = CALCULATORS.filter(c => 
    t(c.name).toLowerCase().includes(searchCalc.toLowerCase()) || 
    t(c.category).toLowerCase().includes(searchCalc.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <Link to="/project-folders" className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rtl:rotate-180" />
           </Link>
           
           {isEditingName ? (
             <div className="flex items-center gap-2">
               <input 
                 type="text" 
                 value={editName}
                 onChange={e => setEditName(e.target.value)}
                 className="text-2xl font-bold bg-transparent border-b-2 border-primary outline-none text-slate-900 dark:text-white"
                 autoFocus
               />
               <button onClick={handleRename} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Check className="w-4 h-4" /></button>
               <button onClick={() => setIsEditingName(false)} className="p-1 bg-slate-400 text-white rounded hover:bg-slate-500"><X className="w-4 h-4" /></button>
             </div>
           ) : (
             <div className="flex items-center gap-3 group">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{folder.name}</h1>
               <button onClick={startEditing} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition-opacity">
                 <Edit2 className="w-4 h-4" />
               </button>
             </div>
           )}
         </div>
         
         <button 
           onClick={handleDelete}
           className="text-rose-500 hover:text-rose-600 font-medium flex items-center gap-2 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors"
         >
            <Trash2 className="w-4 h-4" /> {tFolder.deleteFolder}
         </button>
      </div>
      
      {/* Cover / Info Strip */}
      <div className="h-24 rounded-2xl w-full relative overflow-hidden" style={{ backgroundColor: folder.cover.value }}>
         <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-8">
            <span className="text-white/80 font-mono text-sm">{tFolder.toolsIncluded.replace('{count}', folder.calculatorIds.length.toString())}</span>
         </div>
      </div>

      {/* Content */}
      <div>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tFolder.calculatorsSection}</h2>
            <button 
              onClick={() => setShowAddCalcModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
               <Plus className="w-4 h-4" /> {tFolder.addCalculator}
            </button>
         </div>

         {folder.calculatorIds.length === 0 ? (
           <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">{tFolder.noCalculatorsTitle}</p>
              <button onClick={() => setShowAddCalcModal(true)} className="text-primary font-bold mt-2 hover:underline">{tFolder.addFirstTool}</button>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {folder.calculatorIds.map(calcId => {
               const calc = getCalculatorById(calcId);
               if (!calc) return null;
               return (
                 <div key={calcId} className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                    <Link to={`/calculator/${calc.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                          <CategoryIcon category={calc.category} className="w-5 h-5" />
                       </div>
                       <div className="truncate">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{t(calc.name)}</div>
                          <div className="text-xs text-slate-500">{t(calc.category)}</div>
                       </div>
                    </Link>
                    <button 
                      onClick={() => removeCalculatorFromFolder(folder.id, calcId)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from folder"
                    >
                       <X className="w-4 h-4" />
                    </button>
                 </div>
               );
             })}
           </div>
         )}
      </div>

      {/* Add Calculator Modal */}
      {showAddCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-card dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tFolder.addToolModalTitle}</h2>
                 <button onClick={() => setShowAddCalcModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 shrink-0">
                 <input 
                   type="text" 
                   placeholder={tFolder.searchPlaceholder}
                   value={searchCalc}
                   onChange={e => setSearchCalc(e.target.value)}
                   className="w-full p-3 bg-white dark:bg-slate-800 border border-border rounded-xl outline-none focus:ring-1 focus:ring-primary"
                   autoFocus
                 />
              </div>

              <div className="overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
                 {filteredCalculators.map(calc => {
                   const isAdded = folder.calculatorIds.includes(calc.id);
                   return (
                     <button 
                       key={calc.id}
                       disabled={isAdded}
                       onClick={() => {
                         addCalculatorToFolder(folder.id, calc.id);
                         setShowAddCalcModal(false);
                         setSearchCalc('');
                       }}
                       className={`text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                         isAdded 
                         ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 border-transparent' 
                         : 'hover:border-primary/50 hover:bg-primary/5 border-border bg-card'
                       }`}
                     >
                        <div className={`p-2 rounded-lg ${isAdded ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-slate-100 dark:bg-slate-900 text-primary'}`}>
                           <CategoryIcon category={calc.category} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{t(calc.name)}</div>
                           <div className="text-xs text-slate-500 truncate">{t(calc.category)}</div>
                        </div>
                        {isAdded && <Check className="w-4 h-4 text-green-500" />}
                     </button>
                   );
                 })}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFolderView;
