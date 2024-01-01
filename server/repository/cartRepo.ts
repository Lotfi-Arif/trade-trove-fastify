import { prismaClient } from '$/service/prismaClient';
import type { Cart, CartItem } from '@prisma/client';
import { cartParser, type CartModel } from 'commonTypesWithClient/models';
import { cartIdParser, productIdParser, userIdParser } from '../service/idParsers';

const toModel = async (prismaCart: Cart): Promise<CartModel> => {
  // Fetch related cart items separately
  const cartItems = await prismaClient.cartItem.findMany({
    where: { cartId: prismaCart.id },
  });

  // Construct the data object using the fields from prismaCart and the fetched items
  const cartData = {
    id: cartIdParser.parse(prismaCart.id),
    userId: userIdParser.parse(prismaCart.userId),
    createdAt: prismaCart.createdAt,
    updatedAt: prismaCart.updatedAt,
    // Map the fetched items to the structure expected by CartItemModel[]
    items: cartItems.map((item: CartItem) => ({
      cartId: cartIdParser.parse(item.cartId),
      productId: productIdParser.parse(item.productId),
      quantity: item.quantity,
    })),
  };

  // Validate and parse the data using the Zod schema to ensure it conforms to the CartModel structure
  const cartModel = cartParser.parse(cartData);

  return cartModel;
};

// Get a user's cart
export const getCartByUserId = async (userId: string): Promise<CartModel> => {
  const prismaCart = await prismaClient.cart.findUnique({
    where: { userId },
    include: { items: true }, // Include related products
  });

  if (!prismaCart) {
    throw new Error('Cart not found');
  }
  return toModel(prismaCart);
};

// Create a new cart for a user
export const createCart = async (userId: string): Promise<CartModel> => {
  const prismaCart = await prismaClient.cart.create({
    data: { userId },
  });
  return toModel(prismaCart);
};

// Add a product to the user's cart
export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<CartModel> => {
  const cart = await prismaClient.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Ensure product exists and is explicitly checked
  const product = await prismaClient.product.findUnique({ where: { id: productId } });
  if (product === null) {
    throw new Error('Product not found');
  }

  // Explicitly check for undefined when finding the existing product
  const existingProduct = cart.items.find((item) => item.productId === productId);
  if (existingProduct !== undefined) {
    // Update quantity if it already exists
    await prismaClient.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: existingProduct.productId,
        },
      },
      data: { quantity: existingProduct.quantity + quantity },
    });
  } else {
    // Add new product to the cart
    await prismaClient.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  // Return the updated cart
  return getCartByUserId(userId);
};

// Remove an item from the cart
export const removeItemFromCart = async (userId: string, productId: string): Promise<CartModel> => {
  return prismaClient.$transaction(async (prisma) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    return getCartByUserId(userId);
  });
};

// Clear all items from the cart
export const clearCart = async (userId: string): Promise<CartModel> => {
  return prismaClient.$transaction(async (prisma) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return getCartByUserId(userId);
  });
};

// Delete a cart
export const deleteCart = async (userId: string): Promise<void> => {
  await prismaClient.$transaction(async (prisma) => {
    await prisma.cart.delete({
      where: { userId },
    });
  });

  return;
};

// Update cart (general update if needed, e.g., updating a cart's special notes, etc.)
export const updateCart = async (userId: string, updateData: Cart): Promise<CartModel> => {
  const prismaCart = await prismaClient.cart.update({
    where: { userId },
    data: updateData,
  });

  return toModel(prismaCart);
};

export const calculateTotalPrice = async (userId: string): Promise<number> => {
  const cart = await prismaClient.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (cart === null) {
    throw new Error('Cart not found');
  }

  if (cart.items === undefined || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  return cart.items.reduce((total, item) => {
    // Explicitly check that item.product is not null or undefined
    if (item.product !== null && item.product !== undefined) {
      // Also ensure that item.product.price is a number
      const price = typeof item.product.price === 'number' ? item.product.price : 0;
      return total + item.quantity * price;
    }
    return total;
  }, 0);
};
