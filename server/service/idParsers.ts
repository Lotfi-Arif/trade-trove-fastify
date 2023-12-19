import { z } from 'zod';
import type { OrderId, ProductId, TaskId, UserId } from '../commonTypesWithClient/ids';

const createIdParser = <T extends string>() => z.string() as unknown as z.ZodType<T>;

export const userIdParser = createIdParser<UserId>();

export const taskIdParser = createIdParser<TaskId>();

export const productIdParser = createIdParser<ProductId>();

export const orderIdParser = createIdParser<OrderId>();
