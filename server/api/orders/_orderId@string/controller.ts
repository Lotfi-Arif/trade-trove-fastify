import { deleteOrder, getOrder, patchOrder, updateOrder } from 'repository/ordersRepo';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params }) => {
    try {
      const order = await getOrder(params.orderId);
      return {
        status: 200,
        body: order,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Order not found' },
      };
    }
  },

  put: {
    handler: async ({ body, params }) => ({
      status: 204,
      body: await updateOrder(params.orderId, body.userId, body.productId, body.quantity),
    }),
  },

  patch: {
    handler: async ({ body, params }) => ({
      status: 204,
      body: await patchOrder(params.orderId, body.quantity),
    }),
  },

  delete: async ({ params }) => {
    try {
      const deletedOrder = await deleteOrder(params.orderId);
      return {
        status: 200,
        body: deletedOrder,
      };
    } catch (error) {
      return {
        status: 404,
        body: { error: 'Order not found or error deleting' },
      };
    }
  },
}));
