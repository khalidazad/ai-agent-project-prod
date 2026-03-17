import prisma from "../db/prisma.js";
import getRetriever from "./retriever.js";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});

async function askHelpdesk(conversationId, question) {

  // get previous messages
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" }
  });

  // build conversation history text
  const history = messages
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  // retrieve knowledge base context
  const retriever = await getRetriever();
  const docs = await retriever.invoke(question);

  const context = docs.map(d => d.pageContent).join("\n");

  const prompt = `
You are an AI helpdesk assistant.

Conversation history:
${history}

Knowledge base context:
${context}

User question:
${question}

Answer clearly:
`;

  const response = await llm.invoke(prompt);

  const answer = response.content;

  // save user message
  await prisma.message.create({
    data: {
      conversationId,
      role: "user",
      content: question
    }
  });

  // save AI response
  await prisma.message.create({
    data: {
      conversationId,
      role: "assistant",
      content: answer
    }
  });

  return answer;
}

export default askHelpdesk;