
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/views/DashboardView';
import AIFactoryView from './components/views/AIFactoryView';
import AnalyticsView from './components/views/AnalyticsView';
import DistributionView from './components/views/DistributionView';
import CRMView from './components/views/CRMView';
import AutomationView from './components/views/AutomationView';
import InteractiveView from './components/views/InteractiveView';
import SettingsView from './components/views/SettingsView';
import { ActiveView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.DASHBOARD);

  const renderActiveView = useCallback(() => {
    switch (activeView) {
      case ActiveView.DASHBOARD:
        return <DashboardView setActiveView={setActiveView} />;
      case ActiveView.AI_FACTORY:
        return <AIFactoryView />;
      case ActiveView.DISTRIBUTION:
        return <DistributionView />;
      case ActiveView.CRM:
        return <CRMView />;
      case ActiveView.ANALYTICS:
        return <AnalyticsView />;
      case ActiveView.AUTOMATION:
        return <AutomationView />;
      case ActiveView.INTERACTIVE:
        return <InteractiveView />;
      case ActiveView.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  }, [activeView]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;
