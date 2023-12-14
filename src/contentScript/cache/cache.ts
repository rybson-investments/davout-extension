interface CacheItem<Value> {
  value: Value
  expiresAt: Date
}

export class Cache<Key extends string, Value> {
  private state = new Map<Key, CacheItem<Value>>()

  public get(key: Key): Value | null {
    const cacheItem = this.state.get(key)

    if (!cacheItem) {
      return null
    }

    const { value, expiresAt } = cacheItem

    if (expiresAt.getTime() < Date.now()) {
      this.delete(key)

      return null
    }

    return value
  }

  public delete(key: Key): void {
    this.state.delete(key)
  }

  public set(key: Key, value: Value, expiresIn: number): void {
    const expiresAt = new Date(Date.now() + expiresIn)

    this.state.set(key, { value, expiresAt })
  }
}
