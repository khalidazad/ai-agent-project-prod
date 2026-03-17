import dotenv from "dotenv";
dotenv.config();

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import { getEmbeddings } from "./embeddings.js";

async function getRetriever() {

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  const embeddings = getEmbeddings();

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex: index }
  );

  const retriever = vectorStore.asRetriever({
    k: 4
  });

  return retriever;
}

export default getRetriever;