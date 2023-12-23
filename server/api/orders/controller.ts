import { productIdParser, userIdParser } from '$/service/idParsers';
import { OrderStatus } from '@prisma/client';
import { createOrder, getOrders } from 'repository/ordersRepo';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    try {
      const orders = await getOrders(query?.limit);
      return {
        status: 200,
        body: orders,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Orders not found' },
      };
    }
  },

  post: {
    validators: {
      body: z.object({
        userId: userIdParser,
        productId: productIdParser,
        quantity: z.number().int().positive(),
        status: z.nativeEnum(OrderStatus),
      }),
    },
    handler: async ({ body }) => ({
      status: 201,
      body: await createOrder(body),
    }),
  },
}));
