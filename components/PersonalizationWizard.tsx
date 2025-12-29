
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, GraduationCap, Heart, Video, Microscope, DollarSign, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RoleOption {
  id: string;
  labelKey: keyof typeof WIZARD_I18N['en']['roles'];
  // Fixed: Use ComponentType instead of ElementType to ensure it has construct/call signatures for JSX
  icon: React.ComponentType<any>;
  calculators: string[];
  color: string;
}

const WIZARD_I18N = {
  en: {
    bannerTitle: 'Help us customize your experience',
    bannerSub: 'Get tailored calculator suggestions.',
    goAhead: 'Go ahead',
    selectTitle: 'Which describes you best?',
    selectSub: "We'll show you tools relevant to your needs.",
    recommended: 'Recommended for you',
    basedOn: 'Based on your {role} profile',
    maybeLater: 'Maybe later',
    roles: {
      student: 'Student',
      patient: 'Health / Patient',
      influencer: 'Influencer',
      science: 'Physics / Science',
      investor: 'Investor / Money'
    },
    calcSuffix: 'Calculator'
  },
  es: {
    bannerTitle: 'Ayúdanos a personalizar tu experiencia',
    bannerSub: 'Obtén sugerencias de calculadoras a tu medida.',
    goAhead: 'Continuar',
    selectTitle: '¿Qué te describe mejor?',
    selectSub: 'Te mostraremos herramientas relevantes para tus necesidades.',
    recommended: 'Recomendado para ti',
    basedOn: 'Basado en tu perfil de {role}',
    maybeLater: 'Quizás más tarde',
    roles: {
      student: 'Estudiante',
      patient: 'Salud / Paciente',
      influencer: 'Influencer',
      science: 'Física / Ciencia',
      investor: 'Inversor / Dinero'
    },
    calcSuffix: 'Calculadora'
  },
  fr: {
    bannerTitle: 'Aidez-nous à personnaliser votre expérience',
    bannerSub: 'Obtenez des suggestions de calculatrices sur mesure.',
    goAhead: 'Continuer',
    selectTitle: "Qu'est-ce qui vous décrit le mieux ?",
    selectSub: 'Nous vous montrerons les outils adaptés à vos besoins.',
    recommended: 'Récommandé pour vous',
    basedOn: 'Basé sur votre profil {role}',
    maybeLater: 'Plus tard',
    roles: {
      student: 'Étudiant',
      patient: 'Santé / Patient',
      influencer: 'Influenceur',
      science: 'Physique / Science',
      investor: 'Investisseur / Argent'
    },
    calcSuffix: 'Calculatrice'
  },
  ru: {
    bannerTitle: 'Помогите нам настроить сервис под вас',
    bannerSub: 'Получите персональные рекомендации калькуляторов.',
    goAhead: 'Продолжить',
    selectTitle: 'Что лучше всего описывает вас?',
    selectSub: 'Мы подберем инструменты под ваши нужды.',
    recommended: 'Рекомендовано для вас',
    basedOn: 'На основе вашего профиля {role}',
    maybeLater: 'Может быть позже',
    roles: {
      student: 'Студент',
      patient: 'Здоровье / Пациент',
      influencer: 'Инфлюенсер',
      science: 'Физика / Наука',
      investor: 'Инвестор / Деньги'
    },
    calcSuffix: 'Калькулятор'
  },
  hi: {
    bannerTitle: 'अपना अनुभव अनुकूलित करने में हमारी सहायता करें',
    bannerSub: 'अपनी आवश्यकताओं के अनुसार कैलकुलेटर सुझाव प्राप्त करें।',
    goAhead: 'आगे बढ़ें',
    selectTitle: 'आपका सबसे अच्छा वर्णन क्या है?',
    selectSub: 'हम आपको आपकी आवश्यकताओं के अनुसार उपकरण दिखाएंगे।',
    recommended: 'आपके लिए अनुशंसित',
    basedOn: 'आपके {role} प्रोफाइल के आधार पर',
    maybeLater: 'बाद में',
    roles: {
      student: 'छात्र',
      patient: 'स्वास्थ्य / रोगी',
      influencer: 'इन्फ्लुएंसर',
      science: 'भौतिकी / विज्ञान',
      investor: 'निवेशक / पैसा'
    },
    calcSuffix: 'कैलकुलेटर'
  },
  ar: {
    bannerTitle: 'ساعدنا في تخصيص تجربتك',
    bannerSub: 'احصل على اقتراحات مخصصة للآلات الحاسبة.',
    goAhead: 'استمر',
    selectTitle: 'أيهما يصفك بشكل أفضل؟',
    selectSub: 'سنعرض لك الأدوات ذات الصلة باحتياجاتك.',
    recommended: 'موصى به لك',
    basedOn: 'بناءً على ملفك الشخصي كـ {role}',
    maybeLater: 'ربما لاحقاً',
    roles: {
      student: 'طالب',
      patient: 'صحة / مريض',
      influencer: 'مؤثر',
      science: 'فيزياء / علوم',
      investor: 'مستثمر / مال'
    },
    calcSuffix: 'حاسبة'
  }
};

const roles: RoleOption[] = [
  { id: 'student', labelKey: 'student', icon: GraduationCap, calculators: ['gpa', 'final-grade', 'pomodoro'], color: 'text-blue-500' },
  { id: 'patient', labelKey: 'patient', icon: Heart, calculators: ['bmi', 'bmr', 'water'], color: 'text-rose-500' },
  { id: 'influencer', labelKey: 'influencer', icon: Video, calculators: ['engagement', 'youtube-rpm', 'tiktok'], color: 'text-purple-500' },
  { id: 'science', labelKey: 'science', icon: Microscope, calculators: ['throw', 'trig', 'quad'], color: 'text-amber-500' },
  { id: 'investor', labelKey: 'investor', icon: DollarSign, calculators: ['mortgage', 'savings-goal', 'compound'], color: 'text-emerald-500' }
];

const STORAGE_KEY = 'calcverse_personalization_dismissed';

const PersonalizationWizard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [step, setStep] = useState<'banner' | 'select' | 'result'>('banner');
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  
  const { language, dir } = useLanguage();
  const navigate = useNavigate();

  // Pick translation based on current language or fallback to English
  const i18n = WIZARD_I18N[language as keyof typeof WIZARD_I18N] || WIZARD_I18N.en;

  const SelectedIcon = selectedRole?.icon;

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsDismissed(false);
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => setIsDismissed(true), 300);
  };

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role);
    setStep('result');
  };

  const handleNavigate = (id: string) => {
    navigate(`/calculator/${id}`);
    handleDismiss();
  };

  if (isDismissed) return null;

  return (
    <div className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} dir={dir}>
      <div className="bg-card dark:bg-slate-800 border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden relative">
        {/* Close Button - positioned absolutely to avoid overlap with content, but with safe padding on the content side */}
        <button 
          onClick={handleDismiss}
          className="absolute top-2 end-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors z-30"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'banner' && (
          <div className="p-4 pe-12 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
               <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-slate-900 dark:text-white text-sm">{i18n.bannerTitle}</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">{i18n.bannerSub}</p>
            </div>
            <button 
              onClick={() => setStep('select')}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-2 group"
            >
              {i18n.goAhead}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </button>
          </div>
        )}

        {step === 'select' && (
          <div className="p-6 animate-fade-in">
             <div className="mb-4">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">{i18n.selectTitle}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">{i18n.selectSub}</p>
             </div>
             <div className="grid grid-cols-2 gap-2">
                {roles.map(role => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                    >
                      {/* Fixed: Icon can now be used as a JSX component due to updated RoleOption.icon type */}
                      <Icon className={`w-6 h-6 ${role.color} transition-transform group-hover:scale-110`} />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{i18n.roles[role.labelKey]}</span>
                    </button>
                  );
                })}
             </div>
          </div>
        )}

        {step === 'result' && selectedRole && SelectedIcon && (
          <div className="p-6 animate-fade-in">
             <div className="mb-4 flex items-center gap-2">
               <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50`}>
                 {/* Fixed: SelectedIcon can now be used as a JSX component due to updated RoleOption.icon type */}
                 <SelectedIcon className={`w-5 h-5 ${selectedRole.color}`} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{i18n.recommended}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {i18n.basedOn.replace('{role}', i18n.roles[selectedRole.labelKey])}
                  </p>
               </div>
             </div>
             
             <div className="space-y-2 mb-4">
                {selectedRole.calculators.map(id => (
                  <button
                    key={id}
                    onClick={() => handleNavigate(id)}
                    className="w-full text-start p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
                  >
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize">
                       {id.replace(/-/g, ' ')} {i18n.calcSuffix}
                     </span>
                     <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors rtl:rotate-180" />
                  </button>
                ))}
             </div>
             
             <button 
               onClick={handleDismiss}
               className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
             >
               {i18n.maybeLater}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizationWizard;
