"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  novelId: string;
  initialLikesCount: number;
}

export function LikeButton({ novelId, initialLikesCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    async function checkLikeStatus() {
      if (!user) return;

      const { data, error } = await supabase
        .from("likes")
        .select()
        .eq("novel_id", novelId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error checking like status:", error);
        return;
      }

      setIsLiked(data.length > 0);
    }

    checkLikeStatus();
  }, [novelId, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "ログインが必要です",
        description: "いいねするにはログインしてください",
      });
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("novel_id", novelId)
          .eq("user_id", user.id);

        if (error) throw error;
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({
            novel_id: novelId,
            user_id: user.id,
          });

        if (error) throw error;
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "もう一度お試しください",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1"
      onClick={(e) => {
        e.preventDefault();
        handleLike();
      }}
    >
      <Heart
        className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`}
      />
      <span>{likesCount}</span>
    </Button>
  );
}