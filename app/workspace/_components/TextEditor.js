import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import Placeholder from "@tiptap/extension-placeholder";
import EditorExtension from "./EditorExtension";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

import TextAlign from "@tiptap/extension-text-align";
import { useQuery } from "convex/react";

function TextEditor({ fileId }) {
  const notes = useQuery(api.notes.GetNotes, { fileId: fileId });
  console.log(notes);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: false, // Disables the default Strike extension
      }),
      ,
      Underline,
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      Highlight.configure({
        multicolor: true,
      }),

      Placeholder.configure({ placeholder: "What Questions do you have...." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
    injectCSS: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    editor && editor.commands.setContent(notes);
  }, [notes && editor]);
  return (
    <div>
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;
