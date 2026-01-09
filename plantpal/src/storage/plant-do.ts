// storage/plant-do.ts
import type { DurableObjectState, Env } from "../index";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Plant {
  plantId : string;
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

  async demoPlants(data: any): Promise<void> {
    await this.state.storage.put("demoPlants", data);
  }


  private async handleChat(req: Request) {

    const { plantId, message } = (await req.json()) as { plantId: string; message: string };
    if (!plantId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing plantId or message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Load all plants for this user
    const plants: Plant[] = (await this.state.storage.get("plants")) || [];
    const plant = plants.find(p => p.plantId === plantId);
    if (!plant) {
      return new Response(
        JSON.stringify({ error: "Plant not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
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
    console.log("Sending prompt to AI:", prompt);
    const answer = await (this.env as any).AI.run(
      "@cf/meta/llama-3-8b-instruct",
      { prompt }
    );

    const assistantReply = answer.response;
    console.log("AI assistant reply:", assistantReply);
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
    if (url.pathname === "/getAll") {
      const plants = await this.getPlants();
      return new Response(JSON.stringify(plants), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (url.pathname === "/demo") {
      const mockPlants: Plant[] = [
      {
        plantId: "plant_1",
        name: "Spike",
        species: {
          commonName: "Snake Plant",
          scientificName: "Sansevieria trifasciata"
        },
        imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400",
        care: {
          light: "low",
          wateringFrequencyDays: 14,
          soilType: "well-draining",
          fertilizerFrequencyDays: 60
        },
        location: {
          room: "Living Room",
          windowDirection: "north"
        },
        schedule: {
          lastWatered: "2024-12-20"
        },
        notes: "Very low maintenance, perfect for beginners",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-12-20T14:30:00Z"
      },
      {
        plantId: "plant_2",
        name: "Monstera Mike",
        species: {
          commonName: "Monstera",
          scientificName: "Monstera deliciosa"
        },
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
        care: {
          light: "bright",
          wateringFrequencyDays: 7,
          soilType: "standard",
          fertilizerFrequencyDays: 30
        },
        location: {
          room: "Bedroom",
          windowDirection: "east"
        },
        schedule: {
          lastWatered: "2024-12-25"
        },
        notes: "Loves humidity, mist regularly",
        createdAt: "2024-02-10T12:00:00Z",
        updatedAt: "2024-12-25T09:15:00Z"
      }];

      const oldPlants = await this.getPlants();

      const newPlants = [...oldPlants, ...mockPlants];

      await this.savePlants(newPlants);
      return new Response(JSON.stringify(mockPlants), { status: 200, headers: { "Content-Type": "application/json" } });
      //Added the two demo plants so users can play around with other
      //features without needing to fill out their own plant data first.
    
    }
    if (url.pathname === "/set") {
      console.log("Handling /set request");
      const incoming: any = await request.json() 

      const newPlant: Plant = {
        ...incoming, 
        id: incoming.plantId
      }

      console.log("New plant data received:", newPlant);

      const plants = await this.getPlants();
      const existingIndex = plants.findIndex(p => p.plantId === newPlant.plantId);

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
