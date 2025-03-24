"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Novel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  file_path: string;
  user_id: string;
}

export function NovelViewer({ id }: { id: string }) {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNovel() {
      const { data, error } = await supabase
        .from("novels")
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;
      setNovel(data);

      const { data: fileData, error: fileError } = await supabase.storage
        .from("novels")
        .createSignedUrl(data.file_path, 3600);

      if (fileError) throw fileError;
      setPdfUrl(fileData.signedUrl);
    }

    fetchNovel();
  }, [id]);

  if (!novel || !pdfUrl) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-[800px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{novel.title}</h1>
        <p className="text-muted-foreground mb-4">{novel.description}</p>
        <div className="flex gap-2 mb-6">
          {novel.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="w-full aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={novel.title}
          />
        </div>
      </div>
    </div>
  );
}