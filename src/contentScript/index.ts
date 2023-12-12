import { Extension } from './extension'
import { CacheFactory } from './cache/cacheFactory'
import { ChatObserverFactory } from './chatObserver/chatObserverFactory'
import { HistoryObserver } from './historyObserver'
import { LoggerFactory } from './logger/loggerFactory'
import { UserSummonerRankingService } from './userSummonerRanking/userSummonerRankingService'

async function init() {
  try {
    const loggerFactory = new LoggerFactory()
    const cacheFactory = new CacheFactory(loggerFactory)

    const historyObserver = new HistoryObserver(loggerFactory)
    const userSummonerRankingService = new UserSummonerRankingService(loggerFactory, cacheFactory)
    const chatObserverFactory = new ChatObserverFactory(loggerFactory)

    const extension = new Extension(historyObserver, userSummonerRankingService, chatObserverFactory, loggerFactory)

    await extension.start()
  } catch (error) {
    console.error(error)
  }
}

init()
