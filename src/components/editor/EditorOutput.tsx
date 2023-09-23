"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-dark.css";
import { Clipboard } from "lucide-react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  );
};

function CustomCodeRenderer({ data }: any) {
  const highlightedCode = hljs.highlightAuto(data.code).value;
  const [IsCopyCodeText, setIsCopyCodeText] = useState<string>("Copy code");
  const [IsCopying, setIsCopying] = useState<boolean>(false);
  const code = { __html: highlightedCode };

  const copyCode = () => {
    const codeToCopy = data.code;

    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        setIsCopyCodeText("Copiado");
        setIsCopying(true);
      })
      .catch((err) => setIsCopyCodeText("Ops.."))
      .finally(() =>
        setTimeout(() => {
          setIsCopyCodeText("Copy code");
          setIsCopying(false);
        }, 2000)
      );
  };

  return (
    <pre>
      <div className="bg-neutral-800 text-neutral-50 rounded-md mb-4 ">
        <div className="flex items-center justify-between relative bg-neutral-600 text-xs text-neutral-50 px-4 py-2 rounded-t-md w-full">
          <span>{hljs.highlightAuto(data.code).language}</span>
          <button
            disabled={IsCopying}
            onClick={copyCode}
            className="flex ml-auto gap-2"
          >
            <Clipboard size={16} />
            {IsCopyCodeText}
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <code
            id="code"
            className="text-sm"
            dangerouslySetInnerHTML={code}
          ></code>
        </div>
      </div>
    </pre>
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}

export default EditorOutput;
