import { Auth } from "../../../domain/entities";
import { UnauthorizedError } from "../../../domain/errors";
import { iHasAuthenticationRecordCompany } from "../../../domain/usecases/authentications";
import { iAuthenticationRepository } from "../../../infra/database/contracts/repositorys";
import { mock, MockProxy } from "jest-mock-extended";
import { HasAuthenticationRecordCompanyData } from "./HasAuthenticationRecordCompany.data";

describe('Has Authentication record for company', () => {
    let sut: iHasAuthenticationRecordCompany;
    let AuthenticationRepositorySpy: MockProxy<iAuthenticationRepository>;

    let fakeValidDataAuth: Auth;
    let fakeInputCredentials: iHasAuthenticationRecordCompany.input;

    beforeAll(() => {
        AuthenticationRepositorySpy = mock();
    });

    beforeEach(() => {
        sut = new HasAuthenticationRecordCompanyData(
            AuthenticationRepositorySpy
        )


        fakeValidDataAuth = {
            _id: "01",
            email: "any_email@gmail.com",
            cnpj: "any_cnpj",
            password: "any_passowrd",
            associeteded_id: "12"
        };
        
        fakeInputCredentials = {
            email: "fake_email",
            cnpj: "fake_cnpj"
        }
    })

    it("Should return void when email donst is record", async () => {
        delete fakeInputCredentials.cnpj
        AuthenticationRepositorySpy.getAuth.mockResolvedValue(undefined);

        const response = await sut.exec(fakeInputCredentials);
        expect(response).toBe(undefined);
    })


    it("Should return void when cnpj donst is record", async () => {
        delete fakeInputCredentials.email
        AuthenticationRepositorySpy.getAuth.mockResolvedValue(undefined);

        const response = await sut.exec(fakeInputCredentials);
        expect(response).toBe(undefined);
    })

    it("Should return UnauthorizedError when email is record", async () => {
        delete fakeInputCredentials.cnpj
        AuthenticationRepositorySpy.getAuth.mockResolvedValue(fakeValidDataAuth);

        const response = sut.exec(fakeInputCredentials);
  
        await expect(response).rejects.toThrow(
            new UnauthorizedError('This CNPJ or Email has record, try change your passwoord.')
          );
    })

    it("Should return UnauthorizedError when cnpj is record", async () => {
        delete fakeInputCredentials.email
        AuthenticationRepositorySpy.getAuth.mockResolvedValue(fakeValidDataAuth);

        const response = sut.exec(fakeInputCredentials);
  
        await expect(response).rejects.toThrow(
            new UnauthorizedError('This CNPJ or Email has record, try change your passwoord.')
          );
    })

});