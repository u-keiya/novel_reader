"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Novel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
}

export default function NovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNovels() {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching novels:", error);
        return;
      }

      setNovels(data || []);
      setLoading(false);
    }

    fetchNovels();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">小説一覧</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">小説一覧</h1>
      {novels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">まだ小説がアップロードされていません</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novels/${novel.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>{novel.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {novel.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {novel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}