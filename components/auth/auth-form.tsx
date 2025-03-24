"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { signIn, signUp } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (mode === "signin") {
        await signIn(values.email, values.password);
        toast({
          title: "ログインしました",
          description: "ようこそ Novel Reader へ",
        });
      } else {
        await signUp(values.email, values.password);
        toast({
          title: "アカウントを作成しました",
          description: "確認メールを送信しました",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "認証に失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "ログイン" : "アカウント作成"}</CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Novel Reader へようこそ"
            : "新しいアカウントを作成します"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {mode === "signin" ? "ログイン" : "アカウント作成"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                disabled={isLoading}
              >
                {mode === "signin"
                  ? "アカウントをお持ちでない方"
                  : "すでにアカウントをお持ちの方"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}