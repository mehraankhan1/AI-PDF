"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UploadPdf from "./UploadPdf";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
function SideBar() {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="shadow-md h-screen p-7">
      <Image src={"/logo.svg"} alt="logo" width={180} height={130} />
      <div className="mt-10">
        <UploadPdf isMaxFile={fileList?.length >= 10 ? true : false}>
          <Button className="w-full">+ Upload PDF</Button>
        </UploadPdf>
        <div className="flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Layout />
          <h2>Workspace</h2>
        </div>
        <div className="flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Shield />
          <h2>Upgrade</h2>
        </div>
      </div>
      <div className="absolute bottom-10 w-[80%]">
        <Progress value={(fileList?.length / 10) * 100} />
        <p className="text-sm mt-2 text-center">
          {fileList?.length} out of 10 Pdf Uploaded
        </p>
        <p className="text-sm text-gray-400 mt-2 cursor-pointer text-center">
          Upgrade to upload more!
        </p>
      </div>
    </div>
  );
}

export default SideBar;
