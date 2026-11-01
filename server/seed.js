const bcrypt = require('bcryptjs');
const db = require('./db');



async function seed() {
  console.log('--- Seeding PeriodReady Database (4 Specific Products, Sales Channels) ---');

  // Clear existing collections
  await db.users.clear();
  await db.products.clear();
  await db.variants.clear();
  await db.orders.clear();
  await db.coupons.clear();
  await db.enquiries.clear();
  await db.addresses.clear();
  await db.salesChannels.clear();
  await db.content.clear();

  // 1. Seed Users (Admin & Customer)
  const adminSalt = await bcrypt.genSalt(10);
  const adminHashed = await bcrypt.hash('Admin@123', adminSalt);

  const customerSalt = await bcrypt.genSalt(10);
  const customerHashed = await bcrypt.hash('Customer@123', customerSalt);

  const adminUser = await db.users.create({
    _id: 'usr_admin_01',
    name: 'PeriodReady Admin',
    email: 'admin@periodready.com',
    password: adminHashed,
    phone: '+91 9876543210',
    role: 'admin'
  });

  const customerUser = await db.users.create({
    _id: 'usr_cust_01',
    name: 'Ananya Sharma',
    email: 'customer@periodready.com',
    password: customerHashed,
    phone: '+91 9123456789',
    role: 'customer'
  });

  await db.addresses.create({
    _id: 'addr_01',
    userId: customerUser._id,
    name: 'Ananya Sharma',
    phone: '+91 9123456789',
    addressLine: 'Flat 402, Lotus Residency, 4th Cross Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100',
    isDefault: true
  });

  console.log('✓ Users & Addresses seeded');

  // 2. Seed 4 Products
  const productsData = [
    {
      _id: 'prod_regular',
      id: 'prod_regular',
      name: 'Regular Period Kit',
      tier: 'Regular',
      tagline: 'daily comfort',
      description: 'Your essential everyday hygiene companion designed for college and PG students and working professionals. Features balanced day-to-day absorbency and complete intimate hygiene essentials.',
      basePrice: 179,
      comparePrice: 229,
      rating: 4.8,
      reviewsCount: 428,
      isActive: true,
      category: 'kits',
      quickCommerceAvailable: true,
      frontImage: '/images/products/regular-front.jpg',
      insideImage: '/images/products/regular-inside.jpg',
      images: ['/images/products/regular-front.jpg', '/images/products/regular-inside.jpg'],
            features: [
        '3 x Premium XL Sanitary Pads (High absorption for daily comfort)',
        '2 x Breathable Panty Liners for light spotting & fresh comfort',
        '1 x Mini Hand Sanitizer for instant on-the-go hygiene',
        '1 x Set of Eco-Friendly Disposal Bags for clean, odor-free disposal',
        '1 x Educational Mini-Period Guide Card with cycle care tips'
      ],
      whatInside: [
        { item: 'Premium XL Sanitary Pads (High absorption for daily comfort)', count: 3, icon: 'ShieldCheck' },
        { item: 'Breathable Panty Liners', count: 2, icon: 'Feather' },
        { item: 'Mini Hand Sanitizer', count: 1, icon: 'Star' },
        { item: 'Set of Eco-Friendly Disposal Bags', count: 1, icon: 'Package' },
        { item: 'Educational Mini-Period Guide Card', count: 1, icon: 'HelpCircle' }
      ]
    },
    {
      _id: 'prod_travel',
      id: 'prod_travel',
      name: 'Travel Period Kit (No-Wash Version)',
      tier: 'Travel',
      tagline: 'hassle-free travel',
      description: 'Engineered specifically for flights, long bus rides, road trips, and hectic work travels. Zero water or washing needed. Features on-the-spot cramp relief roll-on, emergency clothing stain remover spray, high-absorbency pads, and gentle intimate wet wipes.',
      basePrice: 249,
      comparePrice: 299,
      rating: 4.9,
      reviewsCount: 560,
      isActive: true,
      category: 'kits',
      quickCommerceAvailable: true,
      frontImage: '/images/products/travel-front.jpg',
      insideImage: '/images/products/travel-inside.jpg',
      images: ['/images/products/travel-front.jpg', '/images/products/travel-inside.jpg'],
            features: [
        '1 x Cramp Pain Relief Roll-on (Mini travel format for instant relief)',
        '1 x Instant Stain Remover Spray/Pen for clothing emergencies',
        '1 x Set of Disposable Menstrual Cups / Travel Pads for all-day security',
        '1 x Pocket Pack of Intimate Wet Wipes (10 counts) for effortless hygiene',
        'Durable inner cardboard box designed for luggage & backpacks',
        'Delivered in ~10 minutes on Blinkit, Zepto, and Instamart'
      ],
      whatInside: [
        { item: 'Cramp Pain Relief Roll-on (Mini travel format for instant relief)', count: 1, icon: 'Flame' },
        { item: 'Instant Stain Remover Spray/Pen', count: 1, icon: 'Star' },
        { item: 'Set of Disposable Menstrual Cups / Travel Pads', count: 1, icon: 'ShieldCheck' },
        { item: 'Pocket Pack of Intimate Wet Wipes (10 counts)', count: 1, icon: 'CheckCircle' }
      ]
    },
    {
      _id: 'prod_emergency',
      id: 'prod_emergency',
      name: 'Emergency Period Kit (Compact Saviour Pouch)',
      tier: 'Emergency',
      tagline: 'compact saviour pouch',
      description: 'The ultra-compact emergency kit designed to eliminate sudden period panic wherever you are. Fits seamlessly into tiny handbags, jacket pockets, and desk corners. Quick, discreet relief in 10 minutes flat.',
      basePrice: 49,
      comparePrice: 79,
      rating: 4.9,
      reviewsCount: 312,
      isActive: true,
      category: 'kits',
      quickCommerceAvailable: true,
      includePainkillerTablets: true,
      frontImage: '/images/products/emergency-front.jpg',
      insideImage: '/images/products/emergency-inside.jpg',
      images: ['/images/products/emergency-front.jpg', '/images/products/emergency-inside.jpg'],
            features: [
        '1 x Premium Sanitary Pad with ultra-soft organic cotton',
        '2 x Compressed Coin Tissues (expand instantly into refreshing wet wipes)',
        '2 x Approved Painkiller Tablets (For quick unexpected relief)',
        '1 x Ultra-Compact Travel Saviour Pouch',
        'Delivered in 10 minutes on Blinkit, Zepto & Instamart',
        '100% Discreet outer box with zero product markings'
      ],
      whatInside: [
        { item: 'Premium Sanitary Pad', count: 1, icon: 'ShieldCheck' },
        { item: 'Compressed Coin Tissues', count: 2, icon: 'Star' },
        { item: 'Approved Painkiller Tablets (For quick unexpected relief)', count: 2, icon: 'ShieldCheck' },
        { item: 'Ultra-Compact Travel Saviour Pouch', count: 1, icon: 'Package' }
      ]
    },
    {
      _id: 'prod_combo_box',
      id: 'prod_combo_box',
      name: 'Over-all Master Combo Box',
      tier: 'Combo',
      tagline: 'all three kits in a premium navy-blue mailer box with custom sticker and tissue wrapping',
      description: 'The ultimate period preparedness bundle! Receive all three kits together: Regular Period Kit, Travel Period Kit, and Emergency Period Kit, presented in a luxury navy-blue mailer box with custom PeriodReady branding, tissue wrapping, and sealed stickers. Save ₹78 compared to buying individually.',
      basePrice: 399,
      comparePrice: 477,
      rating: 5.0,
      reviewsCount: 640,
      isActive: true,
      category: 'combo',
      quickCommerceAvailable: true,
      frontImage: '/images/products/trio-combo.jpg',
      insideImage: '/images/products/combo-inside.jpg',
      images: ['/images/products/trio-combo.jpg', '/images/products/combo-inside.jpg'],
            features: [
        'Includes 1 Full Regular Period Kit (with mini hot water bag)',
        'Includes 1 Full Travel Period Kit (no-wash version with roll-on & stain spray)',
        'Includes 1 Full Emergency Period Kit (compact saviour pouch)',
        'Beautifully packed inside a Premium Navy Blue Mailer Box with Custom Wrapping & Sticker Seal (Perfect for gifting or personal stocking)',
        'Best Value: Save ₹78 versus buying each kit separately (₹179 + ₹249 + ₹49 = ₹477)',
        'Delivered in 10 minutes on Blinkit, Zepto & Instamart'
      ],
      whatInside: [
        { item: 'Full Regular Period Kit', count: 'Includes 1', icon: 'Package' },
        { item: 'Full Travel Period Kit', count: 'Includes 1', icon: 'Flame' },
        { item: 'Full Emergency Period Kit', count: 'Includes 1', icon: 'ShieldCheck' },
        { item: 'Beautifully packed inside a Premium Navy Blue Mailer Box with Custom Wrapping & Sticker Seal (Perfect for gifting or personal stocking)', count: 'Master Packaging', icon: 'Package' }
      ]
    }
  ];

  await db.products.insertMany(productsData);
  console.log('✓ 4 Products seeded with exact specifications');

  // 3. Seed Pack Size Variants (1 kit / pack of 2 / pack of 3 for kits a-c, 1 variant for combo)
  const variantsData = [
    // Regular Kit Variants
    {
      _id: 'var_reg_1',
      productId: 'prod_regular',
      packSize: '1 Kit',
      price: 179,
      comparePrice: 229,
      stock: 100,
      sku: 'PR-REG-1KIT',
      image: '/images/products/regular-front.jpg',
      isDefault: true
    },
    {
      _id: 'var_reg_2',
      productId: 'prod_regular',
      packSize: 'Pack of 2',
      price: 349,
      comparePrice: 458,
      stock: 60,
      sku: 'PR-REG-2PACK',
      image: '/images/products/regular-front.jpg',
      isDefault: false
    },
    {
      _id: 'var_reg_3',
      productId: 'prod_regular',
      packSize: 'Pack of 3',
      price: 499,
      comparePrice: 687,
      stock: 40,
      sku: 'PR-REG-3PACK',
      image: '/images/products/regular-front.jpg',
      isDefault: false
    },

    // Travel Kit Variants
    {
      _id: 'var_trv_1',
      productId: 'prod_travel',
      packSize: '1 Kit',
      price: 249,
      comparePrice: 299,
      stock: 80,
      sku: 'PR-TRV-1KIT',
      image: '/images/products/travel-front.jpg',
      isDefault: true
    },
    {
      _id: 'var_trv_2',
      productId: 'prod_travel',
      packSize: 'Pack of 2',
      price: 479,
      comparePrice: 598,
      stock: 50,
      sku: 'PR-TRV-2PACK',
      image: '/images/products/travel-front.jpg',
      isDefault: false
    },
    {
      _id: 'var_trv_3',
      productId: 'prod_travel',
      packSize: 'Pack of 3',
      price: 699,
      comparePrice: 897,
      stock: 30,
      sku: 'PR-TRV-3PACK',
      image: '/images/products/travel-front.jpg',
      isDefault: false
    },

    // Emergency Kit Variants
    {
      _id: 'var_emg_1',
      productId: 'prod_emergency',
      packSize: '1 Kit',
      price: 49,
      comparePrice: 79,
      stock: 200,
      sku: 'PR-EMG-1KIT',
      image: '/images/products/emergency-front.jpg',
      isDefault: true
    },
    {
      _id: 'var_emg_2',
      productId: 'prod_emergency',
      packSize: 'Pack of 2',
      price: 95,
      comparePrice: 158,
      stock: 120,
      sku: 'PR-EMG-2PACK',
      image: '/images/products/emergency-front.jpg',
      isDefault: false
    },
    {
      _id: 'var_emg_3',
      productId: 'prod_emergency',
      packSize: 'Pack of 3',
      price: 139,
      comparePrice: 237,
      stock: 80,
      sku: 'PR-EMG-3PACK',
      image: '/images/products/emergency-front.jpg',
      isDefault: false
    },

    // Complete Combo Box Variant (Single Variant)
    {
      _id: 'var_combo_1',
      productId: 'prod_combo_box',
      packSize: '1 Complete Box',
      price: 399,
      comparePrice: 477,
      stock: 75,
      sku: 'PR-COMBO-BOX',
      image: '/images/products/trio-combo.jpg',
      isDefault: true
    }
  ];

  await db.variants.insertMany(variantsData);
  console.log('✓ Pack size variants seeded');

  // 4. Seed Sales Channels (Blinkit, Zepto, Instamart, Amazon, Flipkart, Myntra)
  const platforms = [
    { name: 'Blinkit', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://blinkit.com/prn/periodready-' },
    { name: 'Zepto', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://zeptonow.com/search?q=periodready-' },
    { name: 'Instamart', type: 'quick-commerce', tag: '10-Minute Delivery', defaultStatus: 'Live', urlPrefix: 'https://swiggy.com/instamart/search?query=periodready-' },
    { name: 'Amazon', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Live', urlPrefix: 'https://amazon.in/dp/periodready-' },
    { name: 'Flipkart', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Coming Soon', urlPrefix: 'https://flipkart.com/periodready-' },
    { name: 'Myntra', type: 'marketplace', tag: 'Marketplace', defaultStatus: 'Coming Soon', urlPrefix: 'https://myntra.com/periodready-' }
  ];

  const salesChannelsData = [];
  for (const prod of productsData) {
    for (const plat of platforms) {
      const slug = prod._id.replace('prod_', '');
      salesChannelsData.push({
        _id: `sc_${slug}_${plat.name.toLowerCase()}`,
        productId: prod._id,
        productName: prod.name,
        platform: plat.name,
        type: plat.type,
        badge: plat.tag,
        status: plat.defaultStatus, // 'Live' | 'Coming Soon' | 'Hidden'
        url: `${plat.urlPrefix}${slug}`,
        logo: ''
      });
    }
  }

  await db.salesChannels.insertMany(salesChannelsData);
  console.log('✓ Sales Channels seeded for all 4 products');

  // 5. Seed Coupons
  await db.coupons.insertMany([
    {
      _id: 'coup_student10',
      code: 'STUDENT10',
      description: '10% off for college and PG students & professionals',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 99,
      maxDiscountAmount: 100,
      isActive: true
    },
    {
      _id: 'coup_ready50',
      code: 'READY50',
      description: 'Flat ₹50 off on orders above ₹300',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 300,
      isActive: true
    }
  ]);
  console.log('✓ Coupons seeded');

  // 6. Seed Sample Orders
  await db.orders.create({
    _id: 'ord_demo_101',
    orderNumber: 'PR-ORD-1001',
    userId: customerUser._id,
    customerName: customerUser.name,
    customerEmail: customerUser.email,
    customerPhone: customerUser.phone,
    items: [
      {
        productId: 'prod_regular',
        variantId: 'var_reg_1',
        name: 'Regular Period Kit',
        packSize: '1 Kit',
        price: 179,
        quantity: 1,
        image: '/images/products/regular-front.jpg'
      }
    ],
    pricing: {
      subtotal: 179,
      discount: 18,
      couponCode: 'STUDENT10',
      deliveryCharge: 0,
      gst: 29,
      total: 190
    },
    shippingAddress: {
      name: 'Ananya Sharma',
      phone: '+91 9123456789',
      addressLine: 'Flat 402, Lotus Residency, 4th Cross Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Delivered',
    trackingTimeline: [
      { status: 'Placed', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 86400000 * 2.8).toISOString() },
      { status: 'Packed', timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString() },
      { status: 'Shipped', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: 'Delivered', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  });

  // 7. Seed Sample Contact Enquiry
  await db.enquiries.create({
    _id: 'enq_01',
    name: 'Pooja Verma',
    email: 'pooja.verma@gmail.com',
    phone: '+91 9888877777',
    subject: 'Question regarding Emergency Kit pouch size',
    message: 'Does the compact saviour pouch fit comfortably into a standard laptop sleeve or waist bag?',
    status: 'pending',
    type: 'contact',
    createdAt: new Date().toISOString()
  });

  console.log('✓ Enquiries seeded');

  // 8. Seed About Page Content
  await db.content.create({
    _id: 'about_page',
    seoTitle: 'About PeriodReady | Our Story, Emergency Kits & Quality Promise',
    seoDescription: 'Learn about PeriodReady: discreet menstrual emergency kits for college & PG students and working professionals. Thoughtfully packaged, pocket-friendly, and ready in minutes.',
    problemSection: {
      badge: 'The Problem',
      title: 'Periods Often Arrive Unexpectedly',
      paragraph: 'Periods often arrive unexpectedly: in a lecture, at the office, on a commute or while travelling. The nearest store may be far or closed, buying pads feels awkward, and one surprise can ruin a whole day.'
    },
    whatIsSection: {
      badge: 'What PeriodReady Is',
      title: 'A Stylish, Discreet, Ready-to-Use Kit',
      paragraph: 'PeriodReady is a stylish, discreet, ready-to-use kit designed for exactly that moment. Everything needed comes in one small pack that looks like a normal pouch, so you are never caught unprepared.'
    },
    whyItMatters: [
      {
        title: 'Saves Time',
        description: 'No last-minute store search, and in an emergency you can order on a quick-commerce app and get it in about 10 minutes (where available).'
      },
      {
        title: 'Saves Stress & Embarrassment',
        description: 'Discreet look, plain unbranded packaging with zero awkward product labels.'
      },
      {
        title: 'Saves Money',
        description: 'Low entry price starting at just ₹49, and a combo cheaper than buying all three kits separately.'
      },
      {
        title: 'Everything in One Grab',
        description: 'No running to buy five different things. All hygiene and comfort essentials together in one pack.'
      },
      {
        title: 'Stay Confident & Keep Going',
        description: 'Stay confident and keep going with your day without hesitation.'
      }
    ],
    ourPromise: {
      title: 'Our Promise',
      statement: 'Quality products, honest pricing, discreet delivery.',
      tagline: 'Be Ready. Feel Confident. Keep Going.'
    }
  });

  console.log('✓ About Page content seeded');
  console.log('============================================================');
  console.log('  Database Seeding Completed Successfully!                  ');
  console.log('  Demo Admin: admin@periodready.com / Admin@123             ');
  console.log('  Demo Customer: customer@periodready.com / Customer@123    ');
  console.log('============================================================');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seed;
