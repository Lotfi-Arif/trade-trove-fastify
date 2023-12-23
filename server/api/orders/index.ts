import type { DefineMethods } from 'aspida';
import type { OrderModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit: number;
    };
    resBody: OrderModel[];
  };

  post: {
    reqBody: Omit<OrderModel, 'id' | 'createdAt' | 'updatedAt'>;
    resBody: OrderModel;
  };
}>;
