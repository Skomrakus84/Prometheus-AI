
import React, { useState, useEffect, useCallback, memo } from 'react';
import Card from '../ui/Card';
import { AnalyticsIcon } from '../icons/Icons';
import { generateAnalyticsData } from '../../services/geminiService';
import { AnalyticsData, KPI } from '../../types';
import Spinner from '../ui/Spinner';
import { useTranslation } from '../../i18n';

// A simple chart component for demonstration
const BarChart: React.FC<{ data: AnalyticsData['engagementTrend'] }> = memo(({ data }) => {
    const maxValue = Math.max(...data.map(d => d.likes + d.comments + d.shares));
    return (
        <div className="w-full h-64 bg-gray-900/50 p-4 rounded-lg flex items-end justify-around space-x-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="relative w-full h-full flex items-end">
                        <div 
                            className="w-full bg-indigo-500 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-400" 
                            style={{ height: `${((d.likes + d.comments + d.shares) / maxValue) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{d.day.replace('Day ','D')}</span>
                </div>
            ))}
        </div>
    );
});
BarChart.displayName = 'BarChart';

const DonutChart: React.FC<{ data: AnalyticsData['sentiment'] }> = memo(({ data }) => {
    const { t } = useTranslation();
    const { positive, neutral, negative } = data;
    const total = positive + neutral + negative;
    const p1 = (positive / total) * 100;
    const p2 = (neutral / total) * 100;
    
    const conicGradient = `conic-gradient(#22c55e ${p1}%, #f97316 ${p1}% ${p1 + p2}%, #ef4444 ${p1 + p2}%)`;

    return (
        <div className="flex items-center justify-center space-x-6">
            <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{ background: conicGradient }}
            >
                <div className="w-24 h-24 bg-gray-800 rounded-full"></div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>{t('analytics.sentiment.positive')}: {positive}%</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>{t('analytics.sentiment.neutral')}: {neutral}%</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>{t('analytics.sentiment.negative')}: {negative}%</div>
            </div>
        </div>
    );
});
DonutChart.displayName = 'DonutChart';

const KPICard: React.FC<{ item: KPI }> = memo(({ item }) => {
    const isIncrease = item.changeType === 'increase';
    return (
        <Card className="p-4">
            <p className="text-sm text-gray-400">{item.metric}</p>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <div className={`text-sm font-semibold flex items-center ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                {isIncrease ? '▲' : '▼'} {item.change}
            </div>
        </Card>
    )
});
KPICard.displayName = 'KPICard';


const AnalyticsView: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateAnalyticsData();
            setData(result);
        } catch (e) {
            setError(t('analytics.error'));
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Spinner className="h-8 w-8" /></div>;
    }

    if (error || !data) {
        return <div className="text-center text-red-400">{error || t('analytics.noData')}</div>;
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('analytics.title')}</h1>
                 <button onClick={fetchData} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 transition-colors">
                    {t('analytics.buttonRefresh')}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.kpis.map(kpi => <KPICard key={kpi.metric} item={kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title={t('analytics.trendCardTitle')} className="lg:col-span-2">
                    <BarChart data={data.engagementTrend} />
                </Card>
                <Card title={t('analytics.sentimentCardTitle')}>
                    <DonutChart data={data.sentiment} />
                </Card>
            </div>
            
            <Card title={t('analytics.contentCardTitle')}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700 text-sm text-gray-400">
                            <tr>
                                <th className="p-2">{t('analytics.table.snippet')}</th>
                                <th className="p-2">{t('analytics.table.platform')}</th>
                                <th className="p-2">{t('analytics.table.engagement')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topPerformingContent.map((item, i) => (
                                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-2 text-gray-300">{item.content}</td>
                                    <td className="p-2 text-indigo-400">{item.platform}</td>
                                    <td className="p-2 font-semibold text-green-400">{item.engagementRate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default AnalyticsView;
