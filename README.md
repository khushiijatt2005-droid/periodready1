# PeriodReady — India's 10-Minute Menstrual Emergency Companion

> **"When a period surprises you, we’re 10 minutes away."**  
> *Slogan:* **"Be Ready. Feel Confident. Always."**

PeriodReady is an e-commerce platform engineered specifically for Indian college students, PG residents, and busy working professionals. Delivered directly to your campus gate, PG reception, or office desk in about 10 minutes via Blinkit, Zepto, and Instamart in 100% plain, discreet packaging.

---

## 🌸 Key Features

1. **Lightweight & Fast E-Commerce Experience**
   - Built with React 19, Vite, and Tailwind CSS.
   - Ultra-clean light theme with customized color palette: Indigo (`#443c82`), Lavender (`#f3f0ff`), Blush (`#fdecf3`), Rose (`#d6457f`), and White cards.
   - Editorial typography: **Playfair Display** (headings) & **Plus Jakarta Sans** (body).

2. **Official Brand Logo & Image Sliders**
   - Powered by your authentic uploaded logo (purple water-drop with leaf, transparent background).
   - Swipeable photo slider with scroll-snap, navigation arrows, and dot indicators for all 4 emergency kits:
     - **Emergency Period Kit (₹49)**: Closed box & open contents pouch.
     - **Regular Period Kit (₹179)**: Closed box & open contents layout.
     - **Travel Period Kit (₹249)**: Closed navy blue box & open contents layout.
     - **Over-all Master Combo Box (₹399)**: 3-in-1 combo photo & individual closed boxes.

3. **Cozy Knit Hot Water Bag & Real-time Recoloring**
   - 7 round pastel knit color buttons: **Light Pink, Light Blue, Light Lavender, Light Green, White, Light Orange, Pista Green**.
   - Tapping any color dynamically recolors the knit fabric while keeping the neck spout, handle, and signature leaf tag authentic.
   - The selected color flows directly into the cart and printable tax invoice (e.g., `Cozy Knit Hot Water Bag (Light Pink)`).

4. **Streamlined Shopping Flow & Account Gate**
   - Mandatory account registration modal before adding items to the cart.
   - Automatic resume: once signed up, the selected item is added straight to the cart drawer!
   - Instant 10-minute delivery address field.
   - Payment Choice:
     - **Pay Online (Demo · No real money)**: Realistic sandbox modal with UPI / Card / Net Banking options, 1.5s simulated processing, and payment reference code.
     - **Cash on Delivery (COD)**: Seamless gate drop payment.
   - Printable tax invoice with instant **Print / Save as PDF** support.
   - Customer Order History in **My Account** to revisit and re-print receipts anytime.

5. **Owner Admin Dashboard (`/admin`)**
   - Protected route requiring email & password (`periodready1@gmail.com`).
   - Date range filters: **Today, 7 days, 30 days, All time**.
   - 12 real-time KPIs: Total revenue, Paid online, Collected, Still to collect (COD), Estimated profit, Profit margin %, Orders, Units sold, AOV, New customers, Repeat customers, Cancelled count.
   - **Profit Settings**: Editable cost per unit for every product, saved directly to the database.
   - Visual 14-day revenue & orders trend chart, plus product sales & profit share analysis.
   - Order management with status workflow: **Placed ➔ Shipped ➔ Delivered ➔ Cancelled** (with confirmation; cancelled orders excluded from revenue).
   - Customer directory table with phone numbers and lifetime order totals.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🗄️ Real Backend Database Setup (Supabase)

PeriodReady is built to run smoothly right out of the box with persistent local storage sync, and connects directly to a live Supabase database when configured.

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase dashboard, navigate to the **SQL Editor**.

### Step 2: Run the Provided Schema
Open `supabase_schema.sql` located in this project root, copy its contents, paste them into the Supabase SQL Editor, and click **Run**. This creates:
- `customers` table
- `orders` table (with JSONB items, payment method, delivery address, reference)
- `product_costs` table (preloaded with baseline manufacturing costs for profit tracking)
- Row Level Security (RLS) policies allowing secure order placement and admin synchronization.

### Step 3: Add Your Credentials to `.env`
Create or edit `.env` in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
Restart the dev server (`npm run dev`) or re-deploy. The app will immediately start writing and reading orders and customers from your shared Supabase cloud database!

---

## 🔑 Admin Credentials

- **Admin URL:** [`/admin`](http://localhost:3000/admin)
- **Default Owner Email:** `periodready1@gmail.com`
- **Default Owner Password:** `Admin@PeriodReady2026`  
*(You can also invite this user inside Supabase Authentication to manage the password securely.)*

---

## ☁️ Deployment Instructions

### Deploy to Netlify
1. Connect your repository to [Netlify](https://www.netlify.com).
2. Set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. In **Site Configuration > Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. The included `public/_redirects` ensures client-side routing works smoothly without 404s on page refresh.

### Deploy to Vercel
1. Connect your repository to [Vercel](https://vercel.com).
2. The framework will automatically detect **Vite**.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. The included `vercel.json` rewrite rule handles client routing.
