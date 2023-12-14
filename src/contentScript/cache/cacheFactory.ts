import { Cache } from './cache'

export class CacheFactory {
  public create<Key extends string, Value>(): Cache<Key, Value> {
    return new Cache<Key, Value>()
  }
}
