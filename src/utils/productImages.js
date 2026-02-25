// Default product images by category (using emoji as placeholders)
export const DEFAULT_PRODUCT_IMAGES = {
  VEGETABLES: {
    emoji: '🥬',
    color: '#C8E6C9',
    icon: 'leaf'
  },
  FRUITS: {
    emoji: '🍎',
    color: '#FFCDD2',
    icon: 'nutrition'
  },
  GRAINS: {
    emoji: '🌾',
    color: '#FFE0B2',
    icon: 'barcode'
  },
  DAIRY: {
    emoji: '🥛',
    color: '#E3F2FD',
    icon: 'water'
  },
  MEAT: {
    emoji: '🍖',
    color: '#FFCCBC',
    icon: 'nutrition'
  },
  HERBS: {
    emoji: '🌿',
    color: '#DCEDC8',
    icon: 'leaf'
  },
  POULTRY: {
    emoji: '🥚',
    color: '#FFF9C4',
    icon: 'egg'
  },
  OTHER: {
    emoji: '📦',
    color: '#E0F2F1',
    icon: 'cube'
  },
  OTHERS: {
    emoji: '🌿',
    color: '#E0F2F1',
    icon: 'flower'
  }
};

// Specific product emojis based on product name
export const SPECIFIC_PRODUCT_EMOJIS = {
  // Fruits
  'apple': { emoji: '🍎', color: '#FFCDD2' },
  'banana': { emoji: '🍌', color: '#FFF9C4' },
  'orange': { emoji: '🍊', color: '#FFE0B2' },
  'mango': { emoji: '🥭', color: '#FFECB3' },
  'grapes': { emoji: '🍇', color: '#E1BEE7' },
  'watermelon': { emoji: '🍉', color: '#F8BBD0' },
  'papaya': { emoji: '🧡', color: '#FFCCBC' },
  'pineapple': { emoji: '🍍', color: '#FFE082' },
  'guava': { emoji: '🟢', color: '#C8E6C9' },
  'pomegranate': { emoji: '🔴', color: '#FFCDD2' },
  'strawberry': { emoji: '🍓', color: '#FFCDD2' },
  'blueberry': { emoji: '🫐', color: '#C5CAE9' },
  'kiwi': { emoji: '🥝', color: '#DCEDC8' },
  'lemon': { emoji: '🍋', color: '#FFF9C4' },
  'lime': { emoji: '🍋', color: '#F0F4C3' },
  'peach': { emoji: '🍑', color: '#FFCCBC' },
  'plum': { emoji: '🟣', color: '#E1BEE7' },
  'cherry': { emoji: '🍒', color: '#FFCDD2' },
  'pear': { emoji: '🍐', color: '#DCEDC8' },
  'avocado': { emoji: '🥑', color: '#C8E6C9' },
  'coconut': { emoji: '🥥', color: '#EFEBE9' },
  
  // Vegetables
  'tomato': { emoji: '🍅', color: '#FFCDD2' },
  'potato': { emoji: '🥔', color: '#EFEBE9' },
  'onion': { emoji: '🧅', color: '#F5F5F5' },
  'carrot': { emoji: '🥕', color: '#FFE0B2' },
  'cabbage': { emoji: '🥬', color: '#C8E6C9' },
  'cauliflower': { emoji: '🥦', color: '#F5F5F5' },
  'broccoli': { emoji: '🥦', color: '#C8E6C9' },
  'spinach': { emoji: '🥬', color: '#C8E6C9' },
  'lettuce': { emoji: '🥬', color: '#DCEDC8' },
  'cucumber': { emoji: '🥒', color: '#C8E6C9' },
  'bell pepper': { emoji: '🫑', color: '#C8E6C9' },
  'pepper': { emoji: '🫑', color: '#C8E6C9' },
  'green chili': { emoji: '🌶️', color: '#C8E6C9' },
  'chili': { emoji: '🌶️', color: '#FFCDD2' },
  'eggplant': { emoji: '🍆', color: '#E1BEE7' },
  'pumpkin': { emoji: '🎃', color: '#FFE0B2' },
  'beetroot': { emoji: '🟣', color: '#F8BBD0' },
  'beet': { emoji: '🟣', color: '#F8BBD0' },
  'radish': { emoji: '🔴', color: '#FFCDD2' },
  'green beans': { emoji: '🫘', color: '#C8E6C9' },
  'beans': { emoji: '🫘', color: '#EFEBE9' },
  'peas': { emoji: '🫛', color: '#C8E6C9' },
  'corn': { emoji: '🌽', color: '#FFF9C4' },
  'okra': { emoji: '🌿', color: '#C8E6C9' },
  'mushroom': { emoji: '🍄', color: '#EFEBE9' },
  
  // Grains
  'rice': { emoji: '🍚', color: '#FFFDE7' },
  'wheat': { emoji: '🌾', color: '#FFF9C4' },
  'barley': { emoji: '🌾', color: '#FFE0B2' },
  'oats': { emoji: '🌾', color: '#FFF9C4' },
  'millet': { emoji: '🌾', color: '#FFE082' },
  'quinoa': { emoji: '🌾', color: '#FFECB3' },
  'sorghum': { emoji: '🌾', color: '#FFE0B2' },
  
  // Dairy
  'milk': { emoji: '🥛', color: '#F5F5F5' },
  'butter': { emoji: '🧈', color: '#FFECB3' },
  'cheese': { emoji: '🧀', color: '#FFE082' },
  'yogurt': { emoji: '🥛', color: '#E1F5FE' },
  'curd': { emoji: '🥛', color: '#E1F5FE' },
  'cream': { emoji: '🥛', color: '#FFF8E1' },
  'paneer': { emoji: '🧀', color: '#FFFDE7' },
  'ghee': { emoji: '🧈', color: '#FFECB3' },
  
  // Meat & Protein
  'chicken': { emoji: '🍗', color: '#FFCCBC' },
  'mutton': { emoji: '🍖', color: '#EFEBE9' },
  'beef': { emoji: '🥩', color: '#FFCDD2' },
  'pork': { emoji: '🥓', color: '#FFCCBC' },
  'fish': { emoji: '🐟', color: '#B3E5FC' },
  'eggs': { emoji: '🥚', color: '#FFF9C4' },
  'egg': { emoji: '🥚', color: '#FFF9C4' },
  
  // Herbs
  'coriander': { emoji: '🌿', color: '#C8E6C9' },
  'mint': { emoji: '🌿', color: '#C8E6C9' },
  'basil': { emoji: '🌿', color: '#C8E6C9' },
  'curry leaves': { emoji: '🌿', color: '#DCEDC8' },
  'parsley': { emoji: '🌿', color: '#DCEDC8' },
  'thyme': { emoji: '🌿', color: '#DCEDC8' },
  'rosemary': { emoji: '🌿', color: '#DCEDC8' },
  'oregano': { emoji: '🌿', color: '#DCEDC8' },
};

// Get specific product emoji based on name, fallback to category
export const getProductEmoji = (productName, category) => {
  const nameLower = (productName || '').toLowerCase().trim();
  
  // Try exact match first
  if (SPECIFIC_PRODUCT_EMOJIS[nameLower]) {
    return SPECIFIC_PRODUCT_EMOJIS[nameLower];
  }
  
  // Try partial match (if product name contains a known product)
  for (const [key, value] of Object.entries(SPECIFIC_PRODUCT_EMOJIS)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return value;
    }
  }
  
  // Fallback to category default
  const categoryDefault = DEFAULT_PRODUCT_IMAGES[category] || DEFAULT_PRODUCT_IMAGES.OTHER;
  return {
    emoji: categoryDefault.emoji,
    color: categoryDefault.color
  };
};

// Get default image configuration for a category
export const getDefaultProductImage = (category) => {
  return DEFAULT_PRODUCT_IMAGES[category] || DEFAULT_PRODUCT_IMAGES.OTHERS;
};

// Check if product has uploaded images
export const hasCustomImages = (product) => {
  return product?.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0;
};

// Get product display image (first uploaded image or default)
export const getProductDisplayImage = (product) => {
  // Always show default category image on product cards
  const defaultImg = getDefaultProductImage(product?.category);
  return {
    type: 'default',
    emoji: defaultImg.emoji,
    color: defaultImg.color,
    icon: defaultImg.icon
  };
};

// Get product detail images (for detail view only)
export const getProductDetailImages = (product) => {
  if (hasCustomImages(product)) {
    return {
      type: 'url',
      images: product.image_urls
    };
  }
  
  const defaultImg = getDefaultProductImage(product?.category);
  return {
    type: 'default',
    emoji: defaultImg.emoji,
    color: defaultImg.color,
    icon: defaultImg.icon
  };
};

// Get all product images
export const getAllProductImages = (product) => {
  if (hasCustomImages(product)) {
    return product.image_urls.map(url => ({ type: 'url', value: url }));
  }
  return [];
};
