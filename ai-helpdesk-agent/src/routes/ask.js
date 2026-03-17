import express from "express";
import askHelpdesk from "../rag/ragAgent.js";

const router = express.Router();

router.post("/chat", async (req, res) => {

  try {

    const { conversationId, question } = req.body;

    const answer = await askHelpdesk(conversationId, question);

    res.json({
      answer
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI failed"
    });

  }

});

export default router;