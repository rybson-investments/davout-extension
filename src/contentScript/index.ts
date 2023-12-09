import { Application } from './application'
import { CacheFactory } from './cacheFactory'
import { HistoryObserver } from './historyObserver'
import { LogLevel } from './logger'
import { LoggerFactory } from './loggerFactory'
import { TwitchChatFactory } from './twitchChatFactory'
import { UserLolRankingService } from './userLolRankingService'

async function init() {
  try {
    const loggerFactory = new LoggerFactory(LogLevel.debug)
    const cacheFactory = new CacheFactory(loggerFactory)

    const historyObserver = new HistoryObserver(loggerFactory)
    const userLolRankingService = new UserLolRankingService(loggerFactory, cacheFactory)
    const twitchChatFactory = new TwitchChatFactory()

    const application = new Application(historyObserver, userLolRankingService, twitchChatFactory, loggerFactory)

    await application.start()
  } catch (error) {
    console.error(error)
  }
}

init()
