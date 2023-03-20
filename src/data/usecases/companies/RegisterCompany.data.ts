import { iCompanyRepository } from '../../../infra/database/contracts/repositorys';
import { iRegisterCompany } from '../../../domain/usecases/companies';
import { CompanyEntity } from '../../../domain/entities';
import {
  iCreateAuthenticateForCompanyUsecase,
  iCreateTokenForCompany,
} from '../../../../src/domain/usecases/authentications';
import { iUsecase } from 'src/domain/contracts';
import { iDatabase } from 'src/infra/database/contracts';

export class RegisterCompanyData extends iRegisterCompany {
  constructor(
    private readonly sessionDatabase: iDatabase.iSession,
    private readonly companyRepository: iCompanyRepository,
    private readonly createAuthenticationForCompany: iCreateAuthenticateForCompanyUsecase,
    private readonly createTokenForCompany: iCreateTokenForCompany
  ) {
    super();
  }

  async exec(
    input: iRegisterCompany.input,
    options?: iUsecase.Options
  ): Promise<iRegisterCompany.output> {
    const session = this.sessionDatabase;

    session.startSession();

    try {
      await session.initTransaction();

      const company = new CompanyEntity({
        ...input,
        id: this.companyRepository.generateId(),
      });

      const requestResult = await Promise.all([
        this.createAuthenticationForCompany.exec(
          {
            associeteded_id: company.id,
            email: company.email,
            cnpj: company.cnpj,
            password: input.password,
          },
          { session }
        ),
        this.companyRepository.register(
          {
            id: company.id,
            name_fantasy: company.name_fantasy,
            cnpj: company.cnpj,
            email: company.email,
            timezone: company.timezone,
          },
          { session }
        ),
        this.createTokenForCompany.exec(
          {
            companyId: company.id,
          },
          { session }
        ),
      ]);

      await session.commitTransaction();
      return {
        token: requestResult[2].token,
      };
    } catch (error) {
      await session.rollbackTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
