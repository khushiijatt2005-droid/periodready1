export const HOT_WATER_BAG_COLORS = [
  { name: 'Light Pink', hex: '#f4a6c0', border: '#e88ba9', image: '/images/bag-light-pink.png', tagImage: '/images/tag-light-pink.png' },
  { name: 'Light Blue', hex: '#9ecdf5', border: '#7cb7eb', image: '/images/bag-light-blue.png', tagImage: '/images/tag-light-blue.png' },
  { name: 'Light Lavender', hex: '#cdb4f5', border: '#b898ec', image: '/images/bag-light-lavender.png', tagImage: '/images/tag-light-lavender.png' },
  { name: 'Light Green', hex: '#a5e1be', border: '#86cca4', image: '/images/bag-light-green.png', tagImage: '/images/tag-light-green.png' },
  { name: 'White', hex: '#f7f7f7', border: '#dcdcdc', image: '/images/bag-white.png', tagImage: '/images/tag-white.png' },
  { name: 'Light Orange', hex: '#fcc391', border: '#e8a970', image: '/images/bag-light-orange.png', tagImage: '/images/tag-light-orange.png' },
  { name: 'Pista Green', hex: '#bede87', border: '#a5c76c', image: '/images/bag-pista-green.png', tagImage: '/images/tag-pista-green.png' },
];

export const PRODUCTS = [
  {
    id: 'emergency-kit',
    name: 'Emergency Period Kit (Compact Saviour Pouch)',
    shortName: 'Emergency Period Kit',
    tagline: 'Instant 10-Minute Rescue Pouch',
    price: 49,
    badge: 'Fastest 10-Min Delivery',
    badgeColor: 'rose',
    images: [
      { url: '/images/emergency-closed.png', alt: 'Emergency Period Kit Closed Box' },
      { url: '/images/emergency-open.png', alt: 'Emergency Period Kit Open Box with Contents' }
    ],
    description: 'Designed for unexpected period emergencies in college, office or transit. Fits right in your pocket or clutch.',
    features: [
      '1 x Premium Sanitary Pad',
      '2 x Compressed Coin Tissues',
      '2 x Approved Painkiller Tablets (For quick unexpected relief)',
      '1 x Ultra-Compact Travel Saviour Pouch'
    ],
    idealFor: 'Sudden unexpected surprises in college, office meetings, or on public transit.'
  },
  {
    id: 'regular-kit',
    name: 'Regular Period Kit',
    shortName: 'Regular Period Kit',
    tagline: 'Full Day Comfort & Hygiene Essentials',
    price: 179,
    badge: 'Daily Essential',
    badgeColor: 'indigo',
    images: [
      { url: '/images/regular-closed.png', alt: 'Regular Period Kit Closed Box' },
      { url: '/images/regular-open.png', alt: 'Regular Period Kit Open Box with Contents' }
    ],
    description: 'Your complete sanitary replenishment for full-day campus lectures, office shifts or PG stays.',
    features: [
      '3 x Premium XL Sanitary Pads (High absorption for daily comfort)',
      '1 x Mini Hand Sanitizer',
      '1 x Set of Eco-Friendly Disposal Bags',
      '1 x Educational Mini-Period Guide Card'
    ],
    idealFor: 'Full day at college or office with complete hygiene & hassle-free disposal.'
  },
  {
    id: 'travel-kit',
    name: 'Travel Period Kit (No-Wash Version)',
    shortName: 'Travel Period Kit',
    tagline: 'Waterless, On-The-Go Period Care',
    price: 249,
    badge: 'No-Wash Travel Edition',
    badgeColor: 'indigo',
    images: [
      { url: '/images/travel-closed.png', alt: 'Travel Period Kit Closed Blue Box' },
      { url: '/images/travel-open.png', alt: 'Travel Period Kit Open Box with Contents' }
    ],
    description: 'Engineered for flights, trains, road trips, and locations where clean water is scarce or inaccessible.',
    features: [
      '1 x Cramp Pain Relief Roll-on (Mini travel format for instant relief)',
      '1 x Instant Stain Remover Spray/Pen',
      '1 x Set of Disposable Menstrual Cups / Travel Pads',
      '1 x Pocket Pack of Intimate Wet Wipes (10 counts)'
    ],
    idealFor: 'Road trips, trains, flights, festivals, and water-scarce situations.'
  },
  {
    id: 'master-combo',
    name: 'Over-all Master Combo Box',
    shortName: 'Master Combo Box',
    tagline: 'The 3-in-1 Ultimate Period Care Solution',
    price: 399,
    badge: 'Best for gifting',
    badgeColor: 'rose',
    images: [
      { url: '/images/master-combo-main.png', alt: '3-in-1 Ultimate Period Care Combo Box' },
      { url: '/images/emergency-closed.png', alt: 'Emergency Kit Box Included' },
      { url: '/images/regular-closed.png', alt: 'Regular Kit Box Included' },
      { url: '/images/travel-closed.png', alt: 'Travel Kit Box Included' }
    ],
    description: 'The all-in-one comprehensive period care powerhouse. Covers sudden emergencies, daily campus needs, and long distance travel.',
    features: [
      'Includes 1 Full Regular Period Kit',
      'Includes 1 Full Travel Period Kit',
      'Includes 1 Full Emergency Period Kit',
      'Beautifully packed inside a Premium Navy Blue Mailer Box with Custom Wrapping & Sticker Seal (Perfect for gifting or personal stocking)'
    ],
    idealFor: 'Gifting loved ones, dorm room stocking, and year-round peace of mind.'
  },
  {
    id: 'hot-water-bag',
    name: 'Cozy Knit Hot Water Bag',
    shortName: 'Cozy Knit Hot Water Bag',
    tagline: 'Soft Cable-Knit Cramp & Back Ache Soother',
    price: 349,
    badge: 'Cramp Relief Favorite',
    badgeColor: 'rose',
    isHotWaterBag: true,
    images: [
      { url: '/images/hot-water-bag-base.jpg', alt: 'Cozy Knit Hot Water Bag with Leaf Tag' },
      { url: '/images/hot-water-bag-tag.jpg', alt: 'Leaf Tag Close-up Detail' }
    ],
    description: 'Soft cable-knit cover over a reusable, leak-resistant bag, for cramps and back ache.',
    features: [
      'Ultra-soft cable-knit removable & washable cover',
      'Leak-resistant thermal rubber bladder',
      'Soothes menstrual cramps, lower back stiffness & muscular aches',
      'Includes signature natural leaf tag'
    ],
    idealFor: 'Gentle, comforting warmth during difficult cramp days at home, PG, or office desk.'
  }
];
