"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { AddFileEntryToDb } from "@/convex/fileStorage";
import { ingest } from "@/convex/myActions";

function UploadPdf({ children, isMaxFile }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const { user } = useUser();
  const [file, setFile] = useState();
  const embeddDocument = useAction(api.myActions.ingest);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();
  const [open, setOpen] = useState(false);
  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const OnUpload = async () => {
    setLoading(true);
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    console.log("StorageId", storageId);
    const fileId = uuid4();

    // Step 3: Save the newly allocated storage id to the database
    // await sendImage({ storageId, author: name });
    const fileUrl = await getFileUrl({ storageId: storageId });
    const resp = await addFileEntry({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName ?? "UNTITLED",
      fileUrl: fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(resp);

    //api call to fetch PDF Process data
    const ApiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
    console.log(ApiResp.data.result);
    const embeddResult = embeddDocument({
      splitText: ApiResp.data.result,
      fileId: fileId,
    });
    console.log(embeddResult);
    setLoading(false);
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          disabled={isMaxFile}
          className="w-full"
        >
          + Upload PDF File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File!</DialogTitle>
          <DialogDescription asChild>
            <div className="">
              <div className="flex mt-10 gap-2 p-3 rounded-md border">
                <h2>Select PDF file to Uplaod</h2>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => OnFileSelect(event)}
                />
              </div>
              <div className="mt-3">
                <label>File Name *</label>
                <Input
                  className="mt-1"
                  placeholder="File Name"
                  onChange={(e) => setFileName(e.target.value)}
                ></Input>
              </div>
              <div></div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Uplaod"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdf;
