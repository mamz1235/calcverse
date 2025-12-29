
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ElectricalLoadBalancer from '../components/ElectricalLoadBalancer';

const LoadBalancerPage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      <ElectricalLoadBalancer />
    </div>
  );
};

export default LoadBalancerPage;
