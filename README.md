# PeriodReady — Full-Stack D2C E-Commerce Platform

> **"Emergency? Get it in about 10 minutes."**  
> Discreet menstrual emergency kits designed exclusively for **college & PG students and working professionals**. When an unexpected cycle begins, order on top quick-commerce apps and receive complete preparedness in ~10 minutes, or order direct on our website with standard delivery.

---

## 🌟 Live Access Links

| Device / Interface | URL Link | Notes |
| :--- | :--- | :--- |
| **💻 Laptop / Windows Browser** | **[http://localhost:5000](http://localhost:5000)** | Open in Chrome, Edge, or Firefox on this PC |
| **📱 Mobile Phone (iPhone & Android)** | **[http://192.168.0.109:5000](http://192.168.0.109:5000)** | Connect your phone to the same local Wi-Fi and open this URL |
| **🔐 Admin Operations Portal** | **[http://localhost:5000/admin](http://localhost:5000/admin)** | Restricted staff portal for inventory, sales channels, orders & revenue |

---

## 📦 Products & Variants (Stored in DB & Admin-Editable)

All prices and inventory are stored in the database and fully editable via the Admin Portal:

1. **Regular Period Kit (with mini hot water bag)** — **₹149**
   - **Tagline**: daily comfort
   - **What's Inside**: mini hot water bag, 3 premium XL sanitary pads, 2 panty liners, mini hand sanitizer and disposal bags, printed mini period guide card, inner cardboard box.
   - **Pack Size Variants**: 1 Kit (₹149), Pack of 2 (₹289), Pack of 3 (₹419).
   - **360° Viewer**: Interactive 24-frame 360-degree rotation view at top of product page.

2. **Travel Period Kit (no-wash version)** — **₹199**
   - **Tagline**: hassle-free travel
   - **What's Inside**: cramp pain relief roll-on (mini), stain remover pen/spray (mini), disposable travel pads/menstrual cup, pocket pack of 10 intimate wet wipes, inner cardboard box.
   - **Pack Size Variants**: 1 Kit (₹199), Pack of 2 (₹389), Pack of 3 (₹569).
   - **360° Viewer**: Interactive 24-frame 360-degree rotation view at top of product page.

3. **Emergency Period Kit (compact saviour pouch)** — **₹49**
   - **Tagline**: compact saviour pouch
   - **What's Inside**: 1 sanitary pad, 2 compressed coin tissues, compact envelope/mini pouch.
   - **Painkiller Tablets Option**: Optional admin-toggleable item (default OFF in compliance with drug-licensing regulations).
   - **Pack Size Variants**: 1 Kit (₹49), Pack of 2 (₹95), Pack of 3 (₹139).
   - **360° Viewer**: Interactive 24-frame 360-degree rotation view at top of product page.

4. **Complete Combo Box (all three kits in a premium navy-blue mailer box)** — **₹349** *(Best Value)*
   - **Tagline**: all three kits in a premium navy-blue mailer box with custom sticker and tissue wrapping
   - **Savings**: Save ₹48 versus buying separately (₹149 + ₹199 + ₹49 = ₹397 → Only ₹349).
   - **What's Inside**: 1x Regular Period Kit, 1x Travel Period Kit, 1x Emergency Period Kit, luxury navy-blue mailer box with custom sticker and tissue wrapping.
   - **Variant**: 1 Complete Box (₹349).
   - **360° Viewer**: Interactive 24-frame 360-degree rotation view at top of product page.

---

## ⚡ Multi-Channel Availability ("Available Everywhere")

Products are available across India's leading hyperlocal apps and marketplaces:
- **10-Minute Delivery Apps**: Blinkit, Zepto, Swiggy Instamart.
- **Online Marketplaces**: Amazon, Flipkart, Myntra.
- **Admin Sales Channels Manager**: Accessible at `/admin/sales-channels` to edit platform URLs and status (**Live** / **Coming Soon** / **Hidden**). "Order" buttons only appear active when set to Live.
- **Direct Website Checkout**: Provides standard 2-4 day shipping with full cart, coupon, address validation, and payment support.

---

## 🔄 360-Degree Product Viewer

- Placed as the **first element** on every product page.
- Backed by a pure CSS premium dark charcoal backdrop with radial spotlight glow, soft vignette, and high-contrast HUD controls.
- Displays uploaded photos **exactly as uploaded** (`object-fit: contain`) with zero crops, filters, or alterations.
- Features smooth drag-to-rotate (mouse and touch), auto-rotate on load with pause/play toggle, zoom slider, and 24-frame sequence support.
- If no 360 sequence exists for a newly added product, it automatically falls back to standard photo view.

---

## 🔑 Demo Accounts

### 👑 Admin Portal
- **URL**: `http://localhost:5000/admin/login`
- **Email**: `admin@periodready.com`
- **Password**: `Admin@123`
- *(Includes a 1-click **"Auto Fill"** button for instant testing)*

### 👩 Customer Account
- **URL**: `http://localhost:5000/login`
- **Email**: `customer@periodready.com`
- **Password**: `Customer@123`
- *(Includes a 1-click **"Fill Demo"** button for instant testing)*

---

## 🎟️ Active Coupons

- `STUDENT10` — 10% Off for college/PG students and professionals
- `READY50` — Flat ₹50 Off on orders above ₹300

---

## 🚀 Running the App

```powershell
# Run the seed script to initialize users, products, variants, and channels:
.\node_runtime\node.exe server\seed.js

# Start the full-stack server (serving API + React frontend):
.\node_runtime\node.exe server\server.js
```
