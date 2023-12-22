import type { DefineMethods } from 'aspida';
import type { OrderModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    params: {
      orderId: string;
    };
    resBody: OrderModel;
  };

  put: {
    params: {
      orderId: string;
    };
    reqBody: Omit<OrderModel, 'id' | 'created'>;
    resBody: OrderModel;
  };

  patch: {
    params: {
      orderId: string;
    };
    reqBody: {
      quantity?: number;
    };
    resBody: OrderModel;
  };

  delete: {
    params: {
      orderId: string;
    };
    resBody: OrderModel;
  };
}>;
