import { getProduct } from 'repository/productsRepo';
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
}));
