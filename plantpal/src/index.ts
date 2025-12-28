import { Hono } from "hono";
import { chatHandler } from "./endpoints/chat";
import { createPlant } from "./endpoints/create";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

//Example call with syntax to base all other calls on 
app.get("/example-plant-call", async (c) => {

  // Get the plant ID from URL
  const plantId = c.req.param("plantId");    
  // Parse user question from request body
  const { question } = await c.req.json();        

  // Get the Durable Object stub for this plant
  const stub = c.env.MY_DURABLE_OBJECT.getByName(plantId);

  // Fetch plant data from the DO
  const plantResp = await stub.fetch(new Request(`https://dummy/get`));
  // Example: { species: "succulent", water: "weekly" 
  const plantData = await plantResp.json();
  
  //Make call to LLM with context we just gathered. 
  const results = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
    messages: [
      {"role": "user", "content": "Say hello in five different languages."}
    ]
  })
    
  return c.json(results);
})


//Route for creating a plant object with attributes like last_watered etc..
app.post("/create", createPlant);

//Route to interact with LLM and ask for advice about plant care
app.post("/chat/:plantId", chatHandler);


export default app;
