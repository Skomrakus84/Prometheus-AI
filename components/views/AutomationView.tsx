









import React, { useState, useCallback, DragEvent, memo } from 'react';
import Card from '../ui/Card.js';
import Button from '../ui/Button.js';
import { AutomationWorkflow } from '../../types.js';
import { generateWorkflows } from '../../services/geminiService.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { GripVerticalIcon, TrashIcon } from '../icons/Icons.js';
import { useTranslation } from '../../i18n.js';

// --- Workflow Builder Components & Data ---

interface DraggableItemData {
    name: string;
    type: 'trigger' | 'action' | 'tool';
}

interface WorkflowCanvasItem extends DraggableItemData {
    id: string;
}

const DRAGGABLE_ITEMS: Record<string, DraggableItemData[]> = {
    triggers: [
        { name: 'New Blog Post Published', type: 'trigger' },
        { name: 'New Song on Spotify', type: 'trigger' },
        { name: 'Weekly Schedule', type: 'trigger' },
    ],
    actions: [
        { name: 'Share on X/Twitter', type: 'action' },
        { name: 'Post to Instagram', type: 'action' },
        { name: 'Send Email Newsletter', type: 'action' },
        { name: 'Add to "New Releases" Playlist', type: 'action' },
    ],
    tools: [
        { name: 'WordPress', type: 'tool' },
        { name: 'Mautic', type: 'tool' },
        { name: 'n8n', type: 'tool' },
        { name: 'Spotify API', type: 'tool' },
    ],
};

const DraggableItem: React.FC<{ item: DraggableItemData, onDragStart: (e: DragEvent<HTMLDivElement>, item: DraggableItemData) => void }> = memo(({ item, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        className="flex items-center p-2 mb-2 bg-gray-700 rounded-md cursor-grab active:cursor-grabbing"
    >
        <GripVerticalIcon />
        <span className="ml-2 text-sm text-gray-200">{item.name}</span>
    </div>
));
DraggableItem.displayName = 'DraggableItem';

const PaletteSection: React.FC<{ title: string, items: DraggableItemData[], onDragStart: (e: DragEvent<HTMLDivElement>, item: DraggableItemData) => void }> = memo(({ title, items, onDragStart }) => (
    <div className="mb-4">
        <h4 className="font-semibold text-gray-400 mb-2">{title}</h4>
        {items.map(item => <DraggableItem key={item.name} item={item} onDragStart={onDragStart} />)}
    </div>
));
PaletteSection.displayName = 'PaletteSection';

const ArrowDown: React.FC = () => (
    <div className="flex justify-center my-1">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
);


const AutomationView: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'ideas' | 'builder'>('ideas');
    
    // State for Idea Generator
    const [workflows, setWorkflows] = useLocalStorage<AutomationWorkflow[]>('automation_workflows', []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('promoting my weekly blog and newsletter');

    // State for Workflow Builder
    const [canvasItems, setCanvasItems] = useLocalStorage<WorkflowCanvasItem[]>('automation_canvasItems', []);

    const handleGenerateWorkflows = useCallback(async () => {
        if (!prompt.trim()) { setError(t('automation.ideas.errorPrompt')); return; }
        setIsGenerating(true); setError(null);
        try {
            const result = await generateWorkflows(prompt);
            setWorkflows(result);
        } catch (e) { setError(t('automation.ideas.errorGenerate')); console.error(e); } finally { setIsGenerating(false); }
    }, [prompt, setWorkflows, t]);

    // Drag and Drop handlers for Workflow Builder
    const handleDragStart = (e: DragEvent<HTMLDivElement>, item: DraggableItemData) => {
        e.dataTransfer.setData('application/json', JSON.stringify(item));
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const itemData = e.dataTransfer.getData('application/json');
        if (itemData) {
            const item: DraggableItemData = JSON.parse(itemData);
            setCanvasItems(prev => [...prev, { ...item, id: `${Date.now()}-${prev.length}` }]);
        }
    };
    const handleClearCanvas = () => setCanvasItems([]);
    
    const IdeaGenerator = (
         <>
            <Card>
                <div className="space-y-4">
                    <label htmlFor="automation-prompt" className="block text-sm font-medium text-gray-300">{t('automation.ideas.promptLabel')}</label>
                    <textarea id="automation-prompt" rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('automation.ideas.placeholder')} />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right"><Button onClick={handleGenerateWorkflows} isLoading={isGenerating}>{t('automation.ideas.buttonGenerate')}</Button></div>
                </div>
            </Card>
             <div className="mt-8 space-y-6">
                 {isGenerating && workflows.length === 0 ? (<div className="text-center p-8 text-gray-400">{t('automation.ideas.generating')}</div>) : 
                 workflows.length > 0 ? (workflows.map((flow, index) => (
                    <Card key={`${flow.title}-${index}`} title={flow.title}>
                        <p className="text-gray-300 mb-4">{flow.description}</p>
                        <div className="space-y-3 text-sm">
                            <p><span className="font-semibold text-gray-400">{t('automation.ideas.trigger')}</span> <span className="text-indigo-400">{flow.trigger}</span></p>
                            <div><p className="font-semibold text-gray-400 mb-1">{t('automation.ideas.actions')}</p><ul className="list-disc list-inside text-gray-400 pl-4">{flow.actions.map((action, i) => <li key={i}>{action}</li>)}</ul></div>
                            <p><span className="font-semibold text-gray-400">{t('automation.ideas.tools')}</span> {flow.tools.join(', ')}</p>
                        </div>
                    </Card>
                 ))) : (<Card><p className="text-center text-gray-400">{t('automation.ideas.emptyState')}</p></Card>)}
             </div>
        </>
    );

    const WorkflowBuilder = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title={t('automation.builder.componentsTitle')} className="md:col-span-1 h-fit">
                <PaletteSection title={t('automation.builder.triggersTitle')} items={DRAGGABLE_ITEMS.triggers} onDragStart={handleDragStart} />
                <PaletteSection title={t('automation.builder.actionsTitle')} items={DRAGGABLE_ITEMS.actions} onDragStart={handleDragStart} />
                <PaletteSection title={t('automation.builder.toolsTitle')} items={DRAGGABLE_ITEMS.tools} onDragStart={handleDragStart} />
            </Card>
            <div className="md:col-span-2">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">{t('automation.builder.canvasTitle')}</h3>
                        <button onClick={handleClearCanvas} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                            <TrashIcon /> <span className="ml-1">{t('automation.builder.buttonClear')}</span>
                        </button>
                    </div>
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg min-h-[500px] p-4"
                    >
                        {canvasItems.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">{t('automation.builder.canvasPlaceholder')}</div>
                        ) : (
                            canvasItems.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <div className={`p-3 rounded-lg text-white text-center font-medium shadow-md ${
                                        item.type === 'trigger' ? 'bg-green-600' :
                                        item.type === 'action' ? 'bg-blue-600' : 'bg-purple-600'
                                    }`}>
                                        {item.name}
                                    </div>
                                    {index < canvasItems.length - 1 && <ArrowDown />}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    const TabButton: React.FC<{tabType: 'ideas' | 'builder'; label: string}> = memo(({ tabType, label }) => (
        <button
            onClick={() => setActiveTab(tabType)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-full sm:w-auto ${
                activeTab === tabType ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    ));
    TabButton.displayName = 'TabButton';

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('automation.title')}</h1>
            <p className="text-lg text-gray-400 mb-6">{t('automation.description')}</p>
            
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-800 rounded-lg">
                <TabButton tabType="ideas" label={t('automation.tabs.ideas')} />
                <TabButton tabType="builder" label={t('automation.tabs.builder')} />
            </div>
            
            {activeTab === 'ideas' ? IdeaGenerator : WorkflowBuilder}
        </div>
    );
};

export default AutomationView;