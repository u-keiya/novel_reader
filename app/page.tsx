import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Tags, ThumbsUp } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">小説を共有し、発見する新しい方法</h1>
        <p className="text-lg text-muted-foreground mb-8">
          PDFで小説を共有し、タグで整理し、新しい物語を見つけましょう
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">
            今すぐ始める
          </Button>
          <Button variant="outline" size="lg">
            詳しく見る
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
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">サンプル小説 {i}</h3>
                <p className="text-muted-foreground mb-4">
                  これはサンプル小説の説明文です。実際の小説では、ここに作品の簡単な概要が表示されます。
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    ファンタジー
                  </Button>
                  <Button variant="secondary" size="sm">
                    SF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}