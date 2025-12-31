import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";
import { getTokenFromRequest } from "../utils/tokens";

export const addPlant = async (c: HonoContext<Env>) => {
    try {
        
        
        console.log("c", c.req.raw.headers);
        const userID = getTokenFromRequest(c);

        //const userID = getTokenFromRequest(c);
        const { plantData } = await c.req.json();
        console.log("Add Plant Endpoint Hit");
        console.log("Plant Data Received:", plantData);

        const id = c.env.PLANT_DO.idFromName(userID);
        const stub = c.env.PLANT_DO.get(id);
        const res = await stub.fetch(
            new Request("https://dummy/set", {
                method: "POST", 
                body: JSON.stringify(plantData),
            })
        )

        const newPlant = await res.json()
        return c.json({ message: "Plant created", newPlant});

    } catch (error) {
        console.log("Error in addPlant:", error);
        return c.json({ error: (error as Error).message, "connor": "Why is it not working" }, 400);
    }
}


/* 

Example Request: 

{
  "plantData": {
    "plantId": "fern-123",
    "name": "Fern",
    "lastWatered": "2025-12-28",
    "waterIntervalDays": 3
  }
}

*/


//Bearer fake-user-token-123
//token = fake-user-token-123