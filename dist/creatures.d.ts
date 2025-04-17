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
export declare function createCreature(params: CreateCreatureParams, options?: {
    token?: string;
}): Promise<Creature>;
