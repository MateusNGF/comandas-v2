import { iCompanyRepository } from '../../../infra/database/contracts/repositorys';
import { iRegisterCompany } from '../../../domain/usecases/companies';
import { Company } from '../../../domain/entities';
import {
  iCreateAuthenticateForCompanyUsecase,
  iCreateTokenForCompany,
} from '../../../../src/domain/usecases/authentications';
import { iCreateInventory } from '../../../domain/usecases/inventories/iCreateInventory.usecase';

export class RegisterCompanyData extends iRegisterCompany {
  constructor(
    private readonly companyRepository: iCompanyRepository,
    private readonly createAuthenticationForCompany: iCreateAuthenticateForCompanyUsecase,
    private readonly createTokenForCompany: iCreateTokenForCompany,
    private readonly createInvetory: iCreateInventory
  ) {
    super();
  }

  async exec(input: iRegisterCompany.input): Promise<iRegisterCompany.output> {
    const company = new Company({
      ...input,
      id: this.companyRepository.generateId(),
    });

    await this.createAuthenticationForCompany.exec({
      associeteded_id: company.id,
      email: company.email,
      cnpj: company.cnpj,
      password: input.password,
    });

    await this.companyRepository.register({
      id: company.id,
      name_fantasy: company.name_fantasy,
      cnpj: company.cnpj,
      email: company.email,
      timezone: company.timezone,
    });

    await this.createInvetory.exec({
      companyId: company.id,
      inventory: {},
    });

    const { token } = await this.createTokenForCompany.exec({
      companyId: company.id,
    });

    return {
      token: token,
    };
  }
}
