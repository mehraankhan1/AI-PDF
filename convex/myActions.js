import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { action } from "./_generated/server.js";
import { TaskType } from "@google/generative-ai";
import { api } from "./_generated/api.js";
import { v } from "convex/values";
export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText, //ARRAY
      { fileId: args.fileId }, //string
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyDachzwHGa4BtLmNGrwxIlxhVgAa_l8QsE",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    return "completed..";
  },
});
export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyDachzwHGa4BtLmNGrwxIlxhVgAa_l8QsE",
        model: "text-embedding-004",
      }),
      { ctx }
    );

    console.log("Query:", args.query);
    console.log("File ID:", args.fileId);

    // Fetch multiple results to inspect them
    const resultOne = await vectorStore.similaritySearch(args.query, 2);
    console.log("Raw search results:", resultOne);

    // Inspect the metadata of the results
    resultOne.forEach((q, index) => {
      console.log(`Metadata for result ${index + 1}:`, q.metadata);
    });

    // Filter based on fileId
    const filteredResults = resultOne.filter((q) => {
      const reconstructedFileId = Object.values(q.metadata || {}).join("");
      return reconstructedFileId === args.fileId;
    });

    // console.log("Filtered results:", filteredResults);

    // Format results
    const formattedResults = filteredResults.map((doc) => {
      const reconstructedFileId = Object.values(doc.metadata || {}).join("");
      return {
        ...doc,
        metadata: { fileId: reconstructedFileId },
      };
    });

    console.log("Formatted results:", formattedResults);

    return JSON.stringify(formattedResults);
  },
});

// const resultOne = (
//   await vectorStore.similaritySearch(args.query, 1)
// ).filter((q) => q.metadata.fileId == args.fileId); // Matches fileId inside metadata

// console.log(resultOne);

// return JSON.stringify(resultOne);
