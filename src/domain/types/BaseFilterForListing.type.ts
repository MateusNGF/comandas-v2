import { iEntity } from '../contracts/iEntity';

export type BaseFilterForListing = {
  text?: string;
  limit?: number;
  offset?: number;
};

export type BaseFilterForEntities = iEntity & BaseFilterForListing;
