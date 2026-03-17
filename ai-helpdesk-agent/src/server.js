import express from "express";
import cors from "cors";

import chatRoute from "./routes/ask.js";
import conversationRoute from "./routes/conversation.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoute);
app.use("/api", conversationRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});