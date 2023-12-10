import { LoggerFactory } from '../logger/loggerFactory'
import { ChatObserver } from './chatObserver'

export class ChatObserverFactory {
  private readonly loggerFactory: LoggerFactory

  public constructor(loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory
  }

  public create(): ChatObserver {
    return new ChatObserver(this.loggerFactory)
  }
}
