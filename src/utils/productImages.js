// Default product images by category (using emoji as placeholders)
export const DEFAULT_PRODUCT_IMAGES = {
  VEGETABLES: {
    emoji: '🥬',
    color: '#4CAF50',
    icon: 'leaf'
  },
  FRUITS: {
    emoji: '🍎',
    color: '#FF5722',
    icon: 'nutrition'
  },
  GRAINS: {
    emoji: '🌾',
    color: '#FF9800',
    icon: 'barcode'
  },
  DAIRY: {
    emoji: '🥛',
    color: '#2196F3',
    icon: 'water'
  },
  MEAT: {
    emoji: '🍖',
    color: '#D32F2F',
    icon: 'nutrition'
  },
  HERBS: {
    emoji: '🌿',
    color: '#43A047',
    icon: 'leaf'
  },
  POULTRY: {
    emoji: '🥚',
    color: '#FFC107',
    icon: 'egg'
  },
  OTHER: {
    emoji: '📦',
    color: '#009688',
    icon: 'cube'
  },
  OTHERS: {
    emoji: '🌿',
    color: '#009688',
    icon: 'flower'
  }
};

// Specific product emojis based on product name
export const SPECIFIC_PRODUCT_EMOJIS = {
  // Fruits
  'apple': { emoji: '🍎', color: '#FF5252' },
  'banana': { emoji: '🍌', color: '#FFEB3B' },
  'orange': { emoji: '🍊', color: '#FF9800' },
  'mango': { emoji: '🥭', color: '#FFC107' },
  'grapes': { emoji: '🍇', color: '#9C27B0' },
  'watermelon': { emoji: '🍉', color: '#E91E63' },
  'papaya': { emoji: '🧡', color: '#FF6F00' },
  'pineapple': { emoji: '🍍', color: '#FFA000' },
  'guava': { emoji: '🟢', color: '#66BB6A' },
  'pomegranate': { emoji: '🔴', color: '#D32F2F' },
  'strawberry': { emoji: '🍓', color: '#F44336' },
  'blueberry': { emoji: '🫐', color: '#3F51B5' },
  'kiwi': { emoji: '🥝', color: '#8BC34A' },
  'lemon': { emoji: '🍋', color: '#FFEB3B' },
  'lime': { emoji: '🍋', color: '#CDDC39' },
  'peach': { emoji: '🍑', color: '#FFCCBC' },
  'plum': { emoji: '🟣', color: '#673AB7' },
  'cherry': { emoji: '🍒', color: '#D32F2F' },
  'pear': { emoji: '🍐', color: '#8BC34A' },
  'avocado': { emoji: '🥑', color: '#558B2F' },
  'coconut': { emoji: '🥥', color: '#795548' },
  
  // Vegetables
  'tomato': { emoji: '🍅', color: '#F44336' },
  'potato': { emoji: '🥔', color: '#A1887F' },
  'onion': { emoji: '🧅', color: '#D7CCC8' },
  'carrot': { emoji: '🥕', color: '#FF9800' },
  'cabbage': { emoji: '🥬', color: '#66BB6A' },
  'cauliflower': { emoji: '🥦', color: '#E0E0E0' },
  'broccoli': { emoji: '🥦', color: '#4CAF50' },
  'spinach': { emoji: '🥬', color: '#388E3C' },
  'lettuce': { emoji: '🥬', color: '#8BC34A' },
  'cucumber': { emoji: '🥒', color: '#66BB6A' },
  'bell pepper': { emoji: '🫑', color: '#4CAF50' },
  'pepper': { emoji: '🫑', color: '#4CAF50' },
  'green chili': { emoji: '🌶️', color: '#4CAF50' },
  'chili': { emoji: '🌶️', color: '#F44336' },
  'eggplant': { emoji: '🍆', color: '#673AB7' },
  'pumpkin': { emoji: '🎃', color: '#FF9800' },
  'beetroot': { emoji: '🟣', color: '#880E4F' },
  'beet': { emoji: '🟣', color: '#880E4F' },
  'radish': { emoji: '🔴', color: '#E91E63' },
  'green beans': { emoji: '🫘', color: '#4CAF50' },
  'beans': { emoji: '🫘', color: '#8D6E63' },
  'peas': { emoji: '🫛', color: '#66BB6A' },
  'corn': { emoji: '🌽', color: '#FFEB3B' },
  'okra': { emoji: '🌿', color: '#66BB6A' },
  'mushroom': { emoji: '🍄', color: '#A1887F' },
  
  // Grains
  'rice': { emoji: '🍚', color: '#FFFDE7' },
  'wheat': { emoji: '🌾', color: '#FFE082' },
  'barley': { emoji: '🌾', color: '#D4A574' },
  'oats': { emoji: '🌾', color: '#FFD54F' },
  'millet': { emoji: '🌾', color: '#FFB300' },
  'quinoa': { emoji: '🌾', color: '#F9A825' },
  'sorghum': { emoji: '🌾', color: '#FF8F00' },
  
  // Dairy
  'milk': { emoji: '🥛', color: '#ECEFF1' },
  'butter': { emoji: '🧈', color: '#FFECB3' },
  'cheese': { emoji: '🧀', color: '#FFD54F' },
  'yogurt': { emoji: '🥛', color: '#E1F5FE' },
  'curd': { emoji: '🥛', color: '#E1F5FE' },
  'cream': { emoji: '🥛', color: '#FFF8E1' },
  'paneer': { emoji: '🧀', color: '#FFFDE7' },
  'ghee': { emoji: '🧈', color: '#FFECB3' },
  
  // Meat & Protein
  'chicken': { emoji: '🍗', color: '#FFCCBC' },
  'mutton': { emoji: '🍖', color: '#D7CCC8' },
  'beef': { emoji: '🥩', color: '#D32F2F' },
  'pork': { emoji: '🥓', color: '#FFAB91' },
  'fish': { emoji: '🐟', color: '#4FC3F7' },
  'eggs': { emoji: '🥚', color: '#FFF9C4' },
  'egg': { emoji: '🥚', color: '#FFF9C4' },
  
  // Herbs
  'coriander': { emoji: '🌿', color: '#66BB6A' },
  'mint': { emoji: '🌿', color: '#4CAF50' },
  'basil': { emoji: '🌿', color: '#388E3C' },
  'curry leaves': { emoji: '🌿', color: '#558B2F' },
  'parsley': { emoji: '🌿', color: '#689F38' },
  'thyme': { emoji: '🌿', color: '#7CB342' },
  'rosemary': { emoji: '🌿', color: '#8BC34A' },
  'oregano': { emoji: '🌿', color: '#9CCC65' },
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
