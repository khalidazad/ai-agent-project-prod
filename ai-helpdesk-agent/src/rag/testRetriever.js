import getRetriever from "./retriever.js";

async function test() {

  const retriever = await getRetriever();

  const docs = await retriever.invoke(
    "How can customers request a refund?"
  );

  console.log(docs);
}

test();