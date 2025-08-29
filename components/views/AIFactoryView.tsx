import React, { useState, useCallback, useEffect, memo } from 'react';
import { generateSocialMediaPosts, generateBlogIdeas, generateImage, generateVideo, getVideosOperation, fetchVideo } from '/services/geminiService.js';
import { SocialMediaPost, BlogIdea, SimulatedAudio, GeneratedVideo } from '/types.js';
import Card from '/components/ui/Card.js';
import Button from '/components/ui/Button.js';
import useLocalStorage from '/components/hooks/useLocalStorage.js';
import Spinner from '/components/ui/Spinner.js';
import { useTranslation } from '/i18n.js';

type ContentType = 'social' | 'blog' | 'image' | 'audio' | 'video';

const AIFactoryView: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentType>('social');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for generated content, persisted in localStorage
  const [socialPosts, setSocialPosts] = useLocalStorage<SocialMediaPost[]>('aiFactory_socialPosts', []);
  const [blogIdeas, setBlogIdeas] = useLocalStorage<BlogIdea[]>('aiFactory_blogIdeas', []);
  const [imageUrl, setImageUrl] = useLocalStorage<string>('aiFactory_imageUrl', '');
  const [simulatedAudio, setSimulatedAudio] = useLocalStorage<SimulatedAudio | null>('aiFactory_simulatedAudio', null);
  const [videoState, setVideoState] = useLocalStorage<GeneratedVideo>('aiFactory_generatedVideo', { status: 'idle' });

  // State to trigger visual feedback on generation
  const [justGenerated, setJustGenerated] = useState(false);

  /**
   * Effect to reset the visual feedback animation state after it has played.
   */
  useEffect(() => {
    if (justGenerated) {
      const timer = setTimeout(() => {
        setJustGenerated(false);
      }, 1500); // Must match the animation duration
      return () => clearTimeout(timer);
    }
  }, [justGenerated]);


  const VideoContentRenderer: React.FC<{ videoState: GeneratedVideo }> = ({ videoState }) => {
    const { t } = useTranslation();
    const generatingMessages = t('aiFactory.generatingMessages', {}) as unknown as string[];
    const [message, setMessage] = useState(generatingMessages[0]);

    useEffect(() => {
        if (videoState.status === 'generating') {
            const messageInterval = setInterval(() => {
                setMessage(prev => {
                    const currentIndex = generatingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % generatingMessages.length;
                    return generatingMessages[nextIndex];
                });
            }, 5000);
            return () => clearInterval(messageInterval);
        }
    }, [videoState.status, generatingMessages]);

    if (videoState.status === 'generating') {
        return (
            <div className="animate-fade-in">
                <Card title={t('aiFactory.videoGeneratingCardTitle')}>
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Spinner className="h-10 w-10" />
                        <p className="text-gray-300 text-center">{message}</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (videoState.status === 'success' && videoState.videoUrl) {
        return (
            <div className={`animate-fade-in ${justGenerated ? 'highlight-on-generate' : ''}`}>
                <Card title={t('aiFactory.videoGeneratedCardTitle')}>
                    <video controls src={videoState.videoUrl} className="w-full rounded-lg shadow-lg" />
                </Card>
            </div>
        );
    }
    
    if (videoState.status === 'failed') {
         return (
            <div className="animate-fade-in">
                <Card title={t('aiFactory.videoFailedCardTitle')}>
                    <p className="text-red-400 text-center p-4">{videoState.error || t('aiFactory.videoError')}</p>
                </Card>
            </div>
        );
    }

    return null;
  };

  /**
   * Effect to poll for video generation status.
   * This effect runs only when the video status is 'generating' and an operation object is present.
   * It polls the Gemini API every 10 seconds to check for completion.
   * The polling state is persisted in localStorage, so it continues after a page refresh.
   */
  useEffect(() => {
    if (videoState.status !== 'generating' || !videoState.operation) {
        return;
    }

    let intervalId: number;

    const poll = async () => {
        try {
            const updatedOperation = await getVideosOperation(videoState.operation);
            
            if (updatedOperation.done) {
                clearInterval(intervalId);
                const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    const videoBlob = await fetchVideo(downloadLink);
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setVideoState({ status: 'success', videoUrl: videoUrl });
                    setJustGenerated(true);
                } else {
                    throw new Error("Video generation completed but no video URI was found.");
                }
            } else {
                // Not done yet, update operation state to persist polling after refresh
                setVideoState(prevState => ({...prevState, operation: updatedOperation}));
            }
        } catch (error) {
            console.error(error);
            setVideoState({ status: 'failed', error: t('aiFactory.videoStatusError') });
            clearInterval(intervalId);
        }
    };

    // Start polling immediately and then every 10 seconds
    poll();
    intervalId = window.setInterval(poll, 10000);

    return () => clearInterval(intervalId);
  }, [videoState.status, videoState.operation, setVideoState, t]);


  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError(t('aiFactory.errorPrompt'));
      return;
    }
    setIsLoading(true);
    setError(null);

    // Clear previous results for other tabs before generating new ones
    if (activeTab !== 'social') setSocialPosts([]);
    if (activeTab !== 'blog') setBlogIdeas([]);
    if (activeTab !== 'image') setImageUrl('');
    if (activeTab !== 'audio') setSimulatedAudio(null);
    if (activeTab !== 'video') setVideoState({ status: 'idle' });

    try {
      let success = false;
      switch (activeTab) {
        case 'social':
          const posts = await generateSocialMediaPosts(prompt);
          setSocialPosts(posts);
          if (posts.length > 0) success = true;
          break;
        case 'blog':
          const ideas = await generateBlogIdeas(prompt);
          setBlogIdeas(ideas);
          if (ideas.length > 0) success = true;
          break;
        case 'image':
          const url = await generateImage(prompt);
          setImageUrl(url);
          if (url) success = true;
          break;
        case 'audio':
          const audioTool = Math.random() > 0.5 ? 'Riffusion' : 'Bark (SunO AI)';
            setSimulatedAudio({
                tool: audioTool,
                promptUsed: prompt,
                description: t('aiFactory.audioDescription', { tool: audioTool }),
                howTo: audioTool === 'Riffusion'
                ? t('aiFactory.audioHowToRiffusion')
                : t('aiFactory.audioHowToBark'),
                parameters: {
                    seed: Math.floor(Math.random() * 100000),
                    denoising: parseFloat(Math.random().toFixed(2)),
                    guidance_scale: Math.floor(Math.random() * 10) + 5
                }
            });
            success = true;
          break;
        case 'video':
           setVideoState({ status: 'generating' });
           const operation = await generateVideo(prompt);
           setVideoState({ status: 'generating', operation: operation });
          break;
      }
      if (success) {
        setJustGenerated(true);
      }
    } catch (e) {
      setError(t('aiFactory.errorGenerate', { tab: activeTab }));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, activeTab, setSocialPosts, setBlogIdeas, setImageUrl, setSimulatedAudio, setVideoState, t]);
  
  const TabButton: React.FC<{tabType: ContentType; label: string, disabled?: boolean}> = memo(({ tabType, label, disabled }) => (
    <button
        onClick={() => setActiveTab(tabType)}
        disabled={disabled || videoState.status === 'generating'}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-full sm:w-auto ${
            activeTab === tabType ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
        } ${disabled || videoState.status === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
  ));
  TabButton.displayName = 'TabButton';

  const renderContent = () => {
    if (isLoading && activeTab !== 'video') {
        return <div className="text-center p-8 text-gray-400">{t('aiFactory.generating')}</div>;
    }

    switch (activeTab) {
        case 'social':
            return socialPosts.length > 0 && (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in ${justGenerated ? 'highlight-on-generate' : ''}`}>
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
                <div className={`space-y-6 animate-fade-in ${justGenerated ? 'highlight-on-generate' : ''}`}>
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
                <div className={`animate-fade-in ${justGenerated ? 'highlight-on-generate' : ''}`}>
                    <Card title={t('aiFactory.imageGeneratedCardTitle')}>
                        <img src={imageUrl} alt={prompt} className="rounded-lg w-full max-w-2xl mx-auto shadow-lg" />
                    </Card>
                </div>
            );
        case 'audio':
            return simulatedAudio && (
                <div className={`animate-fade-in ${justGenerated ? 'highlight-on-generate' : ''}`}>
                    <Card title={t('aiFactory.audioCardTitle', { tool: simulatedAudio.tool })}>
                        <div className="space-y-6">
                            <p className="text-gray-300">{simulatedAudio.description}</p>
                            <div>
                                <h4 className="font-semibold text-gray-200 mb-2">{t('aiFactory.audioMockTitle')}</h4>
                                <div className="bg-gray-900/50 p-4 rounded-lg flex items-center space-x-4">
                                    <svg className="h-8 w-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 15.132A5.95 5.95 0 012 10a6 6 0 1110.89 3.876l-1.854.927a4 4 0 10-7.018 1.229zM10 4a4 4 0 100 8 4 4 0 000-8z" /><path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1z" /></svg>
                                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                        <div className="w-1/3 h-full bg-indigo-500 animate-pulse"></div>
                                    </div>
                                    <span className="text-sm text-gray-400">0:05 / 0:15</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">{t('aiFactory.audioPromptUsedLabel')}</h4>
                                    <p className="text-sm text-indigo-300 bg-gray-900 p-2 rounded-md mt-1">"{simulatedAudio.promptUsed}"</p>
                                </div>
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-400">{t('aiFactory.audioParamsLabel')}</h4>
                                     <pre className="text-xs text-indigo-300 bg-gray-900 p-2 rounded-md mt-1 whitespace-pre-wrap">{JSON.stringify(simulatedAudio.parameters, null, 2)}</pre>
                                </div>
                            </div>
                             <div>
                                <p className="text-sm font-semibold text-gray-400">{t('aiFactory.audioHowItWorksLabel')}</p>
                                <p className="text-sm text-gray-300 mt-1">{simulatedAudio.howTo}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        case 'video':
            return <VideoContentRenderer videoState={videoState} />;
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
        case 'audio':
            options = <>
                <option>Riffusion</option>
                <option>Bark (SunO AI)</option>
            </>;
            break;
        case 'video':
             options = <>
                <option>veo-2.0-generate-001</option>
            </>;
            return (
                <div>
                    <label htmlFor="model-select" className="block text-xs font-medium text-gray-400 mb-1">Model</label>
                    <select id="model-select" disabled className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed">
                        {options}
                    </select>
                </div>
            );
        default:
            return null;
    }
    return (
        <div>
            <label htmlFor="model-select" className="block text-xs font-medium text-gray-400 mb-1">{t('aiFactory.modelLabel')}</label>
            <select id="model-select" className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                {options}
            </select>
        </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('aiFactory.title')}</h1>
      <p className="text-lg text-gray-400 mb-6">{t('aiFactory.description')}</p>

      <div className="flex flex-wrap gap-2 mb-4 p-1 bg-gray-800 rounded-lg">
        <TabButton tabType="social" label={t('aiFactory.tabs.social')} />
        <TabButton tabType="blog" label={t('aiFactory.tabs.blog')} />
        <TabButton tabType="image" label={t('aiFactory.tabs.image')} />
        <TabButton tabType="audio" label={t('aiFactory.tabs.audio')} />
        <TabButton tabType="video" label={t('aiFactory.tabs.video')} />
      </div>

      <Card>
        <div className="space-y-4">
          <label htmlFor="content-prompt" className="block text-sm font-medium text-gray-300">{t('aiFactory.promptLabel')}</label>
          <textarea
            id="content-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={
                activeTab === 'social' ? t('aiFactory.promptPlaceholders.social') :
                activeTab === 'blog' ? t('aiFactory.promptPlaceholders.blog') :
                activeTab === 'image' ? t('aiFactory.promptPlaceholders.image') :
                activeTab === 'audio' ? t('aiFactory.promptPlaceholders.audio') :
                t('aiFactory.promptPlaceholders.video')
            }
          />
           {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <ConceptualModelSelector />
            <Button onClick={handleGenerate} isLoading={isLoading || videoState.status === 'generating'} disabled={videoState.status === 'generating'}>
              {videoState.status === 'generating' ? t('aiFactory.buttonGenerating') : t('aiFactory.buttonGenerate')}
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