export class Logger {
  private readonly source: string

  public constructor(source: string) {
    this.source = source
  }

  public info(message: string, context = {}): void {
    console.info(message, {
      context,
      source: this.source,
    })
  }

  public debug(message: string, context = {}): void {
    console.debug(message, {
      context,
      source: this.source,
    })
  }

  public error(message: string, context = {}): void {
    console.error(message, {
      context,
      source: this.source,
    })
  }
}
