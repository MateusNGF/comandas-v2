import {
  iAccessCompany,
  iRegisterCompany,
} from '../../../../domain/usecases/companies';
import {
  makeUsecaseCreateAuthenticateForCompany,
  makeUsecaseCreateTokenForCompany,
  makeUsecaseHasAuthenticationRecordCompany,
} from './authentications.factory';
import {
  AccessCompanyData,
  RegisterCompanyData,
} from '../../../../../src/data/usecases/companies';
import { makeCompanyRepository } from '../../infra/database/mongo.factory';


export const makeUseCaseRegisterCompany = (): iRegisterCompany => {
  return new RegisterCompanyData(
    makeCompanyRepository(),
    makeUsecaseCreateAuthenticateForCompany(),
    makeUsecaseCreateTokenForCompany()
  );
};

export const makeUseCaseAccessCompany = (): iAccessCompany => {
  return new AccessCompanyData(makeUsecaseHasAuthenticationRecordCompany());
};
