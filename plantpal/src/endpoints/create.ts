import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";

export const createPlant = async (c: HonoContext<Env>) => {
    const { plantId, plantData } = await c.req.json();


    const stub = c.env.PlANT_DO.getByName(plantId);

    await stub.fetch(
        new Request("https://dummy/init", {
            method: "POST", 
            body: JSON.stringify(plantData),
        })
    )

    return c.json({ message: "Plant created", plantId });
}