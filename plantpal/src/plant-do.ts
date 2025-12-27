import { DurableObject } from "cloudflare:workers";

export class PlantDO extends DurableObject<Env> {
  state: DurableObjectState;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.state = ctx;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // GET request: retrieve stored plant data
    if (request.method === "GET") {
      const plantData = await this.state.storage.get("plant");
      return new Response(JSON.stringify(plantData || {}), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST request: update plant data
    if (request.method === "POST") {
      const data = await request.json();
      await this.state.storage.put("plant", data);
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Use plant ID or name from URL path to get the correct Durable Object
    const plantId = new URL(request.url).pathname.slice(1); 
    const stub = env.PLANT_DO.getByName(plantId);

    // Forward request to Durable Object
    const response = await stub.fetch(request);
    return response;
  },
} satisfies ExportedHandler<Env>;