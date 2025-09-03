import { GoogleGenAI, Type } from "@google/genai";
import { SocialMediaPost, BlogIdea, PressRelease, AnalyticsData, Contact, AutomationWorkflow, InteractiveConcept, Submission, ScheduledPost } from '../types.js';

// The API key is expected to be set in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A centralized error handler for Gemini API calls.
 * It inspects the error and returns a more user-friendly, specific message.
 * @param {unknown} error - The error object caught.
 * @param {string} context - A string describing the operation that failed (e.g., "social media post generation").
 * @returns {Error} A new Error object with a user-friendly message.
 */
const handleGeminiError = (error: unknown, context: string): Error => {
    console.error(`Error during ${context}:`, error);
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('api key not valid')) {
            return new Error("Authentication failed: The provided API Key is not valid. Please check your environment configuration.");
        }
        if (errorMessage.includes('quota')) {
            return new Error("API quota exceeded. Please check your Google AI platform billing or wait and try again later.");
        }
        if (errorMessage.includes('timed out')) {
            return new Error("The request timed out. The service may be busy. Please try again in a moment.");
        }
         if (errorMessage.includes('permission denied')) {
            return new Error("Permission Denied. The API key does not have the required permissions for this operation.");
        }
        // A more detailed fallback that includes the original error reason
        return new Error(`Failed during ${context}. Reason: ${error.message}`);
    }
    // Very generic fallback for non-Error exceptions
    return new Error(`An unknown error occurred during ${context}.`);
};


/**
 * Generates a series of social media posts based on a user prompt.
 * @param {string} prompt - The user's prompt describing the topic for the posts.
 * @returns {Promise<SocialMediaPost[]>} A promise that resolves to an array of social media post objects.
 * @throws {Error} Throws an error if the API call fails.
 */
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
        return JSON.parse(response.text.trim()) as SocialMediaPost[];
    } catch (error) { throw handleGeminiError(error, "social media post generation"); }
};

/**
 * Generates a list of blog post ideas with outlines and keywords.
 * @param {string} prompt - The user's prompt describing the topic for the blog ideas.
 * @returns {Promise<BlogIdea[]>} A promise that resolves to an array of blog idea objects.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generateBlogIdeas = async (prompt: string): Promise<BlogIdea[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 blog post ideas with outlines and keywords for a musician or writer based on this topic: "${prompt}".`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, outline: { type: Type.ARRAY, items: { type: Type.STRING } }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text.trim()) as BlogIdea[];
    } catch (error) { throw handleGeminiError(error, "blog idea generation"); }
};

/**
 * Generates a professional press release from a prompt.
 * @param {string} prompt - The user's prompt containing the announcement details.
 * @returns {Promise<PressRelease>} A promise that resolves to a press release object.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generatePressRelease = async (prompt: string): Promise<PressRelease> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a professional press release for a musician or writer based on this announcement: "${prompt}". The body should have at least two paragraphs.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, subheadline: { type: Type.STRING }, dateline: { type: Type.STRING }, body: { type: Type.STRING }, contactInfo: { type: Type.STRING } } } }
        });
        return JSON.parse(response.text.trim()) as PressRelease;
    } catch (error) { throw handleGeminiError(error, "press release generation"); }
};

/**
 * Generates an image using the Imagen model based on a descriptive prompt.
 * @param {string} prompt - The text prompt describing the desired image.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated PNG image.
 * @throws {Error} Throws an error if the image generation fails.
 */
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
        throw new Error("No image was generated by the API.");
    } catch (error) { throw handleGeminiError(error, "image generation"); }
};

/**
 * Initiates a video generation task with the Veo model.
 * @param {string} prompt - The text prompt describing the video to be generated.
 * @returns {Promise<any>} A promise that resolves to an operation object, which can be used to poll for the result.
 * @throws {Error} Throws an error if starting the generation fails.
 */
export const generateVideo = async (prompt: string): Promise<any> => {
    try {
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        throw handleGeminiError(error, "starting video generation");
    }
};

/**
 * Polls the status of an ongoing video generation operation.
 * @param {any} operation - The operation object received from `generateVideo`.
 * @returns {Promise<any>} A promise that resolves to the updated operation object, indicating the current status.
 * @throws {Error} Throws an error if the status check fails.
 */
export const getVideosOperation = async (operation: any): Promise<any> => {
    try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        throw handleGeminiError(error, "getting video operation status");
    }
};

/**
 * Fetches the generated video file from its URI.
 * @param {string} uri - The download URI for the video, obtained from a completed operation.
 * @returns {Promise<Blob>} A promise that resolves to a Blob containing the video data.
 * @throws {Error} Throws an error if fetching the video fails.
 */
export const fetchVideo = async (uri: string): Promise<Blob> => {
    try {
        const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch video with status ${response.status}: ${response.statusText}`);
        }
        return await response.blob();
    } catch (error) {
        throw handleGeminiError(error, "fetching video file");
    }
};

/**
 * Generates a set of simulated marketing analytics data.
 * @returns {Promise<AnalyticsData>} A promise that resolves to a complete analytics data object.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generateAnalyticsData = async (): Promise<AnalyticsData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a realistic set of marketing analytics data for an indie artist's recent album launch. Include KPIs, sentiment analysis, a 15-day engagement trend, and top performing content.",
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { kpis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, value: { type: Type.STRING }, change: { type: Type.STRING }, changeType: { type: Type.STRING, enum: ['increase', 'decrease'] } } } }, sentiment: { type: Type.OBJECT, properties: { positive: { type: Type.NUMBER }, neutral: { type: Type.NUMBER }, negative: { type: Type.NUMBER } } }, engagementTrend: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, likes: { type: Type.NUMBER }, comments: { type: Type.NUMBER }, shares: { type: Type.NUMBER } } } }, topPerformingContent: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, platform: { type: Type.STRING }, engagementRate: { type: Type.STRING } } } } } } }
        });
        return JSON.parse(response.text.trim()) as AnalyticsData;
    } catch (error) { throw handleGeminiError(error, "analytics data generation"); }
};

/**
 * Generates a list of sample CRM contacts based on a niche.
 * @param {string} prompt - A description of the creator's niche (e.g., "sci-fi author").
 * @returns {Promise<Contact[]>} A promise that resolves to an array of contact objects.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generateContacts = async (prompt: string): Promise<Contact[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a list of 5 realistic, sample CRM contacts for a musician or writer in this genre: ${prompt}. Include media, curators, and influencers.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, email: { type: Type.STRING }, type: { type: Type.STRING, enum: ['Media', 'Fan', 'Influencer', 'Curator'] }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text.trim()) as Contact[];
    } catch (error) { throw handleGeminiError(error, "contact generation"); }
};

/**
 * Generates ideas for marketing automation workflows.
 * @param {string} prompt - A description of the automation goal.
 * @returns {Promise<AutomationWorkflow[]>} A promise that resolves to an array of workflow idea objects.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generateWorkflows = async (prompt: string): Promise<AutomationWorkflow[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 automation workflow ideas for a creator focused on: ${prompt}. Describe the trigger, actions, and conceptual tools used (e.g., n8n, Mautic, WordPress).`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, trigger: { type: Type.STRING }, actions: { type: Type.ARRAY, items: { type: Type.STRING } }, tools: { type: Type.ARRAY, items: { type: Type.STRING } } } } } }
        });
        return JSON.parse(response.text.trim()) as AutomationWorkflow[];
    } catch (error) { throw handleGeminiError(error, "workflow generation"); }
};

/**
 * Generates a detailed concept for an interactive experience (AR/VR/MR).
 * @param {string} prompt - A prompt describing the core idea for the experience.
 * @returns {Promise<InteractiveConcept>} A promise that resolves to an interactive concept object.
 * @throws {Error} Throws an error if the API call fails.
 */
export const generateInteractiveConcept = async (prompt: string): Promise<InteractiveConcept> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a detailed concept for an AR/VR/MR interactive experience for a creative project based on this idea: "${prompt}". Include a title, description, interaction ideas, target platform (e.g., Spark AR), and a descriptive prompt for generating concept art.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, interactionIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }, platform: { type: Type.STRING }, imagePrompt: { type: Type.STRING } } } }
        });
        return JSON.parse(response.text.trim()) as InteractiveConcept;
    } catch (error) { throw handleGeminiError(error, "interactive concept generation"); }
};

/**
 * Generates a list of submission opportunities with personalized pitches.
 * @param {string} prompt - A description of the creative work to be pitched.
 * @returns {Promise<Submission[]>} A promise that resolves to an array of submission objects.
 * @throws {Error} Throws an error if the API call fails.
 */
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
        return JSON.parse(response.text.trim()) as Submission[];
    } catch (error) {
        throw handleGeminiError(error, "submission pitch generation");
    }
};

/**
 * Generates a 7-day social media content schedule based on a promotional goal.
 * @param {string} prompt - The promotional goal (e.g., "promote my new single").
 * @returns {Promise<ScheduledPost[]>} A promise that resolves to an array of scheduled post objects.
 * @throws {Error} Throws an error if the API call fails.
 */
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
        return JSON.parse(response.text.trim()) as ScheduledPost[];
    } catch (error) {
        throw handleGeminiError(error, "content schedule generation");
    }
};