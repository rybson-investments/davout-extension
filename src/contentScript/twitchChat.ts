import pRetry from 'p-retry'
import { UserLolRanking } from './userLolRanking'

export interface ObservePayload {
  onChatMessage: (chatMessageElement: Element) => void
}

export class TwitchChat {
  private chatObserver: MutationObserver | null = null
  private chatElement: Element | null = null

  chatElementSelector = '.chat-scrollable-area__message-container'

  private async findChatElement(): Promise<Element | null> {
    const retryCount = 5

    return pRetry<Element | null>(
      async (attemptCount) => {
        if (attemptCount === retryCount) {
          return null
        }

        const chatElement = document.querySelector(this.chatElementSelector)

        if (!chatElement) {
          throw new Error('No chat element found.')
        }

        return chatElement
      },
      {
        retries: retryCount,
        minTimeout: 1000,
        maxTimeout: 1000,
      },
    )
  }

  public appendBadgeElement(chatMessageElement: Element, badgeElement: Element): Element | null {
    const iconContainerElement = chatMessageElement.querySelector('.chat-line__username-container span')

    if (iconContainerElement) {
      iconContainerElement.appendChild(badgeElement)
    }

    return iconContainerElement
  }

  public removeBadgeElement(chatMessageElement: Element, badgeElement: Element): void {
    const iconContainerElement = chatMessageElement.querySelector('.chat-line__username-container span')

    if (iconContainerElement) {
      iconContainerElement.removeChild(badgeElement)
    }
  }

  public replaceBadgeElement(chatMessageElement: Element, oldBadgeElement: Element, newBadgeElement: Element): void {
    const iconContainerElement = chatMessageElement.querySelector('.chat-line__username-container span')

    if (iconContainerElement) {
      iconContainerElement.replaceChild(newBadgeElement, oldBadgeElement)
    }
  }

  public async observe(payload: ObservePayload) {
    const { onChatMessage } = payload

    const chatElement = await this.findChatElement()

    if (!chatElement) {
      throw new Error('No chat element found.')
    }

    this.chatElement = chatElement

    const observerConfig = { attributes: true, childList: true, sbutree: true }

    const observer = new MutationObserver(async (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const chatMessageElement = mutation.addedNodes[0] as Element

          if (chatMessageElement) {
            onChatMessage(chatMessageElement)
          }
        }
      }
    })

    observer.observe(chatElement, observerConfig)

    this.chatObserver = observer
  }

  public async stopObserving(): Promise<void> {
    if (!this.chatObserver) {
      return
    }

    this.chatObserver.disconnect()

    this.chatObserver = null
  }

  public getChatElement(): Element | null {
    return this.chatElement
  }

  public getTwitchUsername(chatMessageElement: Element): string | null {
    const twitchUsername = chatMessageElement.getAttribute('data-a-user')

    return twitchUsername || null
  }

  public createUserLolRankingBadgeElement(userLolRanking: UserLolRanking): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.backgroundColor = '#2f2f2f2'

    const buttonElement = document.createElement('button')

    buttonElement.dataset.aTarget = 'chat-badge'

    const iconElement = document.createElement('img')

    iconElement.classList.add('chat-badge')

    if (userLolRanking.lolTier && userLolRanking.lolRank) {
      iconElement.src = chrome.runtime.getURL(`img/${userLolRanking.lolTier.toLowerCase()}.png`)
      iconElement.ariaLabel = `${userLolRanking.lolTier} ${userLolRanking.lolRank}`
    } else {
      iconElement.src = chrome.runtime.getURL(`img/unranked.png`)
      iconElement.ariaLabel = `N/A`
    }

    buttonElement.appendChild(iconElement)

    badgeElement.appendChild(buttonElement)

    return badgeElement
  }
}

export class SevenTvChat extends TwitchChat {
  chatElementSelector = '#seventv-message-container > main'

  public getTwitchUsername(chatMessageElement: Element): string | null {
    const twitchUsername = chatMessageElement.querySelector('.seventv-chat-user-username span span')?.innerHTML

    return twitchUsername?.toLowerCase() || null
  }

  public appendBadgeElement(chatMessageElement: Element, badgeElement: Element): Element | null {
    const iconContainerElement = chatMessageElement.querySelector('.seventv-chat-user-badge-list')
    if (iconContainerElement) {
      iconContainerElement.appendChild(badgeElement)
    }

    return iconContainerElement
  }

  public createUserLolRankingBadgeElement(userLolRanking: UserLolRanking): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.marginLeft = '0.25rem'
    badgeElement.classList.add('seventv-chat-badge')

    const iconElement = document.createElement('img')

    if (userLolRanking.lolTier && userLolRanking.lolRank) {
      iconElement.src = chrome.runtime.getURL(`img/${userLolRanking.lolTier.toLowerCase()}.png`)
      iconElement.ariaLabel = `${userLolRanking.lolTier} ${userLolRanking.lolRank}`
    } else {
      iconElement.src = chrome.runtime.getURL(`img/gold.png`)
      iconElement.ariaLabel = `N/A`
    }

    badgeElement.appendChild(iconElement)

    return badgeElement
  }
}
