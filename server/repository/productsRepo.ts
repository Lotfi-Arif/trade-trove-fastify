import type { Prisma, Product } from '@prisma/client';
import type { ProductModel } from 'commonTypesWithClient/models';
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
  if (!id.trim()) {
    throw new Error('Product ID must not be empty');
  }

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

// Using Prisma transactions for createProduct to ensure atomic operations
export const createProduct = async (data: Prisma.ProductCreateInput): Promise<ProductModel> => {
  const prismaProduct = await prismaClient.product.create({
    data,
  });

  return toModel(prismaProduct);
};

// The updateProduct function is used to update a product.
export const updateProduct = async (
  id: string,
  { name, price, quantity }: Product,
): Promise<ProductModel> => {
  // use prisma transaction for updating prouct
  const prismaProduct = await prismaClient.product.update({
    where: { id },
    data: { name, price, quantity },
  });

  return toModel(prismaProduct);
};

// the patchProduct function is used to patch a product.
export const patchProduct = async (
  id: string,
  { name, price, quantity }: Product,
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
