# Verbal Identity — Codified Frameworks

## Governing Principle: Voice Is Constant, Tone Is Variable

From Fenton & Lee (*Nicely Said*): A brand's **voice** is its personality — it never changes. A brand's **tone** shifts based on context (celebration vs. error state vs. onboarding). An agent building verbal identity must define both independently.

---

## West's Three Levels of Brand Voice

From Chris West's *Strong Language*. The most directly codifiable verbal identity framework:

### Level 1: Worldview

The world the brand creates through language. Not what the brand says about itself, but the reality it assumes exists.

**Define:**
- What does the brand believe about the world?
- What future does the brand take for granted?
- What does the brand consider normal vs. remarkable?

**Example contrasts:**
| Worldview | Language implies... |
|-----------|-------------------|
| Optimistic | Problems are solvable, progress is natural |
| Rebellious | The status quo is broken, change is necessary |
| Crafted | Details matter, quality speaks for itself |
| Democratic | Everyone deserves access, simplicity is respect |

**For AI agent:** Worldview = system prompt context. It shapes *what* the brand talks about and *what it assumes* without stating.

### Level 2: Personality

Character traits expressed through language patterns.

**Define 3–5 personality traits, each with a tension pair:**

```
Trait:       Confident
Not:         Arrogant
Expressed:   "Here's how it works" (not "We're the best at...")

Trait:       Warm
Not:         Saccharine
Expressed:   "Welcome back" (not "We MISSED you SO much!! 😍")

Trait:       Clear
Not:         Dumbed-down
Expressed:   "Your payment processed" (not "Yay! Money stuff done!")
```

**For AI agent:** Personality = behavioral constraints. Each trait is a rule with a positive and negative boundary.

### Level 3: Ground-Level Details

The specific, measurable language rules:

| Dimension | Options to Define |
|-----------|-------------------|
| **Vocabulary** | Technical level (jargon allowed?), forbidden words, preferred terms, industry terms to redefine |
| **Sentence length** | Short and punchy? Long and flowing? Mixed? Maximum words? |
| **Grammar** | Contractions? Fragments? Starting sentences with "And"? Oxford comma? |
| **Punctuation** | Exclamation marks (how often)? Ellipses? Em dashes? Semicolons? |
| **Capitalization** | Title Case? Sentence case? ALL CAPS ever? |
| **Emoji** | Never? Sometimes? Which ones? |
| **Pronouns** | "We" vs. brand name? "You" vs. "Users"? First person ever? |
| **Humor** | Never? Subtle? Frequent? What kind? |
| **Numbers** | Spelled out or digits? When to switch? |

**For AI agent:** Ground-level details = output formatting rules. These are directly encodable as generation constraints.

---

## Podmajersky's Voice Chart

From *Strategic Writing for UX*. The most machine-readable verbal identity format:

### Template

| Voice Principle | Vocabulary | Verbosity | Grammar | Punctuation |
|----------------|-----------|-----------|---------|-------------|
| [Principle 1] | [Words/terms to use] | [Short/medium/long] | [Rules] | [Rules] |
| [Principle 2] | [Words/terms to use] | [Short/medium/long] | [Rules] | [Rules] |
| [Principle 3] | [Words/terms to use] | [Short/medium/long] | [Rules] | [Rules] |

### Example: A Confident Tech Brand

| Voice Principle | Vocabulary | Verbosity | Grammar | Punctuation |
|----------------|-----------|-----------|---------|-------------|
| **Direct** | Action verbs, concrete nouns. No hedging ("might," "perhaps," "it seems"). | Short. 5–15 word sentences. No filler. | Imperative mood for instructions. Active voice always. Contractions yes. | Periods. Rare exclamation marks. No ellipses. |
| **Precise** | Technical terms used correctly, never dumbed down. Define on first use. | Medium. Enough to be clear, not a word more. | Complete sentences for explanations. Fragments for UI labels. | Colons to introduce explanations. |
| **Human** | "You" and "your" always. First names when possible. No "users" or "customers." | Varies by context. Warm in onboarding, terse in errors. | Questions are okay in onboarding. Contractions everywhere. | Occasional exclamation for celebration moments only. |

### Voice Chart Encoding (JSON)

For machine-readable output:

```json
{
  "voice": {
    "principles": [
      {
        "name": "Direct",
        "vocabulary": {
          "prefer": ["action verbs", "concrete nouns"],
          "avoid": ["might", "perhaps", "it seems", "in order to", "utilize"],
          "technical_level": "precise — use correct terms, define on first use"
        },
        "verbosity": {
          "default": "short",
          "sentence_length": "5–15 words",
          "rules": ["No filler words", "One idea per sentence"]
        },
        "grammar": {
          "mood": "imperative for instructions, declarative for information",
          "voice": "active always",
          "contractions": true,
          "fragments_allowed": "UI labels and CTAs only"
        },
        "punctuation": {
          "period": "standard",
          "exclamation": "rare — celebration moments only",
          "ellipsis": "never",
          "question_mark": "onboarding and conversational contexts only",
          "semicolon": "never in UI, acceptable in long-form"
        }
      }
    ]
  }
}
```

---

## UX Text Patterns by Component

From Podmajersky's *Strategic Writing for UX*. Rules for every UI text element:

### Titles & Headlines
- State the benefit or topic, not the feature name
- Use sentence case (not Title Case) for approachability
- ≤ 6 words for screen titles
- No periods on titles

### Buttons & CTAs
- Start with a verb (action-first)
- Use specific verbs, not generic ones ("Save recipe" not "Submit")
- ≤ 3 words when possible
- Primary CTA = specific action; Secondary = escape ("Cancel," "Skip," "Not now")

### Descriptions & Body Copy
- Lead with the most important information
- One idea per paragraph
- Use "you" and "your"
- Link text = destination description, never "click here"

### Empty States
- Explain why it's empty (context)
- Show what it will look like with content (preview)
- Provide a clear action to fill it (CTA)
- Keep it encouraging, never blame the user

### Error Messages
- Say what happened (in plain language)
- Say why it happened (if knowable and useful)
- Say what to do next (always)
- Never blame the user ("Your password is wrong" → "That password didn't match")

### Success Messages
- Confirm what completed
- State any next step or consequence
- Keep it brief — don't celebrate trivial actions
- Reserve enthusiastic celebration for meaningful achievements

### Placeholder Text
- Show the expected format ("jane@example.com")
- Never use placeholder as label (accessibility issue)
- Disappears on focus — don't put instructions here

### Tooltips & Help Text
- Answer one question only
- ≤ 2 sentences
- Provide the "why" (not just the "what") when the UI isn't self-explanatory
- Link to full documentation for complex topics

---

## Watkins' SMILE/SCRATCH Framework

From *Hello, My Name Is Awesome*. A scoring rubric for evaluating brand names:

### SMILE: Five Qualities of Great Names

| Quality | Test Question | Score 1–5 |
|---------|---------------|-----------|
| **S**uggestive | Does it evoke something about the brand's experience? | |
| **M**emorable | Is it easy to recall after hearing once? | |
| **I**magery | Does it create a vivid mental picture? | |
| **L**egs | Can it inspire extended creative campaigns and wordplay? | |
| **E**motional | Does it trigger a positive emotional response? | |

### SCRATCH: Seven Deal-Breakers

| Quality | Test Question | Fail? |
|---------|---------------|-------|
| **S**pelling-challenged | Will people misspell it? | |
| **C**opycat | Too similar to existing brands? | |
| **R**estrictive | Too narrow for future growth? | |
| **A**nnoying | Forced, gimmicky, or cringeworthy? | |
| **T**ame | Boring, generic, forgettable? | |
| **C**urse of knowledge | Only insiders understand it? | |
| **H**ard to pronounce | Will people stumble saying it? | |

### Evaluation Rule
- SMILE total ≥ 20/25 = strong candidate
- Any SCRATCH fail = eliminate or rework
- Test with 5+ people outside the project for honest reactions

---

## Brand Naming Pipeline (Meyerson)

From *Brand Naming*. The professional-grade naming process:

### Stages

1. **Creative Brief**
   - Positioning statement
   - Required name attributes (e.g., "must feel premium")
   - Name type preference (descriptive, suggestive, abstract, acronym, founder)
   - Linguistic requirements (works in which languages? URL availability?)

2. **Generation** (aim for 200+ candidates)
   - Real words (repurposed or evocative)
   - Modified words (blended, clipped, respelled)
   - Coined words (completely invented)
   - Phrases and compounds

3. **Screening Rounds**
   - Round 1: Quick gut check (200 → 50)
   - Round 2: SMILE/SCRATCH evaluation (50 → 15)
   - Round 3: Linguistic screening — pronunciation across target languages, negative connotations, cultural issues (15 → 8)
   - Round 4: Preliminary trademark search (8 → 3–5)

4. **Validation**
   - Full trademark search (legal)
   - Domain/social handle availability
   - Consumer testing (surveys, A/B)
   - Visual identity compatibility (does it look good as a wordmark?)

5. **Selection & Launch**

---

## Tone Shifting by Context

Voice stays constant. Tone shifts. Define tone rules for key contexts:

| Context | Tone Shift | Example |
|---------|-----------|---------|
| **Onboarding** | Warmer, more patient, encouraging | "Welcome! Let's get you set up — it takes about 2 minutes." |
| **Error/Failure** | Calmer, solution-focused, no blame | "We couldn't process that. Try again, or contact support." |
| **Success/Celebration** | Brief enthusiasm, then move on | "Done! Your changes are live." |
| **Transactional** | Neutral, precise, no personality filler | "Payment of $49.00 processed on March 15, 2026." |
| **Marketing** | More expressive, benefit-focused | "The fastest way to turn ideas into reality." |
| **Legal/Compliance** | Formal, precise, no ambiguity | "By continuing, you agree to our Terms of Service." |
| **Support/Help** | Empathetic, patient, step-by-step | "No worries — here's how to fix this." |
| **Empty States** | Encouraging, forward-looking | "Nothing here yet. Create your first project to get started." |

### Tone Encoding (JSON)

```json
{
  "tone": {
    "contexts": {
      "onboarding": {
        "warmth": "high",
        "formality": "low",
        "enthusiasm": "moderate",
        "verbosity": "medium",
        "humor": "light"
      },
      "error": {
        "warmth": "moderate",
        "formality": "medium",
        "enthusiasm": "none",
        "verbosity": "short",
        "humor": "never"
      },
      "celebration": {
        "warmth": "high",
        "formality": "low",
        "enthusiasm": "high",
        "verbosity": "short",
        "humor": "allowed"
      },
      "transactional": {
        "warmth": "low",
        "formality": "high",
        "enthusiasm": "none",
        "verbosity": "minimal",
        "humor": "never"
      }
    }
  }
}
```

---

## Content Governance Rules

### Word Lists

Every brand should maintain:
- **Preferred terms** — The words this brand uses (e.g., "workspace" not "project")
- **Forbidden terms** — Words that conflict with brand personality
- **Redefined terms** — Industry jargon the brand uses differently
- **Inclusive language** — Terms to use and avoid for inclusivity

### Writing Checklist (Handley)
- [ ] Does this sound like our brand? (Voice check)
- [ ] Is the tone appropriate for this context? (Tone check)
- [ ] Is every sentence necessary? (Brevity check)
- [ ] Is the most important info first? (Priority check)
- [ ] Would a 12-year-old understand this? (Clarity check)
- [ ] Does it tell the reader what to do next? (Action check)
