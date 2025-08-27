import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { InteractiveConcept } from '../../types';
import { generateInteractiveConcept, generateImage } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import useLocalStorage from '../hooks/useLocalStorage';

const InteractiveView: React.FC = () => {
    const [concept, setConcept] = useLocalStorage<InteractiveConcept | null>('interactive_concept', null);
    const [conceptImage, setConceptImage] = useLocalStorage<string>('interactive_conceptImage', '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("an AR filter based on my fantasy novel's cover");

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter an idea for an interactive experience.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setConcept(null);
        setConceptImage('');

        try {
            const conceptResult = await generateInteractiveConcept(prompt);
            setConcept(conceptResult);
            if(conceptResult.imagePrompt) {
                const imageResult = await generateImage(conceptResult.imagePrompt);
                setConceptImage(imageResult);
            }
        } catch (e) {
            setError('Failed to generate interactive concept.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, setConcept, setConceptImage]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Interactive AI</h1>
            <p className="text-lg text-gray-400 mb-6">Conceptualize AR/VR/MR experiences for your audience.</p>

            <Card>
                <div className="space-y-4">
                    <label htmlFor="interactive-prompt" className="block text-sm font-medium text-gray-300">Your Idea</label>
                    <textarea
                        id="interactive-prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., A virtual gallery of my concept art, a 3D model of my main character..."
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right">
                        <Button onClick={handleGenerate} isLoading={isLoading}>
                            Generate Concept
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="mt-8">
                {isLoading && <div className="text-center p-8"><Spinner /></div>}
                
                {concept && (
                    <Card title="Generated Concept">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-indigo-400">{concept.title}</h3>
                                <p className="text-gray-300">{concept.description}</p>
                                <div>
                                    <h4 className="font-semibold text-gray-200 mb-2">Interaction Ideas:</h4>
                                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                                        {concept.interactionIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                                    </ul>
                                </div>
                                <p className="text-sm"><span className="font-semibold text-gray-400">Target Platform:</span> {concept.platform}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200 mb-2">Concept Art:</h4>
                                {conceptImage ? (
                                    <img src={conceptImage} alt="Generated concept art" className="rounded-lg shadow-lg w-full" />
                                ) : (
                                    <div className="w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center"><Spinner /></div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default InteractiveView;