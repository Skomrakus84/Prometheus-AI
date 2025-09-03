









import React, { useState, useCallback, memo } from 'react';
import { generatePressRelease, generateSubmissions, generateContentSchedule } from '../../services/geminiService.js';
import { PressRelease, DistributionPlatform, DistributionStatus, Submission, ScheduledPost } from '../../types.js';
import Card from '../ui/Card.js';
import Button from '../ui/Button.js';
import { CheckCircleIcon, XCircleIcon, DownloadIcon } from '../icons/Icons.js';
import Spinner from '../ui/Spinner.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useTranslation } from '../../i18n.js';

type DistributionTab = 'pr' | 'submissions' | 'scheduler';

const TabButton: React.FC<{ tabType: DistributionTab; activeTab: DistributionTab; label: string; onClick: (tab: DistributionTab) => void; }> = memo(({ tabType, activeTab, label, onClick }) => (
    <button
        onClick={() => onClick(tabType)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tabType ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
));
TabButton.displayName = 'TabButton';

const PressReleaseGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pressRelease, setPressRelease] = useLocalStorage<PressRelease | null>('dist_pressRelease', null);
    const [distributionList, setDistributionList] = useLocalStorage<DistributionPlatform[]>('dist_distributionList', []);
    const [isDistributing, setIsDistributing] = useState(false);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError(t('distributionHub.pr.errorPrompt')); return; }
        setIsLoading(true); setError(null); setPressRelease(null); setDistributionList([]); setIsDistributing(false);
        try {
            const result = await generatePressRelease(prompt);
            setPressRelease(result);
        } catch (e) { setError(t('distributionHub.pr.errorGenerate')); console.error(e); } finally { setIsLoading(false); }
    }, [prompt, setPressRelease, setDistributionList, t]);

    const handleDistribute = useCallback(() => {
        const platforms = ["PR.com (Free)", "PRLog", "24-7 Press Release", "openPR", "NewsWireToday"];
        const initialList = platforms.map(name => ({ name, status: 'sending' as DistributionStatus }));
        setDistributionList(initialList); setIsDistributing(true);
        initialList.forEach((platform, index) => {
            setTimeout(() => setDistributionList(prev => prev.map(p => p.name === platform.name ? { ...p, status: Math.random() > 0.2 ? 'success' : 'failed' } : p)), (index + 1) * 1500);
        });
        setTimeout(() => setIsDistributing(false), platforms.length * 1500 + 500);
    }, [setDistributionList]);

    return (
        <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <label htmlFor="pr-prompt" className="block text-sm font-medium text-gray-300">{t('distributionHub.pr.promptLabel')}</label>
                    <textarea id="pr-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('distributionHub.pr.placeholder')} />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right"><Button onClick={handleGenerate} isLoading={isLoading}>{t('distributionHub.pr.buttonGenerate')}</Button></div>
                </div>
            </Card>
            {pressRelease && (
                <div className="space-y-6 animate-fade-in">
                    <Card title={t('distributionHub.pr.cardTitle')}>
                        <div className="space-y-4 text-gray-300">
                            <h2 className="text-2xl font-bold text-white">{pressRelease.headline}</h2>
                            <h3 className="text-lg text-gray-400">{pressRelease.subheadline}</h3>
                            <p className="text-sm font-semibold">{pressRelease.dateline}</p>
                            <div className="whitespace-pre-wrap text-gray-300">{pressRelease.body}</div>
                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <h4 className="font-semibold mb-2 text-white">{t('distributionHub.pr.contactLabel')}</h4>
                                <p className="whitespace-pre-wrap text-sm text-gray-400">{pressRelease.contactInfo}</p>
                            </div>
                        </div>
                    </Card>
                    <div className="text-center"><Button onClick={handleDistribute} isLoading={isDistributing} disabled={isDistributing}>{t('distributionHub.pr.buttonSimulate')}</Button></div>
                    {distributionList.length > 0 && (
                        <Card title={t('distributionHub.pr.statusCardTitle')}>
                            <ul className="space-y-3">{distributionList.map((platform) => (
                                <li key={platform.name} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                                    <span className="text-gray-300 font-medium">{platform.name}</span>
                                    <div className="flex items-center space-x-2 text-sm">
                                        {platform.status === 'sending' && <Spinner className="h-4 w-4" />}
                                        {platform.status === 'success' && <CheckCircleIcon />}
                                        {platform.status === 'failed' && <XCircleIcon />}
                                        <span className={`capitalize font-semibold ${platform.status === 'success' ? 'text-green-400' : platform.status === 'failed' ? 'text-red-400' : 'text-gray-400'}`}>{platform.status}</span>
                                    </div>
                                </li>))}
                            </ul>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

const SubmissionAssistant: React.FC = () => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissions, setSubmissions] = useLocalStorage<Submission[]>('dist_submissions', []);
    
    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError(t('distributionHub.submissions.errorPrompt')); return; }
        setIsLoading(true); setError(null); setSubmissions([]);
        try {
            const result = await generateSubmissions(prompt);
            setSubmissions(result);
        } catch (e) { setError(t('distributionHub.submissions.errorGenerate')); console.error(e); } finally { setIsLoading(false); }
    }, [prompt, setSubmissions, t]);

    return (
         <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <label htmlFor="sub-prompt" className="block text-sm font-medium text-gray-300">{t('distributionHub.submissions.promptLabel')}</label>
                    <textarea id="sub-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('distributionHub.submissions.placeholder')} />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right"><Button onClick={handleGenerate} isLoading={isLoading}>{t('distributionHub.submissions.buttonGenerate')}</Button></div>
                </div>
            </Card>
            {isLoading && submissions.length === 0 && <div className="text-center"><Spinner /></div>}
            {submissions.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    {submissions.map((sub, i) => (
                        <Card key={`${sub.platformName}-${i}`}>
                            <h3 className="font-bold text-white">{sub.platformName}</h3>
                            <p className="text-sm text-indigo-400 mb-3">{sub.platformType}</p>
                            <p className="text-gray-300 whitespace-pre-wrap">{sub.pitch}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

const ContentScheduler: React.FC = () => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [schedule, setSchedule] = useLocalStorage<ScheduledPost[]>('dist_schedule', []);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError(t('distributionHub.scheduler.errorPrompt')); return; }
        setIsLoading(true); setError(null); setSchedule([]);
        try {
            const result = await generateContentSchedule(prompt);
            setSchedule(result);
        } catch (e) { setError(t('distributionHub.scheduler.errorGenerate')); console.error(e); } finally { setIsLoading(false); }
    }, [prompt, setSchedule, t]);

    const handleExportToICS = useCallback(() => {
        const weekdays: { [key: string]: number } = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };

        const toICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//PrometheusOS//AI Content Scheduler//EN'
        ];

        schedule.forEach((post, index) => {
            const today = new Date();
            const targetDayIndex = weekdays[post.day as keyof typeof weekdays];
            const todayDayIndex = today.getDay();
            let dayDifference = targetDayIndex - todayDayIndex;
            if (dayDifference < 0) { dayDifference += 7; }

            const eventDate = new Date();
            eventDate.setDate(today.getDate() + dayDifference);
            
            const timeParts = post.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeParts) {
                let hours = parseInt(timeParts[1], 10);
                const minutes = parseInt(timeParts[2], 10);
                const period = timeParts[3].toUpperCase();
                if (period === 'PM' && hours < 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                eventDate.setHours(hours, minutes, 0, 0);
            }

            const startDate = new Date(eventDate);
            const endDate = new Date(eventDate);
            endDate.setHours(endDate.getHours() + 1); // 1-hour duration

            icsContent.push(
                'BEGIN:VEVENT',
                `UID:${Date.now()}${index}@prometheusos.ai`,
                `DTSTAMP:${toICSDate(new Date())}`,
                `DTSTART:${toICSDate(startDate)}`,
                `DTEND:${toICSDate(endDate)}`,
                `SUMMARY:Post to ${post.platform}`,
                `DESCRIPTION:${post.content.replace(/\n/g, '\\n')}`,
                'END:VEVENT'
            );
        });

        icsContent.push('END:VCALENDAR');

        const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prometheus-schedule.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [schedule]);

    return (
        <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <label htmlFor="sched-prompt" className="block text-sm font-medium text-gray-300">{t('distributionHub.scheduler.promptLabel')}</label>
                    <textarea id="sched-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('distributionHub.scheduler.placeholder')} />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right"><Button onClick={handleGenerate} isLoading={isLoading}>{t('distributionHub.scheduler.buttonGenerate')}</Button></div>
                </div>
            </Card>
            {isLoading && schedule.length === 0 && <div className="text-center"><Spinner /></div>}
            {schedule.length > 0 && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">{t('distributionHub.scheduler.cardTitle')}</h3>
                        <Button onClick={handleExportToICS} icon={<DownloadIcon />}>
                            {t('distributionHub.scheduler.buttonExport')}
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700 text-sm text-gray-400">
                                <tr>
                                    <th className="p-2">{t('distributionHub.scheduler.table.day')}</th>
                                    <th className="p-2">{t('distributionHub.scheduler.table.time')}</th>
                                    <th className="p-2">{t('distributionHub.scheduler.table.platform')}</th>
                                    <th className="p-2">{t('distributionHub.scheduler.table.content')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((post, i) => (
                                    <tr key={`${post.day}-${i}`} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-2 font-semibold text-white">{post.day}</td>
                                        <td className="p-2 text-gray-300">{post.time}</td>
                                        <td className="p-2 text-indigo-400">{post.platform}</td>
                                        <td className="p-2 text-gray-300">{post.content}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}


const DistributionView: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<DistributionTab>('pr');

    const renderContent = () => {
        switch (activeTab) {
            case 'pr': return <PressReleaseGenerator />;
            case 'submissions': return <SubmissionAssistant />;
            case 'scheduler': return <ContentScheduler />;
            default: return null;
        }
    };
    
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('distributionHub.title')}</h1>
            <p className="text-lg text-gray-400 mb-6">{t('distributionHub.description')}</p>
            
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-800 rounded-lg">
                <TabButton tabType="pr" activeTab={activeTab} onClick={setActiveTab} label={t('distributionHub.tabs.pr')} />
                <TabButton tabType="submissions" activeTab={activeTab} onClick={setActiveTab} label={t('distributionHub.tabs.submissions')} />
                <TabButton tabType="scheduler" activeTab={activeTab} onClick={setActiveTab} label={t('distributionHub.tabs.scheduler')} />
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

export default DistributionView;