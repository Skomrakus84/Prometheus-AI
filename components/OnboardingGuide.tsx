import React, { useState, useId } from 'react';
import Card from './ui/Card.js';
import Button from './ui/Button.js';
import { 
  AIFactoryIcon, 
  DistributionIcon, 
  CRMIcon, 
  AnalyticsIcon, 
  AutomationIcon, 
  InteractiveIcon,
  XIcon
} from './icons/Icons.js';
import { useTranslation } from '../i18n.js';

const ONBOARDING_STEP_ICONS = [
    <span className="text-4xl">👋</span>,
    <AIFactoryIcon />,
    <DistributionIcon />,
    <CRMIcon />,
    <AnalyticsIcon />,
    <AutomationIcon />,
    <InteractiveIcon />
];

interface OnboardingGuideProps {
    onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const { t } = useTranslation();
    const titleId = useId();

    const steps = t('onboarding.steps', {}) as unknown as {title: string, description: string}[];
    const currentStep = steps[step];
    
    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            onClose();
        }
    };
    
    const handlePrev = () => {
        if (step > 0) {
            setStep(s => s - 1);
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <Card className="w-full max-w-md bg-gray-800 border-gray-600" titleId={titleId} title={currentStep.title}>
                <div className="absolute top-4 right-4">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500"
                        aria-label={t('onboarding.close')}
                    >
                        <XIcon />
                    </button>
                </div>
                <div className="text-center flex flex-col items-center p-4">
                    <div className="text-indigo-400 mb-4 h-10 w-10 flex items-center justify-center">
                       {ONBOARDING_STEP_ICONS[step]}
                    </div>
                    <p className="text-gray-300 mb-6">{currentStep.description}</p>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {t('onboarding.step', { current: step + 1, total: steps.length })}
                    </span>
                    <div className="flex gap-2">
                        {step > 0 && (
                            <button onClick={handlePrev} className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                                {t('onboarding.buttonPrevious')}
                            </button>
                        )}
                        <Button onClick={handleNext}>
                            {step === steps.length - 1 ? t('onboarding.buttonFinish') : t('onboarding.buttonNext')}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OnboardingGuide;