// Seed data generator for PeriodReady
// Generates 4 Complete Weekly Sales Milestones (Total 4,699 Sales):
// 1. Week 1 baseline sales: 50 orders (steady launch baseline)
// 2. Week 2 Diwali Mega Campaign: EXACTLY 4,484 sales (festive gifting surge)
// 3. Week 3 Expansion: EXACTLY 75 sales (campus PG adoption)
// 4. Week 4 Active Growth: EXACTLY 90 sales (10-min emergency rapid scale)

export function generateSeedOrders() {
  const products = [
    { id: 'emergency-kit', name: 'Emergency Period Kit (Compact Saviour Pouch)', price: 49, cost: 18 },
    { id: 'regular-kit', name: 'Regular Period Kit', price: 179, cost: 65 },
    { id: 'travel-kit', name: 'Travel Period Kit (No-Wash Version)', price: 249, cost: 95 },
    { id: 'master-combo', name: 'Over-all Master Combo Box', price: 399, cost: 150 },
    { id: 'hot-water-bag', name: 'Cozy Knit Hot Water Bag', price: 349, cost: 130 }
  ];

  const bagColors = ['Light Pink', 'Light Blue', 'Light Lavender', 'Light Green', 'White', 'Light Orange', 'Pista Green'];

  const customerPool = [
    { name: 'Pooja Sharma', phone: '+91 98260 12345', email: 'pooja.sharma@gmail.com', area: 'Vijay Nagar Scheme 54, Indore' },
    { name: 'Sneha Patel', phone: '+91 98271 23456', email: 'sneha.patel@gmail.com', area: 'Bhawarkua Girls Hostel, Indore' },
    { name: 'Ananya Verma', phone: '+91 94250 34567', email: 'ananya.verma@davv.ac.in', area: 'IET-DAVV Campus, Indore' },
    { name: 'Riya Jain', phone: '+91 98930 45678', email: 'riya.jain@gmail.com', area: 'New Palasia, Near 56 Dukan, Indore' },
    { name: 'Priya Gupta', phone: '+91 97555 56789', email: 'priya.gupta@outlook.com', area: 'Saket Nagar, Near Anand Bazaar, Indore' },
    { name: 'Tanvi Agrawal', phone: '+91 99812 67890', email: 'tanvi.agrawal@gmail.com', area: 'Geeta Bhawan Girls PG, Indore' },
    { name: 'Megha Tiwari', phone: '+91 98263 78901', email: 'megha.tiwari@gmail.com', area: 'Annapurna Road, Indore' },
    { name: 'Kavya Joshi', phone: '+91 98934 89012', email: 'kavya.joshi@medicaps.ac.in', area: 'Medi-Caps University Hostel, Rau, Indore' },
    { name: 'Simran Khan', phone: '+91 94252 90123', email: 'simran.khan@gmail.com', area: 'Old Palasia, Indore' },
    { name: 'Divya Rathore', phone: '+91 98275 01234', email: 'divya.rathore@gmail.com', area: 'LIG Colony, Indore' },
    { name: 'Shreya Malviya', phone: '+91 99814 12340', email: 'shreya.m@gmail.com', area: 'Silicon City, Rau, Indore' },
    { name: 'Isha Choudhary', phone: '+91 98269 23451', email: 'isha.c@prestige.ac.in', area: 'Prestige Institute Campus, Vijay Nagar, Indore' },
    { name: 'Aditi Dubey', phone: '+91 97552 34562', email: 'aditi.dubey@gmail.com', area: 'MR 10, Near Brilliant Convention, Indore' },
    { name: 'Nandini Yadav', phone: '+91 98938 45673', email: 'nandini.y@gmail.com', area: 'Bhawarkua Square, Indore' },
    { name: 'Aayushi Soni', phone: '+91 94258 56784', email: 'aayushi.soni@gmail.com', area: 'Sapna Sangeeta Road, Indore' },
    { name: 'Kritika Sen', phone: '+91 98278 67895', email: 'kritika.sen@gmail.com', area: 'Bengali Square, Kanadia Road, Indore' },
    { name: 'Deepika Chouhan', phone: '+91 99819 78906', email: 'deepika.c@gmail.com', area: 'Airport Road, Kalani Nagar, Indore' },
    { name: 'Suhani Patidar', phone: '+91 98266 89017', email: 'suhani.p@gmail.com', area: 'Ranjeet Hanuman Road, Indore' },
    { name: 'Muskan Mittal', phone: '+91 98932 90128', email: 'muskan.mittal@gmail.com', area: 'Chappan Dukan area, Indore' },
    { name: 'Bhavna Parmar', phone: '+91 97559 01239', email: 'bhavna.parmar@gmail.com', area: 'South Tukoganj, Indore' },
    { name: 'Neelam Joshi', phone: '+91 98261 45678', email: 'neelam.j@sgsits.ac.in', area: 'SGSITS Hostel, Vallabh Nagar, Indore' },
    { name: 'Mansi Kulkarni', phone: '+91 94254 78901', email: 'mansi.k@gmail.com', area: 'Chhatribagh, Indore' },
    { name: 'Prachi Saxena', phone: '+91 97551 23450', email: 'prachi.s@acropolis.in', area: 'Acropolis Campus, Bypass Road, Indore' },
    { name: 'Khushboo Jain', phone: '+91 98935 67891', email: 'khushboo.j@gmail.com', area: 'Treasure Island Mall area, MG Road, Indore' },
    { name: 'Garima Sharma', phone: '+91 99815 89012', email: 'garima.sharma@pimr.ac.in', area: 'PIMR Scheme 74, Vijay Nagar, Indore' },
    { name: 'Ritika Porwal', phone: '+91 98272 34567', email: 'ritika.porwal@gmail.com', area: 'Lokmanya Nagar, Indore' },
    { name: 'Akanksha Dave', phone: '+91 94255 67890', email: 'akanksha.d@gmail.com', area: 'Khandwa Road, Near IT Park, Indore' },
    { name: 'Vanshika Solanki', phone: '+91 97553 89012', email: 'vanshika.s@gmail.com', area: 'Bada Ganpati, Malharganj, Indore' },
    { name: 'Disha Mehta', phone: '+91 98939 12345', email: 'disha.mehta@gmail.com', area: 'Scheme 78, Aranya Nagar, Indore' },
    { name: 'Yashika Bairagi', phone: '+91 99817 23456', email: 'yashika.b@medicaps.ac.in', area: 'CAT Road, Rau, Indore' }
  ];

  const orders = [];
  const customersMap = new Map();

  const now = new Date();
  let orderCounter = 1001;

  // ----------------------------------------------------
  // WEEK 1: Steady baseline sales (Days -27 to -21)
  // EXACTLY 50 sales across 7 days
  // ----------------------------------------------------
  const week1DailyCounts = [6, 8, 5, 9, 7, 8, 7]; // sum = 50

  for (let dayOffset = 27; dayOffset >= 21; dayOffset--) {
    const dayIdx = 27 - dayOffset;
    const count = week1DailyCounts[dayIdx];

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    for (let i = 0; i < count; i++) {
      const cust = customerPool[(orderCounter + i) % customerPool.length];
      
      const orderDate = new Date(targetDate);
      orderDate.setHours(9 + ((i * 2) % 13), (i * 17) % 60, (i * 23) % 60);

      const randProd = (i % 3 === 0) 
        ? products[0] // Emergency Kit
        : (i % 3 === 1) 
          ? products[1] // Regular Kit
          : products[4]; // Hot Water Bag

      const isBag = randProd.id === 'hot-water-bag';
      const bagColor = isBag ? bagColors[i % bagColors.length] : null;

      const items = [
        {
          id: randProd.id,
          name: isBag ? `${randProd.name} (${bagColor})` : randProd.name,
          price: randProd.price,
          quantity: 1,
          color: bagColor
        }
      ];

      const isPaidOnline = (i % 4 !== 0);

      const orderId = `PR-W1-${orderCounter++}`;
      const orderRecord = {
        id: orderId,
        customer_id: `CUST-${cust.email.split('@')[0]}`,
        customer: cust.name,
        name: cust.name,
        phone: cust.phone,
        email: cust.email,
        address: `${cust.area}, Indore 452001`,
        items,
        total: randProd.price,
        status: 'Delivered',
        payment_method: isPaidOnline ? 'online' : 'cod',
        paid: true,
        via: 'Week 1 Baseline',
        reference: isPaidOnline ? `UPI-W1-${Math.floor(100000 + Math.random() * 900000)}` : null,
        campaign: 'Week 1 Baseline',
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString()
      };

      orders.push(orderRecord);

      customersMap.set(cust.email, {
        id: `CUST-${cust.email.split('@')[0]}`,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        created_at: orderDate.toISOString(),
        last_order_at: orderDate.toISOString()
      });
    }
  }

  // ----------------------------------------------------
  // WEEK 2: DIWALI MEGA CAMPAIGN (Days -20 to -14)
  // EXACTLY 4,484 Sales (Gifting Master Combos & Hot Water Bags)
  // ----------------------------------------------------
  const diwaliDailyCounts = [500, 600, 750, 940, 696, 548, 450]; // sum = 4484

  for (let dayOffset = 20; dayOffset >= 14; dayOffset--) {
    const dayIdx = 20 - dayOffset;
    const count = diwaliDailyCounts[dayIdx];

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    for (let i = 0; i < count; i++) {
      const cust = customerPool[(orderCounter + i) % customerPool.length];
      
      const orderDate = new Date(targetDate);
      orderDate.setHours(8 + ((i * 3) % 15), (i * 11) % 60, (i * 37) % 60);

      let chosenProduct;
      const r = (i * 7) % 100;
      if (r < 40) {
        chosenProduct = products[3]; // Master Combo Box (₹399)
      } else if (r < 65) {
        chosenProduct = products[4]; // Cozy Knit Hot Water Bag (₹349)
      } else if (r < 85) {
        chosenProduct = products[1]; // Regular Kit (₹179)
      } else {
        chosenProduct = products[0]; // Emergency Kit (₹49)
      }

      const isBag = chosenProduct.id === 'hot-water-bag';
      const bagColor = isBag ? bagColors[(i + dayIdx) % bagColors.length] : null;

      const items = [
        {
          id: chosenProduct.id,
          name: isBag ? `${chosenProduct.name} (${bagColor})` : chosenProduct.name,
          price: chosenProduct.price,
          quantity: 1,
          color: bagColor
        }
      ];

      if (i % 7 === 0 && chosenProduct.id !== 'master-combo') {
        items.push({
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1
        });
      }

      const total = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const isOnline = (i % 5 !== 0);

      const orderId = `PR-DWL-${orderCounter++}`;
      const orderRecord = {
        id: orderId,
        customer_id: `CUST-${cust.email.split('@')[0]}`,
        customer: cust.name,
        name: cust.name,
        phone: cust.phone,
        email: cust.email,
        address: `${cust.area}, Indore 452001`,
        items,
        total,
        status: 'Delivered',
        payment_method: isOnline ? 'online' : 'cod',
        paid: true,
        via: 'Diwali Campaign 2026',
        reference: isOnline ? `DIWALI-UPI-${Math.floor(200000 + Math.random() * 800000)}` : null,
        campaign: 'Diwali Campaign 2026',
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString()
      };

      orders.push(orderRecord);

      customersMap.set(cust.email, {
        id: `CUST-${cust.email.split('@')[0]}`,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        created_at: customersMap.get(cust.email)?.created_at || orderDate.toISOString(),
        last_order_at: orderDate.toISOString()
      });
    }
  }

  // ----------------------------------------------------
  // WEEK 3: Campus & PG Expansion (Days -13 to -7)
  // EXACTLY 75 Sales
  // ----------------------------------------------------
  const week3DailyCounts = [10, 11, 12, 11, 10, 11, 10]; // sum = 75

  for (let dayOffset = 13; dayOffset >= 7; dayOffset--) {
    const dayIdx = 13 - dayOffset;
    const count = week3DailyCounts[dayIdx];

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    for (let i = 0; i < count; i++) {
      const cust = customerPool[(orderCounter + i) % customerPool.length];
      
      const orderDate = new Date(targetDate);
      orderDate.setHours(9 + ((i * 3) % 13), (i * 19) % 60, (i * 31) % 60);

      // Balanced mix: Regular kits (₹179), Emergency (₹49), Travel (₹249), Hot water bag (₹349)
      const r = (i * 11) % 100;
      let chosenProduct;
      if (r < 35) {
        chosenProduct = products[1]; // Regular Kit (₹179)
      } else if (r < 65) {
        chosenProduct = products[0]; // Emergency Kit (₹49)
      } else if (r < 85) {
        chosenProduct = products[2]; // Travel Kit (₹249)
      } else {
        chosenProduct = products[4]; // Hot Water Bag (₹349)
      }

      const isBag = chosenProduct.id === 'hot-water-bag';
      const bagColor = isBag ? bagColors[(i + dayIdx) % bagColors.length] : null;

      const items = [
        {
          id: chosenProduct.id,
          name: isBag ? `${chosenProduct.name} (${bagColor})` : chosenProduct.name,
          price: chosenProduct.price,
          quantity: 1,
          color: bagColor
        }
      ];

      // Occasional add-on
      if (i % 6 === 0 && chosenProduct.id !== 'emergency-kit') {
        items.push({
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1
        });
      }

      const total = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const isOnline = (i % 4 !== 0);

      const orderId = `PR-W3-${orderCounter++}`;
      const orderRecord = {
        id: orderId,
        customer_id: `CUST-${cust.email.split('@')[0]}`,
        customer: cust.name,
        name: cust.name,
        phone: cust.phone,
        email: cust.email,
        address: `${cust.area}, Indore 452001`,
        items,
        total,
        status: 'Delivered',
        payment_method: isOnline ? 'online' : 'cod',
        paid: true,
        via: 'Week 3 Expansion',
        reference: isOnline ? `UPI-W3-${Math.floor(300000 + Math.random() * 700000)}` : null,
        campaign: 'Week 3 Campaign',
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString()
      };

      orders.push(orderRecord);

      customersMap.set(cust.email, {
        id: `CUST-${cust.email.split('@')[0]}`,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        created_at: customersMap.get(cust.email)?.created_at || orderDate.toISOString(),
        last_order_at: orderDate.toISOString()
      });
    }
  }

  // ----------------------------------------------------
  // WEEK 4: Rapid Growth & Emergency Scale (Days -6 to 0)
  // EXACTLY 90 Sales
  // ----------------------------------------------------
  const week4DailyCounts = [12, 13, 14, 15, 12, 12, 12]; // sum = 90

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const dayIdx = 6 - dayOffset;
    const count = week4DailyCounts[dayIdx];

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    for (let i = 0; i < count; i++) {
      const cust = customerPool[(orderCounter + i) % customerPool.length];
      
      const orderDate = new Date(targetDate);
      orderDate.setHours(8 + ((i * 2) % 15), (i * 13) % 60, (i * 41) % 60);

      // High volume mix: Master combo, regular kit, emergency kits, travel kits
      const r = (i * 13) % 100;
      let chosenProduct;
      if (r < 30) {
        chosenProduct = products[0]; // Emergency Kit (₹49)
      } else if (r < 60) {
        chosenProduct = products[1]; // Regular Kit (₹179)
      } else if (r < 80) {
        chosenProduct = products[3]; // Master Combo (₹399)
      } else {
        chosenProduct = products[4]; // Hot Water Bag (₹349)
      }

      const isBag = chosenProduct.id === 'hot-water-bag';
      const bagColor = isBag ? bagColors[(i + dayIdx) % bagColors.length] : null;

      const items = [
        {
          id: chosenProduct.id,
          name: isBag ? `${chosenProduct.name} (${bagColor})` : chosenProduct.name,
          price: chosenProduct.price,
          quantity: 1,
          color: bagColor
        }
      ];

      if (i % 5 === 0 && chosenProduct.id !== 'emergency-kit') {
        items.push({
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1
        });
      }

      const total = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

      // Real status distribution for current week
      let status = 'Delivered';
      let paid = true;
      if (dayOffset === 0) {
        const sr = i % 10;
        if (sr < 2) {
          status = 'Placed';
          paid = (i % 2 !== 0);
        } else if (sr < 5) {
          status = 'Shipped';
          paid = (i % 3 !== 0);
        } else {
          status = 'Delivered';
          paid = true;
        }
      } else if (dayOffset === 1) {
        if (i % 6 === 0) status = 'Shipped';
      }

      const isOnline = (i % 4 !== 0);

      const orderId = `PR-W4-${orderCounter++}`;
      const orderRecord = {
        id: orderId,
        customer_id: `CUST-${cust.email.split('@')[0]}`,
        customer: cust.name,
        name: cust.name,
        phone: cust.phone,
        email: cust.email,
        address: `${cust.area}, Indore 452001`,
        items,
        total,
        status,
        payment_method: isOnline ? 'online' : 'cod',
        paid: isOnline ? true : paid,
        via: 'Week 4 Growth',
        reference: isOnline ? `UPI-W4-${Math.floor(400000 + Math.random() * 600000)}` : null,
        campaign: 'Week 4 Campaign',
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString()
      };

      orders.push(orderRecord);

      customersMap.set(cust.email, {
        id: `CUST-${cust.email.split('@')[0]}`,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        created_at: customersMap.get(cust.email)?.created_at || orderDate.toISOString(),
        last_order_at: orderDate.toISOString()
      });
    }
  }

  // Sort orders descending by created_at (newest first)
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    orders,
    customers: Array.from(customersMap.values())
  };
}
