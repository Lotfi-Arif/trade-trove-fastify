import {
  cartIdParser,
  orderIdParser,
  productIdParser,
  taskIdParser,
  userIdParser,
} from 'service/idParsers';
import { z } from 'zod';
import type { UserId } from './ids';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

// Task model and parser
export const taskParser = z.object({
  id: taskIdParser,
  userId: userIdParser,
  label: z.string(),
  done: z.boolean(),
  created: z.number(),
});
export type TaskModel = z.infer<typeof taskParser>;

// Order model and parser
export const orderParser = z.object({
  id: orderIdParser,
  userId: userIdParser,
  productId: productIdParser,
  quantity: z.number(),
  created: z.number(),
});
export type OrderModel = z.infer<typeof orderParser>;

// Product model and parser
export const productParser = z.object({
  id: productIdParser,
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  orders: z.array(orderParser), // Product to orders relationship
  created: z.number(),
});
export type ProductModel = z.infer<typeof productParser>;

// Cart model and parser (if applicable)
export const cartParser = z.object({
  id: cartIdParser,
  userId: userIdParser,
  products: z.array(productIdParser), // Cart to products relationship
});
export type CartModel = z.infer<typeof cartParser>;
