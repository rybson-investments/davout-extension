import { LogLevel, Logger } from './logger'

export class LoggerFactory {
  private readonly logLevel: LogLevel

  public constructor(logLevel: LogLevel) {
    this.logLevel = logLevel
  }

  public create(source: string): Logger {
    return new Logger(source, this.logLevel)
  }
}
