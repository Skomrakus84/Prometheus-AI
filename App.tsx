
import React, { useState, useCallback, Suspense, lazy } from 'react';
import Sidebar from '/components/Sidebar.js';
import { ActiveView } from '/types.js';
import { I18nProvider } from '/i18n.js';
import Spinner from '/components/ui/Spinner.js';

// Lazy load views for performance optimization (code-splitting)
const DashboardView = lazy(() => import('/components/views/DashboardView.js'));
const AIFactoryView = lazy(() => import('/components/views/AIFactoryView.js'));
const AnalyticsView = lazy(() => import('/components/views/AnalyticsView.js'));
const DistributionView = lazy(() => import('/components/views/DistributionView.js'));
const CRMView = lazy(() => import('/components/views/CRMView.js'));
const AutomationView = lazy(() => import('/components/views/AutomationView.js'));
const InteractiveView = lazy(() => import('/components/views/InteractiveView.js'));
const SettingsView = lazy(() => import('/components/views/SettingsView.js'));


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
    <I18nProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-full"><Spinner className="h-8 w-8" /></div>}>
            {renderActiveView()}
          </Suspense>
        </main>
      </div>
    </I18nProvider>
  );
};

export default App;