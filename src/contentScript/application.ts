import { BadgeElementFactory } from './badgeElementFactory'
import { HistoryObserver, HistoryObserverEventName } from './historyObserver'
import { Logger } from './logger'
import { LoggerFactory } from './loggerFactory'
import { TwitchChat } from './twitchChat'
import { TwitchChatFactory } from './twitchChatFactory'
import { UserLolRankingService } from './userLolRankingService'

export class Application {
  private readonly userLolRankingService: UserLolRankingService
  private readonly historyObserver: HistoryObserver
  private readonly twitchChatFactory: TwitchChatFactory
  private readonly badgeElementFactory: BadgeElementFactory
  private readonly logger: Logger

  public constructor(
    historyObserver: HistoryObserver,
    userLolRankingService: UserLolRankingService,
    twitchChatFactory: TwitchChatFactory,
    badgeElementFactory: BadgeElementFactory,
    loggerFactory: LoggerFactory,
  ) {
    this.userLolRankingService = userLolRankingService
    this.historyObserver = historyObserver
    this.twitchChatFactory = twitchChatFactory
    this.badgeElementFactory = badgeElementFactory
    this.logger = loggerFactory.create('Application')
  }

  private async initTwitchChat(): Promise<TwitchChat> {
    const twitchChat = this.twitchChatFactory.create()

    this.logger.debug('Initializing Twitch chat...')

    await twitchChat.observe({
      onChatMessage: async (chatMessageElement) => {
        const twitchUsername = twitchChat.getTwitchUsername(chatMessageElement)

        if (!twitchUsername) {
          return
        }

        try {
          const userLolRanking = await this.userLolRankingService.getUserLolRanking(twitchUsername)

          if (!userLolRanking.lolRank) {
            return
          }

          this.logger.debug('UserLolRanking found.', {
            twitchUsername,
            userLolRanking,
          })

          const userLolRankingBadgeElement = this.badgeElementFactory.createUserLolRankingBadgeElement(userLolRanking)

          twitchChat.appendBadgeElement(chatMessageElement, userLolRankingBadgeElement)
        } catch (error) {
          this.logger.error('UserLolRanking not found.', {
            twitchUsername,
            error,
          })
        }
      },
    })

    this.logger.info('Twitch chat initialized.')

    return twitchChat
  }

  public async start(): Promise<void> {
    this.logger.debug('Starting application...')

    let twitchChat = await this.initTwitchChat()

    this.historyObserver.on(HistoryObserverEventName.routeChange, async () => {
      this.logger.debug('Route change detected.')

      if (!twitchChat) {
        return
      }

      twitchChat.stopObserving()

      twitchChat = await this.initTwitchChat()
    })

    this.logger.info('Application started.')
  }
}
