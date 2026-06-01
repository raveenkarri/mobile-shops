import Banner from "../models/Banner.js";

const isBannerInDateRange = (banner, now = new Date()) => {
  const start = new Date(banner.startDate);
  const end = new Date(banner.endDate);
  return banner.isActive && start <= now && end >= now;
};

const matchesProductCondition = (banner, product) => {
  const productIds = (banner.conditions?.applicableProducts || []).map((id) => id.toString());
  const hasProductList = productIds.length > 0;
  const hasCategory = Boolean(banner.conditions?.category);
  const categoryMatch = hasCategory ? banner.conditions.category === product.category : true;
  const productMatch = hasProductList ? productIds.includes(product._id.toString()) : true;
  return categoryMatch && productMatch;
};

const meetsAmountCondition = (banner, product) => {
  const minimum = Number(banner.conditions?.minPurchaseAmount || 0);
  return Number(product.price) >= minimum;
};

const formatBadgeText = (banner) => {
  if (banner.type === "bogo") return "Buy 1 Get 1";
  if (banner.type === "combo_offer" && banner.freeProduct) {
    return `Free ${banner.freeProduct}`;
  }
  if (banner.discountType === "percentage") return `${banner.discountValue}% OFF`;
  if (banner.discountType === "fixed") return `Save ₹${banner.discountValue}`;
  return banner.title;
};

const applyDiscount = (price, banner) => {
  if (banner.discountType === "percentage") {
    return Math.max(0, price - (price * Number(banner.discountValue || 0)) / 100);
  }
  if (banner.discountType === "fixed") {
    return Math.max(0, price - Number(banner.discountValue || 0));
  }
  return price;
};

export const getActiveBannersForShop = async (shopId) => {
  const banners = await Banner.find({ shopId, isActive: true }).sort({ createdAt: -1 });
  return banners.filter((banner) => isBannerInDateRange(banner));
};

export const computeProductOffer = (product, activeBanners = []) => {
  const basePrice = Number(product.price || 0);
  const eligibleBanners = activeBanners.filter(
    (banner) => matchesProductCondition(banner, product) && meetsAmountCondition(banner, product),
  );

  if (!eligibleBanners.length) {
    return {
      originalPrice: basePrice,
      discountedPrice: basePrice,
      hasOffer: false,
      offer: null,
    };
  }

  const computed = eligibleBanners.map((banner) => {
    const discountedPrice =
      banner.type === "discount" || banner.type === "combo_offer"
        ? applyDiscount(basePrice, banner)
        : basePrice;
    const savings = Math.max(0, basePrice - discountedPrice);

    return {
      banner,
      discountedPrice,
      savings,
    };
  });

  const best = computed.sort((a, b) => b.savings - a.savings)[0];

  return {
    originalPrice: basePrice,
    discountedPrice: Number(best.discountedPrice.toFixed(2)),
    hasOffer: true,
    offer: {
      bannerId: best.banner._id,
      title: best.banner.title,
      description: best.banner.description,
      type: best.banner.type,
      discountType: best.banner.discountType || "",
      discountValue: Number(best.banner.discountValue || 0),
      freeProduct: best.banner.freeProduct || "",
      badgeText: formatBadgeText(best.banner),
      minPurchaseAmount: Number(best.banner.conditions?.minPurchaseAmount || 0),
      endDate: best.banner.endDate,
      savings: Number(best.savings.toFixed(2)),
    },
  };
};

export const enrichProductsWithOffers = (products, activeBanners = []) => {
  return products.map((productDoc) => {
    const product = productDoc.toObject ? productDoc.toObject() : productDoc;
    return {
      ...product,
      pricing: computeProductOffer(product, activeBanners),
    };
  });
};
