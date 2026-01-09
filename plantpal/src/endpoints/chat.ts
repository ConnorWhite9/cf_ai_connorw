import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";
import { getTokenFromRequest } from "../utils/tokens";

export const chatHandler = async (c: HonoContext<Env>) => {

  const token = getTokenFromRequest(c);
  // Get the Durable Object stub for this plant
  const stub = c.env.PLANT_DO.getByName(token);

  const body = await c.req.json();

  // Fetch plant data from the DO
 const res = await stub.fetch(
            new Request("https://dummy/chat", {
                method: "POST", 
                body: JSON.stringify(body),
            })
        )
  // Example: { species: "succulent", water: "weekly" 
  const plantData = await res.json();
  return c.json(plantData);
};