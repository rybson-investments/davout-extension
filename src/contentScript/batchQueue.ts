import { Interval } from './interval'

interface BatchQueueItem<Item, Result> {
  item: Item
  callback: (result: Result) => void
}

export type BatchQueueCallback<Item, Result> = (items: Item[]) => Promise<Result[]>

export class BatchQueue<Item, Result> {
  private readonly proccessCallback: (items: Item[]) => Promise<Result[]>
  private readonly interval: Interval
  private queue: BatchQueueItem<Item, Result>[] = []

  public constructor(intervalDelay: number, proccessCallback: (items: Item[]) => Promise<Result[]>) {
    this.interval = new Interval(intervalDelay)
    this.proccessCallback = proccessCallback
  }

  public add(item: Item, callback: (result: Result) => void): void {
    this.queue.push({
      item,
      callback,
    })
  }

  public clear(): void {
    this.queue = []
  }

  private async processQueue(): Promise<void> {
    const queueItemsToProcess = [...this.queue]

    this.clear()

    if (!queueItemsToProcess.length) {
      return
    }

    const results = await this.proccessCallback(queueItemsToProcess.map((queueItem) => queueItem.item))

    queueItemsToProcess.forEach((queueItem, index) => {
      queueItem.callback(results[index])
    })
  }

  public start(): void {
    this.interval.start(() => {
      this.processQueue()
    })
  }

  public stop(): void {
    this.interval.stop()
  }
}
