import { ClientSession, MongoClient } from 'mongodb';
import { iDatabase } from '../contracts';

export class MongoSession implements iDatabase.iSession {
  private mongoSession: ClientSession;

  constructor(private readonly mongoClient: MongoClient) {}

  startSession(): iDatabase.iSession {
    if (!this.mongoSession) {
      this.mongoSession = this.mongoClient.startSession();
      return this;
    }
  }

  async endSession(): Promise<void> {
    if (this.mongoSession) {
      await this.mongoSession.endSession();
      this.mongoSession = null;
    }
  }

  async initTransaction(): Promise<iDatabase.iTransaction> {
    this.hasInstanceOfClient();
    this.mongoSession.startTransaction();
    return this;
  }

  async commitTransaction(): Promise<void> {
    this.hasInstanceOfClient();
    await this.mongoSession.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    this.hasInstanceOfClient();
    await this.mongoSession.abortTransaction();
  }

  private hasInstanceOfClient() {
    if (!this.mongoSession) throw Error('Session not implements.');
  }

  get() {
    return this.mongoSession;
  }
}
