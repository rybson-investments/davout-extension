import axios from 'axios'

import { BatchQueue } from './batchQueue'
import { BatchQueueFactory } from './batchQueueFactory'
import { Cache } from './cache'
import { CacheFactory } from './cacheFactory'
import { Logger } from './logger'
import { LoggerFactory } from './loggerFactory'
import { UserLolRanking } from './userLolRanking'

export class UserLolRankingService {
  private cacheExpirationTime = 1000 * 60 * 60 * 3

  private readonly usersRankingsCache: Cache<string, UserLolRanking>

  private readonly usersLolRankingsQueue: BatchQueue<string, UserLolRanking>
  private readonly logger: Logger

  public constructor(loggerFactory: LoggerFactory, cacheFactory: CacheFactory, batchQueueFactory: BatchQueueFactory) {
    this.usersRankingsCache = cacheFactory.create<string, UserLolRanking>('usersLolRankings')
    this.usersLolRankingsQueue = batchQueueFactory.create<string, UserLolRanking>(5000, (items) =>
      this.processUsersLolRankingsQueue(items),
    )
    this.logger = loggerFactory.create('UserLolRankingService')

    this.usersLolRankingsQueue.start()
  }

  private async processUsersLolRankingsQueue(twitchUsernames: string[]): Promise<UserLolRanking[]> {
    const uniqueTwitchUsernames = [...new Set(twitchUsernames)]

    const userLolRankingByTwitchUsername = new Map<string, UserLolRanking>()

    this.logger.debug('Finding usersLolRankings...', {
      twitchUsernames: uniqueTwitchUsernames,
    })

    await axios
      .post('https://api.davout.io/api/users/rankings/search', {
        twitchUsernames: uniqueTwitchUsernames,
      })
      .then((res) => {
        const usersLolRankings = res.data.usersRankings

        // TODO: better error handling
        if (!usersLolRankings) {
          throw new Error('No usersLolRankings found.')
        }

        this.logger.debug('UsersLolRankings found.', {
          twitchUsernames: uniqueTwitchUsernames,
          usersLolRankings,
        })

        usersLolRankings.forEach((userLolRanking: UserLolRanking) => {
          this.usersRankingsCache.set(userLolRanking.twitchUsername, userLolRanking, this.cacheExpirationTime)

          userLolRankingByTwitchUsername.set(userLolRanking.twitchUsername, userLolRanking)
        })
      })

    return twitchUsernames.map((twitchUsername) => {
      return userLolRankingByTwitchUsername.get(twitchUsername) as UserLolRanking
    })
  }

  public async getUserLolRanking(twitchUsername: string): Promise<UserLolRanking> {
    const cachedUserLolRanking = this.usersRankingsCache.get(twitchUsername)

    if (cachedUserLolRanking) {
      return cachedUserLolRanking
    }

    return new Promise((resolve) => {
      this.usersLolRankingsQueue.add(twitchUsername, (userLolRanking) => {
        resolve(userLolRanking)
      })
    })
  }
}
