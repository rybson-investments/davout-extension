import { ChatObserver } from './chatObserver/chatObserver'
import { ChatObserverFactory } from './chatObserver/chatObserverFactory'
import { HistoryObserver, HistoryObserverEventName } from './historyObserver'
import { Logger } from './logger/logger'
import { LoggerFactory } from './logger/loggerFactory'
import { UserSummonerRankingService } from './userSummonerRanking/userSummonerRankingService'

export class Extension {
  private readonly userSummonerRankingService: UserSummonerRankingService
  private readonly historyObserver: HistoryObserver
  private readonly chatObserverFactory: ChatObserverFactory
  private readonly logger: Logger

  public constructor(
    historyObserver: HistoryObserver,
    userSummonerRankingService: UserSummonerRankingService,
    chatObserverFactory: ChatObserverFactory,
    loggerFactory: LoggerFactory,
  ) {
    this.userSummonerRankingService = userSummonerRankingService
    this.historyObserver = historyObserver
    this.chatObserverFactory = chatObserverFactory
    this.logger = loggerFactory.create('Extension')
  }

  private async initChatObserver(): Promise<ChatObserver> {
    this.logger.debug('Initializing ChatObserver...')

    const chatObserver = this.chatObserverFactory.create()

    chatObserver.observe({
      onChatMessage: async ({ chatMessageElement, chat }) => {
        const unsafeTwitchUsername = chat.getTwitchUsername(chatMessageElement)

        if (!unsafeTwitchUsername) {
          return
        }

        const twitchUsername = unsafeTwitchUsername.toLowerCase()

        try {
          const userSummonerRanking = await this.userSummonerRankingService.getUserSummonerRanking(twitchUsername)

          if (!userSummonerRanking.rank) {
            return
          }

          this.logger.debug('UserSummonerRanking found.', {
            twitchUsername,
            userSummonerRanking,
          })

          const userSummonerRankingBadgeElement = chat.createUserSummonerRankingBadgeElement(userSummonerRanking)

          chat.appendBadgeElement(chatMessageElement, userSummonerRankingBadgeElement)
        } catch (error) {
          this.logger.error('UserSummonerRanking not found.', {
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
