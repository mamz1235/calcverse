import React from 'react';

export enum Category {
  FINANCE = 'Finance & Money',
  PERSONAL_FINANCE = 'Personal Finance & Taxes',
  HEALTH = 'Health & Fitness',
  NUTRITION = 'Nutrition & Food',
  EDUCATION = 'Education & Study Tools',
  CAREER = 'Careers & HR',
  BUSINESS = 'Business & Finance Tools',
  MARKETING = 'Marketing & Social Media',
  TECH = 'Tech, Dev & Data',
  CONVERTERS = 'Conversions & Utilities',
  HOME = 'Home, DIY & Real Estate',
  CONSTRUCTION = 'Construction, Engineering & Trades',
  AUTO = 'Automotive & Transportation',
  TRAVEL = 'Travel & Transport',
  ENERGY = 'Energy & Utilities',
  ECOLOGY = 'Environment & Agriculture',
  SCIENCE = 'Science & Math',
  LEGAL = 'Law, Dates & Legal Tools',
  FAMILY = 'Parenting & Family',
  LIFESTYLE = 'Beauty, Fashion & Lifestyle',
  SPORTS = 'Sports & Recreation',
  GAMING = 'Gaming & Gamification',
  AUDIO = 'Music & Audio',
  MEDIA = 'Photography & Media',
  WRITING = 'Language & Writing Tools',
  SHOPPING = 'Shopping & E-commerce',
  EVENTS = 'Events & Planning',
  MISC = 'Misc & Fun / Niche Ideas',
  ADMIN = 'Utility / Admin'
}

export interface InputField {
  id: string;
  label: string;
  type: 'number' | 'percentage' | 'currency' | 'select' | 'date' | 'text';
  defaultValue: number | string;
  options?: { label: string; value: string }[]; // For select inputs
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface CalculationResult {
  mainValue: string;
  subText?: string;
  details?: { label: string; value: string }[];
  chartData?: ChartDataPoint[];
  chartType?: 'pie' | 'bar' | 'area';
  riskScore?: number; // 0-100 scale: 0 = Low Risk (Good), 100 = High Risk (Bad)
}

export interface CalculatorGuide {
  concept: string;
  formula: string;
  example: string;
}

export interface CalculatorDef {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string; // Lucide icon name
  inputs: InputField[];
  calculate: (values: Record<string, any>) => CalculationResult;
  // New feature: Reverse calculation for interactive sliders
  inverseCalculate?: (targetMainValue: number, inputToAdjustId: string, currentInputs: Record<string, any>) => Record<string, any>;
  seoContent: {
    title: string;
    intro: string;
    howItWorks: string;
    benefits: string;
  };
  guide: CalculatorGuide;
}

export interface HistoryItem {
  id: string;
  calculatorId: string;
  timestamp: number;
  inputs: Record<string, any>;
  result: CalculationResult;
}

export interface Goal {
  id: string;
  calculatorId: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: string;
  createdAt: number;
  inputs: Record<string, any>;
}

// Global JSX Intrinsic Elements for React Three Fiber
// This fixes TypeScript errors when using R3F components without full type augmentation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Augment React's JSX namespace as well for compatibility with different TS configs
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
