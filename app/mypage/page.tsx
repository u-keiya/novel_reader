"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Novel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  file_path: string;
}

export default function MyPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    async function fetchUserNovels() {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user novels:", error);
        return;
      }

      setNovels(data || []);
      setLoading(false);
    }

    fetchUserNovels();
  }, [user, router]);

  const handleDelete = async (novel: Novel) => {
    if (!user) return;
    
    try {
      // First, delete the file from storage
      const { error: storageError } = await supabase.storage
        .from("novels")
        .remove([novel.file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Then, delete the database record
      const { error: deleteError } = await supabase
        .from("novels")
        .delete()
        .eq("id", novel.id);

      if (deleteError) throw deleteError;

      setNovels(novels.filter(n => n.id !== novel.id));
      
      toast({
        title: "削除完了",
        description: "小説を削除しました",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "削除に失敗しました。もう一度お試しください。",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">マイページ</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">アカウント情報</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                メールアドレス: {user?.email}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">投稿した小説</h2>
          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="h-32" />
                </Card>
              ))}
            </div>
          ) : novels.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                まだ小説を投稿していません
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {novels.map((novel) => (
                <Card key={novel.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-2">{novel.title}</CardTitle>
                        <p className="text-muted-foreground mb-2">
                          {novel.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {novel.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              本当に削除しますか？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。小説は完全に削除されます。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(novel)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}