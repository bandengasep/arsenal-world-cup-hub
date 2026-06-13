// Model access — every model goes through TokenRouter (OpenAI-compatible gateway).
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const tokenrouter = createOpenAICompatible({
  name: "tokenrouter",
  apiKey: process.env.TOKENROUTER_API_KEY ?? "",
  baseURL: process.env.TOKENROUTER_BASE_URL ?? "https://api.tokenrouter.com/v1",
});

export const MODELS = {
  agent: "moonshotai/kimi-k2.6", // orchestration + tool-calling
  code: "moonshotai/kimi-k2.7-code", // Oracle Python codegen
  fallback: "anthropic/claude-opus-4.8-fast", // invisible demo-safety
} as const;
