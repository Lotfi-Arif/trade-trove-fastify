import { OrderStatus } from '@prisma/client'; // Import enums directly from Prisma
import { z } from 'zod';

// Assuming you have id parsers for each type
import { cartIdParser, orderIdParser, productIdParser, userIdParser } from 'service/idParsers';

// User validation schema
export const userParser = z.object({
  id: userIdParser,
  firebaseUid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Relationships will be added later as lazy to avoid circular dependency issues
});

// Product validation schema
export const productParser = z.object({
  id: productIdParser,
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Assuming a relation to Cart is optional and orders is a list of orderIdParser
  cartId: cartIdParser.optional(),
  orders: z.array(orderIdParser).optional(),
});

// Order validation schema
export const orderParser = z.object({
  id: orderIdParser,
  userId: userIdParser, // Ensure user exists for an order
  productId: productIdParser,
  quantity: z.number(),
  status: z.nativeEnum(OrderStatus), // Use the nativeEnum method for Prisma enums
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Cart validation schema
export const cartParser = z.object({
  id: cartIdParser,
  userId: userIdParser, // Ensure a cart is associated with a user
  products: z.array(productIdParser), // Array of product IDs
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Add relationships using z.lazy to avoid issues with circular references
userParser.extend({
  orders: z.lazy(() => z.array(orderParser)), // User to Orders relationship
  cart: z.lazy(() => cartParser).optional(), // User to Cart relationship
});

productParser.extend({
  // Product to Orders relationship, assuming a product can be part of multiple orders
  orders: z.lazy(() => z.array(orderParser)).optional(),
});

// Infer TypeScript types from the Zod schemas
export type UserModel = z.infer<typeof userParser>;
export type ProductModel = z.infer<typeof productParser>;
export type OrderModel = z.infer<typeof orderParser>;
export type CartModel = z.infer<typeof cartParser>;
