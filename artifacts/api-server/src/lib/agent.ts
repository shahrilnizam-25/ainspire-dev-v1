import { chatComplete } from "./llm.js";
import { runReadinessMcpWorkflow } from "./mcp.js";

export async function runReadinessAgent(input: {
  answers: Array<{
    questionId: string;
    questionText: string;
    dimension: string;
    selectedOption: string;
    selectedText: string;
    score: number;
  }>;
  department: string;
  role: string;
  assessmentVersion?: string;
  language: "EN" | "BM";
  languageInstruction: string;
  personaDefinitions: string;
}) {
  const dimensionLabels: Record<string, string> = {
    cognitiveReadiness: "Cognitive Readiness",
    behavioralAdoption: "Behavioral Adoption",
    skillsCapability: "Skills Capability",
    orgEnvironmentalExposure: "Organisation / Environmental Exposure",
    emotionalDisposition: "Emotional Disposition",
    economicVulnerability: "Economic Vulnerability",
  };
  const mcpContext = await runReadinessMcpWorkflow({
    answers: input.answers.map(({ dimension, score }) => ({ dimension, score })),
    department: input.department,
    role: input.role,
    language: input.language,
  });
  const answerSummary = input.answers
    .map((answer) => `Q${answer.questionId} [${dimensionLabels[answer.dimension] ?? answer.dimension}]: ${answer.selectedOption}. "${answer.selectedText}" (score ${answer.score}/4)`)
    .join("\n");

  const prompt = `You are the supervisor agent for Telekom Malaysia's AI workforce readiness programme. Use the MCP tool results below as grounded enterprise context. Produce an advisory readiness profile and secondary AI persona.${input.languageInstruction}

## Personas
${input.personaDefinitions}

## Employee context
- Department: ${input.department}
- Role: ${input.role}
- Assessment version: ${input.assessmentVersion ?? "unknown"}

## Assessment evidence
${answerSummary}

## MCP tool results
${JSON.stringify(mcpContext, null, 2)}

## Rules
- Treat MCP deterministic scores as authoritative.
- Treat the deterministic persona and persona scores as authoritative; use your persona output only to explain the evidence.
- Use project matches and learning priorities as evidence, not invented facts.
- Use human-readable dimension names; never expose internal keys such as "behavioralAdoption" or "orgEnvironmentalExposure".
- Write readiness and dimension scores as percentages, for example "63%" or "63/100"; never present a bare score without its scale.
- Address the employee directly using "you" and "your"; never refer to them as "this employee".
- Keep recommendation descriptions specific and actionable, and include the selected role and department context.
- Mention the submitted role and department naturally in the narrative when they materially affect the interpretation.
- Recommendations are advisory; do not make employment, promotion, or termination decisions.
- Return ONLY valid JSON with persona, confidence, reasoning, narrative, strengths, developmentGaps, projectFit, resourceAssignmentSignals, and recommendations.
`;

  const raw = await chatComplete(prompt, 2048);
  return { raw, mcpContext };
}