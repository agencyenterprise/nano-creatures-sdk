import { NanoCreaturesSDKConfig, SignInOptions, SignUpOptions, SignInResponse, GetCreaturesResponse } from './types.js';
export interface CreateCreatureParams {
    name: string;
    description: string;
}
export interface Creature {
    id: string;
    name: string;
    description: string;
    apiKey: string;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateCreatureParams {
    name?: string;
    description?: string;
}
export interface CreateMemorySourceParams {
    name: string;
    type: 'STATIC_TEXT' | 'DOCUMENT';
    content?: string;
    file?: File;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
}
export interface MemorySource {
    id: string;
    name: string;
    type: string;
    content: string | null;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    createdAt: string;
    updatedAt: string;
}
export interface ChatParams {
    message: string;
    maxResults?: number;
    sessionId?: string;
    templateId?: string;
}
export interface ChatResponse {
    message: string;
    results?: Record<string, any>;
    session_id: string;
    timestamp: string;
    query_type?: {
        isTimeBasedQuery: boolean;
        isContentBasedQuery: boolean;
    };
    slack_filters?: any;
    github_filters?: any;
    google_filters?: any;
}
export declare class NanoCreaturesSDK {
    private config;
    constructor(config?: NanoCreaturesSDKConfig);
    /**
     * Signs up a new user
     * @param options - Sign up options containing email, optional name and password
     * @returns Promise with the sign in response containing token and user info
     */
    signUp(options: SignUpOptions): Promise<SignInResponse>;
    /**
     * Signs in a user with email and optional password
     * @param options - Sign in options containing email and optional password
     * @returns Promise with the sign in response containing token and user info
     */
    signIn(options: SignInOptions): Promise<SignInResponse>;
    /**
     * Gets all creatures for the authenticated user
     * @param token - User authentication token
     * @returns Promise with the list of creatures
     */
    getCreatures(token: string): Promise<GetCreaturesResponse>;
    /**
     * Creates a new creature
     * @param token - User authentication token
     * @param params - Creature creation parameters
     * @returns Promise with the created creature
     */
    createCreature(token: string, params: CreateCreatureParams): Promise<Creature>;
    /**
     * Updates an existing creature
     * @param token - User authentication token
     * @param id - Creature ID
     * @param params - Update parameters
     * @returns Promise with the updated creature
     */
    editCreature(token: string, id: string, params: UpdateCreatureParams): Promise<Creature>;
    /**
     * Deletes a creature
     * @param token - User authentication token
     * @param id - Creature ID
     * @returns Promise that resolves when the creature is deleted
     */
    deleteCreature(token: string, id: string): Promise<void>;
    /**
     * Creates a new memory source for a creature
     * @param token - User authentication token
     * @param creatureId - ID of the creature to add the memory source to
     * @param params - Memory source creation parameters
     * @returns Promise with the created memory source
     */
    createMemorySource(token: string, creatureId: string, params: CreateMemorySourceParams): Promise<MemorySource>;
    /**
     * Sends a chat message to a creature
     * @param token - User authentication token or API key
     * @param creatureId - ID of the creature to chat with
     * @param params - Chat parameters containing message and optional settings
     * @returns Promise with the chat response
     */
    chat(token: string, creatureId: string, params: ChatParams | string): Promise<ChatResponse>;
    testEndpoint(): Promise<void>;
}
export default NanoCreaturesSDK;
