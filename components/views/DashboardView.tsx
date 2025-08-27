
import React from 'react';
import { ActiveView } from '../../types';
import Card from '../ui/Card';
import { AIFactoryIcon, DistributionIcon, CRMIcon, AnalyticsIcon, AutomationIcon, InteractiveIcon } from '../icons/Icons';

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
}

const ModuleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  view: ActiveView;
  onClick: (view: ActiveView) => void;
}> = ({ icon, title, description, view, onClick }) => (
  <Card className="flex flex-col text-center items-center hover:bg-gray-700/50 transition-colors duration-300">
    <div className="text-indigo-400 mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm flex-grow mb-4">{description}</p>
    <button
      onClick={() => onClick(view)}
      className="w-full mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
    >
      Launch
    </button>
  </Card>
);


const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome to Prometheus OS</h1>
      <p className="text-lg text-gray-400 mb-8">Your open-source command center for creator promotion.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          icon={<AIFactoryIcon />}
          title="AI Factory"
          description="Generate text, images, and ideas using a conceptual suite of open-source AI models."
          view={ActiveView.AI_FACTORY}
          onClick={setActiveView}
        />
        <ModuleCard
          icon={<DistributionIcon />}
          title="Distribution Hub"
          description="Simulate content scheduling, press release distribution, and email campaigns."
          view={ActiveView.DISTRIBUTION}
          onClick={setActiveView}
        />
        <ModuleCard
          icon={<CRMIcon />}
          title="CRM"
          description="Manage your contacts and relationships with media, fans, and collaborators."
          view={ActiveView.CRM}
          onClick={setActiveView}
        />
        <ModuleCard
          icon={<AnalyticsIcon />}
          title="Analytics"
          description="Visualize your campaign performance with a dynamic, AI-generated dashboard."
          view={ActiveView.ANALYTICS}
          onClick={setActiveView}
        />
        <ModuleCard
          icon={<AutomationIcon />}
          title="Automation"
          description="Design and conceptualize workflows to automate your marketing tasks."
          view={ActiveView.AUTOMATION}
          onClick={setActiveView}
        />
        <ModuleCard
          icon={<InteractiveIcon />}
          title="Interactive AI"
          description="Conceptualize and generate ideas for AR, VR, and other interactive fan experiences."
          view={ActiveView.INTERACTIVE}
          onClick={setActiveView}
        />
      </div>
    </div>
  );
};

export default DashboardView;
