-- 1. Create PROFILES table (Public user data)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  username text,
  role text default 'USER',
  is_active boolean default true,
  created_at timestamptz default now(),
  primary key (id)
);

-- 2. Create ANALYSIS_RESULTS table (Store sentiment history)
create table public.analysis_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  original_text text,
  image_url text,
  ocr_text text,
  detected_objects text[], -- Array of strings
  sentiment text,
  sarcasm boolean,
  humor boolean,
  confidence_score float,
  processing_time_ms int,
  timestamp timestamptz default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.analysis_results enable row level security;

-- 4. Policies for PROFILES
-- Users can read their own profile
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

-- Admins can view all profiles
create policy "Admins can view all profiles" 
on public.profiles for select 
using ( 
  (select role from public.profiles where id = auth.uid()) = 'ADMIN' 
);

-- Admins can update profiles (e.g., deactivate users)
create policy "Admins can update profiles" 
on public.profiles for update
using ( 
  (select role from public.profiles where id = auth.uid()) = 'ADMIN' 
);

-- 5. Policies for ANALYSIS_RESULTS
-- Users can see their own results
create policy "Users can view own results" 
on public.analysis_results for select 
using ( auth.uid() = user_id );

-- Users can insert their own results
create policy "Users can insert own results" 
on public.analysis_results for insert 
with check ( auth.uid() = user_id );

-- Admins can view ALL results
create policy "Admins can view all results" 
on public.analysis_results for select 
using ( 
  (select role from public.profiles where id = auth.uid()) = 'ADMIN' 
);

-- 6. AUTOMATION: Trigger to create Profile on Sign Up
-- This function runs automatically when a user registers via Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, username, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'role', 'USER')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. INITIAL ADMIN (Optional)
-- This assumes you create a user manually first, then run this to make them admin
-- update public.profiles set role = 'ADMIN' where email = 'your_admin_email@example.com';
