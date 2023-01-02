import { Auth } from '@/src/domain/entities';
import { iAuthenticationAndReturnTokenCompany, iCreateTokenForCompany } from '@/src/domain/usecases/authentications';
import {
  iHashAdapter,
} from '@/src/infra/cryptography/contracts';
import { iAuthenticationRepository } from '@/src/infra/database/contracts/repositorys';

import { mock, MockProxy } from 'jest-mock-extended';
import {
  BadRequestError, UnauthorizedError,
} from '../../../../domain/errors';
import { AuthenticateAndReturnTokenCompanyData } from '../AuthenticateAndReturnTokenCompany.data';

describe('Authenticate Company', () => {
  let sut: iAuthenticationAndReturnTokenCompany;

  let AuthenticationRepositorySpy: MockProxy<iAuthenticationRepository>;
  let createTokenForCompany : MockProxy<iCreateTokenForCompany>
  let hashAdapterSpy: MockProxy<iHashAdapter>;

  let fakeValidDataAuth: Auth;
  let fakeInputCredentials: iAuthenticationAndReturnTokenCompany.input;

  beforeAll(() => {
    AuthenticationRepositorySpy = mock();
    createTokenForCompany = mock();
    hashAdapterSpy = mock();
  });

  beforeEach(() => {
    sut = new AuthenticateAndReturnTokenCompanyData(
      AuthenticationRepositorySpy,
      createTokenForCompany,
      hashAdapterSpy
    );

    fakeValidDataAuth = {
      _id: "01",
      email: "any_email@gmail.com",
      cnpj: "any_cnpj",
      password: "any_passowrd",
      associeteded_id: "12"
    };

    fakeInputCredentials = {
      password: 'any_passowrdd',
      cnpj: 'any_cnpj',
      email: 'any_email@gmail.com',
    };
  });

  it('Should return BadRequestError when email not was find.', async () => {
    delete fakeInputCredentials.cnpj
    AuthenticationRepositorySpy.getAuthByCredentials.mockResolvedValue(undefined);
    const response = sut.exec(fakeInputCredentials);

    await expect(response).rejects.toThrow(
      new BadRequestError('Account not found.')
    );
  });

  it('Should return BadRequestError when CNPJ not was find.', async () => {
    delete fakeInputCredentials.email
    AuthenticationRepositorySpy.getAuthByCredentials.mockResolvedValue(undefined);
    const response = sut.exec(fakeInputCredentials);

    await expect(response).rejects.toThrow(
      new BadRequestError('Account not found.')
    );
  });

  it('Should return UnauhtorizedError when password incorret.', async () => {
    AuthenticationRepositorySpy.getAuthByCredentials.mockResolvedValue(fakeValidDataAuth);

    fakeInputCredentials.password = 'incorret_password';
    hashAdapterSpy.compare.mockResolvedValue(
      fakeValidDataAuth.password === fakeInputCredentials.password // always false
    );

    const response = sut.exec(fakeInputCredentials);

    await expect(response).rejects.toThrow(new UnauthorizedError());
  });

  it('Should return valid token when access is valid.', async () => {
    const tokenMockado = { token : "any_token"}
    AuthenticationRepositorySpy.getAuthByCredentials.mockResolvedValue(fakeValidDataAuth);

    hashAdapterSpy.compare.mockResolvedValue(true);
    createTokenForCompany.exec.mockResolvedValue(tokenMockado);

    const response = await sut.exec(fakeInputCredentials);

    expect(response).toEqual(expect.objectContaining(tokenMockado));
  });
});