import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const docsPath = "./docs";

async function ingest() {
  const files = fs.readdirSync(docsPath);

  const docs = files.map((file) => {
    const content = fs.readFileSync(path.join(docsPath, file), "utf8");

    return new Document({
      pageContent: content,
      metadata: { source: file },
    });
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small",
  });

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
  });

  console.log("Documents embedded successfully");
}

ingest();