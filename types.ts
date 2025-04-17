export interface NanoCreaturesSDKConfig {
  baseUrl?: string;
  apiKey?: string;
}

export interface SignInOptions {
  email: string;
  password?: string;
}

export interface SignUpOptions {
  email: string;
  name?: string;
  password?: string;
}

export interface SignInResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface ErrorResponse {
  message: string;
  code: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  image?: string;
}

export interface Creature {
  id: string;
  name: string;
  description: string | null;
  apiKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCreaturesResponse {
  creatures: Creature[];
}
