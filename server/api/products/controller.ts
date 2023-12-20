import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '$/repository/productsRepo';
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
  post: async ({ body }) => {
    try {
      // Destructure the required fields from the body
      const { name, price, quantity } = body;
      const newProduct = await createProduct(name, price, quantity);
      return {
        status: 201,
        body: newProduct,
      };
    } catch (error) {
      return {
        status: 400,
        body: { error: 'Error creating product' },
      };
    }
  },

  put: async ({ query, body }) => {
    try {
      const { productId } = query;
      if (!productId) {
        return {
          status: 400,
          body: { error: 'Product ID is required for updating' },
        };
      }

      const { name, price } = body;
      const updatedProduct = await updateProduct(productId, name, price);
      return {
        status: 200,
        body: updatedProduct,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Product not found or error updating' },
      };
    }
  },

  delete: async ({ query }) => {
    try {
      const deletedProduct = await deleteProduct(query.productId);
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
