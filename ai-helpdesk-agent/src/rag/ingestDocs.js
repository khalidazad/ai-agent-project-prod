import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { getEmbeddings } from "./embeddings.js";

const DOCS_PATH = "./docs";

async function loadDocuments() {

  const files = fs.readdirSync(DOCS_PATH);
  let documents = [];

  for (const file of files) {

    const filePath = path.join(DOCS_PATH, file);

    if (file.endsWith(".txt")) {

      const text = fs.readFileSync(filePath, "utf8");

      documents.push(
        new Document({
          pageContent: text,
          metadata: { source: file }
        })
      );
    }

    if (file.endsWith(".pdf")) {

      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);

      documents.push(
        new Document({
          pageContent: pdfData.text,
          metadata: { source: file }
        })
      );
    }
  }

  return documents;
}


async function ingest() {

  try {

    console.log("Loading documents...");

    const rawDocs = await loadDocuments();

    console.log("Documents loaded:", rawDocs.length);


    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100
    });

    const docs = await splitter.splitDocuments(rawDocs);

    console.log("Chunks created:", docs.length);


    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);


    const embeddings = getEmbeddings();

    await PineconeStore.fromDocuments(
      docs,
      embeddings,
      { pineconeIndex: index }
    );

    console.log("Documents embedded successfully");

  } catch (error) {

    console.error("Error ingesting documents:", error);

  }
}

ingest();