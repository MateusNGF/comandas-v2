import { Event } from '@/src/domain/entities';
import { iBaseRepository } from '.';

export interface iEventRepository extends iBaseRepository<Event> {
  register(event: Event): Promise<{
    _id: string;
    createdAt: string;
  }>;
}