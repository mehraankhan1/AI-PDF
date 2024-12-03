import React from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";
import AiButton from "@/components/ui/AiButton";
import { useParams } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatSession } from "@google/generative-ai";
import { chatSession } from "@/configs/AIModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
function EditorExtension({ editor }) {
  const { fileId } = useParams();
  const SearchAI = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();
  const onAiClick = async () => {
    toast("AI is Analyzing you question");
    console.log("AI Button Click");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      '"'
    );
    console.log("Selected Text:", selectedText);

    const result = await SearchAI({
      query: selectedText,
      fileId: fileId,
    });

    const unformattedAns = JSON.parse(result);
    let answer = "";
    unformattedAns &&
      unformattedAns.forEach((item) => {
        answer = answer + item.pageContent;
      });
    const PROMPT =
      "For question : " +
      selectedText +
      "and with the content as answer please give appropriate answer in HTML format. The answer content is : " +
      answer;

    const AiModelResult = await chatSession.sendMessage(PROMPT);
    console.log(AiModelResult.response.text());
    const FinalAns = AiModelResult.response
      .text()
      .replace("```", "")
      .replace("html", "")
      .replace("```", "");

    const AllText = editor.getHTML();
    editor.commands.setContent(
      AllText + "<p><strong>Answer: </strong>" + FinalAns + "</p>"
    );

    console.log("Unformatted answer", result);

    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    editor && (
      <div className="p-5 flex gap-3">
        <div className="control-group">
          <div className="button-group flex gap-8">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "text-gray-400" : ""}
            >
              <Bold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "text-gray-400" : ""}
            >
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "text-gray-400" : ""}
            >
              <Underline />
            </button>
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "#ffc078" })
                  .run()
              }
              className={
                editor.isActive("highlight", { color: "#ffc078" })
                  ? "text-gray-400"
                  : ""
              }
            >
              <Highlighter />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "text-gray-400" : ""}
            >
              <Strikethrough />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "text-gray-400" : ""
              }
            >
              <AlignLeft />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "text-gray-400" : ""
              }
            >
              <AlignCenter />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "text-gray-400" : ""
              }
            >
              <AlignRight />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={
                editor.isActive({ textAlign: "justify" }) ? "text-gray-400" : ""
              }
            >
              <AlignJustify />
            </button>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={editor.isActive({ level: 1 }) ? "text-gray-400" : ""}
            >
              <Heading1 />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={editor.isActive({ level: 2 }) ? "text-gray-400" : ""}
            >
              <Heading2 />
            </button>
          </div>
          <button onClick={() => onAiClick()}>
            <AiButton />
          </button>
          {/* <div>
            <AiButton onClick={onAiClick} className=""></AiButton>
          </div> */}
        </div>
      </div>
    )
  );
}

export default EditorExtension;
