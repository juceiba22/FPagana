-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  avatar_url text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: characters
create table public.characters (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: scripts
create table public.scripts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content_url text not null,
  access_level text check (access_level in ('public', 'protected')) default 'protected',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: posts
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.scripts enable row level security;
alter table public.posts enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for characters
create policy "Characters are viewable by everyone." on public.characters
  for select using (true);

-- Policies for scripts
create policy "Scripts with public access are viewable by everyone." on public.scripts
  for select using (access_level = 'public');

create policy "Protected scripts are viewable by authenticated users." on public.scripts
  for select using (auth.role() = 'authenticated');

-- Policies for posts
create policy "Posts are viewable by everyone." on public.posts
  for select using (true);

create policy "Authenticated users can create posts." on public.posts
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own posts." on public.posts
  for update using (auth.uid() = author_id);

create policy "Users can delete their own posts." on public.posts
  for delete using (auth.uid() = author_id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, split_part(new.email, '@', 1), new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when auth.user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
