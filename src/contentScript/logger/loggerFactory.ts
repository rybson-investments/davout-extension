import { Logger } from './logger'

export class LoggerFactory {
  public create(source: string): Logger {
    return new Logger(source)
  }
}
