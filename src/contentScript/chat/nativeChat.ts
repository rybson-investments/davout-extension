import { UserSummonerRanking } from '../userSummonerRanking/userSummonerRanking'
import { Chat } from './chat'

export class NativeChat extends Chat {
  constructor() {
    super({ chatElementSelector: '.chat-scrollable-area__message-container' })
  }

  public appendBadgeElement(chatMessageElement: Element, badgeElement: Element): Element | null {
    const iconContainerElement =
      chatMessageElement.querySelector('.chat-line__username-container span') ||
      chatMessageElement.querySelector('.chat-line__message--badges')

    if (iconContainerElement) {
      iconContainerElement.appendChild(badgeElement)
    }

    return iconContainerElement
  }

  public getTwitchUsername(chatMessageElement: Element): string | null {
    const twitchUsername =
      chatMessageElement.getAttribute('data-a-user') || chatMessageElement.getAttribute('data-user')

    return twitchUsername?.toLowerCase() || null
  }

  public createTooltipElement() {
    const tooltip = document.createElement('span')
    tooltip.classList.add('davout_tooltip-native')

    return tooltip
  }

  public createUserSummonerRankingBadgeElement(userSummonerRanking: UserSummonerRanking): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.backgroundColor = '#2f2f2f2'

    const buttonElement = document.createElement('button')

    buttonElement.dataset.aTarget = 'chat-badge'

    const iconElement = document.createElement('img')

    iconElement.classList.add('chat-badge')

    const tooltip = this.createTooltipElement()
    buttonElement.classList.add('davout_has-tooltip')
    buttonElement.appendChild(tooltip)

    if (userSummonerRanking.tier && userSummonerRanking.rank) {
      const tooltipContent = this.getTooltipText(userSummonerRanking)
      tooltip.innerText = tooltipContent
      iconElement.src = chrome.runtime.getURL(`img/${userSummonerRanking.tier.toLowerCase()}.png`)
      iconElement.ariaLabel = tooltipContent
    }

    buttonElement.appendChild(iconElement)

    badgeElement.appendChild(buttonElement)

    return badgeElement
  }
}
