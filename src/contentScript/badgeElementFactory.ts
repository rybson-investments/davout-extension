import { UserLolRanking } from './userLolRanking'

export class BadgeElementFactory {
  public createUserLolRankingBadgeElement(userLolRanking: UserLolRanking): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.width = '20px'
    badgeElement.style.height = '20px'
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

  public createTemporaryBadgeElement(): Element {
    const badgeElement = document.createElement('div')

    badgeElement.style.display = 'inline'
    badgeElement.style.width = '20px'
    badgeElement.style.height = '20px'
    badgeElement.style.backgroundColor = '#2f2f2f2'

    const buttonElement = document.createElement('button')

    buttonElement.dataset.aTarget = 'chat-badge'

    const iconElement = document.createElement('img')

    iconElement.src = chrome.runtime.getURL(`img/loading.png`)

    iconElement.classList.add('chat-badge')

    iconElement.ariaLabel = `Loading badge`

    buttonElement.appendChild(iconElement)

    badgeElement.appendChild(buttonElement)

    return badgeElement
  }
}
