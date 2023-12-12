import ky from 'ky'

import { Cache } from '../cache/cache'
import { CacheFactory } from '../cache/cacheFactory'
import { Logger } from '../logger/logger'
import { LoggerFactory } from '../logger/loggerFactory'
import { UserSummonerRanking } from './userSummonerRanking'

export class UserSummonerRankingService {
  private cacheExpirationTime = 1000 * 60 * 60 * 2 // 2 hours

  private readonly usersSummonerRankingsCache: Cache<string, UserSummonerRanking>

  private readonly logger: Logger

  public constructor(loggerFactory: LoggerFactory, cacheFactory: CacheFactory) {
    this.usersSummonerRankingsCache = cacheFactory.create<string, UserSummonerRanking>('usersSummonerRankingsCache')
    this.logger = loggerFactory.create('UserSummonerRankingService')
  }

  public async getUserSummonerRanking(twitchUsername: string): Promise<UserSummonerRanking> {
    const cachedUserSummonerRanking = this.usersSummonerRankingsCache.get(twitchUsername)

    if (cachedUserSummonerRanking) {
      return cachedUserSummonerRanking
    }

    const userSummonerRanking = await ky
      .get(`https://api.davout.io/api/users/rankings/${twitchUsername}`)
      .json<UserSummonerRanking>()

    this.logger.debug('UserSummonerRanking found.', {
      twitchUsername,
      userSummonerRanking,
    })

    this.usersSummonerRankingsCache.set(
      userSummonerRanking.twitchUsername,
      userSummonerRanking,
      this.cacheExpirationTime,
    )

    return userSummonerRanking
  }
}
