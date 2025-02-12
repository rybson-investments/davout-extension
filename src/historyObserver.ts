import EventEmitter from 'eventemitter3'

import { Logger } from './logger/logger'
import { Interval } from './interval'
import { LoggerFactory } from './logger/loggerFactory'

export enum HistoryObserverEventName {
  routeChange = 'routeChange',
}

export class HistoryObserver extends EventEmitter<HistoryObserverEventName> {
  private readonly logger: Logger
  private readonly interval: Interval
  private currentRoute: string

  public constructor(loggerFactory: LoggerFactory) {
    super()

    this.currentRoute = window.location.pathname
    this.logger = loggerFactory.create('HistoryObserver')
    this.interval = new Interval(1000)

    this.interval.start(() => {
      const newRoute = window.location.pathname

      if (this.currentRoute !== newRoute) {
        this.currentRoute = newRoute

        this.logger.debug('Route changed.', {
          newRoute,
          oldRoute: this.currentRoute,
        })

        this.emit(HistoryObserverEventName.routeChange)
      }
    })
  }
}
