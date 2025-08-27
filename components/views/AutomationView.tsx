import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AutomationWorkflow } from '../../types';
import { generateWorkflows } from '../../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';

const AutomationView: React.FC = () => {
    const [workflows, setWorkflows] = useLocalStorage<AutomationWorkflow[]>('automation_workflows', []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('promoting my weekly blog and newsletter');

    const handleGenerateWorkflows = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a goal for your automations.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateWorkflows(prompt);
            setWorkflows(result);
        } catch (e) {
            setError('Failed to generate workflow ideas.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, setWorkflows]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Automation</h1>
            <p className="text-lg text-gray-400 mb-6">Design workflows to automate your marketing and promotion.</p>

            <Card>
                <div className="space-y-4">
                    <label htmlFor="automation-prompt" className="block text-sm font-medium text-gray-300">Automation Goal</label>
                    <textarea
                        id="automation-prompt"
                        rows={2}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Cross-post my new music releases everywhere."
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right">
                        <Button onClick={handleGenerateWorkflows} isLoading={isLoading}>
                            Generate Workflow Ideas
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="mt-8 space-y-6">
                 {isLoading && workflows.length === 0 ? (
                    <div className="text-center p-8 text-gray-400">Generating ideas...</div>
                ) : workflows.length > 0 ? (
                    workflows.map((flow, index) => (
                        <Card key={`${flow.title}-${index}`} title={flow.title}>
                            <p className="text-gray-300 mb-4">{flow.description}</p>
                            <div className="space-y-3 text-sm">
                                <p><span className="font-semibold text-gray-400">Trigger:</span> <span className="text-indigo-400">{flow.trigger}</span></p>
                                <div>
                                    <p className="font-semibold text-gray-400 mb-1">Actions:</p>
                                    <ul className="list-disc list-inside text-gray-400 pl-4">
                                        {flow.actions.map((action, i) => <li key={i}>{action}</li>)}
                                    </ul>
                                </div>
                                <p><span className="font-semibold text-gray-400">Tools:</span> {flow.tools.join(', ')}</p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card><p className="text-center text-gray-400">No workflows generated yet. Describe your goal to get started.</p></Card>
                )}
            </div>
        </div>
    );
};

export default AutomationView;