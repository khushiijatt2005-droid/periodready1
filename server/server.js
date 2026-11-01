const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db = require('./db');
const { authenticate, requireAdmin, optionalAuth, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads static directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prd-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for high-res frames & 3D models
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') || ext === '.glb' || ext === '.gltf' || file.mimetype === 'model/gltf-binary' || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG/WebP/JPG) and .glb 3D models are allowed.'));
    }
  }
});

// Image Upload Endpoint (Single file)
app.post('/api/upload', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl, filename: req.file.filename });
});

// 3D Model (.glb) Upload Endpoint
app.post('/api/upload/model', authenticate, requireAdmin, upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No 3D model (.glb) file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl, filename: req.file.filename });
});

// 360-degree Frame Sequence Upload Endpoint (Multiple frames)
app.post('/api/upload/sequence', authenticate, requireAdmin, upload.array('frames', 72), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No sequence frames uploaded' });
  }
  const fileUrls = req.files.map(f => `/uploads/${f.filename}`);
  return res.json({ urls: fileUrls, count: fileUrls.length });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Customer Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await db.users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'Account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.users.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      password: hashedPassword,
      role: 'customer'
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// Customer Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Admin access authorized.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Admin authentication failed.' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addresses = await db.addresses.find({ userId: req.user.id });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      addresses
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update Profile
app.put('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = await db.users.findByIdAndUpdate(req.user.id, {
      name: name || req.user.name,
      phone: phone || req.user.phone
    });
    return res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Forgot / Reset Password Mock
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await db.users.findOne({ email: email ? email.toLowerCase().trim() : '' });
  if (!user) {
    return res.status(404).json({ message: 'No registered account found with that email address.' });
  }
  // In production, send email with reset link. For demo, return reset token.
  const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
  return res.json({
    message: 'Password reset link sent to your email. (Demo token generated)',
    resetToken
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db.users.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    return res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired password reset token.' });
  }
});

// ==========================================
// ADDRESSES ROUTES
// ==========================================
app.get('/api/addresses', authenticate, async (req, res) => {
  const addresses = await db.addresses.find({ userId: req.user.id });
  res.json(addresses);
});

app.post('/api/addresses', authenticate, async (req, res) => {
  const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;
  if (!name || !phone || !addressLine || !pincode) {
    return res.status(400).json({ message: 'Name, phone, address, and pincode are required.' });
  }

  if (isDefault) {
    const userAddresses = await db.addresses.find({ userId: req.user.id });
    for (const addr of userAddresses) {
      await db.addresses.findByIdAndUpdate(addr._id, { isDefault: false });
    }
  }

  const newAddress = await db.addresses.create({
    userId: req.user.id,
    name,
    phone,
    addressLine,
    city: city || 'Bengaluru',
    state: state || 'Karnataka',
    pincode,
    isDefault: !!isDefault
  });
  res.status(201).json(newAddress);
});

// ==========================================
// PRODUCTS & VARIANTS ROUTES
// ==========================================

// Admin: Get All Products (includes inactive & all variants)
app.get('/api/admin/products', authenticate, requireAdmin, async (req, res) => {
  try {
    const products = await db.products.find();
    const allVariants = await db.variants.find();
    const enhanced = products.map(p => ({
      ...p,
      variants: allVariants.filter(v => v.productId === p._id)
    }));
    return res.json(enhanced);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch admin products' });
  }
});

// Get All Products (with filters & search)
app.get('/api/products', async (req, res) => {
  try {
    const { tier, minPrice, maxPrice, search } = req.query;
    let products = await db.products.find({ isActive: true });
    const allVariants = await db.variants.find();

    if (tier && tier !== 'All') {
      products = products.filter(p => p.tier.toLowerCase() === tier.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.basePrice >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.basePrice <= Number(maxPrice));
    }

    // Attach variants to products
    const enriched = products.map(p => {
      const pVariants = allVariants.filter(v => v.productId === p._id || v.productId === p.id);
      return {
        ...p,
        variants: pVariants
      };
    });

    return res.json(enriched);
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get Single Product by ID or Slug
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const variants = await db.variants.find({ productId: product._id });
    const salesChannels = await db.salesChannels.find({ productId: product._id });
    
    // Check painkiller tablets toggle for Emergency kit
    let whatInside = [...(product.whatInside || [])];
    if (product.tier === 'Emergency' && product.includePainkillerTablets) {
      if (!whatInside.some(i => i.item.toLowerCase().includes('painkiller'))) {
        whatInside.push({ item: '2 Painkiller tablets (SOS cramp relief)', count: 2, icon: 'Flame' });
      }
    } else if (product.tier === 'Emergency' && !product.includePainkillerTablets) {
      whatInside = whatInside.filter(i => !i.item.toLowerCase().includes('painkiller'));
    }

    // Get related products (other kits)
    const all = await db.products.find({ isActive: true });
    const related = all.filter(p => p._id !== product._id).slice(0, 3);

    return res.json({
      product: {
        ...product,
        whatInside
      },
      variants,
      salesChannels,
      related
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving product details' });
  }
});

// Admin: Add New Product
app.post('/api/products', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, tier, tagline, description, basePrice, comparePrice, features, whatInside, images, frames360, includePainkillerTablets } = req.body;
    if (!name || !tier || !basePrice) {
      return res.status(400).json({ message: 'Product name, tier, and base price are required.' });
    }

    const newProduct = await db.products.create({
      name,
      tier,
      tagline: tagline || '',
      description: description || '',
      basePrice: Number(basePrice),
      comparePrice: comparePrice ? Number(comparePrice) : Math.round(basePrice * 1.3),
      features: features || [],
      whatInside: whatInside || [],
      images: images || ['/images/products/regular-front.jpg'],
      frames360: frames360 || [],
      includePainkillerTablets: !!includePainkillerTablets,
      rating: 5.0,
      reviewsCount: 1,
      isActive: true,
      category: tier === 'Combo' ? 'combo' : 'kits'
    });

    // Seed default pack size variants
    const isCombo = tier === 'Combo';
    const packs = isCombo
      ? [{ label: '1 Complete Box', mult: 1, disc: 1.0 }]
      : [
          { label: '1 Kit', mult: 1, disc: 1.0 },
          { label: 'Pack of 2', mult: 2, disc: 0.95 },
          { label: 'Pack of 3', mult: 3, disc: 0.90 }
        ];

    const createdVariants = [];
    for (const p of packs) {
      const pPrice = Math.round(newProduct.basePrice * p.mult * p.disc);
      const v = await db.variants.create({
        productId: newProduct._id,
        productTier: newProduct.tier,
        packSize: p.label,
        price: pPrice,
        comparePrice: Math.round(pPrice * 1.3),
        stock: 50,
        sku: `PR-${newProduct.tier.slice(0, 3).toUpperCase()}-${p.mult}PK`,
        image: newProduct.images[0] || '/images/products/regular-front.jpg',
        isDefault: p.mult === 1
      });
      createdVariants.push(v);
    }

    // Seed default sales channels
    const platforms = [
      { name: 'Blinkit', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://blinkit.com/prn/periodready-' },
      { name: 'Zepto', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://zeptonow.com/search?q=periodready-' },
      { name: 'Instamart', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://swiggy.com/instamart/search?query=periodready-' },
      { name: 'Amazon', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Live', urlPrefix: 'https://amazon.in/dp/periodready-' },
      { name: 'Flipkart', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Coming Soon', urlPrefix: 'https://flipkart.com/periodready-' },
      { name: 'Myntra', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Coming Soon', urlPrefix: 'https://myntra.com/periodready-' }
    ];

    for (const plat of platforms) {
      await db.salesChannels.create({
        productId: newProduct._id,
        productName: newProduct.name,
        platform: plat.name,
        type: plat.type,
        badge: plat.tag,
        status: plat.defaultStatus,
        url: `${plat.urlPrefix}${newProduct._id}`,
        logo: ''
      });
    }

    return res.status(201).json({ product: newProduct, variants: createdVariants });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: 'Failed to create product' });
  }
});

// Admin: Update Product
app.put('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const updated = await db.products.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product' });
  }
});

// Admin: Delete Product
app.delete('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const deleted = await db.products.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    // Also remove variants
    const allVariants = await db.variants.find({ productId: req.params.id });
    for (const v of allVariants) {
      await db.variants.findByIdAndDelete(v._id);
    }
    return res.json({ message: 'Product and variants deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Admin: Update Variant Details (Price, Stock, SKU, Image)
app.put('/api/variants/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { price, stock, sku, image, colorName, colorHex, packSize } = req.body;
    const updates = {};
    if (price !== undefined) updates.price = Number(price);
    if (stock !== undefined) updates.stock = Number(stock);
    if (sku !== undefined) updates.sku = sku;
    if (image !== undefined) updates.image = image;
    if (colorName !== undefined) updates.colorName = colorName;
    if (colorHex !== undefined) updates.colorHex = colorHex;
    if (packSize !== undefined) updates.packSize = packSize;

    const updated = await db.variants.findByIdAndUpdate(req.params.id, updates);
    if (!updated) return res.status(404).json({ message: 'Variant not found' });
    return res.json({ message: 'Variant updated successfully', variant: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update variant' });
  }
});

// Admin: Add new variant to product
app.post('/api/products/:id/variants', authenticate, requireAdmin, async (req, res) => {
  try {
    const { colorName, colorHex, packSize, price, stock, sku, image } = req.body;
    const product = await db.products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newVar = await db.variants.create({
      productId: product._id,
      productTier: product.tier,
      colorName: colorName || 'Pastel Pink',
      colorHex: colorHex || '#F8BBD0',
      packSize: packSize || '1 Kit',
      price: Number(price) || product.basePrice,
      stock: Number(stock) || 50,
      sku: sku || `PR-CUSTOM-${Date.now()}`,
      image: image || product.images[0],
      isDefault: false
    });
    return res.status(201).json(newVar);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add variant' });
  }
});

// Admin: Delete Variant
app.delete('/api/variants/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await db.variants.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Variant deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete variant' });
  }
});

// ==========================================
// COUPON VALIDATION & MANAGEMENT
// ==========================================

// Validate Coupon
app.post('/api/coupons/validate', async (req, res) => {
  try {
    const { code, cartTotal, orderTotal } = req.body;
    const total = Number(cartTotal || orderTotal || 0);
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await db.coupons.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }

    if (total < (coupon.minOrderValue || 0)) {
      return res.status(400).json({
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrderValue}.`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discount,
      description: coupon.description
    });
  } catch (err) {
    return res.status(500).json({ message: 'Coupon verification error' });
  }
});

// ==========================================
// ORDERS & CHECKOUT FLOW
// ==========================================

// Create Order (Requires Customer Auth)
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    if (!shippingAddress || !shippingAddress.pincode || !shippingAddress.addressLine) {
      return res.status(400).json({ message: 'Complete delivery address is required.' });
    }

    // Pincode validation: 6 digits Indian PIN
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(shippingAddress.pincode.toString().trim())) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit Indian PIN code.' });
    }

    // Validate prices, check stock and reduce stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const variant = await db.variants.findById(item.variantId);
      if (!variant) {
        return res.status(400).json({ message: `Item variant not found: ${item.title}` });
      }
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.title} (${variant.colorName}, ${variant.packSize}). Only ${variant.stock} left.`
        });
      }

      // Decrement stock
      await db.variants.findByIdAndUpdate(variant._id, {
        stock: variant.stock - item.quantity
      });

      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;
      validatedItems.push({
        productId: item.productId,
        variantId: variant._id,
        title: item.title,
        variantInfo: `${variant.colorName} • ${variant.packSize}`,
        sku: variant.sku,
        price: variant.price,
        quantity: item.quantity,
        total: lineTotal,
        image: item.image || variant.image
      });
    }

    // Apply Coupon discount
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const cpn = await db.coupons.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
      if (cpn && subtotal >= cpn.minOrderValue) {
        if (cpn.discountType === 'percentage') {
          discount = Math.round((subtotal * cpn.discountValue) / 100);
          if (cpn.maxDiscount && discount > cpn.maxDiscount) discount = cpn.maxDiscount;
        } else {
          discount = cpn.discountValue;
        }
        appliedCoupon = cpn.code;
        // Increment usage count
        await db.coupons.findByIdAndUpdate(cpn._id, { usageCount: (cpn.usageCount || 0) + 1 });
      }
    }

    // Delivery charge: Free delivery on orders above ₹399, else ₹49
    const deliveryCharge = (subtotal - discount) >= 399 ? 0 : 49;
    // GST (5% for sanitary hygiene items)
    const taxableAmount = Math.max(0, subtotal - discount);
    const gst = Math.round(taxableAmount * 0.05);
    const grandTotal = taxableAmount + deliveryCharge + gst;

    const orderNumber = `PR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = await db.orders.create({
      orderNumber,
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || shippingAddress.phone,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
      subtotal,
      discount,
      couponCode: appliedCoupon,
      deliveryCharge,
      gst,
      total: grandTotal,
      status: paymentMethod === 'Cash on Delivery' ? 'Placed' : 'Confirmed',
      discreetPackagingNotice: 'Discreet Packaging Guaranteed: Ships in an unmarked plain box with zero product markings on the outside.',
      timeline: [
        {
          status: 'Placed',
          timestamp: new Date().toISOString(),
          note: `Order placed successfully via ${paymentMethod || 'Cash on Delivery'}.`
        },
        ...(paymentMethod !== 'Cash on Delivery' ? [{
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: 'Payment received & confirmed in test mode.'
        }] : [])
      ]
    });

    // Mock notification dispatch (Email & SMS)
    console.log(`[PeriodReady Notification] Mock SMS & Email sent to ${req.user.email} for Order #${newOrder.orderNumber}`);

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ message: 'Order checkout could not be completed.' });
  }
});

// Razorpay Test Mode Order Simulation
app.post('/api/orders/razorpay/create-order', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    // Simulated Razorpay Order Object
    const razorpayOrder = {
      id: `order_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      status: 'created'
    };
    return res.json(razorpayOrder);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to initiate Razorpay session' });
  }
});

// Get Logged In User's Orders
app.get('/api/orders/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await db.orders.find({ userId: req.user.id });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch customer orders' });
  }
});

// Get Single Order By ID
app.get('/api/orders/:id', authenticate, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Customers can only see their own orders, admin can see all
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this order.' });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// Reorder Items
app.post('/api/orders/:id/reorder', authenticate, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Original order not found' });
    return res.json({
      message: 'Items prepared for reorder',
      items: order.items
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reorder' });
  }
});

// ==========================================
// ADMIN DASHBOARD & MANAGEMENT ROUTES
// ==========================================

// Dashboard KPI Metrics & Charts
app.get('/api/admin/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const allOrders = await db.orders.find();
    const allProducts = await db.products.find();
    const allVariants = await db.variants.find();
    const allCustomers = await db.users.find({ role: 'customer' });
    const allEnquiries = await db.enquiries.find();

    const totalSales = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Today's orders
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Low stock variants (stock < 15)
    const lowStockAlerts = allVariants
      .filter(v => v.stock <= 25)
      .map(v => {
        const parent = allProducts.find(p => p._id === v.productId);
        return {
          ...v,
          productName: parent ? parent.name : 'Emergency Kit'
        };
      })
      .slice(0, 8);

    // Top Selling Products Count
    const productSalesMap = {};
    allOrders.forEach(o => {
      (o.items || []).forEach(it => {
        productSalesMap[it.title] = (productSalesMap[it.title] || 0) + it.quantity;
      });
    });

    const topProducts = Object.keys(productSalesMap).map(title => ({
      name: title,
      sold: productSalesMap[title]
    })).sort((a, b) => b.sold - a.sold).slice(0, 5);

    // Sales by day (last 7 days)
    const salesLast7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(dateKey));
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      salesLast7Days.push({
        date: dateKey,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue,
        ordersCount: dayOrders.length
      });
    }

    return res.json({
      totalSales,
      totalOrders: allOrders.length,
      todaySales,
      todayOrdersCount: todayOrders.length,
      totalCustomers: allCustomers.length,
      pendingEnquiries: allEnquiries.filter(e => e.status === 'New').length,
      lowStockAlerts,
      topProducts,
      salesLast7Days,
      recentOrders: allOrders.slice(0, 6)
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return res.status(500).json({ message: 'Failed to retrieve dashboard analytics' });
  }
});

// Admin: View All Orders (with filters)
app.get('/api/admin/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let orders = await db.orders.find();

    if (status && status !== 'All') {
      orders = orders.filter(o => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q))
      );
    }

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load orders' });
  }
});

// Admin: Update Order Status
app.put('/api/admin/orders/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status specified.' });
    }

    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const timeline = order.timeline || [];
    timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status} by admin.`
    });

    const updated = await db.orders.findByIdAndUpdate(req.params.id, {
      status,
      timeline
    });

    return res.json({ message: `Order status updated to ${status}`, order: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Admin: Customers List
app.get('/api/admin/customers', authenticate, requireAdmin, async (req, res) => {
  try {
    const customers = await db.users.find({ role: 'customer' });
    const orders = await db.orders.find();

    const result = customers.map(c => {
      const custOrders = orders.filter(o => o.userId === c._id);
      const totalSpent = custOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        joinedDate: c.createdAt,
        ordersCount: custOrders.length,
        totalSpent
      };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list customers' });
  }
});

// Admin: Export Orders to CSV
app.get('/api/admin/reports/csv', authenticate, requireAdmin, async (req, res) => {
  try {
    const orders = await db.orders.find();
    let csv = 'Order ID,Date,Customer Name,Email,Phone,Items,Subtotal,Discount,GST,Total,Status,Payment Method\n';

    orders.forEach(o => {
      const itemDesc = (o.items || []).map(i => `${i.title} (${i.variantInfo}) x${i.quantity}`).join('; ');
      const cleanDesc = `"${itemDesc.replace(/"/g, '""')}"`;
      csv += `${o.orderNumber},${o.createdAt},"${o.customerName}","${o.customerEmail}","${o.customerPhone}",${cleanDesc},${o.subtotal},${o.discount},${o.gst},${o.total},${o.status},"${o.paymentMethod}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="PeriodReady_Orders_Report.csv"');
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate CSV export' });
  }
});

// Admin: Coupons CRUD
app.get('/api/admin/coupons', authenticate, requireAdmin, async (req, res) => {
  const coupons = await db.coupons.find();
  res.json(coupons);
});

app.post('/api/admin/coupons', authenticate, requireAdmin, async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ message: 'Code and discount value are required' });
    }
    const created = await db.coupons.create({
      code: code.trim().toUpperCase(),
      description: description || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      isActive: true,
      usageCount: 0
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create coupon' });
  }
});

app.put('/api/admin/coupons/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const updated = await db.coupons.findByIdAndUpdate(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update coupon' });
  }
});

app.delete('/api/admin/coupons/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await db.coupons.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Coupon deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

// ==========================================
// SALES CHANNELS ROUTES (Available Everywhere)
// ==========================================

// Public: Get Sales Channels (optionally filtered by productId)
app.get('/api/sales-channels', async (req, res) => {
  try {
    const { productId } = req.query;
    const query = productId ? { productId } : {};
    let channels = await db.salesChannels.find(query);

    // If no specific productId requested, deduplicate by platform so each platform appears only ONCE
    if (!productId) {
      const map = new Map();
      channels.forEach(c => {
        if (!map.has(c.platform)) {
          map.set(c.platform, c);
        }
      });
      channels = Array.from(map.values());
    }

    return res.json(channels);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch sales channels' });
  }
});

// Admin: Get All Sales Channels
app.get('/api/admin/sales-channels', authenticate, requireAdmin, async (req, res) => {
  try {
    const channels = await db.salesChannels.find();
    return res.json(channels);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch sales channels' });
  }
});

// Admin: Update Sales Channel Status / URL / Logo
app.put('/api/admin/sales-channels/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { url, status, logo } = req.body;
    const updated = await db.salesChannels.findByIdAndUpdate(req.params.id, {
      ...(url !== undefined && { url }),
      ...(status !== undefined && { status }),
      ...(logo !== undefined && { logo })
    });
    if (!updated) {
      return res.status(404).json({ message: 'Sales channel not found' });
    }
    return res.json({ message: 'Sales channel updated', channel: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update sales channel' });
  }
});

// Admin: Contact Messages Management
app.get('/api/admin/enquiries', authenticate, requireAdmin, async (req, res) => {
  const enquiries = await db.enquiries.find();
  res.json(enquiries);
});

app.put('/api/admin/enquiries/:id', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const updated = await db.enquiries.findByIdAndUpdate(req.params.id, { status });
  res.json(updated);
});

// ==========================================
// PUBLIC CONTACT MESSAGE SUBMISSION
// ==========================================

// General Contact Form
app.post('/api/enquiries/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    const record = await db.enquiries.create({
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      status: 'New'
    });
    return res.status(201).json({ message: 'Thank you for reaching out! We will respond within 24 hours.', enquiryId: record._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit contact enquiry' });
  }
});

// ==========================================
// PAGES & CONTENT MANAGEMENT (ABOUT PAGE, ETC.)
// ==========================================

const DEFAULT_ABOUT_CONTENT = {
  _id: 'about_page',
  seoTitle: 'About PeriodReady | Our Story, Kits & Quality Promise',
  seoDescription: 'Learn about PeriodReady: discreet menstrual emergency kits for college & PG students and working professionals. Thoughtfully packaged, pocket-friendly, and ready in minutes.',
  problemSection: {
    badge: 'The Problem',
    title: 'Periods Often Arrive Unexpectedly',
    paragraph: 'Periods often arrive unexpectedly: in a lecture, at the office, on a commute or while travelling. The nearest store may be far or closed, buying pads feels awkward, and one surprise can ruin a whole day.'
  },
  whatIsSection: {
    badge: 'What PeriodReady Is',
    title: 'A Stylish, Discreet, Ready-to-Use Kit',
    paragraph: 'A stylish, discreet, ready-to-use kit designed for exactly that moment. Everything needed comes in one small pack that looks like a normal pouch, so you are never caught unprepared.'
  },
  whyItMatters: [
    {
      title: 'Saves Time',
      description: 'No last-minute store search. In an emergency, you can order on a quick-commerce app and get it in about 10 minutes (where available).'
    },
    {
      title: 'Saves Stress & Embarrassment',
      description: 'Discreet, aesthetic look with 100% plain, unmarked delivery packaging.'
    },
    {
      title: 'Saves Money',
      description: 'Low entry price and a combo cheaper than buying all three kits separately.'
    },
    {
      title: 'Everything in One Grab',
      description: 'No running to buy five different things. Complete hygiene essentials in a single pack.'
    },
    {
      title: 'Stay Confident & Keep Going',
      description: 'Stay confident and keep going with your day, uninterrupted.'
    }
  ],
  ourPromise: {
    title: 'Our Promise',
    statement: 'Quality products, honest pricing, discreet delivery.',
    tagline: 'Be Ready. Feel Confident. Keep Going.'
  }
};

// Public & Admin: Get About Page Content
app.get(['/api/content/about', '/api/admin/content/about', '/api/admin/content'], async (req, res) => {
  try {
    let content = await db.content.findById('about_page');
    if (!content) {
      content = await db.content.create(DEFAULT_ABOUT_CONTENT);
    }
    return res.json(content);
  } catch (err) {
    return res.json(DEFAULT_ABOUT_CONTENT);
  }
});

// Admin: Update About Page Content
app.put('/api/admin/content/about', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await db.content.findById('about_page');
    let updated;
    if (existing) {
      updated = await db.content.findByIdAndUpdate('about_page', req.body);
    } else {
      updated = await db.content.create({ _id: 'about_page', ...req.body });
    }
    return res.json({ message: 'About page content updated successfully', content: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update about page content' });
  }
});

// Public static assets for product images from client/public
const clientPublicDir = path.join(__dirname, '..', 'client', 'public');
if (fs.existsSync(clientPublicDir)) {
  app.use(express.static(clientPublicDir));
}

// Serve Client production build if available
const clientDistDir = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` PeriodReady Full-Stack Server running!`);
  console.log(` Local Laptop URL:  http://localhost:${PORT}`);
  console.log(` Mobile / LAN URL:  http://192.168.0.109:${PORT}`);
  console.log(`===============================================`);
});
