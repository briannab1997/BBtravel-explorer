-- Travel Explorer — Supabase Schema
-- Run this in the Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- Auto-populated via trigger when user signs up
-- ─────────────────────────────────────────────
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  username     text unique,
  display_name text,
  avatar_url   text,
  bio          text,
  created_at   timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- SAVED TRIPS (Wishlist)
-- ─────────────────────────────────────────────
create table public.saved_trips (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  city_name    text not null,
  country      text,
  wiki_photo   text,
  notes        text,
  travel_date  date,
  created_at   timestamptz default now(),
  unique(user_id, city_name)
);

-- ─────────────────────────────────────────────
-- ITINERARIES
-- ─────────────────────────────────────────────
create table public.itineraries (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  city_name   text not null,
  title       text not null default 'My Trip',
  start_date  date,
  end_date    date,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ITINERARY ITEMS
-- ─────────────────────────────────────────────
create table public.itinerary_items (
  id            uuid default uuid_generate_v4() primary key,
  itinerary_id  uuid references public.itineraries(id) on delete cascade not null,
  day_number    int not null,
  item_name     text not null,
  item_type     text,
  notes         text,
  time_of_day   text,
  position      int default 0,
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
create table public.reviews (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  city_name   text not null,
  rating      int check (rating >= 1 and rating <= 5) not null,
  title       text,
  body        text,
  visited_at  date,
  created_at  timestamptz default now(),
  unique(user_id, city_name)
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.saved_trips     enable row level security;
alter table public.itineraries     enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.reviews         enable row level security;

-- Profiles
create policy "Profiles are public"
  on public.profiles for select using (true);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Saved trips
create policy "Users manage own saved trips"
  on public.saved_trips for all using (auth.uid() = user_id);

-- Itineraries
create policy "Users manage own itineraries"
  on public.itineraries for all using (auth.uid() = user_id);

-- Itinerary items
create policy "Users manage own itinerary items"
  on public.itinerary_items for all
  using (
    auth.uid() = (
      select user_id from public.itineraries where id = itinerary_id
    )
  );

-- Reviews (public read, auth-gated write)
create policy "Reviews are public"
  on public.reviews for select using (true);
create policy "Users submit reviews"
  on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users update own reviews"
  on public.reviews for update using (auth.uid() = user_id);
create policy "Users delete own reviews"
  on public.reviews for delete using (auth.uid() = user_id);
