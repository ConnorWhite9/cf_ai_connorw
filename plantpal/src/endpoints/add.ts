import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";
import { getTokenFromRequest } from "../utils/tokens";

export const addPlant = async (c: HonoContext<Env>) => {
    try {
        
    
        const userID = getTokenFromRequest(c);

        const body = await c.req.json();

        console.log("Received plant data to add:", body);

        const id = c.env.PLANT_DO.idFromName(userID);
        const stub = c.env.PLANT_DO.get(id);
        const res = await stub.fetch(
            new Request("https://dummy/set", {
                method: "POST", 
                body: JSON.stringify(body),
            })
        )

        const newPlant = await res.json()
        return c.json({ message: "Plant created", newPlant});

    } catch (error) {
        console.log("Error in addPlant:", error);
        return c.json({ error: (error as Error).message }, 400);
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