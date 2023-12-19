import { z } from 'zod';
import { orderIdParser, productIdParser, taskIdParser, userIdParser } from '../service/idParsers';
import type { UserId } from './ids';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export const taskParser = z.object({
  id: taskIdParser,
  label: z.string(),
  done: z.boolean(),
  created: z.number(),
});

export const productParser = z.object({
  id: productIdParser,
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  created: z.number(),
});

export const orderParser = z.object({
  id: orderIdParser,
  userId: userIdParser,
  productId: productIdParser,
  quantity: z.number(),
  created: z.number(),
});

export type TaskModel = z.infer<typeof taskParser>;

export type ProductModel = z.infer<typeof productParser>;

export type OrderModel = z.infer<typeof orderParser>;
