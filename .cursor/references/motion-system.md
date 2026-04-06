# Motion System — Codified Frameworks

## Governing Principle: Motion Is Brand Personality in Time

From Mitch Paone (DIA Studio): Motion is not decoration applied after visual design — it IS the brand expressed through time. A brand that moves with crisp, precise easing feels fundamentally different from one that moves with bouncy, playful springs. Motion choices are brand choices.

---

## Disney's 12 Principles (Adapted for Brand Interfaces)

The universal vocabulary. Every subsequent framework builds on these.

| Principle | Original (Animation) | Brand Interface Application |
|-----------|---------------------|---------------------------|
| **Squash & Stretch** | Volume deformation showing weight | Elastic feedback on interactive elements (buttons, toggles) — more stretch = more playful brand |
| **Anticipation** | Preparatory action before main action | Pull-back before launch, wind-up before transition — builds expectation |
| **Staging** | Directing attention to what matters | One focal animation at a time. Background dims/blurs during modal entry. |
| **Straight-Ahead vs. Pose-to-Pose** | Two approaches to keyframing | Generative/organic motion vs. precise state-to-state transitions |
| **Follow-Through & Overlapping** | Parts move at different rates | Staggered child elements. Menu items animate sequentially, not simultaneously. |
| **Slow-In, Slow-Out** | Acceleration and deceleration | Easing curves. No linear motion in brand interfaces (except progress bars). |
| **Arcs** | Natural curved motion paths | Elements follow curved paths between positions, not straight lines |
| **Secondary Action** | Supporting action reinforcing main | Icon morphs as page transitions. Color shifts as state changes. |
| **Timing** | Speed conveys weight and character | Fast = light, responsive, precise. Slow = heavy, deliberate, premium. |
| **Exaggeration** | Amplification for clarity | Overshoot on toggle, bounce on success. More exaggeration = more playful brand. |
| **Solid Drawing** | Dimensional consistency | 3D-aware transforms. Perspective consistency during card flips. |
| **Appeal** | Charisma and character | The sum of all motion choices creating a distinctive personality |

---

## IBM Carbon's Productive vs. Expressive Binary

The most elegant brand motion framework. Every motion in a brand system falls into one of two modes:

### Productive Motion
- **Purpose:** Efficient task completion, information navigation
- **Character:** Swift, minimal, functional
- **Easing:** Ease-out (fast start, gentle stop)
- **Duration:** Short (100–200ms)
- **When:** Daily-use interactions, data-heavy screens, repeated actions

### Expressive Motion
- **Purpose:** Emotional engagement, celebration, onboarding
- **Character:** Enthusiastic, attention-grabbing, characterful
- **Easing:** Spring or overshoot curves
- **Duration:** Medium-long (300–600ms)
- **When:** First experiences, achievements, empty-to-populated transitions, marketing

### Brand Personality Mapping

Where a brand sits on the Productive ↔ Expressive spectrum defines its motion character:

```
PRODUCTIVE ◄────────────────────────────────► EXPRESSIVE
  IBM         Stripe      Apple      Slack       Duolingo
  (efficient) (precise)   (fluid)    (playful)   (bouncy)
```

**Decision rule:** Map to brand personality traits.
- Confident, professional, trustworthy → lean Productive
- Playful, creative, youthful → lean Expressive
- Premium, crafted, considered → balanced center (Apple-like fluidity)

---

## Willenskomer's 12 Principles of UX in Motion

Purpose-built for interactive interfaces. Organized under four usability pillars:

### Expectation Pillar
*"Motion tells the user what to expect"*

| Principle | Definition | Brand Impact |
|-----------|-----------|-------------|
| **Easing** | Acceleration behavior of moving objects | THE primary brand motion differentiator. Custom curves = unique feel. |
| **Offset & Delay** | Staggered timing of related elements | More delay = more dramatic/premium. Less delay = more efficient. |
| **Parenting** | Child elements follow parent's motion | Establishes visual hierarchy. Children can add personality via secondary motion. |

### Continuity Pillar
*"Motion maintains coherence across states"*

| Principle | Definition | Brand Impact |
|-----------|-----------|-------------|
| **Transformation** | Element morphs from one state to another | Feels sophisticated and intentional. No element should appear/disappear without transition. |
| **Value Change** | Numeric/text values animate between states | Counting up feels rewarding (gamification). Instant switch feels efficient. |
| **Masking** | Content revealed/hidden through shape boundaries | Circular reveal = playful. Rectangular wipe = editorial/clean. |

### Narrative Pillar
*"Motion tells a story"*

| Principle | Definition | Brand Impact |
|-----------|-----------|-------------|
| **Overlay** | Layered content relationships | Depth model reflects brand hierarchy: flat = democratic, layered = structured. |
| **Cloning** | Element spawns duplicate | Creates feeling of generation/creation. Good for "add" actions. |
| **Obscuration** | Content behind blur/overlay | Premium, depth-aware. Apple's vibrancy. Communicates focus. |

### Relationship Pillar
*"Motion shows how elements relate"*

| Principle | Definition | Brand Impact |
|-----------|-----------|-------------|
| **Parallax** | Depth through differential scroll speeds | Immersive, editorial. Use for storytelling contexts, not utility. |
| **Dimensionality** | 3D spatial relationships | Modern, technical feel. Card flips, spatial navigation. |
| **Dolly & Zoom** | Camera-like movement through space | Dramatic. Good for onboarding reveals. Overuse feels disorienting. |

---

## Val Head's Three-Tier Motion System

From *Designing Interface Animation* + *Animation in Design Systems*. How to structure motion guidelines:

### Tier 1: Motion Principles (3–5 statements)

High-level principles derived from brand personality. Examples:

| Brand Type | Motion Principles |
|-----------|------------------|
| **Premium/Minimal** | 1. Every motion earns its place. 2. Transitions feel inevitable. 3. Speed communicates confidence. |
| **Playful/Energetic** | 1. Motion adds joy to routine tasks. 2. Elements feel alive and responsive. 3. Surprise is a feature. |
| **Professional/Trustworthy** | 1. Motion clarifies, never distracts. 2. Consistency builds trust. 3. Efficiency respects time. |

### Tier 2: Building Blocks (Tokens)

Specific, reusable values:

#### Duration Scale
```json
{
  "motion": {
    "duration": {
      "instant":    { "$value": "0ms",   "description": "State changes with no visible transition" },
      "micro":      { "$value": "75ms",  "description": "Hover/focus feedback" },
      "fast":       { "$value": "150ms", "description": "Button presses, toggles, small UI changes" },
      "normal":     { "$value": "250ms", "description": "Panel transitions, card interactions" },
      "slow":       { "$value": "400ms", "description": "Page transitions, major layout changes" },
      "deliberate": { "$value": "600ms", "description": "Onboarding reveals, celebration moments" },
      "dramatic":   { "$value": "1000ms","description": "Kinetic logo, hero animations — rare" }
    }
  }
}
```

**Duration Rule of Thumb:**
- Small elements (< 100px travel) → fast (100–200ms)
- Medium elements (100–500px travel) → normal (200–400ms)
- Large elements (> 500px travel) → slow (400–700ms)
- Full-screen transitions → slow to deliberate (400–800ms)

#### Easing Curves
```json
{
  "motion": {
    "easing": {
      "productive": {
        "enter":  { "$value": "cubic-bezier(0, 0, 0.2, 1)",   "description": "Ease-out: elements appearing" },
        "exit":   { "$value": "cubic-bezier(0.4, 0, 1, 1)",   "description": "Ease-in: elements disappearing" },
        "move":   { "$value": "cubic-bezier(0.4, 0, 0.2, 1)", "description": "Ease-in-out: elements repositioning" }
      },
      "expressive": {
        "enter":  { "$value": "cubic-bezier(0, 0, 0.2, 1.4)",  "description": "Overshoot: playful entry" },
        "bounce": { "$value": "cubic-bezier(0.34, 1.56, 0.64, 1)", "description": "Bounce: celebration, achievement" },
        "spring": { "$value": "spring(1, 80, 10)",              "description": "Physical spring: interactive elements" }
      }
    }
  }
}
```

#### Animation Properties by Category
```json
{
  "motion": {
    "properties": {
      "opacity":   { "duration": "{motion.duration.fast}",   "easing": "{motion.easing.productive.enter}" },
      "transform":  { "duration": "{motion.duration.normal}",  "easing": "{motion.easing.productive.move}" },
      "color":      { "duration": "{motion.duration.fast}",    "easing": "{motion.easing.productive.move}" },
      "layout":     { "duration": "{motion.duration.slow}",    "easing": "{motion.easing.productive.move}" },
      "celebration":{ "duration": "{motion.duration.deliberate}","easing": "{motion.easing.expressive.bounce}" }
    }
  }
}
```

### Tier 3: Pattern Library (Recipes)

Named transition patterns composed from building blocks:

| Pattern | Trigger | Properties | Duration | Easing | Stagger |
|---------|---------|-----------|----------|--------|---------|
| **Page enter** | Route change | opacity + translateY(16px→0) | slow | ease-out | — |
| **Page exit** | Route change | opacity(1→0) | fast | ease-in | — |
| **Modal enter** | User action | opacity + scale(0.95→1) | normal | ease-out | — |
| **Modal exit** | Dismiss | opacity(1→0) + scale(1→0.95) | fast | ease-in | — |
| **List item enter** | Data load | opacity + translateY(8px→0) | fast | ease-out | 50ms per item |
| **Card hover** | Mouse enter | translateY(0→-2px) + shadow | micro | ease-out | — |
| **Button press** | Mouse down | scale(1→0.97) | micro | ease-in | — |
| **Success** | Completion | scale(0→1) + opacity | deliberate | bounce | — |
| **Error shake** | Validation fail | translateX(0→-4→4→-4→0) | normal | ease-in-out | — |
| **Skeleton pulse** | Loading | opacity(0.5→1→0.5) | 2000ms loop | ease-in-out | 100ms per row |

---

## Motion Personality Mapping

Connect brand personality traits to motion characteristics:

| Personality Trait | Duration | Easing | Amplitude | Frequency |
|-------------------|----------|--------|-----------|-----------|
| **Confident** | Fast–normal | Crisp ease-out, no overshoot | Small, precise | Minimal — only when needed |
| **Playful** | Normal–slow | Spring/bounce, overshoot | Large, exaggerated | Frequent — many micro-interactions |
| **Premium** | Slow–deliberate | Smooth ease-in-out, no bounce | Subtle, refined | Moderate — key moments only |
| **Energetic** | Fast | Quick ease-out, slight bounce | Medium | Frequent — snappy responses |
| **Calm** | Slow | Gentle ease-in-out | Minimal | Rare — slow fades only |
| **Rebellious** | Varied | Irregular, asymmetric | Bold, unpredictable | Selective — for impact |

---

## Kinetic Identity (DIA Framework)

From Mitch Paone's work at DIA Studio. Motion AS the brand, not motion ON the brand.

### Core Concept
A kinetic identity is a set of motion rules that generate infinite branded variations — not a fixed animation. The rules define:

1. **Motion DNA** — The fundamental movement pattern (how does the brand move?)
2. **Tempo** — Speed and rhythm (fast/slow, regular/irregular)
3. **Geometry** — Shape language in motion (curves, angles, organic, geometric)
4. **Behavior** — How elements interact (attract, repel, follow, avoid)
5. **Response** — How motion reacts to input (cursor, scroll, sound, data)

### Parametric Motion System
Instead of designing individual animations, define parameters:
```
Brand Motion Parameters:
  base_tempo:       120bpm (energetic) | 60bpm (calm)
  primary_motion:   rotate | translate | scale | morph
  path_type:        curved | linear | orbital | random
  interaction:      elements attract | repel | mirror | ignore
  response_speed:   immediate | delayed | gradual
  complexity:       simple (1-2 elements) | complex (many elements)
```

These parameters generate unique but consistently branded motion across every touchpoint.

---

## Reduced Motion / Accessibility

### Requirements
- Honor `prefers-reduced-motion: reduce` at OS level
- Provide reduced-motion alternatives for every animation
- Never use motion as the *only* way to convey information
- Avoid: rapid flashing, excessive parallax, auto-playing animations

### Reduced Motion Strategy
```css
@media (prefers-reduced-motion: reduce) {
  /* Replace transforms with opacity-only transitions */
  /* Reduce durations to instant/micro */
  /* Disable looping animations */
  /* Keep essential state-change indicators */
}
```

### DTCG Token Override
```json
{
  "motion": {
    "duration": {
      "normal": {
        "$value": "250ms",
        "$extensions": {
          "mode": {
            "reduced": "0ms"
          }
        }
      }
    }
  }
}
```
