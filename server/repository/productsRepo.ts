import type { Product } from '@prisma/client';
import type { ProductModel } from 'commonTypesWithClient/models';
import { randomUUID } from 'crypto';
import { productIdParser } from '../service/idParsers';
import { prismaClient } from '../service/prismaClient';

// The toModel function is used to convert the Prisma Product type to the ProductModel type.
const toModel = (prismaProduct: Product): ProductModel => ({
  id: productIdParser.parse(prismaProduct.id),
  name: prismaProduct.name,
  quantity: prismaProduct.quantity,
  price: prismaProduct.price,
  createdAt: prismaProduct.createdAt,
  updatedAt: prismaProduct.updatedAt,
});

// The getProduct function is used to get a single product by its ID.
export const getProduct = async (id: string): Promise<ProductModel> => {
  // Check if the ID is an empty string
  if (!id.trim()) {
    throw new Error('Product ID must not be empty');
  }

  // Continue with existing checks for ID validity
  if (!productIdParser.safeParse(id).success) {
    throw new Error(`Invalid product ID: ${id}`);
  }

  const prismaProduct = await prismaClient.product.findUnique({
    where: { id },
  });

  if (!prismaProduct) {
    throw new Error(`Product not found: ${id}`);
  }
  return toModel(prismaProduct);
};

// The getProducts function is used to get all products.
export const getProducts = async (limit?: number): Promise<ProductModel[]> => {
  const prismaProducts = await prismaClient.product.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return prismaProducts.map(toModel);
};

// The createProduct function is used to create a new product.
export const createProduct = async (
  name: ProductModel['name'],
  price: ProductModel['price'],
  quantity: ProductModel['quantity']
): Promise<ProductModel> => {
  const prismaProduct = await prismaClient.product.create({
    data: {
      name,
      quantity,
      price,
      createdAt: new Date(),
    },
  });

  return toModel(prismaProduct);
};

// The updateProduct function is used to update a product.
export const updateProduct = async (
  id: string,
  name: string,
  price: number,
  quantity: number
): Promise<ProductModel> => {
  const prismaProduct = await prismaClient.product.update({
    where: { id },
    data: { name, price, quantity },
  });

  return toModel(prismaProduct);
};

// the patchProduct function is used to patch a product.
export const patchProduct = async (
  id: string,
  name?: string,
  price?: number,
  quantity?: number
): Promise<ProductModel> => {
  const prismaProduct = await prismaClient.product.update({
    where: { id },
    data: { name, price, quantity },
  });

  return toModel(prismaProduct);
};

// The deleteProduct function is used to delete a product.
export const deleteProduct = async (id: string): Promise<ProductModel> => {
  const prismaProduct = await prismaClient.product.delete({
    where: { id },
  });

  return toModel(prismaProduct);
};

// The deleteAllProducts function is used to delete all products.
export const deleteAllProducts = async (): Promise<void> => {
  await prismaClient.product.deleteMany({});
};

// The seedProducts function is used to seed the database with some products.
export const seedProducts = async (): Promise<void> => {
  await prismaClient.product.createMany({
    data: [
      {
        id: randomUUID(),
        name: 'Product 1',
        quantity: 1,
        price: 100,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'Product 2',
        quantity: 1,
        price: 200,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: 'Product 3',
        price: 300,
        quantity: 1,
        createdAt: new Date(),
      },
    ],
  });
};

// The getProductCount function is used to get the number of products.
export const getProductCount = async (): Promise<number> => {
  const count = await prismaClient.product.count();
  return count;
};

// The getProductTotalPrice function is used to get the total price of all products.
export const getProductTotalPrice = async (): Promise<number> => {
  const totalPrice = await prismaClient.product.aggregate({
    _sum: {
      price: true,
    },
  });

  if (totalPrice._sum.price === null) throw new Error('No products found');

  return totalPrice._sum.price;
};

// The getProductAveragePrice function is used to get the average price of all products.
export const getProductAveragePrice = async (): Promise<number> => {
  const averagePrice = await prismaClient.product.aggregate({
    _avg: {
      price: true,
    },
  });

  if (averagePrice._avg.price === null) throw new Error('No products found');

  return averagePrice._avg.price;
};
