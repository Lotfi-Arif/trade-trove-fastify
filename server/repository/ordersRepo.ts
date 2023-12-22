import { prismaClient } from '$/service/prismaClient';
import type { Order } from '@prisma/client';
import type { OrderModel } from 'commonTypesWithClient/models';
import { randomUUID } from 'crypto';
import { orderIdParser, productIdParser, userIdParser } from '../service/idParsers';

// The toModel function is used to convert the Prisma Order type to the OrderModel type.
const toModel = (prismaOrder: Order): OrderModel => ({
  id: orderIdParser.parse(prismaOrder.id),
  userId: userIdParser.parse(prismaOrder.userId),
  productId: productIdParser.parse(prismaOrder.productId),
  quantity: prismaOrder.quantity,
  created: prismaOrder.createdAt.getTime(),
});

// The getOrder function is used to get a single order by its ID.
export const getOrder = async (id: string): Promise<OrderModel> => {
  // Check if the ID is an empty string
  if (!id.trim()) {
    throw new Error('Order ID must not be empty');
  }

  // Continue with existing checks for ID validity
  if (!orderIdParser.safeParse(id).success) {
    throw new Error(`Invalid order ID: ${id}`);
  }

  const prismaOrder = await prismaClient.order.findUnique({
    where: { id },
  });

  if (!prismaOrder) {
    throw new Error(`Order not found: ${id}`);
  }
  return toModel(prismaOrder);
};

// The getOrders function is used to get all orders.
export const getOrders = async (limit?: number): Promise<OrderModel[]> => {
  const prismaOrders = await prismaClient.order.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return prismaOrders.map(toModel);
};

// The getOrdersByUserId function is used to get all orders by a user.
export const getOrdersByUserId = async (userId: string): Promise<OrderModel[]> => {
  const prismaOrders = await prismaClient.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return prismaOrders.map(toModel);
};

// The createOrder function is used to create a new order.
export const createOrder = async (
  userId: OrderModel['userId'],
  productId: OrderModel['productId'],
  quantity: OrderModel['quantity']
): Promise<OrderModel> => {
  const prismaOrder = await prismaClient.order.create({
    data: {
      userId,
      productId,
      quantity,
      createdAt: new Date(),
    },
  });

  return toModel(prismaOrder);
};

// The updateOrder function is used to update an order.
export const updateOrder = async (
  id: string,
  userId: string,
  productId: string,
  quantity: number
): Promise<OrderModel> => {
  const prismaOrder = await prismaClient.order.update({
    where: { id },
    data: {
      userId,
      productId,
      quantity,
    },
  });

  return toModel(prismaOrder);
};

// The patchOrder function is used to patch an order.
export const patchOrder = async (id: string, quantity?: number): Promise<OrderModel> => {
  const prismaOrder = await prismaClient.order.update({
    where: { id },
    data: { quantity },
  });

  return toModel(prismaOrder);
};

// The deleteOrder function is used to delete an order.
export const deleteOrder = async (id: string): Promise<OrderModel> => {
  const prismaOrder = await prismaClient.order.delete({
    where: { id },
  });

  return toModel(prismaOrder);
};

// The deleteAllOrders function is used to delete all orders.
export const deleteAllOrders = async (): Promise<void> => {
  await prismaClient.order.deleteMany({});
};

// The deleteOrdersByUserId function is used to delete all orders by a user.
export const deleteOrdersByUserId = async (userId: string): Promise<void> => {
  await prismaClient.order.deleteMany({
    where: { userId },
  });
};

// The seedOrders function is used to seed the database with some orders.
export const seedOrders = async (): Promise<void> => {
  await prismaClient.order.createMany({
    data: [
      {
        userId: randomUUID(),
        productId: randomUUID(),
        quantity: 1,
        createdAt: new Date(),
      },
      {
        userId: randomUUID(),
        productId: randomUUID(),
        quantity: 2,
        createdAt: new Date(),
      },
      {
        userId: randomUUID(),
        productId: randomUUID(),
        quantity: 3,
        createdAt: new Date(),
      },
    ],
  });
};

// The getOrderById function is used to get an order by its id.
export const getOrderById = async (id: string): Promise<OrderModel> => {
  const prismaOrder = await prismaClient.order.findUnique({
    where: { id },
  });

  if (!prismaOrder) {
    throw new Error('Order not found');
  }

  return toModel(prismaOrder);
};
