import { Router } from "express";
import { chatComplete } from "../lib/llm.js";

const router = Router();

type AnswerItem = {
  questionId: number;
  questionText: string;
  selectedOption?: string;
  selectedText?: string;
  personaId?: string;
  freeText?: string;
};

const PERSONA_DEFS: Record<string, string> = {
  explorer:
    "curious and experimental — loves discovering AI tools, early adopter mindset, enthusiastic but without deep technical depth",
  builder:
    "technically hands-on — implements and integrates AI solutions, builds AI-powered systems, high technical depth",
  strategist:
    "business-aligned — leads AI projects, drives measurable ROI, bridges technical teams and executive stakeholders",
  visionary:
    "transformational — shapes long-term AI direction, inspires others, influences policy and thought leadership at an industry level",
};

const LANG_LABELS: Record<string, string> = {
  EN: "English",
  BM: "Bahasa Melayu (Malay)",
  CN: "Simplified Chinese (简体中文)",
};

router.post("/classify", async (req, res) => {
  const { answers, lang } = req.body as { answers: AnswerItem[]; lang?: string };

  req.log.info(
    {
      event: "classify_started",
      answersCount: Array.isArray(answers) ? answers.length : 0,
      lang: lang ?? "EN",
    },
    "Starting persona classification",
  );

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "answers array is required" });
  }

  const mcq = answers.filter((a) => a.selectedOption !== undefined);
  const roleAnswer = answers.find(
    (a) => a.freeText !== undefined && a.questionId === 6,
  );
  const openAnswer = answers.find(
    (a) => a.freeText !== undefined && a.questionId !== 6,
  );

  const mcqSummary = mcq
    .map(
      (a) =>
        `Q${a.questionId}: "${a.questionText}"\nSelected: ${a.selectedOption}. "${a.selectedText}" → maps to persona [${a.personaId}]`,
    )
    .join("\n\n");

  const roleSection = roleAnswer
    ? `\n\nEmployee's current role at Telekom Malaysia: "${roleAnswer.freeText}"`
    : "";

  const openSection = openAnswer
    ? `\n\nOpen-ended response:\nQ${openAnswer.questionId}: "${openAnswer.questionText}"\nEmployee wrote: "${openAnswer.freeText}"`
    : "";

  const outputLang = LANG_LABELS[lang ?? "EN"] ?? LANG_LABELS["EN"];
  const langInstruction =
    lang && lang !== "EN"
      ? `\n\n## Language Requirement\nYou MUST write ALL text in the JSON output — every word in "reasoning", "narrative", all recommendation "title" and "description" fields — entirely in ${outputLang}. Do not mix in any English phrases.`
      : "";

  const prompt = `You are an expert AI talent classifier for Telekom Malaysia's workforce development programme. Analyse this employee's self-assessment holistically and classify them into the most fitting AI persona.${langInstruction}

## The Four AI Personas
${Object.entries(PERSONA_DEFS)
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join("\n")}

## Employee Context${roleSection}

## Assessment Responses
${mcqSummary}${openSection}

## Instructions
1. Analyse the employee's role context, multiple-choice answers, AND the open-ended response together as a whole picture
2. Factor in the employee's current role — it provides important context about their position and likely AI exposure
3. Pay special attention to the open-ended response — it often reveals the employee's true orientation more than MCQ choices
4. Mixed signals are common and expected; resolve them with your best professional judgement
5. Assign the ONE persona that best fits the complete picture, not just the plurality vote
6. Be specific in your reasoning — cite actual phrases or patterns from their answers and role context

Respond ONLY with a valid JSON object. No markdown, no text outside the JSON braces:
{
  "persona": "explorer|builder|strategist|visionary",
  "confidence": 0.75,
  "reasoning": "2-3 sentences citing specific evidence from their responses explaining your classification decision",
  "narrative": "2-3 sentences addressed directly to the employee (use 'you' and 'your') celebrating their unique AI identity and what makes their profile distinctive at Telekom Malaysia",
  "recommendations": [
    { "title": "Specific course or action name", "description": "One sentence on why this fits their specific profile" },
    { "title": "Specific course or action name", "description": "One sentence on why this fits their specific profile" },
    { "title": "Specific course or action name", "description": "One sentence on why this fits their specific profile" }
  ]
}`;

  try {
    const raw = await chatComplete(prompt, 1024);

    // Strip any accidental markdown code fences
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    // Validate and sanitise
    const valid = ["explorer", "builder", "strategist", "visionary"];
    if (!valid.includes(result.persona)) result.persona = "explorer";
    if (typeof result.confidence !== "number") result.confidence = 0.7;
    if (!Array.isArray(result.recommendations)) result.recommendations = [];

    req.log.info(
      {
        event: "classify_success",
        persona: result.persona,
        confidence: result.confidence,
      },
      "Persona classification completed",
    );

    return res.json(result);
  } catch (err) {
    req.log.error({ event: "classify_failed", err }, "Persona classification failed");
    return res
      .status(500)
      .json({ error: "AI classification failed", details: String(err) });
  }
});

export default router;
