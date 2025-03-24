import { supabase } from "@/lib/supabase/client";
import { NovelViewer } from "./novel-viewer";

// Server component for static params generation
export async function generateStaticParams() {
  const { data: novels } = await supabase
    .from("novels")
    .select("id");

  return (novels ?? []).map((novel) => ({
    id: novel.id,
  }));
}

export default function NovelPage({ params }: { params: { id: string } }) {
  return <NovelViewer id={params.id} />;
}