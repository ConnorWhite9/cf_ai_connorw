import { DurableObject } from "cloudflare:workers";

export interface Env {
  MY_DURABLE_OBJECT: DurableObjectNamespace<PlantDO>;
}

// Durable Object
export class PlantDO extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  // Example method to fetch plant data from storage
  async getPlant(): Promise<any> {
    const data = await this.state.storage.get("plant") || {};
    return data;
  }

  // Example method to save plant data
  async setPlant(data: any): Promise<void> {
    await this.state.storage.put("plant", data);
  }

  // Handles incoming requests
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/get") {
      const plant = await this.getPlant();
      return new Response(JSON.stringify(plant), { status: 200 });
    }

    if (url.pathname === "/set") {
      const data = await request.json();
      await this.setPlant(data);
      return new Response("Plant saved", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    // Grab plantId
    const plantId = new URL(request.url).pathname.split("/")[1] || "default";
    const stub = env.MY_DURABLE_OBJECT.getByName(plantId);

    return await stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;