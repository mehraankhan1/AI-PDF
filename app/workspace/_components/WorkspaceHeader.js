import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
const WorkspaceHeader = ({ fileName }) => {
  return (
    <div className="p-4 flex justify-between shadow-md">
      <Image src={"/logo.svg"} alt="logo" width={140} height={100}></Image>
      <h2 className="font-bold">{fileName}.pdf</h2>
      <UserButton />
    </div>
  );
};

export default WorkspaceHeader;
