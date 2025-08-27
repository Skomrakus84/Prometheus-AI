import React, { useState, useCallback } from 'react';
import { generateSocialMediaPosts, generateBlogIdeas, generateImage } from '../../services/geminiService';
import { SocialMediaPost, BlogIdea } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useLocalStorage from '../hooks/useLocalStorage';

type ContentType = 'social' | 'blog' | 'image' | 'audio' | 'video';

const AIFactoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('social');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [socialPosts, setSocialPosts] = useLocalStorage<SocialMediaPost[]>('aiFactory_socialPosts', []);
  const [blogIdeas, setBlogIdeas] = useLocalStorage<BlogIdea[]>('aiFactory_blogIdeas', []);
  const [imageUrl, setImageUrl] = useLocalStorage<string>('aiFactory_imageUrl', '');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or description.');
      return;
    }
    setIsLoading(true);
    setError(null);

    // Clear previous results before generating new ones
    if (activeTab !== 'social') setSocialPosts([]);
    if (activeTab !== 'blog') setBlogIdeas([]);
    if (activeTab !== 'image') setImageUrl('');


    try {
      switch (activeTab) {
        case 'social':
          const posts = await generateSocialMediaPosts(prompt);
          setSocialPosts(posts);
          break;
        case 'blog':
          const ideas = await generateBlogIdeas(prompt);
          setBlogIdeas(ideas);
          break;
        case 'image':
          const url = await generateImage(prompt);
          setImageUrl(url);
          break;
      }
    } catch (e) {
      setError(`Failed to generate ${activeTab} content. Please try again.`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, activeTab, setSocialPosts, setBlogIdeas, setImageUrl]);
  
  const TabButton: React.FC<{tabType: ContentType; label: string, disabled?: boolean}> = ({ tabType, label, disabled }) => (
    <button
        onClick={() => setActiveTab(tabType)}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-full sm:w-auto ${
            activeTab === tabType ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
  );

  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center p-8 text-gray-400">Generating...</div>;
    }

    switch (activeTab) {
        case 'social':
            return socialPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {socialPosts.map((post, i) => (
                        <Card key={`${post.platform}-${i}`} title={post.platform} className="flex flex-col">
                            <p className="text-gray-300 flex-grow">{post.content}</p>
                            <div className="mt-4">
                                <p className="text-sm text-indigo-400">{post.hashtags.join(' ')}</p>
                                <p className="text-xs text-gray-500 mt-2">Visual: {post.visualSuggestion}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            );
        case 'blog':
            return blogIdeas.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                    {blogIdeas.map((idea, i) => (
                        <Card key={`${idea.title}-${i}`} title={idea.title}>
                           <h4 className="font-semibold text-gray-300 mb-2">Outline:</h4>
                           <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">{idea.outline.map((o, j) => <li key={j}>{o}</li>)}</ul>
                           <p className="text-sm text-indigo-400">Keywords: {idea.keywords.join(', ')}</p>
                        </Card>
                    ))}
                </div>
            );
        case 'image':
            return imageUrl && (
                <div className="animate-fade-in">
                    <Card title="Generated Image">
                        <img src={imageUrl} alt={prompt} className="rounded-lg w-full max-w-2xl mx-auto shadow-lg" />
                    </Card>
                </div>
            );
        case 'audio':
        case 'video':
            return <Card title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Generation`}><p className="text-gray-400">Conceptual integration with open-source tools like Riffusion (Audio) and Stable Diffusion (Video) is a core part of the Prometheus OS roadmap.</p></Card>
        default:
            return null;
    }
  }

  const ConceptualModelSelector = () => {
    let options = <></>;
    switch (activeTab) {
        case 'social':
        case 'blog':
            options = <>
                <option>Gemini 2.5 Flash</option>
                <option disabled>Mistral</option>
                <option disabled>LLaMA2</option>
                <option disabled>Falcon</option>
            </>;
            break;
        case 'image':
            options = <>
                <option>Imagen 4</option>
                <option disabled>Stable Diffusion</option>
                <option disabled>ComfyUI</option>
            </>;
            break;
        default:
            return null;
    }
    return (
        <div>
            <label htmlFor="model-select" className="block text-xs font-medium text-gray-400 mb-1">Conceptual Model</label>
            <select id="model-select" className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                {options}
            </select>
        </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">AI Factory</h1>
      <p className="text-lg text-gray-400 mb-6">Generate multi-channel content for your creative work.</p>

      <div className="flex flex-wrap gap-2 mb-4 p-1 bg-gray-800 rounded-lg">
        <TabButton tabType="social" label="Social Media" />
        <TabButton tabType="blog" label="Blog Ideas" />
        <TabButton tabType="image" label="Image" />
        <TabButton tabType="audio" label="Audio (Concept)" disabled />
        <TabButton tabType="video" label="Video (Concept)" disabled />
      </div>

      <Card>
        <div className="space-y-4">
          <label htmlFor="content-prompt" className="block text-sm font-medium text-gray-300">Topic / Description</label>
          <textarea
            id="content-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={
                activeTab === 'social' ? "e.g., My new single 'Midnight Train' is out on Friday!" :
                activeTab === 'blog' ? "e.g., The themes of loneliness in my new poetry collection." :
                "e.g., Album art concept: a lone astronaut on a neon-lit planet."
            }
          />
           {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <ConceptualModelSelector />
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Generate
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AIFactoryView;