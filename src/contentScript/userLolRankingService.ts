import axios from 'axios'

import { Cache } from './cache'
import { CacheFactory } from './cacheFactory'
import { Logger } from './logger'
import { LoggerFactory } from './loggerFactory'
import { UserLolRanking } from './userLolRanking'

export class UserLolRankingService {
  private cacheExpirationTime = 1000 * 60 * 60 * 2 // 2 hours

  private readonly usersRankingsCache: Cache<string, UserLolRanking>

  private readonly logger: Logger

  public constructor(loggerFactory: LoggerFactory, cacheFactory: CacheFactory) {
    this.usersRankingsCache = cacheFactory.create<string, UserLolRanking>('usersLolRankings')
    this.logger = loggerFactory.create('UserLolRankingService')
  }

  public async getUserLolRanking(twitchUsername: string): Promise<UserLolRanking> {
    const cachedUserLolRanking = this.usersRankingsCache.get(twitchUsername)

    if (cachedUserLolRanking) {
      return cachedUserLolRanking
    }

    const { data } = await axios.get(`https://api.davout.io/api/users/rankings/${twitchUsername}`)

    const userLolRanking = data.userRanking

    this.logger.debug('UserLolRanking found.', {
      twitchUsername,
      userLolRanking,
    })

    this.usersRankingsCache.set(userLolRanking.twitchUsername, userLolRanking, this.cacheExpirationTime)

    return userLolRanking
  }
}
