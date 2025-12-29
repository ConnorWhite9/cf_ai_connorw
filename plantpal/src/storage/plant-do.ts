// storage/plant-do.ts
import type { DurableObjectState, Env } from "../index";

export class PlantDO {
  constructor(private state: DurableObjectState, private env: Env) {}

  async getPlant(): Promise<any> {
    return (await this.state.storage.get("plant")) || {};
  }

  async setPlant(data: any): Promise<void> {
    await this.state.storage.put("plant", data);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/get") return new Response(JSON.stringify(await this.getPlant()), { status: 200 });
    if (url.pathname === "/set") {
      const data = await request.json();
      await this.setPlant(data);
      return new Response("Plant saved", { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  }
}
