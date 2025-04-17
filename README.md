# Nano Creatures SDK

A TypeScript SDK for interacting with the Nano Creatures API programmatically. Create, manage, and interact with your AI creatures through a simple and intuitive interface.

## Installation

```bash
npm install @nano-creatures/sdk
```

## Quick Start

```typescript
import { NanoCreaturesSDK } from '@nano-creatures/sdk';

// Initialize the SDK
const sdk = new NanoCreaturesSDK();

// Sign up a new user
const signUpResponse = await sdk.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe' // Optional
});

// Sign in
const signInResponse = await sdk.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Use the token for authenticated requests
const { token } = signInResponse;

// Create a new creature
const creature = await sdk.createCreature(token, {
  name: 'My First Creature',
  description: 'A friendly AI companion'
});

// Add a memory source to your creature (required for chat)
await sdk.createMemorySource(token, creature.id, {
  name: 'Basic Knowledge',
  type: 'STATIC_TEXT',
  content: 'This creature is friendly and helpful. It likes to assist users with their tasks.'
});

// Now you can chat with your creature
const chatResponse = await sdk.chat(token, creature.id, {
  message: 'Hello! How are you today?'
});
```

## Important Notes

- **Memory Source Requirement**: A creature must have at least one memory source before you can chat with it. Memory sources provide the context and knowledge base that allows the creature to engage in meaningful conversations.
- Memory sources can be either static text or documents, allowing you to shape your creature's knowledge and behavior.

## API Reference

### Constructor

```typescript
new NanoCreaturesSDK(config?: NanoCreaturesSDKConfig)
```

#### Configuration Options

- `baseUrl`: (Optional) The base URL of the Nano Creatures API. Defaults to 'http://localhost:3000'
- `apiKey`: (Optional) API key for authentication

### Authentication

#### Sign Up

```typescript
async signUp(options: SignUpOptions): Promise<SignInResponse>
```

Creates a new user account.

##### Parameters
- `options.email`: User's email address
- `options.password`: User's password
- `options.name`: (Optional) User's name

##### Returns
- `token`: Authentication token
- `user`: User information object

#### Sign In

```typescript
async signIn(options: SignInOptions): Promise<SignInResponse>
```

Signs in an existing user.

##### Parameters
- `options.email`: User's email address
- `options.password`: User's password

##### Returns
- `token`: Authentication token
- `user`: User information object

### Creatures Management

#### Get Creatures

```typescript
async getCreatures(token: string): Promise<GetCreaturesResponse>
```

Retrieves all creatures for the authenticated user.

#### Create Creature

```typescript
async createCreature(token: string, params: CreateCreatureParams): Promise<Creature>
```

Creates a new creature.

##### Parameters
- `token`: Authentication token
- `params.name`: Name of the creature
- `params.description`: Description of the creature

#### Edit Creature

```typescript
async editCreature(token: string, id: string, params: UpdateCreatureParams): Promise<Creature>
```

Updates an existing creature.

##### Parameters
- `token`: Authentication token
- `id`: Creature ID
- `params.name`: (Optional) New name for the creature
- `params.description`: (Optional) New description for the creature

#### Delete Creature

```typescript
async deleteCreature(token: string, id: string): Promise<void>
```

Deletes a creature.

### Memory Sources

#### Create Memory Source

```typescript
async createMemorySource(
  token: string,
  creatureId: string,
  params: CreateMemorySourceParams
): Promise<MemorySource>
```

Adds a new memory source to a creature. At least one memory source is required before you can start chatting with a creature.

##### Parameters
- `token`: Authentication token
- `creatureId`: ID of the creature
- `params.name`: Name of the memory source
- `params.type`: Type of memory source ('STATIC_TEXT' | 'DOCUMENT')
- `params.content`: (Optional) Content for STATIC_TEXT type
- `params.fileUrl`: (Optional) URL for DOCUMENT type
- `params.fileName`: (Optional) File name for DOCUMENT type
- `params.fileSize`: (Optional) File size for DOCUMENT type

##### Example
```typescript
// Adding a static text memory source
await sdk.createMemorySource(token, creatureId, {
  name: 'Personality',
  type: 'STATIC_TEXT',
  content: 'This creature is an expert in JavaScript and helps developers write better code.'
});

// Adding a document memory source
await sdk.createMemorySource(token, creatureId, {
  name: 'Documentation',
  type: 'DOCUMENT',
  fileUrl: 'https://example.com/docs.pdf',
  fileName: 'documentation.pdf',
  fileSize: 1024000
});
```

### Chat

#### Send Message

```typescript
async chat(
  token: string,
  creatureId: string,
  params: ChatParams | string
): Promise<ChatResponse>
```

Send a message to chat with a creature.

##### Parameters
- `token`: Authentication token or API key (starting with 'sk-')
- `creatureId`: ID of the creature to chat with
- `params`: Either a string message or a ChatParams object:
  - `message`: The message to send
  - `maxResults`: (Optional) Maximum number of results to return
  - `sessionId`: (Optional) Session ID for continuing a conversation
  - `templateId`: (Optional) Template ID for specific chat behaviors

##### Returns
- `message`: The creature's response
- `results`: (Optional) Additional results data
- `session_id`: Session ID for the conversation
- `timestamp`: Timestamp of the response
- `query_type`: (Optional) Information about the query type

## Error Handling

The SDK throws errors with descriptive messages when operations fail. It's recommended to wrap API calls in try-catch blocks:

```typescript
try {
  const creature = await sdk.createCreature(token, {
    name: 'My Creature',
    description: 'A helpful AI friend'
  });
} catch (error) {
  console.error('Failed to create creature:', error.message);
}
```

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions for all methods and responses. Import types directly from the package:

```typescript
import {
  NanoCreaturesSDKConfig,
  SignInOptions,
  SignUpOptions,
  CreateCreatureParams,
  Creature,
  ChatParams,
  ChatResponse
} from '@nano-creatures/sdk';
``` 