import { CreationEventData } from "../../../../data/usecases/event"
import { Event } from "@/src/domain/entities"
import { iCreationEvent } from "@/src/domain/usecases/events"
import { MongoDB } from "../../../../infra/database/mongodb"
import { EventRepository } from "../../../../infra/database/mongodb/repositorys"
import { makeCompanyRepository } from "./company.factory"


export function makeEventRepository() {
    const collection = MongoDB.colletion<Event>('events')
    const repository = new EventRepository(collection)
    return repository
}

export const makeUsecaseCreationEvent = () : iCreationEvent => {
  return new CreationEventData(
    makeCompanyRepository(),
    makeEventRepository()
  )
}