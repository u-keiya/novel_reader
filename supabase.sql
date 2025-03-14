-- テーブルを削除
drop table if exists users;
drop table if exists likes;
drop table if exists novel_tags;
drop table if exists tags;
drop table if exists novels;

-- novelsテーブルを作成（auth.usersを参照）
create table novels (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade,
  file_url text not null,
  page_count integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLSを有効化
alter table novels enable row level security;

-- テーブルポリシー
create policy "Novels are viewable by everyone"
  on novels for select using (true);

create policy "Users can create novels"
  on novels for insert
  with check (auth.uid() = user_id);

create policy "Users can update own novels"
  on novels for update
  using (auth.uid() = user_id);

create policy "Users can delete own novels"
  on novels for delete
  using (auth.uid() = user_id);

-- ストレージのクリーンアップ
drop policy if exists "Anyone can read" on storage.objects;
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Users can delete own files" on storage.objects;

-- ストレージポリシー
create policy "Anyone can read"
  on storage.objects for select
  using (bucket_id = 'novels');

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'novels'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'novels'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );