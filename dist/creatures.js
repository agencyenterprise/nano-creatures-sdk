import { BASE_URL } from './config';
export async function createCreature(params, options) {
    const response = await fetch(`${BASE_URL}/api/creatures`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...((options === null || options === void 0 ? void 0 : options.token) && { Authorization: `Bearer ${options.token}` }),
        },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create creature');
    }
    return response.json();
}
