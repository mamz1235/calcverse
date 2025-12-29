
import React, { useMemo } from 'react';
import { CalculatorDef } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSEOArticle } from '../utils/seoContentRepository';

interface Props {
  calculator: CalculatorDef;
}

const CalculatorSEOArticle: React.FC<Props> = ({ calculator }) => {
  const { language } = useLanguage();

  const article = useMemo(() => {
    return generateSEOArticle(calculator, language);
  }, [calculator, language]);

  if (!article) return null;

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none mt-16 pt-10 border-t border-border">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {article.introduction}
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {article.whatIs.title}
        </h2>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {article.whatIs.content}
        </div>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {article.howItWorks.title}
        </h2>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {article.howItWorks.content}
        </div>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
          {article.howItWorks.steps.map((step, idx) => (
            <li key={idx}><strong className="text-slate-800 dark:text-slate-200">{step.label}:</strong> {step.description}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {article.stepByStep.title}
        </h2>
        <div className="space-y-6">
          {article.stepByStep.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {article.example.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {article.example.description}
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-border/50 font-mono text-sm space-y-2">
          {article.example.inputs.map((input, idx) => (
            <div key={idx} className="flex justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
              <span className="text-slate-500">{input.label}:</span>
              <span className="font-bold text-slate-900 dark:text-white">{input.value}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t-2 border-primary/20 flex justify-between">
            <span className="font-bold text-primary">Result:</span>
            <span className="font-bold text-primary">{article.example.result}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500 italic">
          {article.example.explanation}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {article.commonMistakes.title}
          </h2>
          <ul className="space-y-3">
            {article.commonMistakes.mistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <span className="text-rose-500 mt-1">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {article.whenUseful.title}
          </h2>
          <ul className="space-y-3">
            {article.whenUseful.cases.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <span className="text-emerald-500 mt-1">✓</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {article.interpretation.title}
        </h2>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {article.interpretation.content}
        </div>
      </section>

      <section className="mb-12 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {article.faq.title}
        </h2>
        <div className="grid gap-4">
          {article.faq.questions.map((faq, idx) => (
            <details key={idx} className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-slate-900 dark:text-white">
                <h3 className="text-lg">{faq.question}</h3>
                <span className="shrink-0 rounded-full bg-white dark:bg-slate-700 p-1.5 text-slate-900 dark:text-white sm:p-3 shadow-sm group-open:bg-primary group-open:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300 text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {article.conclusion.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          {article.conclusion.content}
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1"
        >
          {article.conclusion.cta}
        </button>
      </section>
    </article>
  );
};

export default CalculatorSEOArticle;
