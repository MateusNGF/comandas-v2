import { CompanyEntity } from '../../../../domain/entities';
import { UnauthorizedError } from '../../../../domain/errors';
import { iRegisterCompany } from '../../../../domain/usecases/companies';
import { iCompanyRepository } from '../../../../infra/database/contracts/repositorys';
import { mock, MockProxy } from 'jest-mock-extended';
import { RegisterCompanyData } from '../RegisterCompany.data';
import {
  iCreateAuthenticateForCompanyUsecase,
  iCreateTokenForCompany,
} from '../../../../domain/usecases/authentications';
import { iDatabase } from 'src/infra/database/contracts';

describe('Registration Company', () => {
  let sut: iRegisterCompany;

  let repositorySpy: MockProxy<iCompanyRepository>;

  let sessionDatabase: MockProxy<iDatabase.iSession>;
  let createTokenForCompany: MockProxy<iCreateTokenForCompany>;
  let createAuthenticationForCompany: MockProxy<iCreateAuthenticateForCompanyUsecase>;

  let fakeCompany: CompanyEntity;
  let fakeNewCompany: iRegisterCompany.input;
  let fakeReturnCreateAuth: iCreateAuthenticateForCompanyUsecase.output;
  let fakeReturnCreateToken: iCreateTokenForCompany.output;

  const unauthorizedErrorInHasRecordAuth = new UnauthorizedError(
    'This CNPJ or Email has record, try change your passwoord.'
  );

  beforeAll(() => {
    repositorySpy = mock();
    createTokenForCompany = mock();
    createAuthenticationForCompany = mock();
    sessionDatabase = mock();
  });

  beforeEach(() => {
    sessionDatabase.startSession.mockReturnValue(sessionDatabase);

    sut = new RegisterCompanyData(
      sessionDatabase,
      repositorySpy,
      createAuthenticationForCompany,
      createTokenForCompany
    );

    fakeCompany = {
      id: '01',
      name_fantasy: 'any_name',
      timezone: 'sao_paulo/brazilia',
      cnpj: 'any_cnpj',
      email: 'any_email',
    };

    fakeReturnCreateAuth = {
      authId: '010202',
    };

    fakeReturnCreateToken = {
      token: 'any_token',
    };

    fakeNewCompany = {
      name_fantasy: 'any_name',
      timezone: 'sao_paulo/brazilia',
      cnpj: 'any_cnpj',
      email: 'any_email',
      password: 'any_password',
    };
  });

  it('Should return UnauthorizedError when Email has registraded.', async () => {
    createAuthenticationForCompany.exec.mockRejectedValue(
      unauthorizedErrorInHasRecordAuth
    );

    const response = sut.exec(fakeNewCompany);

    await expect(response).rejects.toThrow(unauthorizedErrorInHasRecordAuth);
  });

  it('Should return UnauthorizedError when CNPJ has registraded.', async () => {
    createAuthenticationForCompany.exec.mockRejectedValue(
      unauthorizedErrorInHasRecordAuth
    );

    const response = sut.exec(fakeNewCompany);

    await expect(response).rejects.toThrow(unauthorizedErrorInHasRecordAuth);
  });

  it('Should return token when record sucess company.', async () => {
    createAuthenticationForCompany.exec.mockResolvedValue(fakeReturnCreateAuth);

    repositorySpy.register.mockResolvedValue({ _id: fakeCompany.id });
    createTokenForCompany.exec.mockResolvedValue(fakeReturnCreateToken);

    const response = await sut.exec(fakeNewCompany);

    expect(response).toEqual(
      expect.objectContaining({
        token: fakeReturnCreateToken.token,
      })
    );
  });
});
