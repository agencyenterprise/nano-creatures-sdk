import jwt from 'jsonwebtoken';
const DEFAULT_BASE_URL = 'https://www.nanocreatures.app';
export class NanoCreaturesSDK {
    constructor(config = {}) {
        this.config = {
            baseUrl: config.baseUrl || DEFAULT_BASE_URL,
            apiKey: config.apiKey || '',
        };
    }
    /**
     * Signs up a new user
     * @param options - Sign up options containing email, optional name and password
     * @returns Promise with the sign in response containing token and user info
     */
    async signUp(options) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify(options),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        }
        catch (error) {
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
    async signIn(options) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify(options),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            const data = await response.json();
            // Create a JWT token with the user ID
            const token = jwt.sign({ userId: data.user.id, email: data.user.email }, 'iloveburritosbaby', // This should match NEXTAUTH_SECRET
            { expiresIn: '1h' });
            return {
                ...data,
                token,
            };
        }
        catch (error) {
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
    async getCreatures(token) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/creatures`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        }
        catch (error) {
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
    async createCreature(token, params) {
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
                const error = await response.json();
                throw new Error(error.message || 'Failed to create creature');
            }
            return await response.json();
        }
        catch (error) {
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
    async editCreature(token, id, params) {
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
                const error = await response.json();
                throw new Error(error.message || 'Failed to update creature');
            }
            return await response.json();
        }
        catch (error) {
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
    async deleteCreature(token, id) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/creatures/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete creature');
            }
        }
        catch (error) {
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
    async createMemorySource(token, creatureId, params) {
        try {
            const formData = new FormData();
            formData.append('name', params.name);
            formData.append('type', params.type);
            if (params.type === 'STATIC_TEXT' && params.content) {
                formData.append('content', params.content);
            }
            else if (params.type === 'DOCUMENT') {
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
            const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        }
        catch (error) {
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
    async chat(token, creatureId, params) {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            // If token starts with 'sk-', it's an API key, otherwise it's a JWT token
            if (token.startsWith('sk-')) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            else {
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
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred while sending chat message');
        }
    }
}
export default NanoCreaturesSDK;
