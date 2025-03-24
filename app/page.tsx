"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Tags, ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Novel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
}

export default function Home() {
  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentNovels() {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching recent novels:", error);
        return;
      }

      setRecentNovels(data || []);
      setLoading(false);
    }

    fetchRecentNovels();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">小説を共有し、発見する新しい方法</h1>
        <p className="text-lg text-muted-foreground mb-8">
          PDFで小説を共有し、タグで整理し、新しい物語を見つけましょう
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/upload">今すぐ始める</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/novels">詳しく見る</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Upload className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>簡単アップロード</CardTitle>
            <CardDescription>
              PDFファイルを数クリックでアップロード
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>快適な読書体験</CardTitle>
            <CardDescription>
              モバイル対応のビューワーで快適に読書
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Tags className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>タグ管理</CardTitle>
            <CardDescription>
              ジャンルやAI生成の有無を明確に
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <ThumbsUp className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>コミュニティ</CardTitle>
            <CardDescription>
              いいねで作品を評価
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">人気の作品</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(null).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-secondary rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-secondary rounded w-full mb-2"></div>
                    <div className="h-4 bg-secondary rounded w-2/3 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-secondary rounded w-16"></div>
                      <div className="h-6 bg-secondary rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : recentNovels.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">まだ小説がアップロードされていません</p>
            </div>
          ) : (
            recentNovels.map((novel) => (
              <Link key={novel.id} href={`/novels/${novel.id}`}>
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">{novel.title}</h3>
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
            ))
          )}
        </div>
      </section>
    </div>
  );
}