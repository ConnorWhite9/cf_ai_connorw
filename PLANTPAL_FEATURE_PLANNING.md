## Advanced Plantpal Feature Planning

This document captures forward-looking ideas for advanced features built around plants, LLMs/agents, and computer vision. It is a planning/ideation document, not a statement of completed work.

---

## 1. Plant "Lab" Simulation & What-If Analysis (Idea 3)

**Goal**  
Let users ask "what if" questions about plant care (light, watering, temperature, fertilizer) and get simulated outcomes with clear explanations.

**User experience**
- User selects a plant (or creates a profile) with:
  - Species or plant type (e.g., pothos, monstera, cactus, fern).
  - Size/age estimate, pot size, medium.
  - Location metadata (window, distance, orientation).
- User specifies an environment and care regime:
  - Light level band (low/medium/high or approximate PPFD/lux).
  - Temperature, humidity.
  - Watering frequency/volume and fertilizer schedule.
- User asks a what-if:
  - "What happens if I increase light from medium to high?"
  - "What if I skip watering for 10 days while I'm away?"
  - "What if I move this plant to the balcony and fertilize weekly?"
- System returns:
  - Predicted growth (slower/faster, leggier/compact).
  - Stress and risk scores (root rot, leaf burn, nutrient issues).
  - Natural-language explanation and recommended adjustments.

**Core technical idea**
- Implement a small, deterministic "plant model" that maps:
  - Plant traits + environment + care regime
  - → growth factor, stress score, and specific risk flags.
- Use an LLM:
  - To turn numeric/rule-based outputs into explanations.
  - To chain reasoning across multiple changes (scenario A vs scenario B).

**Initial implementation sketch**
- Represent a plant profile as a structured object (e.g., JSON) with:
  - Basic species/type category (e.g., "tropical aroid", "desert succulent", "fern").
  - Tolerance bands for light, watering, temperature.
- Define a simple rule-based or scoring engine:
  - Compute light suitability: too low / low / optimal / high / too high.
  - Compute watering suitability: too dry / ideal / too wet, considering potting medium and temperature.
  - Combine these into:
    - Growth factor (e.g., 0.0–1.5).
    - Stress score (e.g., 0–100).
    - Risk flags (root rot, leaf burn, deficiency, pest susceptibility).
- For each what-if scenario:
  - Run the engine for current conditions vs proposed changes.
  - Produce a delta view ("growth +30%, rot risk +20%", etc.).
  - Pass results to an LLM prompt that:
    - Explains likely outcomes in plain language.
    - Suggests safer or more balanced alternatives.

**Future directions**
- Parameterize the model by plant group with more nuance.
- Incorporate user feedback and outcomes as weak supervision (e.g., "I followed this and plant still deteriorated").
- Later, blend in time-series data from sensors or repeated user check-ins.

---

## 2. High-Granularity Plant Health CV Model (Idea 9)

**Goal**  
Analyze plant photos to detect not just that a plant is "unhealthy," but likely underlying causes and severity (e.g., overwatering vs underwatering, nutrient deficiency type, pest type, fungal/bacterial issues).

**User experience**
- User uploads one or more images:
  - Full plant shot and optional close-ups of leaves, stems, soil.
- Optional text/context:
  - Recent changes in care (watering, fertilizer, light or move).
  - Environment (indoor/outdoor, approximate light level).
  - Plant type/species if the user knows it.
- System responds with:
  - Ranked hypotheses with approximate confidences.
  - Evidence-based reasoning ("Lower, older leaves are yellow with green veins → likely nitrogen deficiency").
  - Suggestions for follow-up questions or checks.
  - Recommended next actions or experiments.

**Core technical idea**
- Use computer vision for:
  - Detecting and focusing on relevant regions (leaves, stems, soil surface).
  - Extracting visual features that capture color/texture/patterns.
- Use retrieval + LLM reasoning:
  - Maintain a "casebase" of reference images annotated with issues and treatments.
  - Given a new image, retrieve visually similar cases.
  - Use an LLM to:
    - See the top-k matches + their labels/treatments.
    - Produce a ranked list of likely diagnoses with reasoning and caveats.

**Initial implementation sketch**
- Start from an off-the-shelf vision backbone:
  - CLIP-style model or a general multimodal model.
- Pipeline:
  - Step 1: Basic classification (healthy vs unhealthy).
  - Step 2: If unhealthy, retrieve similar cases from the casebase.
  - Step 3: Let the LLM:
    - Combine retrieval results with any user-provided context.
    - Output:
      - Top candidates (e.g., "overwatering", "spider mites", "sunburn").
      - Confidence bands (high/medium/low).
      - Follow-up questions (e.g., "Is the soil staying wet for many days?").
- Feedback loop:
  - Allow users (or experts) to override / correct diagnoses.
  - Store corrected outcomes as labeled examples for incremental improvement.

**Future directions**
- Finer-grained categorization for:
  - Specific pests.
  - Specific nutrient deficiencies.
  - Fungal vs bacterial spot patterns.
- Visual overlays:
  - Highlight suspected problem areas in the image.
  - Provide before/after comparisons as plants recover.

---

## 3. Visual Layout Optimizer for Rooms/Gardens (Idea 12)

**Goal**  
Given photos of a room or garden plus a set of plants, recommend optimal plant placements that respect light, space, aesthetics, and constraints (pets, kids, style preferences).

**User experience**
- User provides:
  - One or more photos of a room or garden (ideally from multiple angles).
  - Basic metadata:
    - Room orientation (N/E/S/W), rough dimensions, window positions.
    - Preferences/constraints (no floor plants, pet-safe only, minimal vs jungle look).
  - A list of current plants and/or plants they want to add.
- System does:
  - Detects:
    - Windows, doors, major furniture, shelves, floor areas.
    - Existing plants and their apparent positions.
  - Estimates:
    - Light gradient (rough mapping of brighter vs dimmer zones).
    - Potential candidate spots for plants (shelves, corners, tables).
  - Optimizes:
    - Assigns plants to candidate spots to best match their light/space needs and user constraints.
- Output:
  - Annotated image(s) showing suggested placements.
  - Textual summary explaining:
    - Why each plant is recommended for a specific spot.
    - Alternative layout options (e.g., "compact aesthetic", "max-jungle aesthetic").

**Core technical idea**
- Computer vision for scene understanding:
  - Object detection for windows, furniture, existing plants.
  - Optional depth/geometry approximation from single images or multi-view.
- Optimization layer:
  - Each plant gets:
    - Light requirement band, size/shape, toxicity/pet-safety, humidity preference.
  - Each candidate location gets:
    - Estimated light band, available space, stability (floor/shelf), proximity to hazards.
  - Solve an assignment/optimization problem:
    - Maximize overall suitability under constraints (e.g., no toxic plants on low shelves in a pet home).
- LLM provides:
  - Accessible explanations of the optimization result.
  - Styling tips to adjust the layout without breaking plant needs.

**Future directions**
- Seasonal simulation:
  - Allow user to specify season/location.
  - Show how light patterns change over the year and how that affects placements.
- Interactive UI:
  - Let users drag/drop plant icons over the room photo and get real-time feedback on predicted plant well-being.

---

## 4. Combined System Vision

**High-level concept**  
Unify the three features into an AI-powered plant companion that:
- Sees: via computer vision, it inspects plant health and room layouts.
- Thinks: via LLMs and rule-based models, it diagnoses issues and simulates care scenarios.
- Plans: via optimization, it proposes placements and care strategies.

**Shared plant data model**
- Each plant is represented as a single entity with:
  - ID, name, species/type.
  - Location reference (room/spot).
  - Care history (watering, fertilizer, repots, moves).
  - Health history (CV findings, user-reported symptoms, resolved diagnoses).
  - Images and notes.
- Rooms/spaces:
  - ID, type (room, balcony, garden bed).
  - Orientation, windows, typical light conditions.
  - Candidate plant spots (shelves, stands, floor areas).

**Cross-feature interactions**
- From CV diagnosis → simulation:
  - If the CV model flags likely overwatering / low light:
    - Pass current conditions into the simulator.
    - Let user explore alternative care regimes and see predicted outcomes.
- From layout optimizer → simulation:
  - When suggesting a new location, compute the new environment parameters (e.g., higher light).
  - Use the simulator to forecast how the plant might respond over time.
- From simulation → layout suggestions:
  - If the simulator suggests that a plant needs more light or cooler temps:
    - Ask the layout optimizer to propose specific new spots.

**Roadmap thoughts (incremental build)**
- Phase 1: Plant "lab" simulation & what-if engine with a basic UI and simple plant categories.
- Phase 2: CV-based health triage (healthy/unhealthy + broad issue categories) feeding into the simulator.
- Phase 3: Room/garden layout optimizer with simple light estimation and placement suggestions.
- Phase 4: Tight integration of all three, improved models, and feedback loops from real-world outcomes.

---

## 5. Notes on Scope and Positioning

- This document is intentionally ambitious and forward-looking.
- It is suitable as:
  - A roadmap for future development.
  - Supporting material for internship / job discussions, showing depth of thinking.
- It is **not** a claim that the features are already implemented in production.

