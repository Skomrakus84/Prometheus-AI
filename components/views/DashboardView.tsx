
import React, { useState, useEffect, memo } from 'react';
import { ActiveView } from '../../types.js';
import Card from '../ui/Card.js';
import { AIFactoryIcon, DistributionIcon, CRMIcon, AnalyticsIcon, AutomationIcon, InteractiveIcon } from '../icons/Icons.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import OnboardingGuide from '../OnboardingGuide.js';
import { useTranslation } from '../../i18n.js';

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
}

const ModuleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  view: ActiveView;
  onClick: (view: ActiveView) => void;
}> = memo(({ icon, title, description, view, onClick }) => {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col text-center items-center hover:bg-gray-700/50 transition-colors duration-300">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm flex-grow mb-4">{description}</p>
      <button
        onClick={() => onClick(view)}
        className="w-full mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500"
      >
        {t('dashboard.launch')}
      </button>
    </Card>
  );
});
ModuleCard.displayName = 'ModuleCard';


const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage('prometheus_onboarding_completed', false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Show onboarding if it has not been completed
    if (!onboardingCompleted) {
        setShowOnboarding(true);
    }
  }, [onboardingCompleted]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  const handleShowTutorial = () => {
    setOnboardingCompleted(false); // Reset to re-trigger the guide
    setShowOnboarding(true);
  }

  return (
    <>
      {showOnboarding && <OnboardingGuide onClose={handleCloseOnboarding} />}
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('dashboard.title')}</h1>
            <p className="text-lg text-gray-400">{t('dashboard.description')}</p>
          </div>
          <button onClick={handleShowTutorial} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0">
            {t('dashboard.showTutorial')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            icon={<AIFactoryIcon />}
            title={t('dashboard.modules.aiFactory.title')}
            description={t('dashboard.modules.aiFactory.description')}
            view={ActiveView.AI_FACTORY}
            onClick={setActiveView}
          />
          <ModuleCard
            icon={<DistributionIcon />}
            title={t('dashboard.modules.distributionHub.title')}
            description={t('dashboard.modules.distributionHub.description')}
            view={ActiveView.DISTRIBUTION}
            onClick={setActiveView}
          />
          <ModuleCard
            icon={<CRMIcon />}
            title={t('dashboard.modules.crm.title')}
            description={t('dashboard.modules.crm.description')}
            view={ActiveView.CRM}
            onClick={setActiveView}
          />
          <ModuleCard
            icon={<AnalyticsIcon />}
            title={t('dashboard.modules.analytics.title')}
            description={t('dashboard.modules.analytics.description')}
            view={ActiveView.ANALYTICS}
            onClick={setActiveView}
          />
          <ModuleCard
            icon={<AutomationIcon />}
            title={t('dashboard.modules.automation.title')}
            description={t('dashboard.modules.automation.description')}
            view={ActiveView.AUTOMATION}
            onClick={setActiveView}
          />
          <ModuleCard
            icon={<InteractiveIcon />}
            title={t('dashboard.modules.interactiveAI.title')}
            description={t('dashboard.modules.interactiveAI.description')}
            view={ActiveView.INTERACTIVE}
            onClick={setActiveView}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardView;