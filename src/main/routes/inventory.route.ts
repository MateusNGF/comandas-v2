import { Router } from 'express';
import { adaptExpressMiddleware } from '../adapters/express-middleware';
import { adaptExpressRoute } from '../adapters/express-route';
import { makeListInventoryController, makeRegisterItemController } from '../factories/application/controllers';
import { makeMiddlewareAuthentication } from '../factories/application/middlewares/authentication.middleware.factory';

export default (router: Router): void => {
  router.post(
    '/register',
    adaptExpressMiddleware(makeMiddlewareAuthentication()),
    adaptExpressRoute(makeRegisterItemController())
  );

  router.get(
    '/',
    adaptExpressMiddleware(makeMiddlewareAuthentication()),
    adaptExpressRoute(makeListInventoryController())
  );
};
