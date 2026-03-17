import { OpenAIEmbeddings } from "@langchain/openai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export function getEmbeddings() {

  const provider = process.env.EMBEDDING_PROVIDER;

  if (provider === "openai") {
    return new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small"
    });
  }

  if (provider === "huggingface") {
    return new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2"
    });
  }

  throw new Error("Unknown embedding provider");
}