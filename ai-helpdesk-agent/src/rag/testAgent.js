import askHelpdesk from "./ragAgent.js";

async function test() {

  const response = await askHelpdesk(
    "How can customers request a refund?"
  );

  console.log("\nAI Response:\n");
  console.log(response);
}

test();