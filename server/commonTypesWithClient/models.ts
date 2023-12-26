import { OrderStatus } from '@prisma/client';
import { cartIdParser, orderIdParser, productIdParser, userIdParser } from 'service/idParsers';
import { z } from 'zod';

// Enum for OrderStatus using z.nativeEnum
const orderStatusParser = z.nativeEnum(OrderStatus);

// User validation schema
export const userParser = z.object({
  id: userIdParser,
  firebaseUid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  profile: z
    .lazy(() => userProfileParser)
    .optional()
    .nullable(), // Include profile here directly
  // Relationships added later to avoid circular dependency issues
});

// UserProfile validation schema
export const userProfileParser = z.object({
  id: userIdParser,
  userId: userIdParser,
  address: z.string().optional(),
  phone: z.string().optional(),
});

// Product validation schema
export const productParser = z.object({
  id: productIdParser,
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Relationship added later to avoid circular dependency issues
});

// CartItem validation schema
export const cartItemParser = z.object({
  cartId: cartIdParser,
  productId: productIdParser,
  quantity: z.number(),
});

// Cart validation schema
export const cartParser = z.object({
  id: cartIdParser,
  userId: userIdParser,
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(cartItemParser), // Directly include CartItem relationships
});

// OrderDetails validation schema
export const orderDetailsParser = z.object({
  id: orderIdParser,
  orderId: orderIdParser,
  // Add additional fields as needed, e.g., shipping address, payment method, etc.
});

// Order validation schema
export const orderParser = z.object({
  id: orderIdParser,
  userId: userIdParser,
  productId: productIdParser,
  quantity: z.number(),
  status: orderStatusParser,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  // Relationship added later to avoid circular dependency issues
});

// Extend parsers to include relationships
userParser.extend({
  orders: z.lazy(() => z.array(orderParser)),
  cart: z.lazy(() => cartParser).nullable(),
});

productParser.extend({
  cartItems: z.lazy(() => z.array(cartItemParser)),
  orders: z.lazy(() => z.array(orderParser)),
});

orderParser.extend({
  details: z.lazy(() => orderDetailsParser).nullable(),
});

// Infer TypeScript types from the Zod schemas
export type UserModel = z.infer<typeof userParser>;
export type UserProfileModel = z.infer<typeof userProfileParser>;
export type ProductModel = z.infer<typeof productParser>;
export type CartItemModel = z.infer<typeof cartItemParser>;
export type CartModel = z.infer<typeof cartParser>;
export type OrderDetailsModel = z.infer<typeof orderDetailsParser>;
export type OrderModel = z.infer<typeof orderParser>;
