export enum LogLevel {
  debug = 1,
  info = 2,
  error = 3,
}

export class Logger {
  private readonly source: string
  private readonly logLevel: LogLevel

  public constructor(source: string, logLevel: LogLevel) {
    this.source = source
    this.logLevel = logLevel
  }

  private log(level: LogLevel, message: string, context = {}): void {
    const logContext = {
      ...context,
      source: this.source,
      message,
    }

    if (this.logLevel >= level) {
      return
    }

    if (this.logLevel === LogLevel.debug) {
      console.debug(logContext)

      return
    }

    if (this.logLevel === LogLevel.info) {
      console.info(logContext)

      return
    }

    if (this.logLevel === LogLevel.error) {
      console.error(logContext)

      return
    }

    throw new Error('Invalid logLevel.')
  }

  public info(message: string, context = {}): void {
    this.log(LogLevel.info, message, context)
  }

  public debug(message: string, context = {}): void {
    this.log(LogLevel.debug, message, context)
  }

  public error(message: string, context = {}): void {
    this.log(LogLevel.error, message, context)
  }
}
