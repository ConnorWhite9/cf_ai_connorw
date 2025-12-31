export interface RouteData {
  count: number;
  lastReset: number;
}

export interface UserData {
  [route: string]: RouteData;
}

export interface UsersMap {
  [ip: string]: UserData;
}

export class RateLimiterDO implements DurableObject {
  state: DurableObjectState;
  env: any;
  users: UsersMap;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
    this.users = {}; // IP -> { route -> { count, lastReset } }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const ip = request.headers.get("CF-Connecting-IP");
    const route = url.pathname;

    if (!ip) return new Response("Cannot determine IP", { status: 400 });

    // Initialize IP and route if missing
    if (!this.users[ip]) this.users[ip] = {};
    if (!this.users[ip][route]) this.users[ip] = { count: 0, lastReset: Date.now() };
    if (!this.users[ip][route]) this.users[ip][route] = { count: 0, lastReset: Date.now() };

    const data = this.users[ip][route];

    const windowMs = 60_000; // 1 minute
    const maxRequests = 5;   // max requests per route per IP per window
    const now = Date.now();

    // Reset window if expired
    if (now - data.lastReset > windowMs) {
      data.count = 0;
      data.lastReset = now;
    }

    if (data.count >= maxRequests) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    data.count++;
    this.users[ip][route] = data;

    return new Response("Request allowed");
  }
}
