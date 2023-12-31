import type { Product, User } from '@prisma/client';
import { OrderStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PrismaError = Error & { code?: string };

function handleError(error: PrismaError, errorCode: string): void {
  if (error.code === errorCode) {
    console.log(`Duplicate entry encountered: ${error.message}`);
  } else {
    throw error;
  }
}

async function createUser(email: string, firebaseUid: string): Promise<User | null> {
  try {
    return await prisma.user.create({
      data: {
        id: firebaseUid,
        email,
        firebaseUid, // Use the Firebase UID here
        displayName: 'Sample User', // Optional, add a display name
        photoURL: 'https://example.com/photo.jpg', // Optional, add a photo URL
      },
    });
  } catch (error: unknown) {
    handleError(error as PrismaError, 'P2002');
    return null;
  }
}

async function createProduct(
  name: string,
  price: number,
  quantity: number,
): Promise<Product | null> {
  try {
    return await prisma.product.create({ data: { name, price, quantity } });
  } catch (error: unknown) {
    handleError(error as PrismaError, 'P2002');
    return null;
  }
}

async function addProductToCart(cartId: string, productId: string, quantity: number) {
  try {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  } catch (error: unknown) {
    handleError(error as PrismaError, 'P2002');
  }
}

async function main(): Promise<void> {
  // Delete existing data first to ensure a clean start
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create sample data
  const user1 = await createUser('user1@example.com', 'firebaseUid1');
  const product1 = await createProduct('Product 1', 100.0, 10);
  const product2 = await createProduct('Product 2', 200.0, 20);

  if (user1) {
    // Create a new cart for the user
    const cart = await prisma.cart.create({
      data: {
        userId: user1.id,
      },
    });

    // Add products to the cart
    if (product1) await addProductToCart(cart.id, product1.id, 1);
    if (product2) await addProductToCart(cart.id, product2.id, 1);

    // Create an order for the user
    if (product1) {
      await prisma.order.create({
        data: {
          userId: user1.id,
          productId: product1.id,
          quantity: 1,
          status: OrderStatus.PENDING,
        },
      });
    }
  }
}

main()
  .catch((e: unknown) => {
    console.error('An error occurred:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
