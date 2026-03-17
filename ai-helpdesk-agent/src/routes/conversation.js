import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.post("/conversation", async (req, res) => {

  const conversation = await prisma.conversation.create({
    data: {}
  });

  res.json(conversation);

});

export default router;