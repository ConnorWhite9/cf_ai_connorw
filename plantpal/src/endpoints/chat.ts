import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";
import { getTokenFromRequest } from "../utils/tokens";

export const chatHandler = async (c: HonoContext<Env>) => {

  const token = getTokenFromRequest(c);
  const stub = c.env.PLANT_DO.get(
    c.env.PLANT_DO.idFromName(token)
  );

  return stub.fetch(c.req.raw); 
};