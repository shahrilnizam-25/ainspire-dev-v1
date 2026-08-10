const LLM_BASE_URL = process.env.TM_LLM_BASE_URL ?? "https://v-qcwq7ngstdnjr69dtn7g-4000.tma01.gpuproxy.tm.com.my/v1";
const LLM_API_KEY = process.env.TM_LLM_API_KEY ?? "sk-DLZKh-WBCuXKLTxkSgtF6A";
const LLM_MODEL = process.env.TM_LLM_MODEL ?? "gpt-oss-20b";

export async function chatComplete(prompt: string, maxTokens = 1024): Promise<string> {
  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? "{}";
}
