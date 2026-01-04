1. For my plant-pal app idea what cloudflare services should I use for each component of the app and what command should I use to initialize the overarching project structure? 

2. Help me restructure my durable objects initialization for PlantDO to be in line with convention for defining durable objects on Cloudflare.

3. Help me format my durable object code for a plant object that tracks its features such as plant_type, last_time_watered etc; 

4. How do I add a frontend to my workers project would that be workers pages or would I just add a react project to my project?

5. Give me commands to add Tailwind CSS to my React tsx project.

6. I'm making a plant agent web app that tracks info about your plant and provides information on  how to care for it given prompts. Can you make me a HomePage.tsx, AddPlantPage.tsx, and PlantDetailPage.tsx UI design. Incorporate all the necessary components that these pages may need. Additionally, the project also uses react-router and tailwind css. make sure the pages and components are easily scalable so I can add additional features easily. 

7. Build me a create plant form for my plantpal app website in react (TS). Make the UX nice and give it a nice color scheme I can replicate throughout the rest of the app that goes inline with the plant theme of the app. Also keep this json structure in mind when buildin out the form. Try to use dropdown selections when possible. 

Here is the json: {
  "plantId": "string",
  "name": "string",
  "species": {
    "commonName": "string",
    "scientificName": "string"
  },
  "imageUrl": "string",
  "care": {
    "light": "low | medium | bright | direct",
    "wateringFrequencyDays": 7,
    "soilType": "standard | well-draining | cactus",
    "fertilizerFrequencyDays": 30
  },
  "location": {
    "room": "string",
    "windowDirection": "north | south | east | west | none"
  },
  "schedule": {
    "lastWatered": "2025-01-01"
  },
  "notes": "string",
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-02T18:30:00Z"
}


8. Can we turn some of these fields into components this code is way too long.

9. In the same style can you design me a home page that show cases all these plants where if you click on the card for a plant it takes you to a page with all the information of the plants (Don't worry about implementing that yet just implement the home page with that in mind). Also remember the data fields from the previous page and also try to use the components I had you create previously

10. Can you create a hash function for the 3 shards structure I am using for my rate limiter built on Durable objects.

11. Help me implement a Durable Object class that implements a rate limiter as seen in the Cloudflare Durable Objects Docs.

12. Based off the previous pages you have made can you make me a background component for me to build off any other pages with the same look. 

13. Can you make me a nice chat component for the chats to be contained in. 

14. Can you make me a cool bonsai tree svg to use as the image for my home button. 