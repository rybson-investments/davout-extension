import { UserLolRanking } from '../userLolRanking/userLolRanking'
import { Chat } from './chat'

export class SevenTvChat extends Chat {
  constructor() {
    super({ chatElementSelector: '#seventv-message-container > main' })
  }

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
