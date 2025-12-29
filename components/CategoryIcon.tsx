import React from 'react';
import { 
  CircleDollarSign, Wallet, Activity, Utensils, GraduationCap, Briefcase, 
  Building2, Megaphone, Cpu, ArrowLeftRight, Home, Hammer, Car, Plane, 
  Leaf, FlaskConical, Scale, Baby, Shirt, Trophy, Gamepad2, Music, 
  Camera, PenTool, ShoppingBag, CalendarDays, Sparkles, Settings, Calculator, Zap
} from 'lucide-react';
import { Category } from '../types';

interface Props {
  category: string;
  className?: string;
}

export const getIconComponent = (category: string) => {
    switch (category) {
      case Category.FINANCE: return CircleDollarSign;
      case Category.PERSONAL_FINANCE: return Wallet;
      case Category.HEALTH: return Activity;
      case Category.NUTRITION: return Utensils;
      case Category.EDUCATION: return GraduationCap;
      case Category.CAREER: return Briefcase;
      case Category.BUSINESS: return Building2;
      case Category.MARKETING: return Megaphone;
      case Category.TECH: return Cpu;
      case Category.CONVERTERS: return ArrowLeftRight;
      case Category.HOME: return Home;
      case Category.CONSTRUCTION: return Hammer;
      case Category.AUTO: return Car;
      case Category.TRAVEL: return Plane;
      case Category.ENERGY: return Zap;
      case Category.ECOLOGY: return Leaf;
      case Category.SCIENCE: return FlaskConical;
      case Category.LEGAL: return Scale;
      case Category.FAMILY: return Baby;
      case Category.LIFESTYLE: return Shirt;
      case Category.SPORTS: return Trophy;
      case Category.GAMING: return Gamepad2;
      case Category.AUDIO: return Music;
      case Category.MEDIA: return Camera;
      case Category.WRITING: return PenTool;
      case Category.SHOPPING: return ShoppingBag;
      case Category.EVENTS: return CalendarDays;
      case Category.MISC: return Sparkles;
      case Category.ADMIN: return Settings;
      default: return Calculator;
    }
};

const CategoryIcon: React.FC<Props> = ({ category, className }) => {
  const Icon = getIconComponent(category);
  return <Icon className={className} />;
};

export default CategoryIcon;