import { CreateEventData } from "../../../../../src/data/usecases/events";
import { ArchivateEventData } from "../../../../data/usecases/events/ArchivateEvent.data";
import { Event } from "../../../../../src/domain/entities";
import { iArchivateEvent, iCreateEvent } from "../../../../../src/domain/usecases/events";
import { MongoDB } from "../../../../../src/infra/database/mongodb";
import { EventsRepository } from "../../../../infra/database/mongodb/repositorys/events.repository";
import { makeCompanyRepository } from "./companies.factory";


export function makeEventRepository() {
  const collection = MongoDB.colletion<Event>(process.env.COLLECTIONS_NAMES_EVENTS as string);
  const repository = new EventsRepository(collection);
  return repository;
}

export const makeUsecaseCreationEvent = (): iCreateEvent => {
  return new CreateEventData(makeCompanyRepository(), makeEventRepository());
};

export const makeUsecaseArchivationEvent = (): iArchivateEvent => {
  return new ArchivateEventData(makeEventRepository());
};