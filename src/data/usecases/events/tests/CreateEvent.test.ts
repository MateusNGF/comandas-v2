import { Company, Event } from '@/src/domain/entities';
import {
  MissingParamError,
  UnauthorizedError,
} from '../../../../domain/errors';
import { CreateEventData } from '../CreateEvent.data';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  iCompanyRepository,
  iEventRepository,
} from '../../../../infra/database/contracts/repositorys';
import { iCreateEvent } from '../../../../domain/usecases/events';

describe('Creation Event', () => {
  let sut: iCreateEvent;

  let companyRepositorySpy: MockProxy<iCompanyRepository>;
  let eventRepositorySpy: MockProxy<iEventRepository>;

  let fakeCompany: Company;
  let fakeEvent: Event;
  let fakeBody: iCreateEvent.input;

  beforeAll(() => {
    companyRepositorySpy = mock();
    eventRepositorySpy = mock();
  });
  beforeEach(() => {
    sut = new CreateEventData(companyRepositorySpy, eventRepositorySpy);

    fakeEvent = {
      name: 'fake_event',
      description: 'fake_description',
      start_date: '2024/02/12',
      end_date: '2024/02/15',
    };

    fakeCompany = {
      id: 'any_id',
      name_fantasy: 'any_name',
      timezone: 'Europe/Amsterdam',
      cnpj: 'any_cnpj',
      email: 'any_email',
    };

    fakeBody = {
      companyId: 'any_id_company',
      event: fakeEvent,
    };
  });

  it('Should return MissingParamError if companyId is missing.', async () => {
    delete fakeBody.companyId;
    const response = sut.exec(fakeBody);
    await expect(response).rejects.toThrow(new MissingParamError('companyId'));
  });

  it('Should return MissingParamError if event is missing.', async () => {
    delete fakeBody.event;
    companyRepositorySpy.findById.mockResolvedValue(fakeCompany);
    const response = sut.exec(fakeBody);
    await expect(response).rejects.toThrow(new MissingParamError('event'));
  });

  it('Should return UnauthorizedError if companyId not has registered.', async () => {
    companyRepositorySpy.findById.mockResolvedValue(null);
    const response = sut.exec(fakeBody);

    await expect(response).rejects.toThrow(
      new UnauthorizedError('Company not found.')
    );
  });

  it('Should returun undefined if register event failed.', async () => {
    companyRepositorySpy.findById.mockResolvedValue(fakeCompany);
    eventRepositorySpy.register.mockResolvedValue(null);

    const response = await sut.exec(fakeBody);

    expect(response).toBe(undefined);
  });
});
