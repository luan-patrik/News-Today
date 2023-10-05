"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { Input } from "@/components/ui/input";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { uploadFiles } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import "@/styles/editor.css";

const EditorPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Code = (await import("@editorjs/code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Conteúdo",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    endpoint: "imageUploader",
                    files: [file],
                  });

                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  });
                },
              },
            },
          },
          code: Code,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Somenthing went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors, toast]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };
    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
      };
      setIsLoading(true);
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: () => {
      setIsLoading(false);
      return toast({
        title: "Something went wrong",
        description: "Your post was not published. Try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push("/");

      return toast({
        description: "Your post has been published",
      });
    },

    retry: 3,
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
    };
    setIsLoading(true);
    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <>
      <div className="w-full">
        <form id="news-post-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="gap-6 grid">
            <Input
              placeholder="Título"
              className="bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50"
              {...register("title")}
              ref={(e) => {
                titleRef(e);
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
            />
            <div
              className="min-h-[400px] w-full rounded-md border border-input text-neutral-950 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              id="editor"
            />
          </div>
        </form>
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="submit"
          variant="done"
          form="news-post-form"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Publicar"
          )}
        </Button>
      </div>
    </>
  );
};

export default EditorPost;
