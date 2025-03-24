/*
  # Add likes table and update novels table

  1. New Tables
    - `likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `novel_id` (uuid, references novels)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `likes` table
    - Add policies for:
      - Authenticated users can create/delete their own likes
      - Anyone can read likes
*/

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  novel_id uuid NOT NULL REFERENCES novels(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, novel_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read likes"
  ON likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add likes count to novels view
CREATE OR REPLACE VIEW novel_stats AS
SELECT 
  n.id,
  COUNT(l.id) as likes_count
FROM novels n
LEFT JOIN likes l ON n.id = l.novel_id
GROUP BY n.id;