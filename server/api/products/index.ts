import type { DefineMethods } from 'aspida';
import type { ProductModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit: number;
    };
    resBody: ProductModel[];
  };

  post: {
    reqBody: Omit<ProductModel, 'id' | 'created'>;
    resBody: ProductModel;
  };
}>;
