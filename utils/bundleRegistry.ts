
import { CalculatorDef } from '../types';
import { CALCULATORS } from './calculatorRegistry';

export interface BundleDef {
  id: string;
  title: string;
  description: string;
  category: 'Finance' | 'Health' | 'Business' | 'Life' | 'Education' | 'Tech';
  calculatorIds: string[];
  usageFlow: string;
}

const getCalcName = (id: string) => CALCULATORS.find(c => c.id === id)?.name || id;

export const BUNDLES: BundleDef[] = [
  // --- FINANCE ---
  {
    id: 'homebuyer-pack',
    title: 'The Homebuyer Pack',
    description: 'Everything you need to plan your home purchase, from affordability to closing.',
    category: 'Finance',
    calculatorIds: ['affordability', 'mortgage', 'rent-buy', 'refi-break'],
    usageFlow: 'Start with **Home Affordability** to see what you can borrow. Use **Rent vs Buy** to decide if now is the right time. Finally, calculate your monthly commitment with the **Mortgage Payment** tool.'
  },
  {
    id: 'debt-destroyer',
    title: 'Debt Destroyer Kit',
    description: 'Strategic tools to analyze debt, plan payoffs, and regain financial freedom.',
    category: 'Finance',
    calculatorIds: ['dti', 'credit-payoff', 'budget', 'savings-goal'],
    usageFlow: 'Check your health with **Debt-to-Income**. Use **Credit Card Payoff** to plan your attack strategy. Reallocate funds with **Budget Allocation** to speed up the process.'
  },
  {
    id: 'retirement-ready',
    title: 'Retirement Ready',
    description: 'Long-term planning tools to ensure your golden years are funded.',
    category: 'Finance',
    calculatorIds: ['retirement', 'pension', 'pension-impact', 'compound'],
    usageFlow: 'Project your total needs with **Retirement Projection**. Add pension details with **Pension Value**. Use **Compound Interest** to see how extra savings grow over time.'
  },
  {
    id: 'investor-toolkit',
    title: 'The Investor Toolkit',
    description: 'Analyze potential returns and tax implications of your portfolio.',
    category: 'Finance',
    calculatorIds: ['roi', 'cap-gains', 'after-tax-ret', 'compound'],
    usageFlow: 'Calculate potential **Investment ROI**. Check **Capital Gains** to estimate taxes on profits. Use **After-Tax Return** to see your real bottom line.'
  },
  {
    id: 'freelance-financer',
    title: 'Freelance Financer',
    description: 'Manage variable income, taxes, and pricing as a solo professional.',
    category: 'Business',
    calculatorIds: ['freelance', 'self-emp', 'invoice', 'tax-est'],
    usageFlow: 'Determine your **Freelance Rate** based on goals. Estimate **Self-Employment Tax** to save appropriately. Check **Invoice Due** dates to manage cash flow.'
  },
  
  // --- HEALTH ---
  {
    id: 'weight-loss-warrior',
    title: 'Weight Loss Warrior',
    description: 'Data-driven tools to understand your body\'s energy needs and composition.',
    category: 'Health',
    calculatorIds: ['bmi', 'tdee', 'bodyfat', 'macros'],
    usageFlow: 'Find your baseline with **TDEE**. Estimate **Body Fat** for a better metric than weight. Plan your diet with **Macro Split**.'
  },
  {
    id: 'muscle-builder',
    title: 'Muscle Builder Pack',
    description: 'Optimize nutrition and training intensity for hypertrophy.',
    category: 'Health',
    calculatorIds: ['bmr', 'macros', 'recipe-macro', 'cal-cost'],
    usageFlow: 'Calculate **BMR** to know your minimums. Use **Macro Split** (high protein) for diet. Analyze your meal preps with **Recipe Macro**.'
  },
  {
    id: 'keto-kickstart',
    title: 'Keto Kickstart',
    description: 'Essential calculators for maintaining a ketogenic lifestyle.',
    category: 'Health',
    calculatorIds: ['keto', 'carb-lookup', 'water', 'bmr'], // Note: carb-lookup mapped to cal-lookup conceptually if generic
    usageFlow: 'Set your **Keto Macros**. Ensure you drink enough with **Water Intake**. Monitor your base burn with **BMR**.'
  },
  
  // --- BUSINESS ---
  {
    id: 'startup-launcher',
    title: 'Startup Launcher',
    description: 'Key metrics for early-stage companies to track viability and growth.',
    category: 'Business',
    calculatorIds: ['burn', 'cac', 'clv', 'break-even'],
    usageFlow: 'Calculate your **Burn Rate** runway. Determine your **Break-Even** point. Ensure **CLV** (Customer Lifetime Value) is higher than **CAC** (Acquisition Cost).'
  },
  {
    id: 'ecommerce-pro',
    title: 'E-commerce Pro',
    description: 'Optimize pricing, margins, and inventory for your online store.',
    category: 'Business',
    calculatorIds: ['margin', 'markup', 'reorder', 'profit'],
    usageFlow: 'Set prices with **Markup**. Check your actual **Profit Margin**. Use **Reorder Point** to manage inventory stock.'
  },
  {
    id: 'digital-marketer',
    title: 'Digital Marketer',
    description: 'Analyze campaign performance and social media growth.',
    category: 'Business',
    calculatorIds: ['roas', 'cpm-conv', 'engagement', 'ad-pace'],
    usageFlow: 'Track ad spend efficiency with **ROAS**. Convert metrics with **CPM to RPM**. Monitor audience health with **Engagement Rate**.'
  },
  
  // --- LIFE & EDUCATION ---
  {
    id: 'student-survival',
    title: 'Student Survival',
    description: 'Academic planning and budgeting tools for university life.',
    category: 'Education',
    calculatorIds: ['gpa', 'final-grade', 'budget', 'student-loan'], // student-loan via amortization
    usageFlow: 'Track performance with **GPA Calculator**. Find out what you need on the exam with **Final Grade Needed**. Manage limited funds with **Budget Allocation**.'
  },
  {
    id: 'diy-renovator',
    title: 'DIY Renovator',
    description: 'Material estimation tools for home improvement projects.',
    category: 'Life',
    calculatorIds: ['paint', 'flooring', 'concrete', 'roof'],
    usageFlow: 'Measure rooms for **Flooring** and **Paint Needs**. Estimate exterior work with **Roof Area** or **Concrete Vol**.'
  },
  {
    id: 'travel-planner',
    title: 'Travel Planner',
    description: 'Logistics and budgeting for your next international trip.',
    category: 'Life',
    calculatorIds: ['budget-trip', 'curr-conv', 'trip-cost', 'jetlag'],
    usageFlow: 'Set a **Daily Budget**. Use **Currency** conversion for prices. Plan driving with **Trip Cost** and recovery with **Jet Lag**.'
  },
  {
    id: 'car-buyer',
    title: 'Car Buyer Suite',
    description: 'Analyze the total cost of auto ownership.',
    category: 'Life',
    calculatorIds: ['car-loan', 'lease', 'depreciation', 'fuel-cost'], // fuel via trip-cost
    usageFlow: 'Compare **Car Loan** vs **Lease Cost**. Check future **Car Value** (depreciation). Estimate ongoing **Trip Cost** (fuel).'
  },
  {
    id: 'event-planner',
    title: 'Event Planner',
    description: 'Logistics for weddings, parties, and corporate events.',
    category: 'Life',
    calculatorIds: ['evt-bud', 'catering', 'alcohol', 'seating'],
    usageFlow: 'Start with **Event Budget**. Plan food and drink with **Catering** and **Drinks**. Determine space needs with **Seating**.'
  },
  
  // --- TECH & SPECIALTY ---
  {
    id: 'content-creator',
    title: 'Content Creator',
    description: 'Revenue estimation and technical tools for video/audio.',
    category: 'Tech',
    calculatorIds: ['youtube-rpm', 'tiktok', 'bitrate', 'time-lapse'],
    usageFlow: 'Estimate earnings with **YouTube RPM** or **TikTok Est**. Plan upload quality with **Bitrate Calc**.'
  },
  {
    id: 'eco-warrior',
    title: 'Eco Warrior',
    description: 'Tools to measure and reduce your environmental impact.',
    category: 'Life',
    calculatorIds: ['flight-co2', 'ghg', 'solar', 'ev-charge'],
    usageFlow: 'Check travel impact with **Flight CO2**. Estimate home improvement with **Solar Est** or **EV Charge** savings.'
  },
  {
    id: 'gardener-guru',
    title: 'Gardening Guru',
    description: 'Soil, water, and planting calculations for a thriving garden.',
    category: 'Life',
    calculatorIds: ['soil', 'fert', 'irrig', 'seeds'],
    usageFlow: 'Calculate **Garden Soil** volume. Determine **Fertilizer** needs. Check **Water Req** based on rainfall.'
  },
  {
    id: 'teacher-aide',
    title: 'Teacher\'s Aide',
    description: 'Quick grading and aggregate calculation tools.',
    category: 'Education',
    calculatorIds: ['aggregator', 'gpa', 'pomodoro', 'read-grade'],
    usageFlow: 'Combine scores with **Grade Aggregator**. Check text difficulty with **Read Level**. Manage grading time with **Pomodoro Planner**.'
  }
];

export const getBundleById = (id: string) => BUNDLES.find(b => b.id === id);

export const getBundlesByCategory = (category: string) => BUNDLES.filter(b => b.category === category);
