import { BatchQueue, BatchQueueCallback } from './batchQueue'

export class BatchQueueFactory {
  public create<Item, Result>(
    intervalDelay: number,
    callback: BatchQueueCallback<Item, Result>,
  ): BatchQueue<Item, Result> {
    return new BatchQueue<Item, Result>(intervalDelay, callback)
  }
}
