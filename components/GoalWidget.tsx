
import React, { useState } from 'react';
import { Goal } from '../types';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, Check, MoreVertical, Trash2, Edit2, Play, Trophy, X } from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GOAL_TRANSLATIONS } from '../utils/goalTranslations';

interface Props {
  goal: Goal;
}

const GoalWidget: React.FC<Props> = ({ goal }) => {
  const navigate = useNavigate();
  const { deleteGoal, updateGoal } = useGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(goal.currentValue.toString());
  
  const { language } = useLanguage();
  const t = (key: string) => GOAL_TRANSLATIONS[language]?.[key] || GOAL_TRANSLATIONS['en'][key];

  const percent = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
  
  const handleUpdate = () => {
    // Navigate to calculator with saved inputs
    const params = new URLSearchParams();
    Object.keys(goal.inputs).forEach(key => {
        params.append(key, String(goal.inputs[key]));
    });
    navigate(`/calculator/${goal.calculatorId}?${params.toString()}`);
  };

  const handleQuickUpdate = () => {
    const val = parseFloat(editVal);
    if (!isNaN(val)) {
        updateGoal(goal.id, { currentValue: val });
        setIsEditing(false);
    }
  };

  return (
    <div className="bg-card dark:bg-slate-800 border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-3">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${percent >= 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                {percent >= 100 ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{goal.title}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                   {goal.deadline && (
                     <>
                        <Calendar className="w-3 h-3" /> 
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                     </>
                   )}
                </div>
            </div>
         </div>
         
         <div className="flex gap-1">
             <button 
               onClick={() => deleteGoal(goal.id)}
               className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
               title={t('delete')}
             >
                <Trash2 className="w-4 h-4" />
             </button>
             <button 
               onClick={handleUpdate}
               className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
               title={t('open')}
             >
                <Play className="w-4 h-4" />
             </button>
         </div>
      </div>

      <div className="space-y-2 mb-4">
         <div className="flex justify-between text-sm font-medium">
             <span className="text-slate-500">{goal.unit === '$' ? '$' : ''}{goal.currentValue}{goal.unit !== '$' ? ` ${goal.unit}` : ''}</span>
             <span className="text-slate-900 dark:text-white">{goal.unit === '$' ? '$' : ''}{goal.targetValue}{goal.unit !== '$' ? ` ${goal.unit}` : ''}</span>
         </div>
         <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${percent >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
             ></div>
         </div>
         <div className="text-right text-xs font-bold text-primary">
            {percent.toFixed(0)}% {t('complete')}
         </div>
      </div>

      {isEditing ? (
         <div className="flex gap-2 animate-fade-in">
            <input 
              type="number" 
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
            />
            <button onClick={handleQuickUpdate} className="p-1 bg-emerald-500 text-white rounded-lg">
                <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-lg">
                <X className="w-4 h-4" />
            </button>
         </div>
      ) : (
         <button 
           onClick={() => setIsEditing(true)}
           className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
         >
            <Edit2 className="w-3 h-3" /> {t('updateProgress')}
         </button>
      )}
    </div>
  );
};

export default GoalWidget;
