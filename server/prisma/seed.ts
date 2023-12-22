import { OrderStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password1', // Remember to hash in production!
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: 'password2', // Remember to hash in production!
    },
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      price: 100.0,
      quantity: 10,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      price: 200.0,
      quantity: 20,
    },
  });

  // Create sample orders
  await prisma.order.create({
    data: {
      user: { connect: { id: user1.id } },
      product: { connect: { id: product1.id } },
      quantity: 1,
      status: OrderStatus.PENDING,
    },
  });

  // Create sample carts
  await prisma.cart.create({
    data: {
      user: { connect: { id: user2.id } },
      products: { connect: [{ id: product1.id }, { id: product2.id }] },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
