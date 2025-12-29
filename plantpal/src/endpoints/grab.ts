import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";

export const grab = async (c: HonoContext<Env>) => {

  // Get the plant ID from URL
  const plantId = c.req.param("plantId");    
  // Parse user question from request body

  // Get the Durable Object stub for this plant
  const stub = c.env.PLANT_DO.getByName(plantId);

  // Fetch plant data from the DO
  const plantResp = await stub.fetch(new Request(`https://dummy/get`));
  // Example: { species: "succulent", water: "weekly" 
  const plantData = await plantResp.json();

  return c.json(plantData);
};