// Mock data for the Spiceey frontend. Replaces the Express API until the
// backend lands (build-plan tasks 04–05). All images are served from
// /public/images/* — local placeholders, swapped for Cloudinary URLs later.
//
// Schema mirrors client/types/index.ts and server/src/db/schema.ts (see
// architecture.md "Database Schema"). Money is whole BDT taka (integer).
// Each product has multiple images so the product detail gallery and the
// card cover image can both be driven from the same array.

import type {
  Product,
  Review,
  Blog,
  Story,
  Coupon,
  Announcement,
  ShippingConfig,
} from "@/types";

// ─── Image helpers ───
// 10 product photos available in /public/images/products/. We rotate them
// across products so every product has a 3-image gallery (cover + 2 extra).
const PRODUCT_PHOTOS = [
  "cumin",
  "turmeric",
  "coriander",
  "cardamom",
  "cinnamon",
  "chili",
  "black-pepper",
  "garam-masala",
  "curry-blend",
  "saffron",
] as const;

const img = (file: string) => `/images/products/${file}.jpg`;

// Build a 3-image gallery for a product: its primary photo + two others
// for variety on the detail page. sortOrder starts at 0.
function gallery(primary: string, extra1: string, extra2: string, id: string) {
  return [
    { id: `${id}-img-1`, url: img(primary), publicId: null, sortOrder: 0 },
    { id: `${id}-img-2`, url: img(extra1), publicId: null, sortOrder: 1 },
    { id: `${id}-img-3`, url: img(extra2), publicId: null, sortOrder: 2 },
  ];
}

// ─── Variant factory ───
// 100g / 250g / 500g per product. Price scales with weight. Some variants
// carry a discount. Stock varies so out-of-stock and low-stock states render.
function variants(
  productId: string,
  base100g: number,
  opts?: { outOfStock?: boolean; lowStock?: boolean; discount?: number },
) {
  const v = (weight: "100g" | "250g" | "500g", price: number) => ({
    id: `${productId}-v-${weight}`,
    productId,
    sku: `${productId.toUpperCase()}-${weight}`,
    weight,
    price,
    discountPrice:
      opts?.discount != null ? Math.round(price * (1 - opts.discount)) : null,
    quantity:
      weight === "100g" && opts?.outOfStock
        ? 0
        : weight === "250g" && opts?.lowStock
          ? 6
          : 80,
    reservedQuantity: weight === "100g" && opts?.outOfStock ? 0 : 4,
    lowStockThreshold: 10,
    isAvailable: !(weight === "100g" && opts?.outOfStock),
    status:
      weight === "100g" && opts?.outOfStock
        ? ("out_of_stock" as const)
        : ("active" as const),
  });
  return [
    v("100g", base100g),
    v("250g", Math.round(base100g * 2.4)),
    v("500g", Math.round(base100g * 4.5)),
  ];
}

// ─── Products (12 across 4 categories) ───
export const mockProducts: Product[] = [
  {
    id: "p-cumin-powder",
    name: "Cumin Powder",
    slug: "cumin-powder",
    description:
      "Hand-ground cumin seeds roasted in small batches for a deep, earthy aroma. No preservatives, no additives — just pure cumin, ground fresh weekly in our Dhaka kitchen.",
    shortDescription: "Hand-ground cumin powder, roasted in small batches.",
    category: "ground",
    tags: ["cumin", "ground spice", "roasted", "essential"],
    seoTitle: "Cumin Powder — Hand-Ground Fresh | Spiceey Bangladesh",
    seoDescription:
      "Buy authentic hand-ground cumin powder online in Bangladesh. Roasted weekly, no preservatives. 100g, 250g, 500g packs with cash on delivery.",
    ogImage: img("cumin"),
    isFeatured: true,
    isBestSeller: true,
    status: "published",
    ingredients: "100% cumin seeds (Cuminum cyminum).",
    nutritionInfo:
      "Per 100g: Energy 375 kcal, Protein 18g, Fat 22g, Carbs 44g, Fiber 11g, Iron 66% DV.",
    howToUse:
      "Add 1 tsp to curries, dals, or marinades. Toast lightly in oil before adding for deeper flavor.",
    images: gallery("cumin", "spice-jars", "coriander", "p-cumin-powder"),
    variants: variants("p-cumin-powder", 120, { discount: 0.1 }),
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "p-turmeric-powder",
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    description:
      "Sun-dried turmeric roots stone-ground into a vibrant golden powder. High curcumin content, no artificial color. A daily staple in every Bangladeshi kitchen.",
    shortDescription: "Stone-ground turmeric, high curcumin, no color added.",
    category: "ground",
    tags: ["turmeric", "haldi", "ground spice", "daily use"],
    seoTitle: "Turmeric Powder — Stone-Ground, High Curcumin | Spiceey",
    seoDescription:
      "Authentic stone-ground turmeric powder with high curcumin. No artificial color. Order online in Bangladesh with cash on delivery.",
    ogImage: img("turmeric"),
    isFeatured: true,
    isBestSeller: true,
    status: "published",
    ingredients: "100% turmeric root (Curcuma longa).",
    nutritionInfo:
      "Per 100g: Energy 354 kcal, Protein 8g, Fat 1g, Carbs 65g, Fiber 21g, Iron 55% DV.",
    howToUse:
      "Use 1/2 tsp in curries, rice, or milk. A pinch in warm milk is a traditional wellness drink.",
    images: gallery("turmeric", "spice-jars", "cumin", "p-turmeric-powder"),
    variants: variants("p-turmeric-powder", 90, { discount: 0.15 }),
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "p-corriander-powder",
    name: "Coriander Powder",
    slug: "coriander-powder",
    description:
      "Freshly ground coriander seeds with a citrusy, warm aroma. The backbone of most Bangladeshi curry bases. Ground in small batches to preserve essential oils.",
    shortDescription: "Freshly ground coriander with citrusy aroma.",
    category: "ground",
    tags: ["coriander", "ground spice", "curry base"],
    seoTitle: "Coriander Powder — Freshly Ground | Spiceey Bangladesh",
    seoDescription:
      "Freshly ground coriander powder with citrusy aroma. Small-batch ground for essential oils. Cash on delivery across Bangladesh.",
    ogImage: img("coriander"),
    isFeatured: false,
    isBestSeller: true,
    status: "published",
    ingredients: "100% coriander seeds (Coriandrum sativum).",
    nutritionInfo:
      "Per 100g: Energy 298 kcal, Protein 12g, Fat 18g, Carbs 55g, Fiber 42g.",
    howToUse:
      "Add 1-2 tsp to curry bases, dals, or marinades. Combine with cumin for a classic curry seasoning.",
    images: gallery("coriander", "cumin", "turmeric", "p-corriander-powder"),
    variants: variants("p-corriander-powder", 110),
    createdAt: "2026-01-12T08:00:00Z",
    updatedAt: "2026-01-12T08:00:00Z",
  },
  {
    id: "p-chili-powder",
    name: "Red Chili Powder",
    slug: "red-chili-powder",
    description:
      "Sun-dried red chilies ground to a fine, fiery powder. No artificial color — the deep red comes from the chilies themselves. Adjust to taste for heat.",
    shortDescription: "Sun-dried red chili powder, no artificial color.",
    category: "ground",
    tags: ["chili", "red chili", "ground spice", "hot"],
    seoTitle: "Red Chili Powder — Sun-Dried, No Color | Spiceey",
    seoDescription:
      "Sun-dried red chili powder with no artificial color. Fiery and fresh. Order online in Bangladesh with cash on delivery.",
    ogImage: img("chili"),
    isFeatured: false,
    isBestSeller: false,
    status: "published",
    ingredients: "100% red chilies (Capsicum annuum).",
    nutritionInfo:
      "Per 100g: Energy 402 kcal, Protein 14g, Fat 17g, Carbs 60g, Fiber 35g, Vitamin C 240% DV.",
    howToUse:
      "Add 1/2 to 1 tsp to curries or marinades for heat. Start small — it's potent.",
    images: gallery("chili", "spice-jars", "black-pepper", "p-chili-powder"),
    variants: variants("p-chili-powder", 100, { outOfStock: true }),
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "p-cardamom",
    name: "Green Cardamom",
    slug: "green-cardamom",
    description:
      "Whole green cardamom pods, hand-picked for size and aroma. Sweet, floral, and warming — essential for biriyani, chai, and desserts. No broken pods.",
    shortDescription: "Whole green cardamom pods, hand-picked, sweet aroma.",
    category: "whole",
    tags: ["cardamom", "whole spice", "biriyani", "chai"],
    seoTitle: "Green Cardamom — Whole Pods, Hand-Picked | Spiceey",
    seoDescription:
      "Hand-picked whole green cardamom pods for biriyani, chai, and desserts. No broken pods. Cash on delivery in Bangladesh.",
    ogImage: img("cardamom"),
    isFeatured: true,
    isBestSeller: false,
    status: "published",
    ingredients: "100% green cardamom pods (Elettaria cardamomum).",
    nutritionInfo:
      "Per 100g: Energy 311 kcal, Protein 11g, Fat 7g, Carbs 68g, Fiber 28g.",
    howToUse:
      "Crush 2-3 pods and add to rice, chai, or desserts. Use whole for biriyani.",
    images: gallery("cardamom", "cinnamon", "spice-jars", "p-cardamom"),
    variants: variants("p-cardamom", 180, { discount: 0.1 }),
    createdAt: "2026-01-18T08:00:00Z",
    updatedAt: "2026-01-18T08:00:00Z",
  },
  {
    id: "p-cinnamon",
    name: "Cinnamon Sticks",
    slug: "cinnamon-sticks",
    description:
      "True Ceylon cinnamon sticks, fragrant and sweet. Hand-rolled and sun-dried. Adds warmth to curries, desserts, and hot drinks. No cassia substitute.",
    shortDescription: "True Ceylon cinnamon sticks, sweet and fragrant.",
    category: "whole",
    tags: ["cinnamon", "whole spice", "ceylon", "dessert"],
    seoTitle: "Cinnamon Sticks — True Ceylon | Spiceey Bangladesh",
    seoDescription:
      "True Ceylon cinnamon sticks, hand-rolled and sun-dried. No cassia substitute. Order online in Bangladesh.",
    ogImage: img("cinnamon"),
    isFeatured: false,
    isBestSeller: true,
    status: "published",
    ingredients: "100% Ceylon cinnamon bark (Cinnamomum verum).",
    nutritionInfo:
      "Per 100g: Energy 247 kcal, Protein 4g, Fat 1g, Carbs 80g, Fiber 53g.",
    howToUse:
      "Add 1 stick to curries, rice, or hot drinks. Remove before serving.",
    images: gallery("cinnamon", "cardamom", "spice-jars", "p-cinnamon"),
    variants: variants("p-cinnamon", 160),
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-01-20T08:00:00Z",
  },
  {
    id: "p-black-pepper",
    name: "Black Peppercorns",
    slug: "black-peppercorns",
    description:
      "Whole black peppercorns, sun-dried and hand-sorted. Sharp, pungent heat with citrus notes. Grind fresh for the best flavor. No dust or broken bits.",
    shortDescription: "Whole black peppercorns, sun-dried, sharp heat.",
    category: "whole",
    tags: ["black pepper", "whole spice", "peppercorn"],
    seoTitle: "Black Peppercorns — Whole, Sun-Dried | Spiceey",
    seoDescription:
      "Whole sun-dried black peppercorns with sharp, pungent heat. Grind fresh. Cash on delivery in Bangladesh.",
    ogImage: img("black-pepper"),
    isFeatured: false,
    isBestSeller: false,
    status: "published",
    ingredients: "100% black peppercorns (Piper nigrum).",
    nutritionInfo:
      "Per 100g: Energy 251 kcal, Protein 10g, Fat 3g, Carbs 64g, Fiber 25g, Iron 42% DV.",
    howToUse:
      "Grind fresh over food. Add whole to soups, stews, or marinades.",
    images: gallery(
      "black-pepper",
      "chili",
      "spice-jars",
      "p-black-pepper",
    ),
    variants: variants("p-black-pepper", 140, { lowStock: true }),
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-01-22T08:00:00Z",
  },
  {
    id: "p-biriyani-masala",
    name: "Biriyani Masala",
    slug: "biriyani-masala",
    description:
      "Our signature biriyani blend — 14 spices including cardamom, cinnamon, clove, and nutmeg, ground fresh in small batches. One spoon transforms rice and meat into a feast.",
    shortDescription: "14-spice biriyani blend, ground fresh in small batches.",
    category: "mix",
    tags: ["biriyani", "masala", "blend", "signature"],
    seoTitle: "Biriyani Masala — 14-Spice Blend | Spiceey Bangladesh",
    seoDescription:
      "Signature 14-spice biriyani masala blend, ground fresh in small batches. One spoon for perfect biriyani. Cash on delivery.",
    ogImage: img("garam-masala"),
    isFeatured: true,
    isBestSeller: true,
    status: "published",
    ingredients:
      "Cardamom, cinnamon, clove, black pepper, cumin, coriander, nutmeg, mace, bay leaf, fennel, star anise, turmeric, chili, salt.",
    nutritionInfo:
      "Per 100g: Energy 320 kcal, Protein 13g, Fat 15g, Carbs 50g, Fiber 22g.",
    howToUse:
      "Use 1-2 tbsp per kg of rice or meat. Add during cooking, not at the end.",
    images: gallery(
      "garam-masala",
      "curry-blend",
      "cardamom",
      "p-biriyani-masala",
    ),
    variants: variants("p-biriyani-masala", 220, { discount: 0.12 }),
    createdAt: "2026-01-25T08:00:00Z",
    updatedAt: "2026-02-05T08:00:00Z",
  },
  {
    id: "p-chicken-masala",
    name: "Chicken Curry Masala",
    slug: "chicken-curry-masala",
    description:
      "A balanced blend for everyday chicken curry — warm, savory, and mildly spiced. Ground fresh so the aromatics stay bright. No added salt or color.",
    shortDescription: "Everyday chicken curry blend, mild and savory.",
    category: "mix",
    tags: ["chicken", "masala", "blend", "curry"],
    seoTitle: "Chicken Curry Masala — Everyday Blend | Spiceey",
    seoDescription:
      "Balanced everyday chicken curry masala, ground fresh. Mild and savory, no added salt or color. Cash on delivery in Bangladesh.",
    ogImage: img("curry-blend"),
    isFeatured: false,
    isBestSeller: true,
    status: "published",
    ingredients:
      "Coriander, cumin, turmeric, chili, black pepper, fenugreek, garlic, ginger, mustard, curry leaf.",
    nutritionInfo:
      "Per 100g: Energy 290 kcal, Protein 12g, Fat 13g, Carbs 48g, Fiber 18g.",
    howToUse:
      "Use 1 tbsp per 500g chicken. Mix with yogurt or water to form a paste.",
    images: gallery(
      "curry-blend",
      "garam-masala",
      "turmeric",
      "p-chicken-masala",
    ),
    variants: variants("p-chicken-masala", 150),
    createdAt: "2026-01-26T08:00:00Z",
    updatedAt: "2026-01-26T08:00:00Z",
  },
  {
    id: "p-garam-masala",
    name: "Garam Masala",
    slug: "garam-masala",
    description:
      "The classic warming blend — cardamom, cinnamon, clove, and black pepper. Add a pinch at the end of cooking for a fragrant finish. Ground fresh weekly.",
    shortDescription: "Classic warming garam masala, add a pinch at the end.",
    category: "mix",
    tags: ["garam masala", "blend", "warming", "finishing"],
    seoTitle: "Garam Masala — Classic Warming Blend | Spiceey",
    seoDescription:
      "Classic garam masala blend of cardamom, cinnamon, clove, and pepper. Ground fresh weekly. Cash on delivery in Bangladesh.",
    ogImage: img("garam-masala"),
    isFeatured: false,
    isBestSeller: false,
    status: "published",
    ingredients:
      "Cardamom, cinnamon, clove, black pepper, cumin, coriander, bay leaf.",
    nutritionInfo:
      "Per 100g: Energy 305 kcal, Protein 11g, Fat 14g, Carbs 52g, Fiber 20g.",
    howToUse:
      "Add 1/4 tsp at the end of cooking, off the heat, to preserve aromatics.",
    images: gallery(
      "garam-masala",
      "cinnamon",
      "cardamom",
      "p-garam-masala",
    ),
    variants: variants("p-garam-masala", 190),
    createdAt: "2026-01-28T08:00:00Z",
    updatedAt: "2026-01-28T08:00:00Z",
  },
  {
    id: "p-mango-pickle",
    name: "Mango Pickle",
    slug: "mango-pickle",
    description:
      "Raw mango, mustard oil, and a hand-ground spice mix aged for 4 weeks. Tangy, spicy, and unmistakably homemade. No preservatives — the oil and salt preserve it naturally.",
    shortDescription: "Aged raw mango pickle in mustard oil, homemade.",
    category: "pickles",
    tags: ["mango", "pickle", "mustard oil", "homemade"],
    seoTitle: "Mango Pickle — Homemade, Aged 4 Weeks | Spiceey",
    seoDescription:
      "Homemade raw mango pickle aged 4 weeks in mustard oil. No preservatives. Order online in Bangladesh with cash on delivery.",
    ogImage: img("curry-blend"),
    isFeatured: true,
    isBestSeller: true,
    status: "published",
    ingredients:
      "Raw mango, mustard oil, mustard seeds, fenugreek, fennel, turmeric, red chili, salt.",
    nutritionInfo:
      "Per 100g: Energy 210 kcal, Protein 3g, Fat 18g, Carbs 12g, Fiber 4g, Sodium 18% DV.",
    howToUse:
      "Serve 1-2 tbsp alongside rice, dal, or flatbread. Use a clean, dry spoon.",
    images: gallery(
      "curry-blend",
      "chili",
      "spice-jars",
      "p-mango-pickle",
    ),
    variants: variants("p-mango-pickle", 250, { discount: 0.1 }),
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "p-tamarind-pickle",
    name: "Tamarind Pickle",
    slug: "tamarind-pickle",
    description:
      "Tamarind pulp slow-cooked with jaggery, dates, and hand-ground spices. Sweet, sour, and spicy in one bite. A traditional accompaniment that keeps for months.",
    shortDescription: "Sweet-sour tamarind pickle with jaggery and dates.",
    category: "pickles",
    tags: ["tamarind", "pickle", "jaggery", "sweet sour"],
    seoTitle: "Tamarind Pickle — Sweet & Sour | Spiceey Bangladesh",
    seoDescription:
      "Tamarind pickle slow-cooked with jaggery and dates. Sweet, sour, and spicy. Homemade with no preservatives. Cash on delivery.",
    ogImage: img("saffron"),
    isFeatured: false,
    isBestSeller: false,
    status: "published",
    ingredients:
      "Tamarind pulp, jaggery, dates, red chili, cumin, coriander, salt, mustard oil.",
    nutritionInfo:
      "Per 100g: Energy 280 kcal, Protein 4g, Fat 6g, Carbs 60g, Fiber 8g.",
    howToUse:
      "Serve 1 tsp with rice or flatbread. Excellent with fried snacks.",
    images: gallery("saffron", "chili", "spice-jars", "p-tamarind-pickle"),
    variants: variants("p-tamarind-pickle", 230, { lowStock: true }),
    createdAt: "2026-02-03T08:00:00Z",
    updatedAt: "2026-02-03T08:00:00Z",
  },
];

// ─── Reviews (approved + a few pending for the author) ───
export const mockReviews: Review[] = [
  {
    id: "r-1",
    productId: "p-cumin-powder",
    customerId: "u-2",
    customerName: "Rahim Ahmed",
    rating: 5,
    title: "Best cumin powder I've had",
    comment:
      "The aroma when you open the pack is incredible. You can tell it's freshly ground, not like the supermarket stuff. Will order again.",
    status: "approved",
    helpfulCount: 12,
    isOwner: false,
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "r-2",
    productId: "p-cumin-powder",
    customerId: "u-3",
    customerName: "Fatima Khan",
    rating: 4,
    title: "Great flavor, packaging could be better",
    comment:
      "Flavor is excellent and fresh. The zip-lock seal came a bit loose in transit but the spice itself is top quality.",
    status: "approved",
    helpfulCount: 5,
    isOwner: false,
    createdAt: "2026-02-08T14:30:00Z",
    updatedAt: "2026-02-08T14:30:00Z",
  },
  {
    id: "r-3",
    productId: "p-cumin-powder",
    customerId: "u-1",
    customerName: "You",
    rating: 5,
    title: "My pending review",
    comment: "Just submitted this — waiting for admin approval.",
    status: "pending",
    helpfulCount: 0,
    isOwner: true,
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },
  {
    id: "r-4",
    productId: "p-turmeric-powder",
    customerId: "u-2",
    customerName: "Rahim Ahmed",
    rating: 5,
    title: "Vibrant color, real turmeric",
    comment:
      "You can see and taste the difference. The color is natural, not like the dyed ones in the market. Highly recommend.",
    status: "approved",
    helpfulCount: 8,
    isOwner: false,
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-02-10T11:00:00Z",
  },
  {
    id: "r-5",
    productId: "p-biriyani-masala",
    customerId: "u-4",
    customerName: "Karim Hassan",
    rating: 5,
    title: "Restaurant-quality biriyani at home",
    comment:
      "I've tried many biriyani masalas and this is the closest to the famous Dhaka restaurants. The blend is perfectly balanced.",
    status: "approved",
    helpfulCount: 20,
    isOwner: false,
    createdAt: "2026-02-12T16:00:00Z",
    updatedAt: "2026-02-12T16:00:00Z",
  },
  {
    id: "r-6",
    productId: "p-mango-pickle",
    customerId: "u-3",
    customerName: "Fatima Khan",
    rating: 4,
    title: "Tastes like my grandmother's",
    comment:
      "Homemade flavor, not too salty. The mustard oil is authentic. Only wish the jar was bigger!",
    status: "approved",
    helpfulCount: 7,
    isOwner: false,
    createdAt: "2026-02-14T13:00:00Z",
    updatedAt: "2026-02-14T13:00:00Z",
  },
];

// ─── Blogs ───
export const mockBlogs: Blog[] = [
  {
    id: "b-1",
    title: "Why Hand-Ground Spices Taste Better",
    slug: "why-hand-ground-spices-taste-better",
    excerpt:
      "The science behind why stone-grinding beats industrial milling — and how to tell the difference at home.",
    content:
      "<p>Industrial spice milling uses high-speed steel blades that generate heat, vaporizing the very essential oils that give spices their flavor. Stone-grinding, the traditional method we use at Spiceey, keeps temperatures low so the aromatics stay intact.</p><h2>The difference you can smell</h2><p>Open a pack of supermarket cumin and a pack of ours side by side. The supermarket pack smells flat. Ours fills the room.</p>",
    coverImageUrl: "/images/spice-jars.jpg",
    coverImagePublicId: null,
    author: "Spiceey Team",
    seoTitle: "Why Hand-Ground Spices Taste Better | Spiceey Blog",
    seoDescription:
      "The science behind stone-grinding vs industrial milling and why hand-ground spices taste better.",
    tags: ["spices", "process", "quality"],
    status: "published",
    publishedAt: "2026-02-01T08:00:00Z",
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "b-2",
    title: "A Beginner's Guide to Bangladeshi Spice Blends",
    slug: "beginners-guide-bangladeshi-spice-blends",
    excerpt:
      "From biriyani masala to garam masala — what each blend is for and when to use it.",
    content:
      "<p>Bangladeshi cooking relies on a handful of core spice blends. Understanding them unlocks hundreds of recipes.</p><h2>Biriyani Masala</h2><p>A complex, warming blend for layered rice and meat dishes. Use 1-2 tablespoons per kilogram.</p><h2>Garam Masala</h2><p>A finishing blend — add a pinch off the heat to preserve its delicate aromatics.</p>",
    coverImageUrl: "/images/hero-banner.jpg",
    coverImagePublicId: null,
    author: "Spiceey Team",
    seoTitle: "Beginner's Guide to Bangladeshi Spice Blends | Spiceey",
    seoDescription:
      "Learn the core Bangladeshi spice blends — biriyani masala, garam masala, and more — and when to use each.",
    tags: ["guide", "blends", "cooking"],
    status: "published",
    publishedAt: "2026-02-10T08:00:00Z",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
];

// ─── Stories ───
export const mockStories: Story[] = [
  {
    id: "s-1",
    title: "From Seed to Jar: Our Sourcing Journey",
    slug: "from-seed-to-jar-sourcing",
    excerpt:
      "How we travel to the northern districts to buy directly from the farmers who grow our chilies and turmeric.",
    content:
      "<p>We don't buy from middlemen. Every season, our team visits the farmers in Bogra and Pabna who grow our chilies, turmeric, and coriander.</p><h2>Why direct matters</h2><p>Buying direct means the farmer gets a fair price, and we get spices at peak freshness — within days of harvest, not months.</p>",
    coverImageUrl: "/images/stories/story-hands.jpg",
    coverImagePublicId: null,
    author: "Spiceey Team",
    storyType: "sourcing",
    gallery: [
      { url: "/images/stories/story-hands.jpg", publicId: null },
      { url: "/images/spice-jars.jpg", publicId: null },
      { url: "/images/products/turmeric.jpg", publicId: null },
    ],
    seoTitle: "From Seed to Jar: Our Sourcing Journey | Spiceey Stories",
    seoDescription:
      "How Spiceey sources spices directly from farmers in northern Bangladesh for peak freshness and fair prices.",
    tags: ["sourcing", "farmers", "process"],
    status: "published",
    publishedAt: "2026-02-05T08:00:00Z",
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-02-05T08:00:00Z",
  },
  {
    id: "s-2",
    title: "The Stone Mill: Grinding the Old Way",
    slug: "the-stone-mill-grinding-old-way",
    excerpt:
      "Inside our kitchen where every batch is stone-ground in small quantities to preserve the essential oils.",
    content:
      "<p>The stone mill has been the heart of our kitchen since day one. Unlike industrial steel-blade grinders, it never heats the spices above room temperature.</p><h2>Small batches, big flavor</h2><p>We grind in 5kg batches — enough for a week of orders. Larger batches sit on shelves and lose flavor.</p>",
    coverImageUrl: "/images/spice-jars.jpg",
    coverImagePublicId: null,
    author: "Spiceey Team",
    storyType: "grinding",
    gallery: [
      { url: "/images/spice-jars.jpg", publicId: null },
      { url: "/images/products/cumin.jpg", publicId: null },
      { url: "/images/products/coriander.jpg", publicId: null },
    ],
    seoTitle: "The Stone Mill: Grinding the Old Way | Spiceey Stories",
    seoDescription:
      "Inside the Spiceey kitchen where every batch is stone-ground in small quantities to preserve essential oils.",
    tags: ["grinding", "process", "stone mill"],
    status: "published",
    publishedAt: "2026-02-12T08:00:00Z",
    createdAt: "2026-02-12T08:00:00Z",
    updatedAt: "2026-02-12T08:00:00Z",
  },
];

// ─── Coupons ───
export const mockCoupons: Coupon[] = [
  {
    id: "c-1",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderAmount: 300,
    maxDiscount: 100,
    usageLimit: 100,
    usageCount: 23,
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: "c-2",
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    minOrderAmount: 500,
    maxDiscount: null,
    usageLimit: 50,
    usageCount: 11,
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: "c-3",
    code: "FLAT50",
    type: "fixed_amount",
    value: 50,
    minOrderAmount: 400,
    maxDiscount: null,
    usageLimit: 200,
    usageCount: 67,
    expiresAt: "2026-09-30T23:59:59Z",
    isActive: true,
  },
];

// ─── Announcements ───
export const mockAnnouncements: Announcement[] = [
  {
    id: "a-1",
    message: "Free shipping on orders over ৳500 inside Dhaka!",
    type: "success",
    isActive: true,
    startAt: "2026-02-01T00:00:00Z",
    endAt: "2026-12-31T23:59:59Z",
  },
];

// ─── Shipping Config ───
export const mockShippingConfig: ShippingConfig[] = [
  {
    id: "sc-1",
    zone: "inside_dhaka",
    baseCost: 60,
    freeShippingThreshold: 500,
    isActive: true,
  },
  {
    id: "sc-2",
    zone: "outside_dhaka",
    baseCost: 120,
    freeShippingThreshold: 800,
    isActive: true,
  },
  {
    id: "sc-3",
    zone: "remote_area",
    baseCost: 200,
    freeShippingThreshold: 1200,
    isActive: true,
  },
];

// ─── Query helpers (mimic the future Express API) ───
// These let UI components call mock data with the same shape as the real API
// will return, so swapping to fetch() later is a one-line change.

export function getProducts(filters?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): { products: Product[]; meta: { page: number; limit: number; total: number } } {
  let result = mockProducts.filter((p) => p.status === "published");

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.category && filters.category !== "all") {
    result = result.filter((p) => p.category === filters.category);
  }

  switch (filters?.sort) {
    case "price-asc":
      result = [...result].sort(
        (a, b) =>
          (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0),
      );
      break;
    case "price-desc":
      result = [...result].sort(
        (a, b) =>
          (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0),
      );
      break;
    case "best-selling":
      result = [...result].sort(
        (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller),
      );
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt),
      );
      break;
    default:
      result = [...result].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
      );
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const total = result.length;
  const start = (page - 1) * limit;
  const paged = result.slice(start, start + limit);

  return { products: paged, meta: { page, limit, total } };
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug && p.status === "published");
}

export function getFeaturedProducts(limit = 8): Product[] {
  return mockProducts
    .filter((p) => p.isFeatured && p.status === "published")
    .slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return mockProducts
    .filter((p) => p.isBestSeller && p.status === "published")
    .slice(0, limit);
}

export function getRelatedProducts(
  productId: string,
  limit = 4,
): Product[] {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return [];
  return mockProducts
    .filter(
      (p) =>
        p.id !== productId &&
        p.category === product.category &&
        p.status === "published",
    )
    .slice(0, limit);
}

export function getReviewsByProduct(
  productId: string,
  opts?: { includeOwnPending?: boolean; currentUserId?: string },
): Review[] {
  return mockReviews.filter((r) => {
    if (r.productId !== productId) return false;
    if (r.status === "approved") return true;
    // Pending: only visible to the author
    if (r.status === "pending") {
      return opts?.includeOwnPending && r.customerId === opts?.currentUserId;
    }
    return false; // rejected: hidden from everyone
  });
}

export function getActiveAnnouncement(): Announcement | undefined {
  const now = new Date().toISOString();
  return mockAnnouncements.find(
    (a) =>
      a.isActive &&
      a.startAt <= now &&
      a.endAt >= now,
  );
}

export function validateCoupon(
  code: string,
  cartSubtotal: number,
): { valid: boolean; coupon?: Coupon; discountAmount?: number; error?: string } {
  const coupon = mockCoupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive,
  );
  if (!coupon) return { valid: false, error: "Invalid coupon code" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return { valid: false, error: "Coupon has expired" };
  if (coupon.usageCount >= coupon.usageLimit)
    return { valid: false, error: "Coupon usage limit reached" };
  if (cartSubtotal < coupon.minOrderAmount)
    return {
      valid: false,
      error: `Minimum order ৳${coupon.minOrderAmount} required`,
    };

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = Math.round((cartSubtotal * coupon.value) / 100);
    if (coupon.maxDiscount)
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  } else if (coupon.type === "fixed_amount") {
    discountAmount = Math.min(coupon.value, cartSubtotal);
  } else if (coupon.type === "free_shipping") {
    discountAmount = 0; // shipping cost removed at checkout
  }

  return { valid: true, coupon, discountAmount };
}

export function getShippingCost(zone: string, subtotal: number): number {
  const config = mockShippingConfig.find((s) => s.zone === zone && s.isActive);
  if (!config) return 0;
  if (subtotal >= config.freeShippingThreshold) return 0;
  return config.baseCost;
}