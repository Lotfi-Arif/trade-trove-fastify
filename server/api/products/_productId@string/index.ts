import type { DefineMethods } from 'aspida';
import type { ProductModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    params: {
      productId: string;
    };
    resBody: ProductModel;
  };
}>;
