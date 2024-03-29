import { Router } from 'express';
import { adaptExpressRoute } from '../adapters/express-route';
import {
  makeAccessCompanyController,
  makeRegisterCompanyController,
  makeResetPasswordCompanyController,
} from '../factories/application/controllers/companies.factory';

export default (router: Router): void => {
  router.post('/', adaptExpressRoute(makeRegisterCompanyController()));
  router.get('/', adaptExpressRoute(makeAccessCompanyController()));

  router.post(
    '/reset-password/:step',
    adaptExpressRoute(makeResetPasswordCompanyController())
  );
};
