import { z } from 'zod';
import { productIdParser, taskIdParser } from '../service/idParsers';
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
  price: z.number(),
  created: z.number(),
});

export type TaskModel = z.infer<typeof taskParser>;

export type ProductModel = z.infer<typeof productParser>;
