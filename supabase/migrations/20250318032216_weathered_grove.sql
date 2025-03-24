/*
  # Create novels table and storage

  1. New Tables
    - `novels`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `tags` (text array)
      - `file_path` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `novels` table
    - Add policies for:
      - Anyone can read novels
      - Authenticated users can create novels
      - Users can update and delete their own novels
*/

-- Create novels table
CREATE TABLE IF NOT EXISTS novels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  file_path text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read novels"
  ON novels
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create novels"
  ON novels
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own novels"
  ON novels
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own novels"
  ON novels
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for novels
INSERT INTO storage.buckets (id, name)
VALUES ('novels', 'novels')
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can read novel files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'novels');

CREATE POLICY "Authenticated users can upload novel files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'novels'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own novel files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'novels'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own novel files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'novels'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );