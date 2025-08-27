
import React from 'react';
import Card from '../ui/Card';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3 border-b border-gray-700 pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const SelectOption: React.FC<{ label: string, options: string[] }> = ({ label, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const SettingsView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Settings & Configuration</h1>
            <p className="text-lg text-gray-400 mb-6">Conceptually configure your Prometheus OS stack.</p>

            <Card>
                <div className="mb-4 bg-gray-900/50 p-4 rounded-lg border border-indigo-500/30">
                    <h4 className="font-bold text-indigo-400">The Power of Choice</h4>
                    <p className="text-sm text-gray-400">Prometheus OS is built on a foundation of free and open-source tools. This panel allows you to conceptually plan your ideal stack. The application will use default integrations, but this helps you architect your self-hosted or free-tier ecosystem.</p>
                </div>
                
                <SettingsSection title="AI Factory (Content Generation)">
                    <SelectOption label="Text Models" options={['Hugging Face Hub (GPT-J, Mistral, Falcon)', 'Gemini API (Free Tier)']} />
                    <SelectOption label="Image Models" options={['Stable Diffusion (AUTOMATIC1111)', 'ComfyUI', 'Imagen API (Free Tier)']} />
                    <SelectOption label="Audio Models" options={['Riffusion', 'Bark (SunO AI)']} />
                    <SelectOption label="Transcription" options={['OpenAI Whisper (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title="CRM & PR">
                    <SelectOption label="CRM System" options={['EspoCRM (self-hosted)', 'SuiteCRM (self-hosted)']} />
                    <SelectOption label="Marketing Automation" options={['Mautic (self-hosted)']} />
                    <SelectOption label="Newsroom / EPK CMS" options={['WordPress (self-hosted)', 'Strapi (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title="Analytics & Monitoring">
                    <SelectOption label="Web Analytics" options={['Matomo (self-hosted)', 'Umami (self-hosted)']} />
                    <SelectOption label="Dashboards" options={['Grafana (self-hosted)', 'Metabase (self-hosted)']} />
                </SettingsSection>

                <SettingsSection title="Automation Engine">
                    <SelectOption label="Workflow Automation" options={['n8n (self-hosted)', 'Node-RED (self-hosted)']} />
                </SettingsSection>

                 <div className="text-right mt-6">
                    <button className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500" disabled>Save Configuration (Conceptual)</button>
                </div>

            </Card>
        </div>
    );
};

export default SettingsView;
