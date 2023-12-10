import { Extension } from './extension'
import { CacheFactory } from './cache/cacheFactory'
import { ChatObserverFactory } from './chatObserver/chatObserverFactory'
import { HistoryObserver } from './historyObserver'
import { LoggerFactory } from './logger/loggerFactory'
import { UserLolRankingService } from './userLolRanking/userLolRankingService'

async function init() {
  try {
    const loggerFactory = new LoggerFactory()
    const cacheFactory = new CacheFactory(loggerFactory)

    const historyObserver = new HistoryObserver(loggerFactory)
    const userLolRankingService = new UserLolRankingService(loggerFactory, cacheFactory)
    const chatObserverFactory = new ChatObserverFactory(loggerFactory)

    const extension = new Extension(historyObserver, userLolRankingService, chatObserverFactory, loggerFactory)

    await extension.start()
  } catch (error) {
    console.error(error)
  }
}

init()
