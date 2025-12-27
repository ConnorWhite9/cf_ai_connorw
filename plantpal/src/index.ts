import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello-ai", async (c) => {
  const results = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
    messages: [
      {"role": "user", "content": "Say hello in five different languages."}
    ]
  })
  return c.json(results);
})

export default app;
