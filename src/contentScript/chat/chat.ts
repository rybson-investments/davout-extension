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

  public tooltipText(user: UserSummonerRanking): string {
    const rankLP =
      user.tier === 'MASTER' || user.tier === 'GRANDMASTER' || user.tier === 'CHALLENGER'
        ? ` - ${user.leaguePoints}LP`
        : `${user.rank}`
    const tierRankLP = `${user.tier?.toLowerCase()} ${rankLP}`
    const region = `${(user.region === 'eun' ? 'EUNE' : user.region)?.toUpperCase()}`
    return `${tierRankLP} (${region})`
  }

  public createTooltipElement(parent: HTMLElement) {
    const tooltip = document.createElement('span')
    tooltip.style.backgroundColor = '#fff'
    tooltip.style.bottom = '130%'
    tooltip.style.color = '#000'
    tooltip.style.fontSize = 'var(--font-size-6)'
    tooltip.style.fontWeight = 'var(--font-weight-semibold)'
    tooltip.style.fontFamily = 'var(--font-base)'
    tooltip.style.textTransform = 'capitalize'
    tooltip.style.left = '-50%'
    tooltip.style.marginLeft = '-100%'
    tooltip.style.padding = '2px 4px'
    tooltip.style.position = 'absolute'
    tooltip.style.width = 'max-content'
    tooltip.style.borderRadius = '5px'
    tooltip.style.opacity = '0'
    tooltip.style.visibility = 'hidden'
    tooltip.style.transition = 'visibility 0s ease 0s, opacity .1s ease-in'

    parent.style.position = 'relative'
    parent.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1'
      tooltip.style.visibility = 'visible'
    })

    parent.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0'
      tooltip.style.visibility = 'hidden'
    })

    return tooltip
  }

  public findChatElement(): Element | null {
    return document.querySelector(this.config.chatElementSelector)
  }

  public async observe(payload: ObservePayload) {
    const { onChatMessage, chatElement } = payload

    if (!chatElement) {
      throw new Error('No chat element found.')
    }

    const observedAt = Date.now()

    const observer = new MutationObserver(async (mutationList) => {
      // wait for 1s to not fetch UserSummonerRanking for preloaded messages
      if (Date.now() - observedAt < 1000) {
        return
      }

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
