import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: Record<'server' | 'order' | 'product' | 'user', 'ok' | 'ng'>;
  };
}>;
