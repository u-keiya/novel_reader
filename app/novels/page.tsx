"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart } from "lucide-react";

interface Novel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  likes_count: number;
}

export default function NovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchNovels() {
      const tags = searchTags.split(",").map(tag => tag.trim()).filter(Boolean);
      
      let query = supabase
        .from("novels")
        .select(`
          *,
          likes (count)
        `)
        .order("created_at", { ascending: false });

      if (tags.length > 0) {
        query = query.contains("tags", tags);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching novels:", error);
        return;
      }

      // Transform the data to include likes_count
      const transformedData = data.map(novel => ({
        ...novel,
        likes_count: novel.likes?.length || 0
      }));

      setNovels(transformedData);
      setLoading(false);

      // Collect unique tags
      const uniqueTags = new Set<string>();
      data.forEach(novel => {
        novel.tags.forEach((tag: string) => uniqueTags.add(tag));
      });
      setAllTags(Array.from(uniqueTags));
    }

    fetchNovels();
  }, [searchTags]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">小説一覧</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="タグで検索（カンマ区切りで複数指定可能）"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
            className="pl-10"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  const currentTags = searchTags.split(",").map((t: string) => t.trim()).filter(Boolean);
                  if (currentTags.includes(tag)) {
                    setSearchTags(currentTags.filter((t: string) => t !== tag).join(", "));
                  } else {
                    setSearchTags([...currentTags, tag].join(", "));
                  }
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {loading ? (
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
      ) : novels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTags ? "検索条件に一致する小説が見つかりませんでした" : "まだ小説がアップロードされていません"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novels/${novel.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{novel.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{novel.likes_count}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {novel.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {novel.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
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