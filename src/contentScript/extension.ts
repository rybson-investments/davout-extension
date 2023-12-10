import { ChatObserver } from './chatObserver/chatObserver'
import { ChatObserverFactory } from './chatObserver/chatObserverFactory'
import { HistoryObserver, HistoryObserverEventName } from './historyObserver'
import { Logger } from './logger/logger'
import { LoggerFactory } from './logger/loggerFactory'
import { UserLolRankingService } from './userLolRanking/userLolRankingService'

export class Extension {
  private readonly userLolRankingService: UserLolRankingService
  private readonly historyObserver: HistoryObserver
  private readonly chatObserverFactory: ChatObserverFactory
  private readonly logger: Logger

  public constructor(
    historyObserver: HistoryObserver,
    userLolRankingService: UserLolRankingService,
    chatObserverFactory: ChatObserverFactory,
    loggerFactory: LoggerFactory,
  ) {
    this.userLolRankingService = userLolRankingService
    this.historyObserver = historyObserver
    this.chatObserverFactory = chatObserverFactory
    this.logger = loggerFactory.create('Extension')
  }

  private async initChatObserver(): Promise<ChatObserver> {
    this.logger.debug('Initializing ChatObserver...')

    const chatObserver = this.chatObserverFactory.create()

    chatObserver.observe({
      onChatMessage: async ({ chatMessageElement, chat }) => {
        const twitchUsername = chat.getTwitchUsername(chatMessageElement)

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

          const userLolRankingBadgeElement = chat.createUserLolRankingBadgeElement(userLolRanking)

          chat.appendBadgeElement(chatMessageElement, userLolRankingBadgeElement)
        } catch (error) {
          this.logger.error('UserLolRanking not found.', {
            twitchUsername,
            error,
          })
        }
      },
    })

    this.logger.debug('ChatObserver initialized.')

    return chatObserver
  }

  public async start(): Promise<void> {
    this.logger.debug('Starting Davout...')

    let chatObserver = await this.initChatObserver()

    this.historyObserver.on(HistoryObserverEventName.routeChange, async () => {
      this.logger.debug('Route change detected.')

      if (!chatObserver) {
        return
      }

      chatObserver.stopObserving()

      chatObserver = await this.initChatObserver()
    })

    this.logger.info('Davout started.')
  }
}
