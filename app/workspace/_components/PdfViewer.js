import React from "react";

function PdfViewer({ fileUrl }) {
  console.log(fileUrl);
  return (
    <div>
      <iframe
        src={fileUrl + "#toolbar=0"}
        height="90vh"
        width="100%"
        className="h-screen"
      ></iframe>
    </div>
  );
}

export default PdfViewer;
