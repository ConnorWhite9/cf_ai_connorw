import type { HonoContext } from 'hono';
import type { Env } from './env'; 


export function getTokenFromRequest(c: HonoContext<Env>): string {
    console.log("Inside getTokenFromRequest");

    // Try both possible header casings
    const authHeader = c.req.header('authorization') || '';


    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        throw new Error('Unauthorized: missing Authorization header');
    }

    // Split by whitespace and handle extra spaces
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        throw new Error('Unauthorized: invalid Bearer token');
    }

    const token = parts[1].trim();
    console.log('Extracted Token:', token);

    return token;
}