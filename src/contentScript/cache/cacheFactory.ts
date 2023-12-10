import { Cache } from './cache'
import { LoggerFactory } from '../logger/loggerFactory'

export class CacheFactory {
  private readonly loggerFactory: LoggerFactory

  public constructor(loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory
  }

  public create<Key extends string, Value>(name: string): Cache<Key, Value> {
    return new Cache<Key, Value>(name, this.loggerFactory)
  }
}
