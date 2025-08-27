
import React from 'react';
import { ActiveView } from '../types';
import { 
  DashboardIcon, 
  AIFactoryIcon,
  DistributionIcon,
  CRMIcon,
  AnalyticsIcon, 
  AutomationIcon,
  InteractiveIcon,
  SettingsIcon,
  PrometheusIcon 
} from './icons/Icons';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: ActiveView;
  activeView: ActiveView;
  onClick: (view: ActiveView) => void;
}> = ({ icon, label, view, activeView, onClick }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </button>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-gray-800 p-4 flex-col border-r border-gray-700 hidden md:flex">
      <div className="flex items-center mb-8 px-2">
        <PrometheusIcon />
        <h1 className="text-xl font-bold text-white ml-2">Prometheus OS</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem icon={<DashboardIcon />} label="Dashboard" view={ActiveView.DASHBOARD} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<AIFactoryIcon />} label="AI Factory" view={ActiveView.AI_FACTORY} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<DistributionIcon />} label="Distribution Hub" view={ActiveView.DISTRIBUTION} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<CRMIcon />} label="CRM" view={ActiveView.CRM} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<AnalyticsIcon />} label="Analytics" view={ActiveView.ANALYTICS} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<AutomationIcon />} label="Automation" view={ActiveView.AUTOMATION} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<InteractiveIcon />} label="Interactive AI" view={ActiveView.INTERACTIVE} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<SettingsIcon />} label="Settings" view={ActiveView.SETTINGS} activeView={activeView} onClick={setActiveView} />
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>Prometheus OS v2.0</p>
        <p>Open Source Core</p>
      </div>
    </aside>
  );
};

export default Sidebar;
