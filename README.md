# ShopSPA — React + Supabase E-Commerce SPA

A single-page e-commerce app with:
- **Home** — browse products fetched from Supabase, add to cart
- **User Portal** — sign up / log in; logged-in users can add new products
- **Cart** — adjust quantities, see total, place order (saved to Supabase)

---

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Go to https://supabase.com → create a new project.
2. In your project: **SQL Editor → New Query** → paste the entire contents of
   `supabase-schema.sql` (included in this repo) → click **Run**.
   This creates the `products` and `orders` tables, turns on Row Level
   Security, and adds the policies described below, plus 3 sample products.
3. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public** key.
4. In this project, duplicate `.env.example` as a new file named `.env`:

```bash
cp .env.example .env
```

   Then open `.env` and paste in your values:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

   **This is the only file you need to edit to connect your own Supabase project.**
   `.env` is already in `.gitignore`, so your key never gets committed.

5. (Recommended) In **Authentication → Providers → Email**, you can turn OFF
   "Confirm email" while testing, so signup logs the user in immediately
   instead of requiring an email click.

## 3. Run locally

```bash
npm run dev
```

Visit the printed localhost URL.

## 4. What the two tables + RLS policies do

**`products`**
- `select`: anyone (even logged-out visitors) can read — needed for the Home page.
- `insert`: only logged-in (`authenticated`) users, and only if `created_by`
  matches their own `auth.uid()` — this is what makes "Add Product" protected.

**`orders`**
- `select` / `insert`: a user can only see/create orders where `user_id`
  matches their own `auth.uid()` — one user can never see another's orders.

## 5. Deploy (Vercel)

Push this project to a GitHub repo, then:

**Vercel**
1. Import the repo at vercel.com/new.
2. Framework preset: Vite (auto-detected).
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` with the same values from your `.env`.
4. Deploy.

Submit your GitHub repo link and the live Vercel URL.

## Project structure

```
src/
  supabaseClient.js      <- reads keys from .env
  App.jsx                <- navigation state, auth listener, cart state
  components/
    Header.jsx            nav buttons + cart badge
    Footer.jsx
    ProductCard.jsx        single product tile + Add to Cart
    AddProductForm.jsx     protected form, inserts into `products`
  pages/
    Home.jsx               fetches & lists products
    UserPortal.jsx          login/signup + shows AddProductForm when logged in
    Cart.jsx                quantities, total, Place Order -> inserts into `orders`
.env             <- fill in your keys
```
