import { UserSummonerRanking } from '../userSummonerRanking/userSummonerRanking'

export interface ObservePayload {
  onChatMessage: (chatMessageElement: Element) => void
  chatElement: Element
}

interface ChatConfig {
  chatElementSelector: string
}

export abstract class Chat {
  abstract appendBadgeElement(chatMessageElement: Element, badgeElement: Element): Element | null
  abstract getTwitchUsername(chatMessageElement: Element): string | null
  abstract createUserSummonerRankingBadgeElement(userSummonerRanking: UserSummonerRanking): Element

  private chatObserver: MutationObserver | null = null
  private readonly config: ChatConfig

  constructor(config: ChatConfig) {
    this.config = config
  }

  public findChatElement(): Element | null {
    return document.querySelector(this.config.chatElementSelector)
  }

  public async observe(payload: ObservePayload) {
    const { onChatMessage, chatElement } = payload

    if (!chatElement) {
      throw new Error('No chat element found.')
    }

    const observer = new MutationObserver(async (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const chatMessageElement = mutation.addedNodes[0] as Element

          if (chatMessageElement && chatMessageElement.tagName === 'DIV') {
            onChatMessage(chatMessageElement)
          }
        }
      }
    })

    observer.observe(chatElement, { childList: true, subtree: true })

    this.chatObserver = observer
  }

  public async stopObserving(): Promise<void> {
    if (!this.chatObserver) {
      return
    }

    this.chatObserver.disconnect()

    this.chatObserver = null
  }
}
