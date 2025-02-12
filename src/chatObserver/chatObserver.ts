import { Interval } from '../interval'
import { Logger } from '../logger/logger'
import { LoggerFactory } from '../logger/loggerFactory'
import { Chat } from '../chat/chat'
import { NativeChat } from '../chat/nativeChat'
import { SevenTvChat } from '../chat/sevenTvChat'

interface OnChatMessagePayload {
  chatMessageElement: Element
  chat: Chat
}

interface ObservePayload {
  onChatMessage: (payload: OnChatMessagePayload) => void
}

export class ChatObserver {
  private readonly logger: Logger
  private readonly interval: Interval

  private currentChat: Chat | null = null

  private nativeChat = new NativeChat()
  private sevenTvChat = new SevenTvChat()

  public constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('ChatObserver')
    this.interval = new Interval(1000)
  }

  public observe(payload: ObservePayload): void {
    const { onChatMessage } = payload

    let currentRetryCount = 0

    this.interval.start(() => {
      currentRetryCount += 1

      if (currentRetryCount > 15) {
        if (!this.currentChat) {
          this.logger.error('Chat not found.')
        }

        this.interval.stop()

        return
      }

      // sevenTvChat has to be checked first, because it's chatElement replaces the nativeChat's chatElement
      const sevenTvChatElement = this.sevenTvChat.findChatElement()

      if (sevenTvChatElement) {
        if (this.currentChat === this.sevenTvChat) {
          return
        }

        this.logger.debug('7tv chat mounted.', {
          sevenTvChatElement,
        })

        this.currentChat = this.sevenTvChat

        this.nativeChat.stopObserving()
        this.sevenTvChat.observe({
          onChatMessage: (chatMessageElement) => {
            onChatMessage({
              chatMessageElement,
              chat: this.sevenTvChat,
            })
          },
          chatElement: sevenTvChatElement,
        })

        return
      }

      const nativeChatElement = this.nativeChat.findChatElement()

      if (nativeChatElement) {
        if (this.currentChat === this.nativeChat) {
          return
        }

        this.logger.debug('Native chat mounted.', {
          nativeChatElement,
        })

        this.currentChat = this.nativeChat

        this.sevenTvChat.stopObserving()
        this.nativeChat.observe({
          onChatMessage: (chatMessageElement) => {
            onChatMessage({
              chatMessageElement,
              chat: this.nativeChat,
            })
          },
          chatElement: nativeChatElement,
        })

        return
      }
    })
  }

  public stopObserving(): void {
    this.interval.stop()

    if (this.currentChat) {
      this.currentChat.stopObserving()
    }
  }
}
