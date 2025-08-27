import { GoogleGenAI, Type } from "@google/genai";
import { SocialMediaPost, BlogIdea, PressRelease, AnalyticsData, Contact, AutomationWorkflow, InteractiveConcept, Submission, ScheduledPost } from '../types';

// The API key is expected to be set in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Existing Functions
export const generateSocialMediaPosts = async (prompt: string): Promise<SocialMediaPost[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a set of 3-5 distinct social media posts to promote a musician or writer's work based on this topic: "${prompt}". Tailor each post for a different platform (X, Instagram, Mastodon, etc.).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING, enum: ['Facebook', 'X', 'Instagram', 'LinkedIn', 'TikTok', 'Mastodon', 'Bluesky'] },
                            content: { type: Type.STRING },
                            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            visualSuggestion: { type: Type.STRING, description: "A suggestion for a visual to accompany the post." }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text) as SocialMediaPost[];
    } catch (error) { console.error("Error generating social media posts:", error); throw new Error("Failed to generate social media posts."); }
};

export const generateBlogIdeas = async (prompt: string): Promise<BlogIdea[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 blog post ideas with outlines and keywords for a musician or writer based on this topic: "${prompt}".`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, outline: { type: Type.ARRAY, items: { type: Type.STRING } }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text) as BlogIdea[];
    } catch (error) { console.error("Error generating blog ideas:", error); throw new Error("Failed to generate blog ideas."); }
};

export const generatePressRelease = async (prompt: string): Promise<PressRelease> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a professional press release for a musician or writer based on this announcement: "${prompt}". The body should have at least two paragraphs.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, subheadline: { type: Type.STRING }, dateline: { type: Type.STRING }, body: { type: Type.STRING }, contactInfo: { type: Type.STRING } } } }
        });
        return JSON.parse(response.text) as PressRelease;
    } catch (error) { console.error("Error generating press release:", error); throw new Error("Failed to generate press release."); }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Concept art for a musician or writer. A vibrant, high-quality, aesthetically pleasing image based on the theme: ${prompt}`,
            config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '1:1' },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) { console.error("Error generating image:", error); throw new Error("Failed to generate image."); }
};

// New Functions for Prometheus OS
export const generateAnalyticsData = async (): Promise<AnalyticsData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a realistic set of marketing analytics data for an indie artist's recent album launch. Include KPIs, sentiment analysis, a 15-day engagement trend, and top performing content.",
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { kpis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, value: { type: Type.STRING }, change: { type: Type.STRING }, changeType: { type: Type.STRING, enum: ['increase', 'decrease'] } } } }, sentiment: { type: Type.OBJECT, properties: { positive: { type: Type.NUMBER }, neutral: { type: Type.NUMBER }, negative: { type: Type.NUMBER } } }, engagementTrend: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, likes: { type: Type.NUMBER }, comments: { type: Type.NUMBER }, shares: { type: Type.NUMBER } } } }, topPerformingContent: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, platform: { type: Type.STRING }, engagementRate: { type: Type.STRING } } } } } } }
        });
        return JSON.parse(response.text) as AnalyticsData;
    } catch (error) { console.error("Error generating analytics data:", error); throw new Error("Failed to generate analytics data."); }
};

export const generateContacts = async (prompt: string): Promise<Contact[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a list of 5 realistic, sample CRM contacts for a musician or writer in this genre: ${prompt}. Include media, curators, and influencers.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, email: { type: Type.STRING }, type: { type: Type.STRING, enum: ['Media', 'Fan', 'Influencer', 'Curator'] }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text) as Contact[];
    } catch (error) { console.error("Error generating contacts:", error); throw new Error("Failed to generate contacts."); }
};

export const generateWorkflows = async (prompt: string): Promise<AutomationWorkflow[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 automation workflow ideas for a creator focused on: ${prompt}. Describe the trigger, actions, and conceptual tools used (e.g., n8n, Mautic, WordPress).`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, trigger: { type: Type.STRING }, actions: { type: Type.ARRAY, items: { type: Type.STRING } }, tools: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text) as AutomationWorkflow[];
    } catch (error) { console.error("Error generating workflows:", error); throw new Error("Failed to generate workflows."); }
};

export const generateInteractiveConcept = async (prompt: string): Promise<InteractiveConcept> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a detailed concept for an AR/VR/MR interactive experience for a creative project based on this idea: "${prompt}". Include a title, description, interaction ideas, target platform (e.g., Spark AR), and a descriptive prompt for generating concept art.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, interactionIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }, platform: { type: Type.STRING }, imagePrompt: { type: Type.STRING } } } }
        });
        return JSON.parse(response.text) as InteractiveConcept;
    } catch (error) { console.error("Error generating interactive concept:", error); throw new Error("Failed to generate interactive concept."); }
};

export const generateSubmissions = async (prompt: string): Promise<Submission[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on this creative work: "${prompt}", generate a list of 5 distinct submission opportunities. For each, identify the platform name, type (e.g., Playlist Curator, Music Blog), and write a short, personalized pitch.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platformName: { type: Type.STRING },
                            platformType: { type: Type.STRING, enum: ['Playlist Curator', 'Music Blog', 'Literary Magazine', 'Review Site'] },
                            pitch: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text) as Submission[];
    } catch (error) {
        console.error("Error generating submissions:", error);
        throw new Error("Failed to generate submission pitches.");
    }
};

export const generateContentSchedule = async (prompt: string): Promise<ScheduledPost[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a 7-day social media content schedule to promote a project based on this goal: "${prompt}". For each day, suggest a post time, platform, and content idea.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
                            time: { type: Type.STRING },
                            platform: { type: Type.STRING, enum: ['Facebook', 'X', 'Instagram', 'LinkedIn', 'TikTok', 'Mastodon', 'Bluesky'] },
                            content: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text) as ScheduledPost[];
    } catch (error) {
        console.error("Error generating content schedule:", error);
        throw new Error("Failed to generate content schedule.");
    }
};