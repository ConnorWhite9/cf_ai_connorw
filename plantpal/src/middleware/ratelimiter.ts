import type { Env as RateLimiterEnv } from "../storage/rate-limiter";
import  shardKey from "../utils/shard";

export const rateLimitMiddleware = (env: RateLimiterEnv) => { 
    return async (c: any, next: any) => {

        const env = c.env;

        console.log("Rate limiter middleware invoked");
        const ip = c.req.header("CF-Connecting-IP") || 
        c.req.header("X-Forwarded-For") ||'';
        console.log("Extracted IP:", ip);
        if (!ip) {
            console.log("Missing CF-Connecting-IP header");
            return c.text("Cannot determine IP", 400);
        } 
        const index = shardKey(ip);
        const stub = env[`RATE_LIMIT_DO_${index}`].idFromName("shard");
        const rateLimiterStub = env[`RATE_LIMIT_DO_${index}`].get(stub);

        const rlReq = new Request("https://rate-limit/check", {
        method: "POST",
        headers: {
            "X-Client-IP": ip,
        },
        });

        const response = await rateLimiterStub.fetch(rlReq);


        if (response.status === 429) {
            return c.text("Rate limit exceeded", 429);
        }
        
        await next();
    }
};