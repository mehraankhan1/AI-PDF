import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// const pdfUrl =
//   "https://judicious-oyster-888.convex.cloud/api/storage/329f3ecd-039c-4bf3-a388-4187b30be691";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get("pdfUrl");
  console.log(pdfUrl);

  //load pdf file
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach((doc) => {
    pdfTextContent = pdfTextContent + doc.pageContent;
  });

  //split the text into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const output = await splitter.createDocuments([pdfTextContent]);

  let splitterList = [];
  output.forEach((doc) => {
    splitterList.push(doc.pageContent);
  });
  return NextResponse.json({ result: splitterList });
}
