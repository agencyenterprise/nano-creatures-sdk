// const DEFAULT_BASE_URL = 'https://www.nanocreatures.app';
const DEFAULT_BASE_URL = 'http://localhost:3000';
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
            return await response.json();
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
            if (params.type === 'DOCUMENT' && params.file) {
                // Convert file to base64
                const base64Content = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (typeof reader.result === 'string') {
                            resolve(reader.result);
                        }
                        else {
                            reject(new Error('Failed to convert file to base64'));
                        }
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(params.file);
                });
                const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'DOCUMENT',
                        name: params.name,
                        fileUrl: base64Content,
                        fileName: params.file.name,
                        fileSize: params.file.size,
                    }),
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
                return await response.json();
            }
            else {
                // Handle non-file uploads (static text or URL-based documents)
                const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: params.name,
                        type: params.type,
                        ...(params.type === 'STATIC_TEXT' && params.content ? { content: params.content } : {}),
                        ...(params.type === 'DOCUMENT' ? {
                            fileUrl: params.fileUrl,
                            fileName: params.fileName,
                            fileSize: params.fileSize,
                        } : {}),
                    }),
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
                return await response.json();
            }
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
    /**
     * Deletes a memory source from a creature
     * @param token - User authentication token
     * @param creatureId - ID of the creature that owns the memory source
     * @param memorySourceId - ID of the memory source to delete
     * @returns Promise that resolves when the memory source is deleted
     */
    async deleteMemorySource(token, creatureId, memorySourceId) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources/${memorySourceId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred while deleting memory source');
        }
    }
    /**
     * Gets all memory sources for a creature
     * @param token - User authentication token
     * @param creatureId - ID of the creature to get memory sources from
     * @returns Promise with the list of memory sources
     */
    async getMemorySources(token, creatureId) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources`, {
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
            throw new Error('An unexpected error occurred while fetching memory sources');
        }
    }
    /**
     * Updates an existing memory source for a creature
     * @param token - User authentication token
     * @param creatureId - ID of the creature that owns the memory source
     * @param memorySourceId - ID of the memory source to update
     * @param params - Update parameters
     * @returns Promise with the updated memory source
     */
    async editMemorySource(token, creatureId, memorySourceId, params) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/creatures/${creatureId}/memory-sources/${memorySourceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(params.name && { name: params.name }),
                    ...(params.type && { type: params.type }),
                    ...(params.content && { content: params.content }),
                    ...(params.fileUrl && { fileUrl: params.fileUrl }),
                    ...(params.fileName && { fileName: params.fileName }),
                    ...(params.fileSize && { fileSize: params.fileSize }),
                }),
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
            throw new Error('An unexpected error occurred while updating memory source');
        }
    }
}
export default NanoCreaturesSDK;
