import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";
import { getTokenFromRequest } from "../utils/tokens";

export const demo = async (c: HonoContext<Env>) => {
    try {
        const userID = getTokenFromRequest(c);

        const id = c.env.PLANT_DO.idFromName(userID);
        const stub = c.env.PLANT_DO.get(id);
        const res = await stub.fetch(
            new Request("https://dummy/demo", {
                method: "POST", 
            })
        )

        const newPlants = await res.json()
        return c.json({ message: "Demo Plants Created", newPlants});

    } catch (error) {
        console.log("Error in addPlant:", error);
        return c.json({ error: (error as Error).message, "connor": "Why is it not working" }, 400);
    }
}
