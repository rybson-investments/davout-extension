import { UserSummonerRanking } from '../userSummonerRanking/userSummonerRanking'
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

  public createTooltipElement() {
    const tooltip = document.createElement('span')
    tooltip.classList.add('davout_tooltip-seven-tv')

    return tooltip
  }

  public createUserSummonerRankingBadgeElement(userSummonerRanking: UserSummonerRanking): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.marginLeft = '0.25rem'
    badgeElement.classList.add('seventv-chat-badge', 'davout_has-tooltip')

    const iconElement = document.createElement('img')

    const tooltip = this.createTooltipElement()
    badgeElement.appendChild(tooltip)

    if (userSummonerRanking.tier && userSummonerRanking.rank) {
      const tooltipContent = this.getTooltipText(userSummonerRanking)
      tooltip.innerText = tooltipContent
      iconElement.src = chrome.runtime.getURL(`img/${userSummonerRanking.tier.toLowerCase()}.png`)
      iconElement.ariaLabel = tooltipContent
    }

    badgeElement.appendChild(iconElement)

    return badgeElement
  }
}
