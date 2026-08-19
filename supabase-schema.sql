-- ============================================
-- RUN THIS ENTIRE FILE IN: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================

-- 1) PRODUCTS TABLE
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  image_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Anyone (even logged-out visitors) can view products
create policy "Anyone can view products"
  on products for select
  using (true);

-- Only logged-in users can add a product, and only as themselves
create policy "Logged in users can add products"
  on products for insert
  to authenticated
  with check (auth.uid() = created_by);


-- 2) ORDERS TABLE
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  items jsonb not null,       -- snapshot of cart items: [{product_id, name, price, quantity}, ...]
  total numeric not null check (total >= 0),
  created_at timestamptz default now()
);

alter table orders enable row level security;

-- Users can only see their own orders
create policy "Users can view their own orders"
  on orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can only insert orders under their own user id
create policy "Users can insert their own orders"
  on orders for insert
  to authenticated
  with check (auth.uid() = user_id);


-- 3) (Optional) seed a couple of sample products so Home isn't empty at first
insert into products (name, description, price, image_url)
values
  ('Wireless Headphones', 'Noise-cancelling over-ear headphones', 89.99, 'https://picsum.photos/seed/headphones/400/300'),
  ('Mechanical Keyboard', 'RGB backlit, hot-swappable switches', 64.50, 'https://picsum.photos/seed/keyboard/400/300'),
  ('Water Bottle', 'Insulated stainless steel, 750ml', 19.99, 'https://picsum.photos/seed/bottle/400/300');
