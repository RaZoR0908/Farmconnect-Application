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
  POULTRY: {
    emoji: '🥚',
    color: '#FFC107',
    icon: 'egg'
  },
  OTHERS: {
    emoji: '🌿',
    color: '#009688',
    icon: 'flower'
  }
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
