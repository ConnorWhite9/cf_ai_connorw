// src/index.ts
import { Hono } from "hono";
import { chatHandler } from "./endpoints/chat";
import { addPlant } from "./endpoints/add";
import { grab } from "./endpoints/grab";
import type { DurableObjectNamespace, ExportedHandler } from "@cloudflare/workers-types";
import { PlantDO } from "./storage/plant-do";

export interface Env {
  PLANT_DO: DurableObjectNamespace<PlantDO>;
}

// Re-export explicitly for Wrangler dev to detect the Durable Object
export { PlantDO };

// Wrangler-compatible fetch handler for DO routing
export const durableObjectHandler = {
  async fetch(request: Request, env: Env) {
    const plantId = new URL(request.url).pathname.split("/")[1] || "default";
    const stub = env.PLANT_DO.getByName(plantId);
    return await stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;

// Hono app for your API routes
export const app = new Hono<{ Bindings: Env }>();

// Simple test route
app.get("/message", (c) => c.text("Hello Hono!"));

// Example route interacting with a plant DO and LLM
app.post("/example-plant-call", async (c) => {
  const { plantId, question } = await c.req.json();

  // Get the Durable Object stub
  const stub = c.env.PLANT_DO.getByName(plantId);

  // Fetch plant data from the DO
  const plantResp = await stub.fetch(new Request("/get"));
  const plantData = await plantResp.json();

  // Call LLM with context
  const results = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
    messages: [{ role: "user", content: question }],
  });

  return c.json({ plantData, results });
});

// Route for creating a plant object
app.post("/add", addPlant);

// Route to interact with LLM and ask for plant care advice
app.post("/chat", chatHandler);

// Route to grab plant data
app.get("/grab/:plantId", grab);

// Export default the Hono app for deployment
export default app;
