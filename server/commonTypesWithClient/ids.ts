import type { z } from 'zod';

type Branded<T extends string> = string & z.BRAND<T>;

export type Maybe<T> = T | Branded<'Maybe'>;

export type UserId = Branded<'UserId'>;

export type ProductId = Branded<'ProductId'>;

export type OrderId = Branded<'OrderId'>;

export type CartId = Branded<'CartId'>;
