import {
  NanoCreaturesSDKConfig,
  SignInOptions,
  SignUpOptions,
  SignInResponse,
  ErrorResponse,
  GetCreaturesResponse,
} from './types.js';
import jwt from 'jsonwebtoken';

const DEFAULT_BASE_URL = 'https://nanocreatures.app';

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

export class NanoCreaturesSDK {
  private config: Required<NanoCreaturesSDKConfig>;

  constructor(config: NanoCreaturesSDKConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
      apiKey: config.apiKey || '',
    };
    console.log('SDK initialized with config:', this.config);
  }

  /**
   * Signs up a new user
   * @param options - Sign up options containing email, optional name and password
   * @returns Promise with the sign in response containing token and user info
   */
  async signUp(options: SignUpOptions): Promise<SignInResponse> {
    try {
      const url = `${this.config.baseUrl}/api/auth/signup`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify(options),
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseText);

      if (!response.ok) {
        try {
          const error = JSON.parse(responseText);
          throw new Error(error.message || 'Failed to sign up');
        } catch (e) {
          throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during sign up');
    }
  }

  /**
   * Signs in a user with email and optional password
   * @param options - Sign in options containing email and optional password
   * @returns Promise with the sign in response containing token and user info
   */
  async signIn(options: SignInOptions): Promise<SignInResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();

      // Create a JWT token with the user ID
      const token = jwt.sign(
        { userId: data.user.id, email: data.user.email },
        'iloveburritosbaby', // This should match NEXTAUTH_SECRET
        { expiresIn: '1h' }
      );

      return {
        ...data,
        token,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during sign in');
    }
  }

  /**
   * Gets all creatures for the authenticated user
   * @param token - User authentication token
   * @returns Promise with the list of creatures
   */
  async getCreatures(token: string): Promise<GetCreaturesResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/creatures`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching creatures');
    }
  }

  /**
   * Creates a new creature
   * @param token - User authentication token
   * @param params - Creature creation parameters
   * @returns Promise with the created creature
   */
  async createCreature(token: string, params: CreateCreatureParams): Promise<Creature> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/creatures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message || 'Failed to create creature');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while creating creature');
    }
  }

  /**
   * Updates an existing creature
   * @param token - User authentication token
   * @param id - Creature ID
   * @param params - Update parameters
   * @returns Promise with the updated creature
   */
  async editCreature(token: string, id: string, params: UpdateCreatureParams): Promise<Creature> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/creatures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message || 'Failed to update creature');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while updating creature');
    }
  }

  /**
   * Deletes a creature
   * @param token - User authentication token
   * @param id - Creature ID
   * @returns Promise that resolves when the creature is deleted
   */
  async deleteCreature(token: string, id: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/creatures/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message || 'Failed to delete creature');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while deleting creature');
    }
  }

  /**
   * Creates a new memory source for a creature
   * @param token - User authentication token
   * @param creatureId - ID of the creature to add the memory source to
   * @param params - Memory source creation parameters
   * @returns Promise with the created memory source
   */
  async createMemorySource(
    token: string,
    creatureId: string,
    params: CreateMemorySourceParams
  ): Promise<MemorySource> {
    try {
      const formData = new FormData();
      formData.append('name', params.name);
      formData.append('type', params.type);

      if (params.type === 'STATIC_TEXT' && params.content) {
        formData.append('content', params.content);
      } else if (params.type === 'DOCUMENT') {
        if (params.fileUrl) {
          formData.append('fileUrl', params.fileUrl);
        }
        if (params.fileName) {
          formData.append('fileName', params.fileName);
        }
        if (params.fileSize) {
          formData.append('fileSize', params.fileSize.toString());
        }
      }

      const response = await fetch(
        `${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while creating memory source');
    }
  }

  /**
   * Sends a chat message to a creature
   * @param token - User authentication token or API key
   * @param creatureId - ID of the creature to chat with
   * @param params - Chat parameters containing message and optional settings
   * @returns Promise with the chat response
   */
  async chat(
    token: string,
    creatureId: string,
    params: ChatParams | string
  ): Promise<ChatResponse> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // If token starts with 'sk-', it's an API key, otherwise it's a JWT token
      if (token.startsWith('sk-')) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // If params is a string, convert it to a ChatParams object
      const requestBody = typeof params === 'string' ? { message: params } : params;

      const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while sending chat message');
    }
  }
}

export default NanoCreaturesSDK;
