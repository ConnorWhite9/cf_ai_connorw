import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";

export const createPlant = async (c: HonoContext<Env>) => {
    const { plantId, plantData } = await c.req.json();


    const stub = c.env.PLANT_DO.getByName(plantId);

    await stub.fetch(
        new Request("https://dummy/set", {
            method: "POST", 
            body: JSON.stringify(plantData),
        })
    )

    return c.json({ message: "Plant created", plantId });
}

/* 

Example Request: 

{
  "plantId": "fern-123",
  "plantData": {
    "name": "Fern",
    "lastWatered": "2025-12-28",
    "waterIntervalDays": 3
  }
}

*/