
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocaleConfig, detectLocation, getDefaultConfig, getSymbolFromCurrency } from '../utils/localizationHelper';

interface LocalizationContextType extends LocaleConfig {
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  convertFromUSD: (usdValue: number) => number; // Simple placeholder if we had rates
  setCurrency: (code: string) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LocaleConfig>(getDefaultConfig());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      // Check if user has manually set a currency before
      const savedCurrency = localStorage.getItem('calcverse_currency');
      
      const detected = await detectLocation();
      
      if (mounted) {
        setConfig(prev => ({ 
            ...prev, 
            ...detected,
            // Override with saved preference if exists
            currency: savedCurrency || detected.currency || 'USD',
            currencySymbol: getSymbolFromCurrency(savedCurrency || detected.currency || 'USD')
        }));
        setIsLoading(false);
      }
    };

    init();

    return () => { mounted = false; };
  }, []);

  const setCurrency = (code: string) => {
      const symbol = getSymbolFromCurrency(code);
      setConfig(prev => ({
          ...prev,
          currency: code,
          currencySymbol: symbol
      }));
      localStorage.setItem('calcverse_currency', code);
  };

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      return `${config.currencySymbol}${value.toFixed(2)}`;
    }
  };

  // For now, we assume values input by user are ALREADY in local currency.
  // We do not convert calculator result values (which are unitless math) unless they are explicitly hardcoded money strings.
  const convertFromUSD = (val: number) => val; 

  return (
    <LocalizationContext.Provider value={{ ...config, isLoading, formatCurrency, convertFromUSD, setCurrency }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
