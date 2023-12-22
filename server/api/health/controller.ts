import { prismaClient } from '$/service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      server: 'ok',
      task: await prismaClient.task
        .count()
        .then(() => 'ok' as const)
        .catch(() => 'ng' as const),
      order: await prismaClient.order
        .count()
        .then(() => 'ok' as const)
        .catch(() => 'ng' as const),
      product: await prismaClient.product
        .count()
        .then(() => 'ok' as const)
        .catch(() => 'ng' as const),
      user: await prismaClient.user
        .count()
        .then(() => 'ok' as const)
        .catch(() => 'ng' as const),
    },
  }),
}));
