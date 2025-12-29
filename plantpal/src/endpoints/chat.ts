import { HonoContext } from "hono"; // type for context if using TypeScript
import { Env } from "../storage/plant-do";

export const chatHandler = async (c: HonoContext<Env>) => {

  const plantId = c.req.param("plantId");
  const { question } = await c.req.json();

  const stub = c.env.PLANT_DO.getByName(plantId);

  const plantResp = await stub.fetch(new Request(`https://dummy/get`));
  const plantData = await plantResp.json();

  const answer = await c.env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
    prompt: `You are a helpful plant assistant.\nPlant info: ${JSON.stringify(plantData)}\nQuestion: ${question}`,
  });

  return c.json({ answer: answer.output_text });
};