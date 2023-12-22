import { createProduct, getProducts } from '$/repository/productsRepo';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    try {
      const products = await getProducts(query?.limit);
      return {
        status: 200,
        body: products,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Products not found' },
      };
    }
  },

  post: {
    validators: {
      body: z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
    },
    handler: async ({ body }) => ({
      status: 201,
      body: await createProduct(body.name, body.price, body.quantity),
    }),
  },
}));
