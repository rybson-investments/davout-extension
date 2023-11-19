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

    const iconElement = document.createElement('div')

    // iconElement.src = `https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1`

    iconElement.style.marginBottom = '0.15rem'
    iconElement.style.marginRight = '0.3rem'
    iconElement.style.width = '18px'
    iconElement.style.height = '18px'
    iconElement.style.fontSize = '16px'
    iconElement.style.color = '#fff'
    iconElement.style.textAlign = 'center'
    iconElement.style.lineHeight = '18px'
    iconElement.style.fontWeight = 'bold'

    iconElement.textContent = 'G'

    iconElement.classList.add('chat-badge')

    if (userLolRanking.lolRank && userLolRanking.lolTier) {
      iconElement.ariaLabel = `${userLolRanking.lolTier} ${userLolRanking.lolRank}`
    } else {
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

    const iconElement = document.createElement('div')

    // iconElement.src = `https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1`

    iconElement.style.marginBottom = '0.15rem'
    iconElement.style.marginRight = '0.3rem'
    iconElement.style.width = '18px'
    iconElement.style.height = '18px'
    iconElement.style.fontSize = '16px'
    iconElement.style.color = '#fff'
    iconElement.style.textAlign = 'center'
    iconElement.style.lineHeight = '18px'
    iconElement.style.fontWeight = 'bold'

    iconElement.textContent = 'T'

    iconElement.classList.add('chat-badge')

    iconElement.ariaLabel = `Temporary badge`

    buttonElement.appendChild(iconElement)

    badgeElement.appendChild(buttonElement)

    return badgeElement
  }
}
