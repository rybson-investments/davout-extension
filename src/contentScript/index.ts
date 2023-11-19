import { Application } from './application'
import { BadgeElementFactory } from './badgeElementFactory'
import { BatchQueueFactory } from './batchQueueFactory'
import { CacheFactory } from './cacheFactory'
import { HistoryObserver } from './historyObserver'
import { LogLevel } from './logger'
import { LoggerFactory } from './loggerFactory'
import { TwitchChatFactory } from './twitchChatFactory'
import { UserLolRankingService } from './userLolRankingService'

try {
  const loggerFactory = new LoggerFactory(LogLevel.info)
  const cacheFactory = new CacheFactory(loggerFactory)
  const batchQueueFactory = new BatchQueueFactory()

  const historyObserver = new HistoryObserver(loggerFactory)
  const userLolRankingService = new UserLolRankingService(loggerFactory, cacheFactory, batchQueueFactory)
  const twitchChatFactory = new TwitchChatFactory()
  const badgeElementFactory = new BadgeElementFactory()

  const application = new Application(
    historyObserver,
    userLolRankingService,
    twitchChatFactory,
    badgeElementFactory,
    loggerFactory,
  )

  await application.start()
} catch (error) {
  console.error(error)
}
