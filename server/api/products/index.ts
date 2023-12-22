import type { DefineMethods } from 'aspida';
import type { ProductModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      productId: string;
      limit: number;
    };
    resBody: ProductModel[];
  };

  post: {
    reqBody: Omit<ProductModel, 'id' | 'created'>;
    resBody: ProductModel;
  };

  put: {
    query: {
      productId: string;
    };
    reqBody: Omit<ProductModel, 'id' | 'created'>;
    resBody: ProductModel;
  };

  delete: {
    query: {
      productId: string;
    };
    resBody: ProductModel;
  };
}>;
