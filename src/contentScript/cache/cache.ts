import { Interval } from '../interval'
import { LoggerFactory } from '../logger/loggerFactory'
import { Logger } from '../logger/logger'

interface CacheItem<Key extends string, Value> {
  key: Key
  value: Value
}

interface CacheValue<Value> {
  value: Value
  expiresAt: Date
}

export class Cache<Key extends string, Value> {
  private readonly interval: Interval
  private readonly logger: Logger

  private state = new Map<Key, CacheValue<Value>>()

  private readonly name: string

  public constructor(name: string, loggerFactory: LoggerFactory) {
    this.name = name
    this.interval = new Interval(10000)
    this.logger = loggerFactory.create('Cache')

    this.loadState()

    this.interval.start(() => {
      this.saveState()
    })
  }

  private saveState(): void {
    localStorage.setItem(
      this.name,
      JSON.stringify(
        Array.from(this.state.entries())
          .map(([key, value]) => ({ key, value }))
          .filter(({ value }) => {
            return value.expiresAt.getTime() > Date.now()
          }),
      ),
    )

    this.logger.debug('Saved cache state.', {
      cacheName: this.name,
      cacheSize: this.state.size,
    })
  }

  private loadState(): void {
    const state = localStorage.getItem(this.name)

    if (!state) {
      this.logger.debug('No cache state found.', {
        cacheName: this.name,
      })

      return
    }

    try {
      const parsedState = JSON.parse(state) as CacheItem<Key, CacheValue<Value>>[]

      if (!Array.isArray(parsedState)) {
        return
      }

      parsedState.forEach(({ key, value }) => {
        this.state.set(key, {
          value: value.value,
          expiresAt: new Date(value.expiresAt),
        })
      })

      this.logger.debug('Loaded cache state.', {
        cacheName: this.name,
        cacheSize: this.state.size,
      })
    } catch (error) {
      this.logger.error('Error loading cache state.', {
        cacheName: this.name,
        error,
      })
    }
  }

  public get(key: Key): Value | null {
    const cacheValue = this.state.get(key)

    if (!cacheValue) {
      return null
    }

    const { value, expiresAt } = cacheValue

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
