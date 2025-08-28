
export enum ActiveView {
  DASHBOARD = 'DASHBOARD',
  AI_FACTORY = 'AI_FACTORY',
  DISTRIBUTION = 'DISTRIBUTION',
  CRM = 'CRM',
  ANALYTICS = 'ANALYTICS',
  AUTOMATION = 'AUTOMATION',
  INTERACTIVE = 'INTERACTIVE',
  SETTINGS = 'SETTINGS',
}

// --- Generic Content Types ---

export interface SocialMediaPost {
  platform: 'Facebook' | 'X' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Mastodon' | 'Bluesky';
  content: string;
  hashtags: string[];
  visualSuggestion: string;
}

export interface BlogIdea {
  title: string;
  outline: string[];
  keywords: string[];
}

export interface PressRelease {
  headline: string;
  subheadline: string;
  dateline: string;
  body: string;
  contactInfo: string;
}


// --- Distribution Hub Types ---

export type DistributionStatus = 'idle' | 'sending' | 'success' | 'failed';

export interface DistributionPlatform {
  name: string;
  status: DistributionStatus;
}

export interface Submission {
  platformName: string;
  platformType: 'Playlist Curator' | 'Music Blog' | 'Literary Magazine' | 'Review Site';
  pitch: string;
}

export interface ScheduledPost {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  platform: SocialMediaPost['platform'];
  content: string;
}

// --- Analytics Types ---

export interface KPI {
  metric: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}
export interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
}
export interface EngagementTrend {
  day: string;
  likes: number;
  comments: number;
  shares: number;
}
export interface AnalyticsData {
  kpis: KPI[];
  sentiment: Sentiment;
  engagementTrend: EngagementTrend[];
  topPerformingContent: {
    content: string;
    platform: string;
    engagementRate: string;
  }[];
}

// --- CRM Types ---

export interface Contact {
  id: string;
  name: string;
  email: string;
  type: 'Media' | 'Fan' | 'Influencer' | 'Curator';
  tags: string[];
}

// --- Automation Types ---

export interface AutomationWorkflow {
  title: string;
  description: string;
  trigger: string;
  actions: string[];
  tools: string[];
}

// --- Interactive AI Types ---

export interface InteractiveConcept {
  title: string;
  description: string;
  interactionIdeas: string[];
  platform: string;
  imagePrompt: string;
}


// --- AI Factory Types ---

export interface SimulatedAudio {
  tool: 'Riffusion' | 'Bark (SunO AI)';
  promptUsed: string;
  description: string;
  howTo: string;
  parameters: {
      seed: number;
      denoising: number;
      guidance_scale: number;
  };
}


export type VideoGenerationStatus = 'idle' | 'generating' | 'success' | 'failed';

export interface GeneratedVideo {
    status: VideoGenerationStatus;
    videoUrl?: string;
    /** The operation object returned from the Gemini API, used for polling the status of the video generation. */
    operation?: any;
    error?: string;
}
