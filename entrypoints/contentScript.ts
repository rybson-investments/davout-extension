import { CacheFactory } from '@/src/cache/cacheFactory'
import { ChatObserverFactory } from '@/src/chatObserver/chatObserverFactory'
import { Extension } from '@/src/extension'
import { HistoryObserver } from '@/src/historyObserver'
import { LoggerFactory } from '@/src/logger/loggerFactory'
import { UserSummonerRankingService } from '@/src/userSummonerRanking/userSummonerRankingService'

export default defineContentScript({
  matches: ['*://*.twitch.tv/*'],
  main() {
    async function init() {
      try {
        const loggerFactory = new LoggerFactory()
        const cacheFactory = new CacheFactory()

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
  },
})
