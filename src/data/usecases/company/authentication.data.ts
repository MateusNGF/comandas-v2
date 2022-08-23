import { AuthenticationCompany } from "@/src/domain/usecases/company";

export class AuthenticationCompanyData implements AuthenticationCompany {

  auth(
    input: AuthenticationCompany.inputCredentials
  ): Promise<AuthenticationCompany.AccessCredentials> {
    return Promise.resolve({
      token: input.email,
    });
  }
}
