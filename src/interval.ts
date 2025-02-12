// TODO: set to async recursive function to better handle async functions

export class Interval {
  private intervalId: number | null = null
  private readonly delay: number

  public constructor(delay: number) {
    this.intervalId = null
    this.delay = delay
  }

  public isRunning(): boolean {
    return this.intervalId !== null
  }

  public start(callback: () => void) {
    if (this.intervalId) {
      return
    }

    this.intervalId = window.setInterval(callback, this.delay)
  }

  public stop(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId)

      this.intervalId = null
    }
  }
}
