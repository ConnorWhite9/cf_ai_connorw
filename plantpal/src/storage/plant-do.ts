// storage/plant-do.ts
import type { DurableObjectState, Env } from "../index";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Plant {
  id: string;
  name: string;
  species: string;
  chat?: ChatMessage[];
}

export class PlantDO {
  constructor(private state: DurableObjectState, private env: Env) {}

  async getPlants(): Promise<Plant[]> {
    return (await this.state.storage.get("plants")) || [];
  }

  async savePlants(plants: Plant[]): Promise<void> {
    await this.state.storage.put("plants", plants);
  }


  async getPlant(): Promise<any> {
    return (await this.state.storage.get("plant")) || {};
  }

  async setPlant(data: any): Promise<void> {
    await this.state.storage.put("plant", data);
  }

  private async handleChat(req: Request) {

    const { plantId, message } = (await req.json()) as { plantId: string; message: string };

    if (!plantId || !message) {
      return new Response("Missing plantId or message", { status: 400 });
    }

    // Load all plants for this user
    const plants: Plant[] = (await this.state.storage.get("plants")) || [];
    const plant = plants.find(p => p.id === plantId);

    if (!plant) {
      return new Response("Plant not found", { status: 404 });
    }

    // Initialize chat history if first message
    plant.chat ||= [];


    plant.chat.push({
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });

    
    const prompt = `
      You are a helpful plant assistant.

      Plant name: ${plant.name}
      Species: ${plant.species}

      Conversation:
      ${plant.chat.slice(-10).map(m => `${m.role}: ${m.content}`).join("\n")}
      `;

    // Call AI
    const answer = await (this.env as any).AI.run(
      "@cf/meta/llama-3.3-70b-instruct",
      { prompt }
    );

    const assistantReply = answer.output_text;

    // Store assistant reply
    plant.chat.push({
      role: "assistant",
      content: assistantReply,
      timestamp: new Date().toISOString(),
    });

    // Persist state
    await this.state.storage.put("plants", plants);

    return new Response(
      JSON.stringify({ answer: assistantReply }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
   

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/get") return new Response(JSON.stringify(await this.getPlant()), { status: 200 });
    if (url.pathname === "/set") {
      console.log("Handling /set request");
      const newPlant: Plant = await request.json();

      const plants = await this.getPlants();
      const existingIndex = plants.findIndex(p => p.id === newPlant.id);

      if (existingIndex > -1) {
        // Replace existing plant
        plants[existingIndex] = newPlant;
      } else {
        // Add new plant
        plants.push(newPlant);
      }

      await this.savePlants(plants);
      return new Response(JSON.stringify(newPlant), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (url.pathname === "/chat") {
      return this.handleChat(request);
    }
    return new Response("Not found", { status: 404 });
  }
}
