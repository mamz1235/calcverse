
import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getCalculatorById } from '../utils/calculatorRegistry';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGES = ['en', 'es', 'fr', 'ru', 'hi', 'ar'];
const BASE_DOMAIN = 'https://calc-verse.com';

const SEOHead: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    // 1. Clean up existing tags to prevent duplicates
    const existingAlternateTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternateTags.forEach(tag => tag.remove());
    
    const existingOgImage = document.querySelector('meta[property="og:image"]');
    if (existingOgImage) existingOgImage.remove();
    
    const existingTwitterImage = document.querySelector('meta[name="twitter:image"]');
    if (existingTwitterImage) existingTwitterImage.remove();

    const head = document.head;
    
    // 2. Handle Canonical & Hreflang
    const currentPath = location.pathname === '/' ? '' : location.pathname;

    LANGUAGES.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      let href = '';
      if (lang === 'en') {
         href = `${BASE_DOMAIN}${currentPath}`;
      } else {
         href = `${BASE_DOMAIN}/${lang}${currentPath}`;
      }
      link.href = href;
      head.appendChild(link);
    });

    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${BASE_DOMAIN}${currentPath}`;
    head.appendChild(xDefault);

    // 3. Dynamic Open Graph Image URL Construction
    let ogImageUrl = `${BASE_DOMAIN}/og-default.jpg`;
    
    if (location.pathname.startsWith('/calculator/')) {
        const id = location.pathname.split('/')[2];
        const calc = getCalculatorById(id);
        if (calc) {
            const params = new URLSearchParams();
            params.append('title', t(calc.name));
            params.append('category', t(calc.category) || calc.category);
            
            // Calculate result if params are present
            let calculatedResult = '';
            try {
                const inputs: Record<string, any> = {};
                let hasCustomInput = false;
                
                calc.inputs.forEach(inp => {
                    const paramVal = searchParams.get(inp.id);
                    if (paramVal !== null && paramVal !== undefined) {
                        hasCustomInput = true;
                        if (inp.type === 'number' || inp.type === 'currency' || inp.type === 'percentage') {
                            const num = parseFloat(paramVal);
                            inputs[inp.id] = isNaN(num) ? inp.defaultValue : num;
                        } else {
                            inputs[inp.id] = paramVal;
                        }
                    } else {
                        inputs[inp.id] = inp.defaultValue;
                    }
                });

                if (hasCustomInput) {
                    const res = calc.calculate(inputs);
                    if (res && res.mainValue) {
                        calculatedResult = res.mainValue;
                    }
                }
            } catch (e) {
                console.error("Failed to calculate SEO result", e);
            }

            if (calculatedResult) {
                params.append('result', calculatedResult);
            }
            
            ogImageUrl = `${BASE_DOMAIN}/api/og?${params.toString()}`;
        }
    }

    const metaOgImage = document.createElement('meta');
    metaOgImage.setAttribute('property', 'og:image');
    metaOgImage.setAttribute('content', ogImageUrl);
    head.appendChild(metaOgImage);

    const metaTwitterImage = document.createElement('meta');
    metaTwitterImage.setAttribute('name', 'twitter:image');
    metaTwitterImage.setAttribute('content', ogImageUrl);
    head.appendChild(metaTwitterImage);

    return () => {
      // Cleanup on unmount/change
      const tags = document.querySelectorAll('link[rel="alternate"][hreflang]');
      tags.forEach(tag => tag.remove());
      const og = document.querySelector('meta[property="og:image"]');
      if (og) og.remove();
      const tw = document.querySelector('meta[name="twitter:image"]');
      if (tw) tw.remove();
    };
  }, [location.pathname, location.search, t, searchParams]);

  return null;
};

export default SEOHead;
