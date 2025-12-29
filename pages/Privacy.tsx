import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Privacy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 transform rtl:rotate-180" /> {t('terms.back')}
        </Link>
      </div>

      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto border border-secondary/20 shadow-xl shadow-secondary/5">
            <Lock className="w-10 h-10 text-secondary" />
        </div>
        <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{t('privacy.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('terms.updated')}: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border p-8 md:p-12 shadow-2xl space-y-12">
        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-secondary font-mono border border-border">01</span>
                {t('privacy.section1.title')}
            </h3>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
                <p>
                    {t('privacy.section1.body1')}
                </p>
                <p>
                    {t('privacy.section1.body2')}
                </p>
            </div>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-secondary font-mono border border-border">02</span>
                {t('privacy.section2.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {t('privacy.section2.body')}
            </p>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-secondary font-mono border border-border">03</span>
                {t('privacy.section3.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {t('privacy.section3.body')}
            </p>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-secondary font-mono border border-border">04</span>
                {t('privacy.section4.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {t('privacy.section4.body')}
            </p>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-secondary font-mono border border-border">05</span>
                {t('privacy.section5.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {t('privacy.section5.body')}
            </p>
        </section>
      </div>

       {/* Contact / Request Section */}
       <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto p-8 opacity-10 rtl:flip-x">
            <Mail className="w-48 h-48 text-secondary" />
        </div>
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('privacy.contact.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">
                {t('privacy.contact.body')}
            </p>
            <a href="mailto:calcverse91@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg dark:shadow-white/10 group">
                calcverse91@gmail.com
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;