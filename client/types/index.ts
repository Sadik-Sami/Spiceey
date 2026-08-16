// Client-side TypeScript types. Manually mirror server response shapes.
// Keep in sync with server/src/db/schema.ts and server/src/types/index.ts
// when the backend lands. No shared package — see architecture.md "Type Strategy".

export type Category = "ground" | "whole" | "mix" | "pickles";

export type ProductStatus = "published" | "draft" | "archived";

export type VariantWeight = "100g" | "250g" | "500g";

export type VariantStatus = "active" | "out_of_stock" | "discontinued";

export interface ProductImage {
  id: string;
  url: string;
  publicId: string | null; // null for mock/local images
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  weight: VariantWeight;
  price: number; // whole BDT taka — never floats
  discountPrice: number | null;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  status: VariantStatus;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: ProductStatus;
  ingredients: string | null;
  nutritionInfo: string | null;
  howToUse: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  status: ReviewStatus;
  helpfulCount: number;
  isOwner: boolean; // true if current user wrote this review
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packing"
  | "ready_for_courier"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "cod";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantWeight: string;
  sku: string;
  price: number; // effective unit price at purchase (after product-level discount)
  quantity: number;
  total: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  previousStatus: OrderStatus | null;
  note: string;
  createdBy: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  guestPhone: string | null;
  guestName: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    district: string;
    upazila: string;
    area: string;
    addressLine: string;
    phone?: string;
  };
  deliveryNote: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courierName: string | null;
  couponCode: string | null;
  items: OrderItem[];
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type CouponType = "percentage" | "fixed_amount" | "free_shipping";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number;
  usageCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export type AnnouncementType = "info" | "warning" | "success";

export interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

export type ShippingZone = "inside_dhaka" | "outside_dhaka" | "remote_area";

export interface ShippingConfig {
  id: string;
  zone: ShippingZone;
  baseCost: number;
  freeShippingThreshold: number;
  isActive: boolean;
}

export type BlogStatus = "published" | "draft" | "archived";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from Tiptap
  coverImageUrl: string;
  coverImagePublicId: string | null;
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string[];
  status: BlogStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type StoryType =
  | "sourcing"
  | "preparation"
  | "grinding"
  | "packaging"
  | "delivery";

export interface StoryImage {
  url: string;
  publicId: string | null;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImagePublicId: string | null;
  author: string;
  storyType: StoryType;
  gallery: StoryImage[];
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string[];
  status: BlogStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API response envelope (mirrors Express response format) ───
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: { page: number; limit: number; total: number };
  error?: { code: string; message: string; details?: unknown[] };
}

// ─── Cart (client Zustand store shape) ───
export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  weight: string;
  price: number; // effective unit price
  quantity: number;
  image: string;
}