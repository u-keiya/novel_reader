"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, BookOpenIcon, UserIcon, UploadIcon, BookIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { user, signOut } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpenIcon className="h-6 w-6" />
            <span className="font-bold">Novel Reader</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/novels" className="flex items-center space-x-1">
                <BookIcon className="h-4 w-4" />
                <span>小説一覧</span>
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/upload" className="flex items-center space-x-1">
                    <UploadIcon className="h-4 w-4" />
                    <span>アップロード</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/mypage" className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>マイページ</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  ログアウト
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth">ログイン</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}