import type { DefineMethods } from 'aspida';
import type { Maybe, ProductId } from 'commonTypesWithClient/ids';
import type { ProductModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    params: {
      productId: Maybe<ProductId>;
    };
    resBody: ProductModel;
  };

  put: {
    params: {
      productId: Maybe<ProductId>;
    };
    reqBody: Omit<ProductModel, 'id' | 'created'>;
    resBody: ProductModel;
  };

  patch: {
    params: {
      productId: Maybe<ProductId>;
    };
    reqBody: {
      name?: string;
      price?: number;
      quantity?: number;
    };
    resBody: ProductModel;
  };

  delete: {
    params: {
      productId: Maybe<ProductId>;
    };
    resBody: ProductModel;
  };
}>;
