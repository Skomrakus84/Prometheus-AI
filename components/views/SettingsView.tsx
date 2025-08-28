
import React, { memo } from 'react';
import Card from '../ui/Card';
import { useTranslation } from '../../i18n';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = memo(({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3 border-b border-gray-700 pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
));
SettingsSection.displayName = 'SettingsSection';

const SelectOption: React.FC<{ label: string, options: string[] }> = memo(({ label, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
));
SelectOption.displayName = 'SelectOption';

const SettingsView: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();
    
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'pl');
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('settings.title')}</h1>
            <p className="text-lg text-gray-400 mb-6">{t('settings.description')}</p>

            <Card>
                <div className="mb-4 bg-gray-900/50 p-4 rounded-lg border border-indigo-500/30">
                    <h4 className="font-bold text-indigo-400">{t('settings.infoBox.title')}</h4>
                    <p className="text-sm text-gray-400">{t('settings.infoBox.content')}</p>
                </div>

                <SettingsSection title={t('settings.language.title')}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('settings.language.selectLabel')}</label>
                        <select 
                            value={language} 
                            onChange={handleLanguageChange} 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="en">English</option>
                            <option value="pl">Polski</option>
                        </select>
                    </div>
                </SettingsSection>
                
                <SettingsSection title={t('settings.sections.ai')}>
                    <SelectOption label={t('settings.labels.textModels')} options={['Hugging Face Hub (GPT-J, Mistral, Falcon)', 'Gemini API (Free Tier)']} />
                    <SelectOption label={t('settings.labels.imageModels')} options={['Stable Diffusion (AUTOMATIC1111)', 'ComfyUI', 'Imagen API (Free Tier)']} />
                    <SelectOption label={t('settings.labels.audioModels')} options={['Riffusion', 'Bark (SunO AI)']} />
                    <SelectOption label={t('settings.labels.transcription')} options={['OpenAI Whisper (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.crm')}>
                    <SelectOption label={t('settings.labels.crmSystem')} options={['EspoCRM (self-hosted)', 'SuiteCRM (self-hosted)']} />
                    <SelectOption label={t('settings.labels.marketingAutomation')} options={['Mautic (self-hosted)']} />
                    <SelectOption label={t('settings.labels.newsroom')} options={['WordPress (self-hosted)', 'Strapi (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.analytics')}>
                    <SelectOption label={t('settings.labels.webAnalytics')} options={['Matomo (self-hosted)', 'Umami (self-hosted)']} />
                    <SelectOption label={t('settings.labels.dashboards')} options={['Grafana (self-hosted)', 'Metabase (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.automation')}>
                    <SelectOption label={t('settings.labels.workflowAutomation')} options={['n8n (self-hosted)', 'Node-RED (self-hosted)']} />
                </SettingsSection>

                 <div className="text-right mt-6">
                    <button className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500" disabled>{t('settings.buttonSave')}</button>
                </div>

            </Card>
        </div>
    );
};

export default SettingsView;
