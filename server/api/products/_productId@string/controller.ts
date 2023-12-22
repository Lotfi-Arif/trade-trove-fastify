import { deleteProduct, getProduct, patchProduct, updateProduct } from 'repository/productsRepo';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params }) => {
    try {
      const product = await getProduct(params.productId);
      return {
        status: 200,
        body: product,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Product not found' },
      };
    }
  },

  put: {
    validators: {
      body: z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
    },
    handler: async ({ body, params }) => ({
      status: 201,
      body: await updateProduct(params.productId, body.name, body.price, body.quantity),
    }),
  },

  patch: {
    validators: {
      body: z.object({
        name: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
      }),
    },
    handler: async ({ body, params }) => ({
      status: 204,
      body: await patchProduct(params.productId, body.name, body.price, body.quantity),
    }),
  },

  delete: async ({ params }) => {
    try {
      const deletedProduct = await deleteProduct(params.productId);
      return {
        status: 200,
        body: deletedProduct,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Product not found or error deleting' },
      };
    }
  },
}));
